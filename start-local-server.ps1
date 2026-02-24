# Local Server Starter for Testing
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Local Server for Testing" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is available
$pythonAvailable = $null -ne (Get-Command python -ErrorAction SilentlyContinue)

if ($pythonAvailable) {
    Write-Host "Starting Python HTTP Server on port 8000..." -ForegroundColor Green
    Write-Host ""
    Write-Host "Open your browser and visit:" -ForegroundColor Yellow
    Write-Host "  - IRCTC Page: http://localhost:8000/irctc/" -ForegroundColor White
    Write-Host "  - Tools Page: http://localhost:8000/tools/" -ForegroundColor White
    Write-Host "  - Test Page:  http://localhost:8000/test-local.html" -ForegroundColor White
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
    Write-Host ""
    
    python -m http.server 8000
} else {
    Write-Host "Python not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Python or use Node.js:" -ForegroundColor Yellow
    Write-Host "  npx serve -p 8000" -ForegroundColor White
    Write-Host ""
    pause
}
