# Build and Copy Script for Timer 24H Integration
# This script builds the card and copies all files to the integration folder

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Timer 24H Integration - Build & Copy" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install dependencies!" -ForegroundColor Red
        exit 1
    }
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
    Write-Host ""
}

# Step 2: Build the card
Write-Host "Building the card..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host ""

# Step 3: Create dist directory if it doesn't exist
$distDir = "custom_components\timer_24h\dist"
if (-Not (Test-Path $distDir)) {
    Write-Host "Creating dist directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path $distDir | Out-Null
}

# Step 4: Copy built files
Write-Host "Copying built files to integration..." -ForegroundColor Yellow

if (Test-Path "timer-24h-card.js") {
    Copy-Item "timer-24h-card.js" "$distDir\" -Force
    Write-Host "  ✓ Copied timer-24h-card.js" -ForegroundColor Green
} else {
    Write-Host "  ✗ timer-24h-card.js not found!" -ForegroundColor Red
    exit 1
}

if (Test-Path "timer-24h-card-editor.js") {
    Copy-Item "timer-24h-card-editor.js" "$distDir\" -Force
    Write-Host "  ✓ Copied timer-24h-card-editor.js" -ForegroundColor Green
} else {
    Write-Host "  ✗ timer-24h-card-editor.js not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Build and copy completed successfully!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy the 'custom_components/timer_24h' folder to your Home Assistant config directory"
Write-Host "2. Restart Home Assistant"
Write-Host "3. Go to Settings → Devices & Services"
Write-Host "4. Click '+ Add Integration'"
Write-Host "5. Search for 'Timer 24H'"
Write-Host ""

