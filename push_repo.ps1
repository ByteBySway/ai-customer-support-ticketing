# push_repo.ps1 - Automated GitHub Repository Creation, Topic Assignment & Description Update Script
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

if (-not $pat) {
    Write-Error "GITHUB_PAT not found in environment or C:\Users\HP\.env"
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $pat"
    "Accept"        = "application/vnd.github.v3+json"
}

$topDescription = "🚀 Award-Winning AI-Based Customer Support Ticketing System built with Next.js 14, Python ML (TF-IDF), Node.js, and Vercel. Features automated ticket routing, SLA tracking, agent workload analytics, CSAT metrics, and an interactive AI Copilot Bot."

Write-Host "🚀 Updating repository description & metadata on GitHub..." -ForegroundColor Cyan

# 1. Update Repo Details (Description, Homepage URL)
$repoUpdateBody = @{
    description = $topDescription
    homepage = "https://ai-customer-support-ticketing.vercel.app"
    has_issues = $true
    has_projects = $true
    has_wiki = $true
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "https://api.github.com/repos/$username/$repoName" -Method Patch -Headers $headers -Body $repoUpdateBody -ContentType "application/json" | Out-Null
    Write-Host "✅ Successfully updated GitHub repository description and homepage!" -ForegroundColor Green
} catch {
    Write-Warning ("Repo update response: " + $_)
}

# 2. Push Code to GitHub
$gitExe = "C:\Users\HP\.gemini\antigravity\scratch\MinGit\cmd\git.exe"
$repoDir = "C:\Users\HP\.gemini\antigravity\scratch\ai-customer-support-ticketing"

Push-Location $repoDir

try {
    if (-not (Test-Path "$repoDir\.git")) {
        & $gitExe init
    }

    & $gitExe config user.name "ByteBySway"
    & $gitExe config user.email "bytebysway@users.noreply.github.com"

    Write-Host "Staging files..." -ForegroundColor Cyan
    & $gitExe add -A

    Write-Host "Creating commit..." -ForegroundColor Cyan
    & $gitExe commit -m "docs: add top-notch README, architecture diagrams, and GitHub metadata"

    & $gitExe branch -M main

    $remoteUrl = "https://" + $username + ":" + $pat + "@github.com/" + $username + "/" + $repoName + ".git"
    
    $originExists = & $gitExe remote
    if ($originExists -contains "origin") {
        & $gitExe remote set-url origin $remoteUrl
    } else {
        & $gitExe remote add origin $remoteUrl
    }

    Write-Host "Pushing code to GitHub..." -ForegroundColor Cyan
    & $gitExe push -u origin main --force
    Write-Host ("🎉 Successfully pushed code to https://github.com/" + $username + "/" + $repoName) -ForegroundColor Green
} catch {
    Write-Error ("Git operations failed: " + $_)
    exit 1
} finally {
    Pop-Location
}

# 3. Update Repository Topics / Tags
Write-Host "Assigning top-notch GitHub topics/tags..." -ForegroundColor Cyan
$topicsBody = @{
    names = @("nextjs", "python", "machine-learning", "ai-support", "ticketing-system", "sla-tracking", "csat-analytics", "nodejs", "vercel", "fullstack", "react", "mongodb", "automation", "copilot-bot")
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "https://api.github.com/repos/$username/$repoName/topics" -Method Put -Headers $headers -Body $topicsBody -ContentType "application/json" | Out-Null
    Write-Host "✅ Successfully set GitHub repository topics/tags!" -ForegroundColor Green
} catch {
    Write-Warning ("Failed to set topics: " + $_)
}
