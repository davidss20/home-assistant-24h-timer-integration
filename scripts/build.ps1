# Build the Lovelace card into custom_components/timer_24h/dist/
Set-Location (Split-Path -Parent $PSScriptRoot)

npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "Build completed successfully!"
} else {
    Write-Host "Build failed!"
    exit 1
}
