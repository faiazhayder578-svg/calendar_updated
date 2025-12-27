# Check if backend is running and accessible
Write-Host "Checking Backend Server..." -ForegroundColor Cyan
Write-Host ""

# Test if port 5000 is listening
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($port5000) {
    Write-Host "✓ Port 5000 is open" -ForegroundColor Green
} else {
    Write-Host "✗ Port 5000 is NOT open - Backend is not running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "To start backend:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor Yellow
    Write-Host "  python app.py" -ForegroundColor Yellow
    exit
}

# Test if backend responds
Write-Host "Testing backend API..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/classes" -UseBasicParsing -TimeoutSec 5
    Write-Host "✓ Backend is responding!" -ForegroundColor Green
    Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Backend is not responding!" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Backend may be running but not working correctly." -ForegroundColor Yellow
    Write-Host "Try restarting it:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor Yellow
    Write-Host "  python app.py" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Backend is working correctly!" -ForegroundColor Green
Write-Host "You can now use the login page." -ForegroundColor Green
