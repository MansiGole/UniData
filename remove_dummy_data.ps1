# LLM Data Marketplace - Dummy Data Removal (PowerShell)
# ================================================================

Write-Host "🔥 LLM DATA MARKETPLACE - DUMMY DATA REMOVAL TOOL" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

# Find project directory
$currentDir = Get-Location
$projectRoot = $null

if (Test-Path "$currentDir\llm-data-marketplace") {
    $projectRoot = $currentDir
} elseif (Test-Path "$currentDir\..\llm-data-marketplace") {
    $projectRoot = "$currentDir\.."
} elseif (Test-Path "$currentDir\sampleuni\llm-data-marketplace") {
    $projectRoot = "$currentDir\sampleuni"
}

if (-not $projectRoot) {
    Write-Host "❌ Could not find LLM Data Marketplace directory" -ForegroundColor Red
    Write-Host "Please run this script from the project root or sampleuni directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "📁 Project root detected: $projectRoot" -ForegroundColor Green

# Analyze dummy data
Write-Host "`n🔍 ANALYZING DUMMY DATA..." -ForegroundColor Yellow

$apiFile = "$projectRoot\llm-data-marketplace\backend\app\api\api_v1\api.py"
$hooksFile = "$projectRoot\llm-data-marketplace\frontend\src\hooks\useApi.ts"

$dummyDataCount = 0
$locations = @()

# Check backend API
if (Test-Path $apiFile) {
    $apiContent = Get-Content $apiFile -Raw
    if ($apiContent -match 'Customer Sentiment Analysis Dataset') {
        $datasetMatches = [regex]::Matches($apiContent, '"id":\s*\d+')
        $locations += "Backend API: $($datasetMatches.Count) dummy datasets and models"
        $dummyDataCount += $datasetMatches.Count
    }
}

# Check root JSON files
$jsonFiles = @("test_dataset.json", "real_wallet_dataset.json", "web3_dataset.json", "test_purchase.json", "real_wallet_purchase.json")
$foundJsonFiles = @()
foreach ($file in $jsonFiles) {
    if (Test-Path "$projectRoot\$file") {
        $foundJsonFiles += $file
        $dummyDataCount++
    }
}
if ($foundJsonFiles.Count -gt 0) {
    $locations += "Root directory: $($foundJsonFiles.Count) JSON test files"
}

# Check frontend mock data
if (Test-Path $hooksFile) {
    $hooksContent = Get-Content $hooksFile -Raw
    if ($hooksContent -match 'mock data while backend') {
        $locations += "Frontend: Mock feasibility data in useApi.ts"
        $dummyDataCount++
    }
}

# Display analysis
Write-Host "`n📊 DUMMY DATA ANALYSIS REPORT" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host "Total dummy items found: $dummyDataCount" -ForegroundColor Yellow

Write-Host "`n📍 LOCATIONS:" -ForegroundColor Yellow
foreach ($location in $locations) {
    Write-Host "   • $location" -ForegroundColor White
}

if ($dummyDataCount -eq 0) {
    Write-Host "`n✅ No dummy data found! Your marketplace is already clean." -ForegroundColor Green
    exit 0
}

# Ask user what to do
Write-Host "`n🔧 REMOVAL OPTIONS:" -ForegroundColor Yellow
Write-Host "1. 🚀 PRODUCTION MODE - Remove all dummy data (recommended)" -ForegroundColor Green
Write-Host "2. 💾 BACKUP + REMOVE - Create backups then remove all" -ForegroundColor Cyan
Write-Host "3. 🗑️  QUICK REMOVE - Remove root JSON files only" -ForegroundColor Yellow
Write-Host "4. ❌ CANCEL - Just analyze, don't remove anything" -ForegroundColor Red

$choice = Read-Host "`nSelect option (1-4)"

switch ($choice) {
    "1" {
        $confirm = Read-Host "⚠️  This will permanently remove all dummy data. Continue? (y/N)"
        if ($confirm -eq "y" -or $confirm -eq "Y") {
            Write-Host "`n🚀 REMOVING ALL DUMMY DATA..." -ForegroundColor Green
            
            # Remove root JSON files
            foreach ($file in $jsonFiles) {
                $filePath = "$projectRoot\$file"
                if (Test-Path $filePath) {
                    Remove-Item $filePath -Force
                    Write-Host "   ✅ Removed $file" -ForegroundColor Green
                }
            }
            
            # Clean backend API (simple approach - replace arrays)
            if (Test-Path $apiFile) {
                $apiContent = Get-Content $apiFile -Raw
                $apiContent = $apiContent -replace 'DATASETS = \[[\s\S]*?\n\]', 'DATASETS = []'
                $apiContent = $apiContent -replace 'MODELS = \[[\s\S]*?\n\]', 'MODELS = []'
                Set-Content $apiFile -Value $apiContent -Encoding UTF8
                Write-Host "   ✅ Cleaned backend API" -ForegroundColor Green
            }
            
            Write-Host "`n🎉 PRODUCTION CLEANUP COMPLETE!" -ForegroundColor Green
            Write-Host "Your marketplace now starts with clean, empty data stores." -ForegroundColor White
            Write-Host "Users can now upload real datasets and models." -ForegroundColor White
        } else {
            Write-Host "❌ Cancelled" -ForegroundColor Red
        }
    }
    "2" {
        $confirm = Read-Host "⚠️  This will create backups then remove dummy data. Continue? (y/N)"
        if ($confirm -eq "y" -or $confirm -eq "Y") {
            Write-Host "`n💾 CREATING BACKUPS..." -ForegroundColor Cyan
            
            # Create backup directory
            $backupDir = "$projectRoot\backups"
            if (-not (Test-Path $backupDir)) {
                New-Item -ItemType Directory -Path $backupDir -Force
            }
            
            # Backup files
            if (Test-Path $apiFile) {
                Copy-Item $apiFile "$backupDir\api.py.backup" -Force
                Write-Host "   ✅ Backed up api.py" -ForegroundColor Green
            }
            
            if (Test-Path $hooksFile) {
                Copy-Item $hooksFile "$backupDir\useApi.ts.backup" -Force
                Write-Host "   ✅ Backed up useApi.ts" -ForegroundColor Green
            }
            
            foreach ($file in $foundJsonFiles) {
                $filePath = "$projectRoot\$file"
                Copy-Item $filePath "$backupDir\$file.backup" -Force
                Write-Host "   ✅ Backed up $file" -ForegroundColor Green
            }
            
            Write-Host "`n🗑️  REMOVING DUMMY DATA..." -ForegroundColor Yellow
            
            # Remove files (same as option 1)
            foreach ($file in $jsonFiles) {
                $filePath = "$projectRoot\$file"
                if (Test-Path $filePath) {
                    Remove-Item $filePath -Force
                    Write-Host "   ✅ Removed $file" -ForegroundColor Green
                }
            }
            
            # Clean backend API
            if (Test-Path $apiFile) {
                $apiContent = Get-Content $apiFile -Raw
                $apiContent = $apiContent -replace 'DATASETS = \[[\s\S]*?\n\]', 'DATASETS = []'
                $apiContent = $apiContent -replace 'MODELS = \[[\s\S]*?\n\]', 'MODELS = []'
                Set-Content $apiFile -Value $apiContent -Encoding UTF8
                Write-Host "   ✅ Cleaned backend API" -ForegroundColor Green
            }
            
            Write-Host "`n🎉 BACKUP & CLEANUP COMPLETE!" -ForegroundColor Green
            Write-Host "Backups created in: $backupDir" -ForegroundColor White
        } else {
            Write-Host "❌ Cancelled" -ForegroundColor Red
        }
    }
    "3" {
        Write-Host "`n🗑️  REMOVING ROOT JSON FILES..." -ForegroundColor Yellow
        foreach ($file in $jsonFiles) {
            $filePath = "$projectRoot\$file"
            if (Test-Path $filePath) {
                Remove-Item $filePath -Force
                Write-Host "   ✅ Removed $file" -ForegroundColor Green
            }
        }
        Write-Host "`n✅ JSON files removed. Backend dummy data still exists." -ForegroundColor Yellow
    }
    "4" {
        Write-Host "`n❌ Analysis only - no changes made" -ForegroundColor Yellow
    }
    default {
        Write-Host "`n❌ Invalid choice" -ForegroundColor Red
    }
}

Write-Host "`n📋 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Restart your backend server" -ForegroundColor White
Write-Host "2. Refresh your frontend" -ForegroundColor White
Write-Host "3. Upload real datasets and models through the UI" -ForegroundColor White

Read-Host "`nPress Enter to exit"
