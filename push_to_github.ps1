# Push all changes to GitHub
Write-Host "Adding all changes to git..." -ForegroundColor Cyan
git add .

Write-Host "Committing changes..." -ForegroundColor Cyan
git commit -m "v3.0.0 - Migrate from Lovelace card to full Home Assistant integration

- Created full integration structure in custom_components/timer_24h/
- Added coordinator for timer logic and entity control
- Added config flow for UI-based setup
- Added timer entity with state tracking
- Updated card to work with integration (removed business logic)
- Added translations (English and Hebrew)
- Updated documentation (README in English, README_he in Hebrew)
- Updated version to 3.0.0
- Added build and installation instructions

Breaking Changes:
- Installation method changed from card to integration
- Card now requires entity parameter instead of direct configuration
- Users need to install via Settings -> Integrations

New Features:
- Multiple timer instances support
- Automatic state persistence via config entries
- Home presence detection with sensor logic
- Service calls (toggle_slot, set_slots, clear_all)
- Full Hebrew and English translations
- Automatic card installation"

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Create a new release (v3.0.0) on GitHub"
    Write-Host "2. Run 'npm install' to install dependencies"
    Write-Host "3. Run 'npm run build' to build the card"
    Write-Host "4. Copy built files to custom_components/timer_24h/dist/"
} else {
    Write-Host "Failed to push to GitHub!" -ForegroundColor Red
    exit 1
}

