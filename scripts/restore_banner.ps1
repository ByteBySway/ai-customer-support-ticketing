# restore_banner.ps1
$src = "C:\Users\HP\.gemini\antigravity\brain\e067a3a3-3be8-45bf-86c0-280c5f2a29f4\resolvai_banner_no_cta_1785082739496.jpg"
$destRoot = "C:\Users\HP\.gemini\antigravity\scratch\ai-customer-support-ticketing\banner.jpg"
$destPublic = "C:\Users\HP\.gemini\antigravity\scratch\ai-customer-support-ticketing\frontend\public\banner.jpg"

Copy-Item $src $destRoot -Force
Copy-Item $src $destPublic -Force
Write-Host "✅ Restored clean unblemished hero banner image!" -ForegroundColor Green
