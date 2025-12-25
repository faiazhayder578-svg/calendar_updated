# Test Login Flow
Write-Host "=== Testing Login Flow ===" -ForegroundColor Cyan

# Test 1: Check if backend is running
Write-Host "`n1. Checking backend health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/api/classes" -Method GET -TimeoutSec 5
    Write-Host "   Backend is running!" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: Backend is NOT running!" -ForegroundColor Red
    Write-Host "   Please start backend with: cd backend; python app.py" -ForegroundColor Yellow
    exit
}

# Test 2: Try login
Write-Host "`n2. Testing login with admin1..." -ForegroundColor Yellow
try {
    $loginBody = @{
        username = "admin1"
        password = "Admin@123"
    } | ConvertTo-Json

    $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody `
        -WebSession $session `
        -UseBasicParsing

    Write-Host "   Login successful! Status: $($loginResponse.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($loginResponse.Content)" -ForegroundColor Gray
    
    # Check cookies
    Write-Host "`n   Cookies received:" -ForegroundColor Cyan
    $session.Cookies.GetCookies("http://localhost:5000") | ForEach-Object {
        Write-Host "   - $($_.Name) = $($_.Value)" -ForegroundColor Gray
    }

    # Test 3: Check auth with same session
    Write-Host "`n3. Testing auth check with session..." -ForegroundColor Yellow
    $authResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/check" `
        -Method GET `
        -WebSession $session `
        -UseBasicParsing

    Write-Host "   Auth check response: $($authResponse.Content)" -ForegroundColor Gray
    
    $authData = $authResponse.Content | ConvertFrom-Json
    if ($authData.authenticated -eq $true) {
        Write-Host "   SUCCESS: Session is working!" -ForegroundColor Green
    } else {
        Write-Host "   ERROR: Session is NOT working!" -ForegroundColor Red
    }

} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
