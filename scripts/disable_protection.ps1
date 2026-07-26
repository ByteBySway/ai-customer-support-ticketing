# scripts/disable_protection.ps1
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

Write-Host "🚀 Disabling Vercel Deployment Protection on Project..." -ForegroundColor Cyan

$body = @{
    ssoProtection = $null
    passwordProtection = $null
} | ConvertTo-Json

try {
    $res = Invoke-RestMethod -Uri "https://api.vercel.com/v9/projects/ai-customer-support-ticketing" -Method Patch -Headers $headers -Body $body
    Write-Host "✅ Successfully disabled Vercel deployment protection!" -ForegroundColor Green
} catch {
    Write-Warning ("Vercel project update status: " + $_)
}
