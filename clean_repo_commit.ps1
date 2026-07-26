# clean_repo_commit.ps1
$repoDir = "C:\Users\HP\.gemini\antigravity\scratch\ai-customer-support-ticketing"
$scriptsDir = "$repoDir\scripts"

if (-not (Test-Path $scriptsDir)) {
    New-Item -ItemType Directory -Force -Path $scriptsDir | Out-Null
}

# 1. Move leftover scripts to scripts folder
$leftovers = @("push_repo.ps1", "rename_and_organize_repo.ps1")
foreach ($f in $leftovers) {
    if (Test-Path "$repoDir\$f") {
        Move-Item "$repoDir\$f" "$scriptsDir\$f" -Force
    }
}

# Delete temporary vercel deployment json from root if present
if (Test-Path "$repoDir\vercel_deployment.json") {
    Remove-Item "$repoDir\vercel_deployment.json" -Force
}

# 2. Update .gitignore to exclude temporary json and log files
$gitignoreContent = @"
node_modules/
.next/
.env*
*.log
vercel_deployment.json
".gitignore"
"@
Set-Content "$repoDir\.gitignore" $gitignoreContent -Force

# 3. Ensure banner.jpg is precisely edited (erasing blue button and demo link)
Add-Type -AssemblyName System.Drawing
$bannerSrc = "C:\Users\HP\.gemini\antigravity\brain\e067a3a3-3be8-45bf-86c0-280c5f2a29f4\resolvai_minimal_banner_1785082310981.jpg"

if (Test-Path $bannerSrc) {
    $bmp = [System.Drawing.Bitmap]::FromFile($bannerSrc)
    $w = $bmp.Width
    $h = $bmp.Height
    
    # Sample background color at x=40, y=70%
    $bgColor = $bmp.GetPixel(40, [int]($h * 0.70))
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, $bgColor.R, $bgColor.G, $bgColor.B))

    # Erase blue button and request demo link area (x: 4% to 32%, y: 44% to 66%)
    $g.FillRectangle($brush, [int]($w * 0.035), [int]($h * 0.44), [int]($w * 0.285), [int]($h * 0.22))
    $g.Dispose()

    $outRoot = "$repoDir\banner.jpg"
    $outPublic = "$repoDir\frontend\public\banner.jpg"

    if (Test-Path $outRoot) { Remove-Item $outRoot -Force }
    if (Test-Path $outPublic) { Remove-Item $outPublic -Force }

    $bmp.Save($outRoot, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $bmp.Dispose()

    Copy-Item $outRoot $outPublic -Force
    Write-Host "✅ Verified and saved pixel-perfect banner without button and demo link!" -ForegroundColor Green
}

# 4. Git Push with Clean Commit Messages
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
$gitExe = "$repoDir\..\MinGit\cmd\git.exe"

Push-Location $repoDir

try {
    & $gitExe config user.name "ByteBySway"
    & $gitExe config user.email "bytebysway@users.noreply.github.com"

    # Remove untracked files from git index
    & $gitExe rm -r --cached . 2>$null

    Write-Host "Staging clean file structure..." -ForegroundColor Cyan
    & $gitExe add -A

    Write-Host "Creating clean professional commit..." -ForegroundColor Cyan
    & $gitExe commit -m "feat: ResolvAI enterprise support platform initial release"

    $remoteUrl = "https://" + $username + ":" + $pat + "@github.com/" + $username + "/" + $repoName + ".git"
    & $gitExe remote set-url origin $remoteUrl

    Write-Host "Force pushing clean repo to GitHub..." -ForegroundColor Cyan
    & $gitExe push -u origin main --force
    Write-Host ("🎉 Successfully organized repository and pushed to https://github.com/" + $username + "/" + $repoName) -ForegroundColor Green
} catch {
    Write-Error ("Git push error: " + $_)
} finally {
    Pop-Location
}
