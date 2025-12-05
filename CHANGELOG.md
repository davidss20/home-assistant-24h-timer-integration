# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [4.7.6] - 2024-12-05

### Fixed
- **Critical: Complete Key Format Fix** - Fixed all key format inconsistencies causing buttons to malfunction
- Outer circle buttons (full hours, minute=0) now work correctly
- Inner circle buttons (half hours, minute=30) no longer affect random other buttons
- Standardized key format in BOTH `toggleTimeSlot()` AND `getTimeSlots()` methods

### Technical Details
- Updated `getTimeSlots()` line 210 to use: `${slot.hour}:${String(slot.minute).padStart(2, '0')}`
- Now matches `toggleTimeSlot()` key format for consistent state mapping
- This was the root cause of the button malfunction issue

## [4.7.5] - 2024-12-05

### Fixed
- **Key Format Consistency** - Fixed misleading warning logs when clicking slots
- Standardized time slot key format to always use zero-padded minutes (e.g., "5:00" instead of "5:0")
- Eliminated false "UNEXPECTED SLOTS" warnings in console

### Technical Details
- Updated `toggleTimeSlot` to use consistent key format: `${hour}:${String(minute).padStart(2, '0')}`
- This ensures the key format matches throughout the codebase for accurate state tracking

## [4.7.4] - 2024-12-05

### Fixed
- **SVG Event Handlers** - Fixed event handlers not working properly in SVG elements
- Improved click handling for time slot toggles

## [4.7.3] - 2024-12-05

### Fixed
- **Critical SVG Rendering Bug** - Fixed sectors not appearing due to incorrect template usage
- Changed from `html` to `svg` template literals for proper SVG rendering
- All timer slots now render correctly again

### Technical Details
- Import `svg` from lit alongside `html`
- Use `svg` template for all SVG child elements (paths, text, lines)
- This ensures proper rendering of SVG elements with event handlers

## [4.7.2] - 2024-12-05

### Fixed
- **Multi-Instance Synchronization** - Fixed issue where multiple dashboard instances didn't sync when toggling slots
- **Random Slot Activation Bug** - Fixed critical bug where clicking one slot would sometimes activate random other slots
- **Click Event Handling** - Replaced unsafe onclick with proper @click event handlers
- **Event Propagation** - Added proper event.stopPropagation() to prevent event bubbling issues
- **Debouncing** - Added 300ms debounce to prevent rapid multiple clicks

### Changed
- Replaced `unsafeSVG` with native `html` templates for better event handling
- Improved optimistic state clearing - now clears immediately when server state changes
- Enhanced logging with emojis for better debugging (🔄 toggle, ❌ error)
- Reduced optimistic state timeout from 3s to 1s for faster sync

### Technical Details
- Added `clickTimeout` property for debouncing
- Added `handleSlotClick()` method for proper event handling
- Modified `updated()` lifecycle to force re-render on state changes
- Removed unused `renderDividingLines`, `renderOuterSectors`, `renderInnerSectors` methods

## [4.7.1] - 2024-12-05

### Fixed
- **Instant UI Updates** - Implemented optimistic UI updates for immediate visual feedback when toggling time slots
- UI now updates instantly when clicking on time slots, no need to wait for server response or manual refresh
- Added automatic state synchronization when server confirms the change
- Improved error handling with automatic rollback on service call failures

### Technical Details
- Added optimistic state cache (`optimisticSlots`) that updates UI immediately
- Server state syncs automatically after 3 seconds
- Optimistic updates are cleared when entity state changes from server
- On error, optimistic state is immediately removed and UI reverts

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

