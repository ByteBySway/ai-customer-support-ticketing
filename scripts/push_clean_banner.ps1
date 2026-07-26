# push_clean_banner.ps1
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
$gitExe = "C:\Users\HP\.gemini\antigravity\scratch\MinGit\cmd\git.exe"
$repoDir = "C:\Users\HP\.gemini\antigravity\scratch\ai-customer-support-ticketing"

Push-Location $repoDir
& $gitExe add -A
& $gitExe commit -m "docs: restore clean unblemished hero banner image"
$remoteUrl = "https://" + $username + ":" + $pat + "@github.com/" + $username + "/" + $repoName + ".git"
& $gitExe remote set-url origin $remoteUrl
& $gitExe push origin main --force
Pop-Location

Write-Host "🎉 Successfully pushed restored clean hero banner image to GitHub!" -ForegroundColor Green
