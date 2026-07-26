# update_github_metadata.ps1
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

$pat = $env:GITHUB_PAT
$username = "ByteBySway"
$repoName = "ai-customer-support-ticketing"

$headers = @{
    "Authorization" = "Bearer $pat"
    "Accept"        = "application/vnd.github.v3+json"
}

$updateObj = @{
    description = "Award-Winning AI-Based Customer Support Ticketing System built with Next.js 14, Python ML (TF-IDF), Node.js, and Vercel. Features automated ticket routing, SLA tracking, agent workload analytics, CSAT metrics, and an interactive AI Copilot Bot."
    homepage    = "https://ai-customer-support-ticketing.vercel.app"
}

$jsonStr = $updateObj | ConvertTo-Json
$utf8Bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonStr)

try {
    $res = Invoke-RestMethod -Uri "https://api.github.com/repos/$username/$repoName" -Method Patch -Headers $headers -Body $utf8Bytes -ContentType "application/json; charset=utf-8"
    Write-Host "✅ Successfully updated GitHub repository description and homepage!" -ForegroundColor Green
    Write-Host ("Description: " + $res.description) -ForegroundColor Cyan
    Write-Host ("Homepage: " + $res.homepage) -ForegroundColor Cyan
} catch {
    Write-Error ("Metadata update failed: " + $_)
}

# Update topics
$topicsObj = @{
    names = @("nextjs", "python", "machine-learning", "ai-support", "ticketing-system", "sla-tracking", "csat-analytics", "nodejs", "vercel", "fullstack", "react", "mongodb", "automation", "copilot-bot")
}
$topicsJson = $topicsObj | ConvertTo-Json
$topicsBytes = [System.Text.Encoding]::UTF8.GetBytes($topicsJson)

try {
    Invoke-RestMethod -Uri "https://api.github.com/repos/$username/$repoName/topics" -Method Put -Headers $headers -Body $topicsBytes -ContentType "application/json; charset=utf-8" | Out-Null
    Write-Host "✅ Successfully assigned GitHub topics/tags!" -ForegroundColor Green
} catch {
    Write-Error ("Topics update failed: " + $_)
}
