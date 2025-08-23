# Simple PowerShell script to get auth token and upload test data
Write-Host "🚀 Authenticating and uploading test data..." -ForegroundColor Green

# Get authentication token
Write-Host "`n📝 Getting authentication token..." -ForegroundColor Yellow

$body = @{
    username = "testuser"
    password = "testpass"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/login/access-token" -Method Post -Body $body -ContentType "application/json"
$token = $response.access_token
Write-Host "✅ Token obtained successfully" -ForegroundColor Green

# Test upload (simplified - just test the workflow)
Write-Host "`n📊 Testing upload workflow..." -ForegroundColor Yellow

$headers = @{
    "Authorization" = "Bearer $token"
}

# Test authentication
$testResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/login/test-token" -Method Get -Headers $headers
Write-Host "✅ Authentication verified - User: $($testResponse.user)" -ForegroundColor Green

# Check current status
Write-Host "`n🔍 Current API Status:" -ForegroundColor Yellow
$datasets = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/datasets/" -Method Get
$models = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/models/" -Method Get

Write-Host "   📊 Current Datasets: $($datasets.Count)" -ForegroundColor Cyan
Write-Host "   🤖 Current Models: $($models.data.Count)" -ForegroundColor Cyan

Write-Host "`n💡 To test the complete workflow:" -ForegroundColor Yellow
Write-Host "1. Go to http://localhost:3002 (frontend)" -ForegroundColor White
Write-Host "2. Upload a real dataset or model file" -ForegroundColor White
Write-Host "3. The system will automatically run feasibility analysis" -ForegroundColor White
Write-Host "4. View the results in the upload response" -ForegroundColor White

Write-Host "`n🎯 For manual testing:" -ForegroundColor Yellow
Write-Host "Token for API calls: $token" -ForegroundColor Cyan
Write-Host "Use this token in Authorization header: Bearer $token" -ForegroundColor Cyan

Write-Host "`n🎉 Setup completed! You can now use the authenticated API." -ForegroundColor Green
