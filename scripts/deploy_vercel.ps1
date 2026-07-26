# deploy_vercel.ps1 - Vercel Deployment Script using Vercel REST API v13
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

Write-Host "Found $($fileList.Count) project files. Triggering Vercel Deployment..." -ForegroundColor Cyan

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
    $response = Invoke-RestMethod -Uri "https://api.vercel.com/v13/deployments" -Method Post -Headers $headers -Body $bodyJson
    
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "🎉 VERCEL DEPLOYMENT TRIGGERED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "Deployment URL: https://$($response.url)" -ForegroundColor Yellow
    Write-Host "Production URL: https://ai-customer-support-ticketing.vercel.app" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Green

    # Save live URL to file
    $deploymentInfo = @{
        deploymentUrl = "https://$($response.url)"
        productionUrl = "https://ai-customer-support-ticketing.vercel.app"
        id = $response.id
        readyState = $response.readyState
        createdAt = (Get-Date).ToString("o")
    } | ConvertTo-Json

    $deploymentInfo | Set-Content "C:\Users\HP\.gemini\antigravity\scratch\ai-customer-support-ticketing\vercel_deployment.json"

} catch {
    Write-Error "Vercel API Deployment failed: $_"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errBody = $reader.ReadToEnd()
        Write-Host "Error Details: $errBody" -ForegroundColor Red
    }
    exit 1
}
