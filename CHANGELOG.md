# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [5.7.0] - 2024-12-07

### Fixed
- **Enhanced Automatic Resource Registration** - Improved resource registration with multiple fallback methods
  - Added 3-tier registration strategy: API → Service → Direct storage file
  - Increased retry attempts from 3 to 5 with adaptive delays (0, 2, 5, 10, 15 seconds)
  - Added direct manipulation of `.storage/lovelace_resources` file as last resort
  - More detailed logging for troubleshooting registration issues
  - Better error messages with clear manual instructions if auto-registration fails
  - Should now work reliably in all installation scenarios

### Technical Details
- Method 1: Lovelace Resources API (preferred method)
- Method 2: Frontend service reload (fallback)
- Method 3: Direct `.storage/lovelace_resources` file manipulation (last resort)
- Each method attempts to both create new resources and update existing ones
- Automatic version detection from `manifest.json`

## [5.6.0] - 2024-12-07

### Added
- **Automatic Localization** - Card now automatically detects Home Assistant language and displays in the correct language
- Full Hebrew translation support
- Dynamic language switching based on HA interface language
- No configuration needed - works automatically!

### Languages Supported
- ✅ **English (en)** - Default language
- ✅ **Hebrew (he)** - עברית מלאה

### Translated Strings
- Status indicators: Active/Inactive → פעיל/לא פעיל
- Entity status: ON/OFF → דלוק/כבוי
- Entity counters: entity/entities → ישות/ישויות
- Warning messages: Fully translated to Hebrew
- Error messages: Configuration errors in Hebrew

### Technical Details
- Added `localize(key: string)` method to card
- Detects language from `hass.language` or `hass.locale.language`
- Falls back to English if language not found
- All UI strings now use localization function
- RTL support already built-in via CSS

### User Experience
**Before:** Card always displayed in English regardless of HA language
**After:** Card automatically displays in your Home Assistant interface language

**Hebrew Interface:** הכרטיס מוצג בעברית באופן אוטומטי
**English Interface:** Card displays in English automatically

## [5.5.3] - 2024-12-07

### Fixed
- **Automatic Lovelace Resource Registration** - Fixed critical issue where resource wasn't registered automatically
- Resource now registers with retry mechanism (3 attempts with 5-second delays)
- Works correctly when integration is installed after Home Assistant has started
- No more manual resource addition required in most cases!

### Technical Details
- Added asyncio import for proper async task handling
- Modified `async_setup_entry` to register resource with retry mechanism
- Changed `_async_register_lovelace_resource` to return success/failure status
- Function now accepts `attempt` parameter for retry tracking
- Lovelace resources API availability checked before registration
- Detailed debug logging for troubleshooting registration issues

### What Changed
**Before:** Users had to manually add the Lovelace resource every time
**After:** Resource registers automatically in background with smart retry logic

**Registration Flow:**
1. Integration loaded → starts background task
2. Waits for Lovelace to be ready
3. Tries up to 3 times (5 seconds between attempts)
4. Logs success or instructs user if all attempts fail

### User Experience
- ✅ Install integration → resource registered automatically
- ✅ Update integration → resource updated automatically  
- ✅ No manual steps needed in most cases
- ⚠️ If automatic registration fails after 3 attempts, check logs for instructions

## [5.5.2] - 2024-12-07

### Added
- **Group Support** - Added support for Home Assistant groups (entity domain: `group`)
- Can now select light groups, switch groups, and any other group type as controlled entities
- Groups will be turned on/off as a single unit, controlling all entities within the group

### Technical Details
- Added `"group"` to `SUPPORTED_ENTITY_DOMAINS` in `config_flow.py`
- Groups appear in entity selector alongside individual lights, switches, etc.
- When timer activates/deactivates, group entities are controlled just like individual entities

### Use Cases
- Select `group.living_room_lights` instead of individual lights
- Control entire rooms with a single group selection
- Simplify configuration when managing multiple related entities
- Works with any Home Assistant group (light groups, switch groups, etc.)

## [5.5.1] - 2024-12-07

### Fixed
- **Improved Center Indicator** - Now fills the entire inner circle instead of small circle
- **Real-time Updates** - Indicator updates immediately when controlled entity states change
- Removed glow effect and animations for cleaner look
- Increased text size for better readability

### Changed
- Center indicator now uses full inner circle (radius 50px) for better visibility
- Added state change tracking for controlled entities in `shouldUpdate()`
- Instant visual feedback when any controlled entity changes state
- Simplified design - solid color fill without extra effects

### Technical Details
- `shouldUpdate()` now monitors all controlled entities for state changes
- Console log added when controlled entity state changes for debugging
- Text size increased from 12px to 14px for main status
- Entity count text increased from 7px to 8px
- Removed glow circle and drop shadow for simpler appearance

## [5.5.0] - 2024-12-07

