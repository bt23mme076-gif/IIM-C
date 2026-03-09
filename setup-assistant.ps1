# Quick Start Script - Run this to complete setup

Write-Host "🚀 IIM-A Website Setup Assistant" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if in correct directory
if (!(Test-Path "Frontend")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    Write-Host "Run: cd c:\Users\jatin\Documents\GitHub\IIM-A" -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Step 1: Checking Firebase Configuration..." -ForegroundColor Yellow
if (Test-Path "Frontend\src\firebase\config.js") {
    Write-Host "✅ Firebase config found" -ForegroundColor Green
} else {
    Write-Host "❌ Firebase config not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Step 2: Installing Dependencies..." -ForegroundColor Yellow
Set-Location Frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green

Write-Host ""
Write-Host "📋 Step 3: Checking if Firestore is initialized..." -ForegroundColor Yellow
Write-Host "⚠️  You need to manually initialize Firestore" -ForegroundColor Yellow
Write-Host ""
Write-Host "Run this command:" -ForegroundColor Cyan
Write-Host "  node src/scripts/initializeFirestore.js" -ForegroundColor White
Write-Host ""

Write-Host "📋 Step 4: Next Steps" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣  Enable Firebase Authentication:" -ForegroundColor Cyan
Write-Host "   https://console.firebase.google.com/project/iim-a-website/authentication" -ForegroundColor White
Write-Host ""
Write-Host "2️⃣  Create Admin User in Firebase Console" -ForegroundColor Cyan
Write-Host ""
Write-Host "3️⃣  Update admin email in:" -ForegroundColor Cyan
Write-Host "   Frontend/src/context/AuthContext.jsx (line 23)" -ForegroundColor White
Write-Host ""
Write-Host "4️⃣  Deploy Firestore Security Rules:" -ForegroundColor Cyan
Write-Host "   Copy firestore.rules to Firebase Console" -ForegroundColor White
Write-Host "   https://console.firebase.google.com/project/iim-a-website/firestore/rules" -ForegroundColor White
Write-Host ""
Write-Host "5️⃣  Start development server:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""

Write-Host "📖 For detailed instructions, see:" -ForegroundColor Green
Write-Host "   COMPLETE_SETUP_GUIDE.md" -ForegroundColor White
Write-Host ""

Write-Host "Setup assistant completed!" -ForegroundColor Green
