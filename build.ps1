# Build script for Timer 24H Card
npm run build
if ($LASTEXITCODE -eq 0) {
    # Create dist directory in integration
    New-Item -ItemType Directory -Force -Path "custom_components\timer_24h\dist"
    
    # Copy built files
    Copy-Item "timer-24h-card.js" "custom_components\timer_24h\dist\"
    Copy-Item "timer-24h-card-editor.js" "custom_components\timer_24h\dist\"
    
    Write-Host "Build completed successfully!"
} else {
    Write-Host "Build failed!"
    exit 1
}

