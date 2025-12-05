# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [4.7.0] - 2024-12-05

### Added
- **Cache Busting** - Version parameter (`?v=X.X.X`) automatically added to card URL to prevent browser caching issues
- **Smart Resource Registration** - Attempts automatic resource registration when possible
- Detailed logging for card installation process
- Enhanced troubleshooting documentation in README.md
- One-time resource setup instructions

### Changed
- Resource URL format: `/local/timer-24h-card/timer-24h-card.js?v=4.7.0` (with version)
- Card files automatically copied to `www/timer-24h-card/` on installation
- Enhanced README with clear installation steps
- Improved resource registration workflow

### Fixed
- Browser cache preventing card updates from being visible
- Updates not visible without hard refresh (Ctrl+Shift+R)
- Incognito mode showing updates while normal mode doesn't

### Note
- **One-time setup required**: Users must add the Lovelace resource manually once
- **After setup**: All future updates work automatically with cache busting
- **Why**: Lovelace resources API is difficult to access reliably during integration setup

## [4.6.7] - Previous Release

### Features
- 24-hour circular timer with half-hour segments
- Home presence detection with configurable sensors
- Automatic entity control based on schedule
- Multiple timer instances support
- Automatic state persistence
- Multi-language support (English, Hebrew)
- RTL support for Hebrew interface
- Three service calls: toggle_slot, set_slots, clear_all
- Visual indicator for current time segment
- Responsive design with container queries
- Integration with Home Assistant's entity registry

---

## How Cache Busting Works

The integration now automatically manages card versions:

1. **On Installation/Restart**: Reads version from `manifest.json`
2. **Copies Files**: Places card files in `www/timer-24h-card/`
3. **Registers Resource**: Adds resource to Lovelace with version parameter
4. **On Update**: When `manifest.json` version changes, resource URL updates automatically

**Example**:
- Version 4.6.7: `/local/timer-24h-card/timer-24h-card.js?v=4.6.7`
- Version 4.6.8: `/local/timer-24h-card/timer-24h-card.js?v=4.6.8`

The browser sees a different URL and loads the new file instead of using cached version.

---

**Legend**:
- `Added` - New features
- `Changed` - Changes in existing functionality
- `Deprecated` - Soon-to-be removed features
- `Removed` - Removed features
- `Fixed` - Bug fixes
- `Security` - Vulnerability fixes

