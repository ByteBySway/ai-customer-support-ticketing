# edit_exact_banner.ps1
Add-Type -AssemblyName System.Drawing

$imgPath = "C:\Users\HP\.gemini\antigravity\brain\e067a3a3-3be8-45bf-86c0-280c5f2a29f4\resolvai_minimal_banner_1785082310981.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($imgPath)

$w = $bmp.Width
$h = $bmp.Height
Write-Host ("Original Image dimensions: " + $w + "x" + $h) -ForegroundColor Cyan

# Sample the background color at x=50, y=75% of height
$bgColor = $bmp.GetPixel(50, [int]($h * 0.75))
Write-Host ("Sampled background color RGB: (" + $bgColor.R + ", " + $bgColor.G + ", " + $bgColor.B + ")") -ForegroundColor Green

$g = [System.Drawing.Graphics]::FromImage($bmp)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, $bgColor.R, $bgColor.G, $bgColor.B))

# Exact bounding box of "Optimize Your Support" button and "Request Demo" text
$boxX = [int]($w * 0.04)
$boxY = [int]($h * 0.45)
$boxW = [int]($w * 0.28)
$boxH = [int]($h * 0.20)

$g.FillRectangle($brush, $boxX, $boxY, $boxW, $boxH)

$g.Dispose()

$outRoot = "C:\Users\HP\.gemini\antigravity\scratch\ai-customer-support-ticketing\banner.jpg"
$outPublic = "C:\Users\HP\.gemini\antigravity\scratch\ai-customer-support-ticketing\frontend\public\banner.jpg"

if (Test-Path $outRoot) { Remove-Item $outRoot -Force }
if (Test-Path $outPublic) { Remove-Item $outPublic -Force }

$bmp.Save($outRoot, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmp.Dispose()

Copy-Item $outRoot $outPublic -Force
Write-Host "✅ Successfully erased ONLY the Optimize Your Support button and Request Demo text from the exact banner image!" -ForegroundColor Green
