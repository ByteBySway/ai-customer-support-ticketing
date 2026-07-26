# deploy_and_verify_vercel.ps1 - Deploy and wait until Vercel build status is READY
$envFile = "C:\Users\HP\.env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $name = $Matches[1].Trim()
            $value = $Matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
}

$vercelToken = $env:VERCEL_TOKEN
if (-not $vercelToken) {
    Write-Error "VERCEL_TOKEN not found in environment or C:\Users\HP\.env"
    exit 1
}

Write-Host "🚀 Packaging Next.js project for Vercel Deployment..." -ForegroundColor Cyan

$frontendDir = "C:\Users\HP\.gemini\antigravity\scratch\ai-customer-support-ticketing\frontend"

function Get-ProjectFiles {
    param ([string]$dir)
    $files = @()
    Get-ChildItem -Path $dir -Recurse -File | ForEach-Object {
        $relativePath = $_.FullName.Substring($dir.Length + 1).Replace('\', '/')
        if ($relativePath -notmatch '^node_modules' -and $relativePath -notmatch '^\.next' -and $relativePath -notmatch '^\.git') {
            $content = [System.IO.File]::ReadAllText($_.FullName)
            $files += @{
                file = $relativePath
                data = $content
            }
        }
    }
    return $files
}

$fileList = Get-ProjectFiles -dir $frontendDir
$headers = @{
    "Authorization" = "Bearer $vercelToken"
    "Content-Type"  = "application/json"
}

$bodyObj = @{
    name = "ai-customer-support-ticketing"
    files = $fileList
    projectSettings = @{
        framework = "nextjs"
    }
}

$bodyJson = $bodyObj | ConvertTo-Json -Depth 10

try {
    Write-Host "Submitting deployment payload to Vercel REST API..." -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri "https://api.vercel.com/v13/deployments" -Method Post -Headers $headers -Body $bodyJson
    $deployId = $response.id
    $deployUrl = "https://" + $response.url
    
    Write-Host "Deployment Created ID: $deployId" -ForegroundColor Yellow
    Write-Host "Waiting for Vercel edge build to complete..." -ForegroundColor Cyan

    $ready = $false
    $attempts = 0
    while (-not $ready -and $attempts -lt 20) {
        Start-Sleep -Seconds 5
        $attempts++
        try {
            $statusRes = Invoke-RestMethod -Uri "https://api.vercel.com/v13/deployments/$deployId" -Headers $headers
            $state = $statusRes.readyState
            Write-Host ("Build Status Check " + $attempts + ": " + $state) -ForegroundColor Yellow
            if ($state -eq "READY") {
                $ready = $true
            } elseif ($state -eq "ERROR" -or $state -eq "CANCELED") {
                Write-Error ("Vercel Build Failed with state: " + $state)
                exit 1
            }
        } catch {
            Write-Warning "Checking status..."
        }
    }

    if ($ready) {
        Write-Host "==========================================" -ForegroundColor Green
        Write-Host "🎉 VERCEL BUILD COMPLETED & LIVE READY!" -ForegroundColor Green
        Write-Host ("Live Deployment URL: " + $deployUrl) -ForegroundColor Green
        Write-Host "Production URL: https://ai-customer-support-ticketing.vercel.app" -ForegroundColor Cyan
        Write-Host "==========================================" -ForegroundColor Green
    } else {
        Write-Host ("Build is processing in background. Deployment URL: " + $deployUrl) -ForegroundColor Yellow
    }

} catch {
    Write-Error ("Vercel API Deployment failed: " + $_)
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errBody = $reader.ReadToEnd()
        Write-Host ("Error Details: " + $errBody) -ForegroundColor Red
    }
    exit 1
}