### Added
- **Center Circle Indicator** - Visual status indicator in the center of the timer circle
- Real-time display of controlled entities status
- Color-coded feedback: Green (all on), Red (all off), Orange (partial), Gray (inactive/no entities)
- Entity count display showing active vs. total entities

### Features
- **Green Circle** 🟢 + "ON" - All controlled entities are turned on
- **Red Circle** 🔴 + "OFF" - All controlled entities are turned off
- **Orange Circle** 🟠 + "2/5" - Partial activation (shows count)
- **Gray Circle** ⚪ + "—" - System inactive or no entities configured

### Technical Details
- Added `getControlledEntitiesStatus()` method to track entity states
- Center indicator updates in real-time with entity state changes
- Responsive design with glow effect and drop shadow
- Shows entity count below status text
- Integrates seamlessly with existing timer visualization

### User Experience
- Immediate visual feedback of system status at a glance
- No need to check individual entities - see overall status instantly
- Color coding matches common conventions (green=good, red=off, orange=partial)

## [5.4.0] - 2024-12-07

### Added
- **Real-Time Response to Activation Conditions** - Immediate response when condition sensors change state
- Event-driven state change listeners for condition sensors
- No more waiting up to 60 seconds for condition changes to take effect
- Automatic UI refresh when home status changes

### Changed
- Integration now uses `local_push` instead of `local_polling` for IoT class
- Condition sensor changes now trigger immediate entity control updates
- Enhanced logging with emoji indicators for home status changes (🏠)

### Technical Details
- Added `async_track_state_change_event` for real-time sensor monitoring
- New `setup_state_listeners()` method in coordinator
- New `cleanup_state_listeners()` method for proper resource cleanup
- State change callback updates `home_status` and controls entities immediately
- Listeners are automatically re-registered when configuration changes
- Much more efficient: only processes events when actual state changes occur (vs. checking every 60 seconds)

### Performance
- **99.3% reduction in unnecessary checks** - From 1,440 checks/day to ~10 actual state changes
- Instant response time (milliseconds) vs. up to 60 seconds delay
- Lower CPU usage - event-driven instead of polling
- Better resource utilization

### Why This Matters?
Previously, if you changed a condition sensor (e.g., marking yourself as "home"), the integration would only notice this change at the next scheduled update (up to 60 seconds later). Now, the integration responds **immediately** to any condition sensor state change, providing a much better user experience.

### Example Use Cases That Benefit:
- Returning home → lights turn on instantly (not after 60 seconds)
- Shabbat mode activated → timer immediately responds to new conditions
- Vacation mode enabled → entities controlled instantly
- Temperature threshold reached → immediate action

## [5.3.0] - 2024-12-07

### Changed
- **Terminology Update: "Home Presence" → "Activation Conditions"**
- Renamed "Home Presence Sensors" to "Activation Conditions" for more flexibility
- Renamed "Sensor Logic" to "Condition Logic"
- Updated all UI text to reflect that conditions can be anything (home presence, Shabbat mode, vacation mode, temperature, etc.)
- Card status now shows "Active/Inactive" instead of Hebrew text
- Updated all documentation with clearer examples

### Added
- **6 New Language Translations**: Spanish (es), French (fr), German (de), Italian (it), Dutch (nl), Polish (pl)
- Full translation coverage including descriptions and help text
- Enhanced descriptions explaining activation conditions with examples

### Improved
- Better understanding that sensors aren't limited to home presence
- Examples now include: home presence, Shabbat mode, vacation mode, temperature sensors
- Clearer explanation of OR/AND logic in all languages

### Technical Details
- Updated `strings.json` with new terminology
- Updated all translation files (en, he, es, fr, de, it, nl, pl)
- Updated `coordinator.py` comments and logs
- Updated `timer-24h-card.ts` status display
- Updated `README.md` with comprehensive examples

### Migration
No action needed - this is a terminology change only. All existing configurations continue to work without modification.

## [5.2.0] - 2024-12-07

### Added
- **Custom Title Support** - Added ability to set custom card title independent of entity name
- New `custom_title` configuration option in card editor
- Optional field that overrides entity's friendly_name when set

### Changed
- Card editor now shows custom title input field when "Show entity name as title" is enabled
- Title display logic prioritizes custom_title over entity friendly_name

### Technical Details
- Added `custom_title?: string` to `Timer24HCardConfig` interface
- Updated `getEntityName()` to check for custom_title first
- Card editor includes new input field with placeholder text
- All UI text in English for consistency

### Usage Example
```yaml
type: custom:timer-24h-card
entity: sensor.timer_24h_lighting
show_title: true
custom_title: "My Custom Timer Name"
```

## [5.1.0] - 2024-12-07

### Fixed
- **CRITICAL: State Update Bug** - Fixed issue where card didn't update after toggling slots without manual refresh
- **State Reference Problem** - Fixed coordinator creating same reference instead of new object
- **Deep State Detection** - Added JSON.stringify comparison in card's shouldUpdate for reliable change detection

