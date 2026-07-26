# alias_resolvai_domain.ps1
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
$headers = @{
    "Authorization" = "Bearer $vercelToken"
    "Content-Type"  = "application/json"
}

# Get latest READY deployment
$deploys = Invoke-RestMethod -Uri "https://api.vercel.com/v6/deployments?limit=5" -Headers $headers
$readyDeploy = $deploys.deployments | Where-Object { $_.name -eq "ai-customer-support-ticketing" -and $_.state -eq "READY" } | Select-Object -First 1

if (-not $readyDeploy) {
    Write-Error "No READY deployment found!"
    exit 1
}

Write-Host ("Assigning ResolvAI domain aliases to deployment ID: " + $readyDeploy.uid) -ForegroundColor Cyan

$aliasesToTry = @(
    "resolvai-platform.vercel.app",
    "resolvai-support.vercel.app",
    "resolvai-app.vercel.app",
    "resolvai-desk.vercel.app"
)

$successfulAlias = ""

foreach ($aliasName in $aliasesToTry) {
    $aliasBody = @{ alias = $aliasName } | ConvertTo-Json
    try {
        $res = Invoke-RestMethod -Uri ("https://api.vercel.com/v2/deployments/" + $readyDeploy.uid + "/aliases") -Method Post -Headers $headers -Body $aliasBody
        Write-Host ("🎉 Successfully created Vercel alias: https://" + $aliasName) -ForegroundColor Green
        $successfulAlias = "https://" + $aliasName
        break
    } catch {
        Write-Warning ("Could not assign " + $aliasName + ": " + $_)
    }
}

if ($successfulAlias) {
    # Update GitHub homepage URL with new domain
    $pat = $env:GITHUB_PAT
    $ghHeaders = @{
        "Authorization" = "Bearer $pat"
        "Accept"        = "application/vnd.github.v3+json"
    }
    $updateObj = @{
        homepage = $successfulAlias
    }
    $jsonStr = $updateObj | ConvertTo-Json
    $utf8Bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonStr)
    Invoke-RestMethod -Uri "https://api.github.com/repos/ByteBySway/ai-customer-support-ticketing" -Method Patch -Headers $ghHeaders -Body $utf8Bytes -ContentType "application/json; charset=utf-8" | Out-Null
    Write-Host ("✅ Updated GitHub Homepage URL to: " + $successfulAlias) -ForegroundColor Green
}
