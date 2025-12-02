# Installation Guide - Timer 24H Integration

## Prerequisites

- Home Assistant 2024.1.0 or newer
- HACS installed (recommended) or manual installation capability

## Installation via HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Click on "Integrations"
3. Click the "+" button in the bottom right corner
4. Search for "Timer 24H Integration"
5. Click "Install"
6. **Restart Home Assistant**

## Manual Installation

1. Download the latest release from [GitHub Releases](https://github.com/davidss20/home-assistant-24h-timer-integration/releases)
2. Extract the `custom_components/timer_24h` folder
3. Copy it to your Home Assistant `config/custom_components/` directory
4. **Restart Home Assistant**

## First-Time Setup

After installation and restart:

1. Go to **Settings → Devices & Services**
2. Click **"+ Add Integration"**
3. Search for **"Timer 24H"**
4. Enter the details:
   - **Timer Name**: e.g., "Lighting", "Water Heater"
   - **Entities to Control**: Select lights, switches, fans, etc.
   - **Home Presence Sensors** (optional): person, device_tracker, binary_sensor
   - **Sensor Logic**: OR (at least one) or AND (all must be active)
5. Click **"Submit"**

The integration will:
- Create a timer entity (e.g., `sensor.timer_24h_lighting`)
- Automatically install the card to `/config/www/timer-24h-card/`
- Register all necessary services

## Adding the Card to Your Dashboard

### Via UI (Recommended)

1. Enter edit mode in your dashboard
2. Click **"Add Card"**
3. Search for **"Timer 24H Card"**
4. Select your timer entity from the dropdown
5. Configure additional settings (optional)
6. Click **"Save"**

### Via YAML

```yaml
type: custom:timer-24h-card
entity: sensor.timer_24h_lighting
show_title: true
```

## Multiple Timers

You can create multiple timer instances:

1. Repeat the setup process for each timer
2. Give each a unique name (e.g., "Kitchen Lighting", "Bedroom Fan")
3. Add separate cards for each timer entity

## Updating the Integration

### Via HACS

1. Open HACS → Integrations
2. Find "Timer 24H Integration"
3. Click "Update" if available
4. Restart Home Assistant

### Manual Update

1. Download the new release
2. Replace the `custom_components/timer_24h` folder
3. Restart Home Assistant

## Verification

To verify the installation was successful:

1. Check **Settings → Devices & Services** for "Timer 24H"
2. Check `/config/www/timer-24h-card/` for card files
3. Look for timer entities in **Developer Tools → States**
4. Check logs for any errors: **Settings → System → Logs**

## Troubleshooting

### Integration Not Appearing

- Ensure the folder structure is correct: `config/custom_components/timer_24h/`
- Check Home Assistant logs for errors
- Verify Home Assistant version is 2024.1.0 or newer

### Card Not Found

- The card is installed automatically on integration load
- Try clearing your browser cache (Ctrl+F5)
- Check if files exist in `/config/www/timer-24h-card/`
- Restart Home Assistant

### Services Not Working

- Verify the entity ID is correct
- Check that the integration is loaded (Settings → Integrations)
- Look for errors in the logs

## Uninstallation

1. Remove all Timer 24H cards from your dashboards
2. Go to **Settings → Devices & Services**
3. Find **"Timer 24H"** entries
4. Click the three dots menu and select **"Delete"**
5. Remove the integration files from `custom_components/timer_24h/`
6. (Optional) Remove card files from `/config/www/timer-24h-card/`
7. Restart Home Assistant

## Support

If you encounter issues:

- Check the [full documentation](https://github.com/davidss20/home-assistant-24h-timer-integration)
- Search [existing issues](https://github.com/davidss20/home-assistant-24h-timer-integration/issues)
- Create a new issue with:
  - Home Assistant version
  - Integration version
  - Detailed error description
  - Relevant log entries
