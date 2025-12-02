# Install dependencies
Write-Host "Installing npm dependencies..."
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "Failed to install dependencies!" -ForegroundColor Red
    exit 1
}

