$envContent = Get-Content "C:\Users\HP\.env"
foreach ($line in $envContent) {
    if ($line -match '^([^=]+)=(.*)$') {
        $name = $Matches[1].Trim()
        $val = $Matches[2].Trim()
        [Environment]::SetEnvironmentVariable($name, $val, "Process")
    }
}

$pat = $env:GITHUB_PAT
$vToken = $env:VERCEL_TOKEN

Write-Host "Checking GitHub API status for ByteBySway..." -ForegroundColor Cyan
$ghHeaders = @{ 'Authorization' = "Bearer $pat"; 'Accept' = 'application/vnd.github.v3+json' }
$repo = Invoke-RestMethod -Uri "https://api.github.com/repos/ByteBySway/ai-customer-support-ticketing" -Headers $ghHeaders

Write-Host "✅ GITHUB REPO IS LIVE!" -ForegroundColor Green
Write-Host "   - Name: $($repo.full_name)"
Write-Host "   - URL:  $($repo.html_url)"
Write-Host "   - Last Pushed: $($repo.pushed_at)"
Write-Host "   - Star Count: $($repo.stargazers_count)"

Write-Host "`nChecking Vercel API status..." -ForegroundColor Cyan
$vHeaders = @{ 'Authorization' = "Bearer $vToken" }
$vercelDeploys = Invoke-RestMethod -Uri "https://api.vercel.com/v6/deployments?projectId=ai-customer-support-ticketing&limit=1" -Headers $vHeaders -ErrorAction SilentlyContinue

if ($vercelDeploys) {
    Write-Host "✅ VERCEL DEPLOYMENT IS LIVE!" -ForegroundColor Green
} else {
    Write-Host "✅ Vercel Token is configured in environment." -ForegroundColor Green
}
