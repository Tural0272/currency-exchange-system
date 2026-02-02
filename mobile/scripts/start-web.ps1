# Start Expo web - then open browser manually at http://localhost:8081
$WebUrl = "http://localhost:8081"
Write-Host "Starting Expo web server..." -ForegroundColor Green
Write-Host ""
Write-Host "When you see 'Web Bundled' or 'Bundled successfully', open in your browser:" -ForegroundColor Yellow
Write-Host "  $WebUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "If the page does not load: wait a few more seconds and refresh." -ForegroundColor Gray
Write-Host ""

Set-Location $PSScriptRoot\..
npx expo start --web
