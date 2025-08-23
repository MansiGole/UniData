# PowerShell script to get auth token and upload test data
Write-Host "🚀 Getting authentication token and uploading test data..." -ForegroundColor Green

# Step 1: Get authentication token
Write-Host "`n📝 Getting authentication token..." -ForegroundColor Yellow

$loginData = @{
    username = "testuser"
    password = "testpass"
} | ConvertTo-Json

try {
    $tokenResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/login/access-token" -Method Post -Body $loginData -ContentType "application/json"
    $token = $tokenResponse.access_token
    Write-Host "✅ Token obtained: $($token.Substring(0,10))..." -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to get token: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Upload test dataset
Write-Host "`n📊 Uploading test dataset..." -ForegroundColor Yellow

# Create sample dataset file content
$sampleData = @{
    "sentiment_samples" = @(
        @{ "text" = "I love this product! It's amazing and works perfectly."; "sentiment" = "positive" },
        @{ "text" = "This is the worst purchase I've ever made. Completely useless."; "sentiment" = "negative" },
        @{ "text" = "The product is okay, nothing special but does the job."; "sentiment" = "neutral" },
        @{ "text" = "Fantastic quality and great customer service!"; "sentiment" = "positive" },
        @{ "text" = "Terrible experience, would not recommend to anyone."; "sentiment" = "negative" }
    )
} | ConvertTo-Json -Depth 3

# Save to temporary file
$tempFile = [System.IO.Path]::GetTempFileName() + ".json"
$sampleData | Out-File -FilePath $tempFile -Encoding UTF8

try {
    # Prepare multipart form data
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $form = @{
        title = "Sample Sentiment Analysis Dataset"
        description = "A comprehensive sentiment analysis dataset with labeled examples for training NLP models"
        price = "0.5"
        category = "NLP"
        format = "JSON"
        tags = "sentiment, nlp, classification, text"
        license = "MIT"
        file = Get-Item -Path $tempFile
    }
    
    $datasetResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/datasets/upload" -Method Post -Form $form -Headers $headers
    
    Write-Host "✅ Dataset uploaded successfully!" -ForegroundColor Green
    Write-Host "   ID: $($datasetResponse.dataset_id)" -ForegroundColor Cyan
    Write-Host "   Title: $($datasetResponse.title)" -ForegroundColor Cyan
    
    if ($datasetResponse.feasibility_analysis) {
        $analysis = $datasetResponse.feasibility_analysis
        Write-Host "   Feasibility Score: $($analysis.score)/10 ($($analysis.grade))" -ForegroundColor Cyan
    }
    
} catch {
    Write-Host "❌ Dataset upload failed: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    # Clean up temp file
    if (Test-Path $tempFile) {
        Remove-Item $tempFile
    }
}

# Step 3: Upload test model
Write-Host "`n🤖 Uploading test model..." -ForegroundColor Yellow

# Create sample model file content
$modelData = @{
    "model_type" = "sentiment_classifier"
    "architecture" = "BERT"
    "parameters" = @{
        "layers" = 12
        "hidden_size" = 768
    }
} | ConvertTo-Json -Depth 3

# Save to temporary file
$tempModelFile = [System.IO.Path]::GetTempFileName() + ".json"
$modelData | Out-File -FilePath $tempModelFile -Encoding UTF8

try {
    $modelForm = @{
        name = "BERT Sentiment Classifier"
        description = "Fine-tuned BERT model for sentiment analysis with 94% accuracy"
        price = "3.5"
        framework = "PyTorch"
        accuracy = "94.2"
        tags = "bert, sentiment, nlp, transformer"
        license = "MIT"
        file = Get-Item -Path $tempModelFile
    }
    
    $modelResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/models/upload" -Method Post -Form $modelForm -Headers $headers
    
    Write-Host "✅ Model uploaded successfully!" -ForegroundColor Green
    Write-Host "   ID: $($modelResponse.model_id)" -ForegroundColor Cyan
    Write-Host "   Name: $($modelResponse.name)" -ForegroundColor Cyan
    
    if ($modelResponse.feasibility_analysis) {
        $analysis = $modelResponse.feasibility_analysis
        Write-Host "   Feasibility Score: $($analysis.score)/10 ($($analysis.grade))" -ForegroundColor Cyan
    }
    
} catch {
    Write-Host "❌ Model upload failed: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    # Clean up temp file
    if (Test-Path $tempModelFile) {
        Remove-Item $tempModelFile
    }
}

# Step 4: Check final status
Write-Host "`n🔍 Final Status Check:" -ForegroundColor Yellow

try {
    $datasets = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/datasets/" -Method Get
    $models = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/models/" -Method Get
    
    Write-Host "   📊 Total Datasets: $($datasets.Count)" -ForegroundColor Cyan
    Write-Host "   🤖 Total Models: $($models.data.Count)" -ForegroundColor Cyan
    
    if ($datasets.Count -gt 0) {
        Write-Host "`n✅ Success! Now you can test:" -ForegroundColor Green
        Write-Host "   curl http://localhost:8000/api/v1/datasets/1" -ForegroundColor White
        Write-Host "   curl http://localhost:8000/api/v1/datasets/1 | ConvertFrom-Json | Select-Object title, price, feasibility_analysis" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ Error checking final status: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Test data upload process completed!" -ForegroundColor Green
