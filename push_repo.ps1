# push_repo.ps1 - Automated GitHub Repository Creation and Code Deployment Script
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

Write-Host "🚀 Creating repository $username/$repoName on GitHub..." -ForegroundColor Cyan
$headers = @{
    "Authorization" = "Bearer $pat"
    "Accept"        = "application/vnd.github.v3+json"
}

$body = @{
    name = $repoName
    private = $false
    description = "Smart support platform with automated ticket classification, AI routing, SLA tracking, agent performance dashboards, and customer satisfaction analytics. Next.js, Python (ML), Node.js, MongoDB."
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
    Write-Host "✅ Repository created successfully: $($response.html_url)" -ForegroundColor Green
} catch {
    Write-Host "Repository may already exist or responded with status code. Proceeding to push code..." -ForegroundColor Yellow
}

$gitExe = "C:\Users\HP\.gemini\antigravity\scratch\MinGit\cmd\git.exe"
$repoDir = "C:\Users\HP\.gemini\antigravity\scratch\ai-customer-support-ticketing"

Push-Location $repoDir

try {
    # Initialize Git if needed
    if (-not (Test-Path "$repoDir\.git")) {
        & $gitExe init
    }

    & $gitExe config user.name "ByteBySway"
    & $gitExe config user.email "bytebysway@users.noreply.github.com"

    Write-Host "Staging files..." -ForegroundColor Cyan
    & $gitExe add -A

    Write-Host "Creating initial commit..." -ForegroundColor Cyan
    & $gitExe commit -m "feat: AI-Based Customer Support Ticketing System with Next.js, Node.js, Python ML & MongoDB"

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
    Write-Host "🎉 Successfully pushed code to https://github.com/$username/$repoName" -ForegroundColor Green
} catch {
    Write-Error "Git operations failed: $_"
    exit 1
} finally {
    Pop-Location
}

# Update topics
Write-Host "Assigning GitHub topics..." -ForegroundColor Cyan
$topicsBody = @{
    names = @("nextjs", "python", "machine-learning", "customer-support", "ticket-classification", "sla-tracking", "mongodb", "nodejs")
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "https://api.github.com/repos/$username/$repoName/topics" -Method Put -Headers $headers -Body $topicsBody -ContentType "application/json" | Out-Null
    Write-Host "✅ Successfully set GitHub repository topics!" -ForegroundColor Green
} catch {
    Write-Warning "Failed to set topics: $_"
}
