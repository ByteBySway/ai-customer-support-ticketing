# rename_and_organize_repo.ps1
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
$oldRepoName = "ai-customer-support-ticketing"
$newRepoName = "resolvai"

$headers = @{
    "Authorization" = "Bearer $pat"
    "Accept"        = "application/vnd.github.v3+json"
}

# 1. Rename GitHub Repository via API
Write-Host ("🚀 Renaming GitHub repository from " + $oldRepoName + " to " + $newRepoName + "...") -ForegroundColor Cyan

$renamePayload = @{
    name = $newRepoName
    description = "ResolvAI: Enterprise AI-Powered Customer Support and SLA Automation Platform built with Next.js 14, Python ML (TF-IDF), Node.js, and Vercel. Features automated ticket classification, AI routing, SLA tracking, agent workload analytics, CSAT metrics, and an interactive AI Copilot Bot."
    homepage = "https://resolvai-platform.vercel.app"
}
$jsonStr = $renamePayload | ConvertTo-Json
$utf8Bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonStr)

try {
    $res = Invoke-RestMethod -Uri ("https://api.github.com/repos/" + $username + "/" + $oldRepoName) -Method Patch -Headers $headers -Body $utf8Bytes -ContentType "application/json; charset=utf-8"
    Write-Host ("✅ Successfully renamed GitHub repository to: https://github.com/" + $username + "/" + $newRepoName) -ForegroundColor Green
} catch {
    Write-Warning ("Rename status: " + $_)
}

# 2. Organize Project Root Directory Structure
$repoDir = "C:\Users\HP\.gemini\antigravity\scratch\ai-customer-support-ticketing"
$scriptsDir = "$repoDir\scripts"

if (-not (Test-Path $scriptsDir)) {
    New-Item -ItemType Directory -Force -Path $scriptsDir | Out-Null
}

# Move scripts to scripts folder
$scriptFiles = @(
    "alias_resolvai_domain.ps1",
    "deploy_and_verify_vercel.ps1",
    "deploy_vercel.ps1",
    "promote_vercel.ps1",
    "update_github_metadata.ps1",
    "verify_tokens.ps1"
)

foreach ($sf in $scriptFiles) {
    if (Test-Path "$repoDir\$sf") {
        Move-Item -Path "$repoDir\$sf" -Destination "$scriptsDir\$sf" -Force
    }
}

# Copy banner image
Copy-Item 'C:\Users\HP\.gemini\antigravity\brain\e067a3a3-3be8-45bf-86c0-280c5f2a29f4\resolvai_banner_no_cta_1785082739496.jpg' "$repoDir\banner.jpg" -Force
Copy-Item 'C:\Users\HP\.gemini\antigravity\brain\e067a3a3-3be8-45bf-86c0-280c5f2a29f4\resolvai_banner_no_cta_1785082739496.jpg' "$repoDir\frontend\public\banner.jpg" -Force

# 3. Update Git Remote URL and Commit
$gitExe = "C:\Users\HP\.gemini\antigravity\scratch\MinGit\cmd\git.exe"
Push-Location $repoDir

try {
    & $gitExe config user.name "ByteBySway"
    & $gitExe config user.email "bytebysway@users.noreply.github.com"

    $newRemoteUrl = "https://" + $username + ":" + $pat + "@github.com/" + $username + "/" + $newRepoName + ".git"
    & $gitExe remote set-url origin $newRemoteUrl

    Write-Host "Staging files for clean organized commit..." -ForegroundColor Cyan
    & $gitExe add -A

    Write-Host "Creating clean commit..." -ForegroundColor Cyan
    & $gitExe commit -m "feat: organize project architecture into clean scripts folder, update resolvai banner"

    & $gitExe branch -M main

    Write-Host "Pushing clean commits to new GitHub repository..." -ForegroundColor Cyan
    & $gitExe push -u origin main --force
    Write-Host ("🎉 Successfully pushed cleanly organized codebase to https://github.com/" + $username + "/" + $newRepoName) -ForegroundColor Green
} catch {
    Write-Error ("Git push failed: " + $_)
} finally {
    Pop-Location
}

# 4. Update Topics on new repo name
$topicsObj = @{
    names = @("resolvai", "nextjs", "python", "machine-learning", "ai-support", "ticketing-system", "sla-tracking", "csat-analytics", "nodejs", "vercel", "fullstack", "react", "mongodb", "automation", "copilot-bot")
}
$topicsJson = $topicsObj | ConvertTo-Json
$topicsBytes = [System.Text.Encoding]::UTF8.GetBytes($topicsJson)

try {
    Invoke-RestMethod -Uri ("https://api.github.com/repos/" + $username + "/" + $newRepoName + "/topics") -Method Put -Headers $headers -Body $topicsBytes -ContentType "application/json; charset=utf-8" | Out-Null
    Write-Host "✅ Successfully updated repository topics/tags on new URL!" -ForegroundColor Green
} catch {
    Write-Warning ("Topics update status: " + $_)
}
