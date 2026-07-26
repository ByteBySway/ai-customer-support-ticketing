# push_repo.ps1 - Automated GitHub Repository Update Script
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
$repoName = "resolvai"

if (-not $pat) {
    Write-Error "GITHUB_PAT not found in environment or C:\Users\HP\.env"
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $pat"
    "Accept"        = "application/vnd.github.v3+json"
}

$topDescription = "ResolvAI: Enterprise AI-Powered Customer Support & SLA Automation Platform built with Next.js 14, Python ML (TF-IDF), Node.js, and Vercel. Features automated ticket classification, AI routing, SLA tracking, agent workload analytics, CSAT metrics, and an interactive AI Copilot Bot."

Write-Host "🚀 Updating repository description & metadata on GitHub..." -ForegroundColor Cyan

# 1. Update Repo Details (Description, Homepage URL)
$updateObj = @{
    description = $topDescription
    homepage    = "https://resolvai-platform.vercel.app"
    has_issues  = $true
    has_projects = $true
    has_wiki    = $true
}

$jsonStr = $updateObj | ConvertTo-Json
$utf8Bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonStr)

try {
    Invoke-RestMethod -Uri ("https://api.github.com/repos/" + $username + "/" + $repoName) -Method Patch -Headers $headers -Body $utf8Bytes -ContentType "application/json; charset=utf-8" | Out-Null
    Write-Host "✅ Successfully updated GitHub repository description and homepage!" -ForegroundColor Green
} catch {
    Write-Warning ("Repo update status: " + $_)
}

# 2. Push Code to GitHub
$gitExe = "C:\Users\HP\.gemini\antigravity\scratch\MinGit\cmd\git.exe"
$repoDir = "C:\Users\HP\.gemini\antigravity\scratch\ai-customer-support-ticketing"

Push-Location $repoDir

try {
    & $gitExe config user.name "ByteBySway"
    & $gitExe config user.email "bytebysway@users.noreply.github.com"

    Write-Host "Staging files..." -ForegroundColor Cyan
    & $gitExe add -A

    $remoteUrl = "https://" + $username + ":" + $pat + "@github.com/" + $username + "/" + $repoName + ".git"
    & $gitExe remote set-url origin $remoteUrl

    Write-Host "Pushing code to GitHub..." -ForegroundColor Cyan
    & $gitExe push -u origin main --force
    Write-Host ("🎉 Successfully pushed code to https://github.com/" + $username + "/" + $repoName) -ForegroundColor Green
} catch {
    Write-Error ("Git operations failed: " + $_)
} finally {
    Pop-Location
}

# 3. Update Repository Topics / Tags
Write-Host "Assigning top-notch GitHub topics/tags..." -ForegroundColor Cyan
$topicsObj = @{
    names = @("resolvai", "nextjs", "python", "machine-learning", "ai-support", "ticketing-system", "sla-tracking", "csat-analytics", "nodejs", "vercel", "fullstack", "react", "mongodb", "automation", "copilot-bot")
}
$topicsJson = $topicsObj | ConvertTo-Json
$topicsBytes = [System.Text.Encoding]::UTF8.GetBytes($topicsJson)

try {
    Invoke-RestMethod -Uri ("https://api.github.com/repos/" + $username + "/" + $repoName + "/topics") -Method Put -Headers $headers -Body $topicsBytes -ContentType "application/json; charset=utf-8" | Out-Null
    Write-Host "✅ Successfully set GitHub repository topics/tags!" -ForegroundColor Green
} catch {
    Write-Warning ("Failed to set topics: " + $_)
}
