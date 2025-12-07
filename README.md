# Timer 24H Integration

<div align="center">

![Timer 24H Icon](https://github.com/davidss20/home-assistant-24h-timer-integration/raw/main/icon.svg)

[![HACS](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/release/davidss20/home-assistant-24h-timer-integration.svg?style=for-the-badge&color=blue)](https://github.com/davidss20/home-assistant-24h-timer-integration/releases)
[![License](https://img.shields.io/github/license/davidss20/home-assistant-24h-timer-integration.svg?style=for-the-badge&color=green)](LICENSE)

</div>

A custom Home Assistant integration that enables daily timers with automatic entity control.

<div align="center">

![Timer 24H Preview](https://github.com/davidss20/home-assistant-24h-timer-integration/raw/main/images/preview.jpg)

*24-hour circular timer with automatic entity control and home presence detection*

</div>

## ✨ Key Features

- **🕐 24-Hour Circular Timer** with half-hour segments
- **🏠 Home Presence Detection** - entities will only activate when you're home
- **🔧 Automatic Entity Control** according to schedule
- **🎯 Multiple Instances** - create as many timers as you need
- **💾 Automatic State Persistence** - settings saved automatically
- **🌍 Multi-Language Support** with RTL support
- **⚙️ Easy Installation** - one installation includes everything
- **🔄 Automatic Updates** - card resources with built-in cache busting

## 📥 Installation

### Via HACS (Recommended)

Use this link to open the repository in HACS and click on Download

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=davidss20&repository=home-assistant-24h-timer-integration&category=integration)

1. Open HACS in Home Assistant
2. Click on "Integrations"
3. Click the "+" button in the bottom right corner
4. Search for "Timer 24H Integration"
5. Click "Install"
6. **Restart Home Assistant**
7. **Add the Lovelace Resource** (one-time setup):
   - Go to: `Settings → Dashboards → Resources`
   - Click: `+ Add Resource`
   - **URL**: `/local/timer-24h-card/timer-24h-card.js?v=4.7.0`
   - **Type**: `JavaScript Module`
   - Click: `Create`

**✨ That's it!** Future updates will work automatically thanks to cache busting!

### Manual Installation

1. Download the latest release from [GitHub Releases](https://github.com/davidss20/home-assistant-24h-timer-integration/releases)
2. Extract the `custom_components/timer_24h` folder into your `config/custom_components/` directory
3. **Restart Home Assistant**
4. **Add the Lovelace Resource** (one-time setup):
   - Go to: `Settings → Dashboards → Resources`
   - Click: `+ Add Resource`
   - **URL**: `/local/timer-24h-card/timer-24h-card.js?v=4.7.0`
   - **Type**: `JavaScript Module`
   - Click: `Create`

**✨ The integration automatically:**
- Copies card files to `www/timer-24h-card/`
- Updates with cache busting on each version change
- No more browser caching issues!

## 🚀 Usage

### Adding a New Timer

1. Go to **Settings → Devices & Services**
2. Click **"+ Add Integration"**
3. Search for **"Timer 24H"**
4. Enter the details:
   - **Timer Name** (e.g., "Lighting", "Water Heater")
   - **Select Entities to Control** (lights, switches, fans, etc.)
   - **Home Presence Sensors** (optional)
   - **Sensor Logic** (OR/AND)
5. Click **"Submit"**

Your timer is created! Now you can add the card to your dashboard.

### Adding the Card to Your Dashboard

The card is automatically installed with the integration.

#### Via UI

1. Enter edit mode in your dashboard
2. Click **"Add Card"**
3. Search for **"Timer 24H Card"**
4. Select the timer entity you created
5. Customize additional settings (optional)

#### Via YAML

```yaml
type: custom:timer-24h-card
entity: sensor.timer_24h_lighting  # The entity created by the integration
show_title: true  # Show the timer name at the top
```

## ⚙️ Configuration Options

### Integration Settings

| Name | Type | Required | Description |
|----|-----|------|-------|
| `name` | string | ✅ | Timer name |
| `entities` | list | ❌ | List of entities to control automatically |
| `home_sensors` | list | ❌ | Sensors for home presence detection |
| `home_logic` | string | ❌ | Sensor logic: OR or AND |

### Card Settings

| Name | Type | Default | Description |
|----|-----|------------|-------|
| `entity` | string | - | Timer entity (required) |
| `show_title` | boolean | `true` | Show title |

### Supported Entity Types for Control

- `light.*` - Lights
- `switch.*` - Switches
- `fan.*` - Fans
- `climate.*` - Climate control
- `media_player.*` - Media players
- `cover.*` - Covers and blinds
- `input_boolean.*` - Virtual switches

### Supported Sensor Types for Presence Detection

- `person.*` - People
- `device_tracker.*` - Device tracking
- `binary_sensor.*` - Binary sensors
- `sensor.*` - General sensors
- `input_boolean.*` - Virtual switches

## 🎯 How It Works

1. **🎨 Setting Times**: Click on segments in the circle or on the pointing triangle
   - **Outer circle**: Full hours (00:00, 01:00, etc.)
   - **Inner circle**: Half hours (00:30, 01:30, etc.)

2. **🏠 Presence Detection**: The integration checks configured sensors every minute
   - **OR**: At least one sensor must be active
   - **AND**: All sensors must be active

3. **🔧 Entity Control**: If you're home and the time is active, entities will turn on automatically

4. **💾 Persistence**: Settings are automatically saved in the integration

## 🎨 Card Appearance

- **🟢 Green**: Active segments
- **⚪ Gray**: Inactive segments
- **🔵 Blue**: Current segment (blue border)
- **🟢 Green**: System active status (at home)
- **🟡 Yellow**: System inactive status (away from home)

## 🔧 Services

The integration provides services to control the timer:

### `timer_24h.toggle_slot`

Toggle a specific time slot.

```yaml
service: timer_24h.toggle_slot
data:
  entity_id: sensor.timer_24h_lighting
  hour: 14
  minute: 30  # 0 or 30
```

### `timer_24h.set_slots`

Set multiple time slots at once.

```yaml
service: timer_24h.set_slots
data:
  entity_id: sensor.timer_24h_lighting
  slots:
    - hour: 14
      minute: 0
      isActive: true
    - hour: 14
      minute: 30
      isActive: true
    - hour: 15
      minute: 0
      isActive: false
```

### `timer_24h.clear_all`

Clear all time slots.

```yaml
service: timer_24h.clear_all
data:
  entity_id: sensor.timer_24h_lighting
```

## 📋 Examples

### Simple Lighting Timer

```yaml
# Add via UI:
# Settings → Integrations → Add Integration → Timer 24H
# Name: "Lighting"
# Entities: light.living_room, light.kitchen
```

### Advanced Timer with Presence Detection

```yaml
# Add via UI:
# Settings → Integrations → Add Integration → Timer 24H
# Name: "Smart Home System"
# Entities: light.all_lights, switch.water_heater, climate.living_room
# Home Sensors: person.john, person.jane, binary_sensor.motion_entrance
# Logic: OR
```

### Automation with Timer

```yaml
automation:
  - alias: "Notification when timer activates"
    trigger:
      - platform: state
        entity_id: sensor.timer_24h_lighting
        to: "active"
    action:
      - service: notify.mobile_app
        data:
          message: "Timer activated - lights turned on"
```

## 🔄 Updating Settings

You can change timer settings at any time:

1. Go to **Settings → Devices & Services**
2. Find **"Timer 24H"**
3. Click **"Configure"** (⚙️)
4. Edit the settings
5. Click **"Submit"**

## 🌍 Hebrew Support

The integration includes full Hebrew support:

- **📝 Hebrew Interface** - All texts in Hebrew
- **🔄 RTL Support** - Right-to-left text direction
- **⚙️ Hebrew Editor** - Configuration interface in Hebrew

## 🔧 Troubleshooting

### Card Not Appearing

**Did you add the Lovelace resource?** This is a **one-time setup** required:

1. Go to: `Settings → Dashboards → Resources`
2. Click: `+ Add Resource`
3. **URL**: `/local/timer-24h-card/timer-24h-card.js?v=4.7.0`
4. **Type**: `JavaScript Module`
5. Click: `Create`
6. Refresh browser: `Ctrl + Shift + R`

**To verify:**
- Go to: `Settings → Dashboards → Resources`
- You should see: `/local/timer-24h-card/timer-24h-card.js?v=4.7.0`

### Card Not Updating After Integration Update

**🎯 Cache Busting is Built-In!** Once you've added the resource, updates work automatically.

**How it works:**
- You add resource **once**: `/local/timer-24h-card/timer-24h-card.js?v=4.7.0`
- Integration updates → version changes to `v=4.7.1`, `v=4.7.2`, etc.
- Browser sees new URL → loads new file automatically!

**If you added the resource WITHOUT `?v=` parameter:**
1. Go to: `Settings → Dashboards → Resources`
2. **Delete** the old resource: `/local/timer-24h-card/timer-24h-card.js` (without `?v=`)
3. **Add** new resource: `/local/timer-24h-card/timer-24h-card.js?v=4.7.0` (with `?v=`)
4. Hard refresh browser: `Ctrl + Shift + R`

**After each integration update:**
- Just hard refresh: `Ctrl + Shift + R`
- Browser loads the new version automatically!

### Timer Not Activating

1. Check that there is a valid timer entity
2. Verify settings are correct in Configuration
3. Check logs: Settings → System → Logs

### Entities Not Activating

1. Verify entities exist and are available
2. Check that sensors return correct values
3. Ensure you're "at home" according to sensors
4. Check Home Assistant logs

## 🆘 Support

- **🐛 Bug Reports**: [GitHub Issues](https://github.com/davidss20/home-assistant-24h-timer-integration/issues)
- **💡 Feature Requests**: [GitHub Discussions](https://github.com/davidss20/home-assistant-24h-timer-integration/discussions)
- **📖 Additional Documentation**: [Wiki](https://github.com/davidss20/home-assistant-24h-timer-integration/wiki)

## 🤝 Contributing

Contributions are welcome! Please submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for the Home Assistant community** 🏠❤️