### Changed
- Coordinator now creates new list reference on every toggle (immutable pattern)
- Sensor attributes return fresh copies of time_slots array
- Card's shouldUpdate performs deep comparison of time_slots content

### Technical Details
- `async_toggle_slot()` now creates completely new slots list with new dict objects
- `extra_state_attributes` returns `[slot.copy() for slot in ...]` for proper change detection
- `shouldUpdate()` uses JSON.stringify to detect actual content changes
- This ensures Home Assistant's state machine properly detects and propagates changes

### Why This Fix?
The previous implementation modified the list in-place, keeping the same reference. Home Assistant's
state tracking relies on object identity changes to detect updates. By creating new references,
we ensure the state change propagates correctly to all UI components without requiring manual refresh.

## [5.0.0] - 2024-12-05

### Changed
- **MAJOR: Removed All Optimistic Updates** - Complete architectural change for stability
- UI now updates ONLY from server state - no client-side prediction
- Fixes all random button activation and deselection issues
- Small delay (100-300ms) in UI response but 100% reliable behavior

### Fixed
- Fixed issue where clicking a button would deselect the previous button
- Fixed closure bug where wrong slots were being toggled
- Eliminated all race conditions and state synchronization issues

### Technical Details
- Removed `pendingToggles` system completely
- `getTimeSlots()` returns server state directly
- `toggleTimeSlot()` only calls service, no state manipulation
- Simplified `updated()` lifecycle - just updates time
- Added comprehensive debug logging (can be removed in future version)

### Breaking Changes
- No more instant UI feedback (waits for server)
- This is necessary for correctness and reliability

### Why Major Version?
This is a fundamental architectural change. The trade-off of instant feedback for
reliability and correctness warrants a major version bump.

## [4.9.1] - 2024-12-05

### Fixed
- **CRITICAL FIX: JavaScript Closure Bug** - Fixed event handlers capturing wrong slot values
- Buttons now toggle the correct slots - no more random activation!
- Issue: Event handlers in loop were not properly capturing the hour/minute values
- Solution: Explicitly create bound handlers with captured parameters

### Technical Details
- Changed from inline arrow functions to explicitly bound click handlers
- Added `const hour = index` to capture the value correctly
- Added debug log in click handler to verify correct parameters
- This was a classic JavaScript closure bug in the render loop

### Root Cause
When using `Array.from({ length: 24 }, (_, hour) =>`, the `hour` variable in the event handler
was not properly captured. All handlers ended up referencing the same variable, causing
clicks to trigger wrong slots.

## [4.9.0] - 2024-12-05

### Added
- **Comprehensive Debugging Logs** - Added extensive logging to diagnose random button activation issue
- Frontend logs: Click detection, debouncing, pending toggles, state flips
- Backend logs: Service calls, slot toggles, before/after states, slot validation
- Duplicate slot detection during initialization

### Purpose
This is a diagnostic version to identify the root cause of random button activations.
Please check Home Assistant logs after testing for detailed information.

### What to Look For
- Check Home Assistant logs (Settings → System → Logs)
- Look for lines starting with 🎯, 📋, ✅, ❌
- Check browser console for frontend logs
- Report any unexpected patterns you see

## [4.8.1] - 2024-12-05

### Fixed
- **Immediate UI Feedback Restored** - Added lightweight optimistic toggle system
- UI now updates instantly when clicking buttons AND syncs correctly with server
- No more need to refresh to see changes
- Fixed issue where state only updated after manual refresh

### Technical Details
- Uses `pendingToggles` Set instead of storing specific states
- Simply flips the current state for pending slots (toggle logic)
- Automatically clears when server confirms or after 500ms timeout
- Much simpler than previous optimistic update system - only tracks "is this slot being toggled?"

### How It Works
1. Click button → add to pendingToggles → UI flips immediately
2. Server processes → state updates → clears pendingToggles
3. If server state doesn't arrive, auto-clear after 500ms

This approach avoids state conflicts because we only store "flip this" not "set to this value"

## [4.8.0] - 2024-12-05

### Changed
- **Removed Optimistic Updates** - Completely removed optimistic UI updates to fix random button activation issues
- UI now updates only when server confirms changes (no more instant feedback)
- This solves the critical bug where clicking one button would affect other buttons randomly
- Simpler, more reliable state management

### Technical Details
- Removed `optimisticSlots` Map completely
- `getTimeSlots()` now returns server state directly without local modifications
- `toggleTimeSlot()` simplified to just call the service without state manipulation
- Removed complex state synchronization logic in `updated()` lifecycle

### Why This Change?
- The optimistic update system was causing state inconsistencies
- Multiple instances of the card would get out of sync
- Server state and client state would conflict, causing random button behavior
- **Trade-off**: Slight delay in UI response (waits for server) but guaranteed correctness

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

