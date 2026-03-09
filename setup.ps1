# Quick Start Script for IIM-A Website

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "IIM-A Website Quick Start Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js detected: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Frontend Setup
Write-Host "`nSetting up Frontend..." -ForegroundColor Yellow
Set-Location -Path "Frontend"

if (!(Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "✓ Frontend dependencies already installed" -ForegroundColor Green
}

# Create .env if not exists
if (!(Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Created .env file (please update with your values)" -ForegroundColor Green
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

Set-Location -Path ".."

# Backend Setup
Write-Host "`nSetting up Backend..." -ForegroundColor Yellow
Set-Location -Path "Backend"

if (!(Test-Path "node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "✓ Backend dependencies already installed" -ForegroundColor Green
}

# Create .env if not exists
if (!(Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Created .env file (please update with your values)" -ForegroundColor Green
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

Set-Location -Path ".."

# Summary
Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Update Frontend/.env with your API URL" -ForegroundColor White
Write-Host "2. Update Backend/.env with your YouTube API key" -ForegroundColor White
Write-Host "3. Update Frontend/src/firebase/config.js with your Firebase credentials" -ForegroundColor White
Write-Host "4. Update Frontend/src/context/AuthContext.jsx with admin email" -ForegroundColor White
Write-Host ""
Write-Host "To start the servers:" -ForegroundColor Yellow
Write-Host "  Backend:  cd Backend && npm start" -ForegroundColor White
Write-Host "  Frontend: cd Frontend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Read README.md for detailed instructions" -ForegroundColor Cyan
