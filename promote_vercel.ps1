# promote_vercel.ps1 - Alias the latest deployment to ResolvAI production URL
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

# 1. Get latest READY deployment
$deploys = Invoke-RestMethod -Uri "https://api.vercel.com/v6/deployments?limit=5" -Headers $headers
$readyDeploy = $deploys.deployments | Where-Object { $_.name -eq "ai-customer-support-ticketing" -and $_.state -eq "READY" } | Select-Object -First 1

if (-not $readyDeploy) {
    Write-Error "No READY deployment found!"
    exit 1
}

Write-Host ("Assigning ResolvAI domain to latest deployment ID: " + $readyDeploy.uid) -ForegroundColor Cyan

$aliasesToAssign = @("resolvai-platform.vercel.app", "ai-customer-support-ticketing.vercel.app")

foreach ($aliasDomain in $aliasesToAssign) {
    $aliasBody = @{ alias = $aliasDomain } | ConvertTo-Json
    try {
        $aliasRes = Invoke-RestMethod -Uri ("https://api.vercel.com/v2/deployments/" + $readyDeploy.uid + "/aliases") -Method Post -Headers $headers -Body $aliasBody
        Write-Host ("🎉 Domain alias updated: https://" + $aliasDomain) -ForegroundColor Green
    } catch {
        Write-Warning ("Alias response for " + $aliasDomain + ": " + $_)
    }
}
