# Timer 24H Integration

<div align="center">

![Timer 24H Icon](https://github.com/davidss20/home-assistant-24h-timer-integration/raw/main/icon.svg)

[![HACS](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/release/davidss20/home-assistant-24h-timer-integration.svg?style=for-the-badge&color=blue)](https://github.com/davidss20/home-assistant-24h-timer-integration/releases)
[![License](https://img.shields.io/github/license/davidss20/home-assistant-24h-timer-integration.svg?style=for-the-badge&color=green)](LICENSE)

</div>

A custom Home Assistant integration that enables daily timers with automatic entity control.

<div align="center">

<img src="https://raw.githubusercontent.com/davidss20/home-assistant-24h-timer-integration/main/images/preview-1.3.0.svg" alt="Timer 24H 15-minute and 30-minute preview" width="860">

<br>

*Left: 30-minute classic rings. Right: 15-minute quarters (blue outline = selected hour). Red = current time.*

<br>

<a href="https://htmlpreview.github.io/?https://github.com/davidss20/home-assistant-24h-timer-integration/blob/main/docs/preview/card-preview.html">
  <img src="https://img.shields.io/badge/Open_live_preview-click_here-3b82f6?style=for-the-badge" alt="Open live preview">
</a>

</div>

## ✨ Key Features

- **🕐 24-Hour Circular Timer** with 15-minute or classic 30-minute slots
- **🎯 Activation Conditions** - control when entities activate based on any sensor/state
- **🔧 Automatic Entity Control** according to schedule
- **❄️ Climate & Fan Controls** - temperature/mode (AC) and speed (fan) buttons appear on the card when those entities are selected
- **🎯 Multiple Instances** - create as many timers as you need
- **💾 Automatic State Persistence** - settings saved automatically
- **🌍 Multi-Language Support** with RTL support
- **⚙️ Easy Installation** - one installation includes everything
- **🔄 Automatic Updates** - card resources with built-in cache busting

## 📥 Installation

### Via HACS (Recommended)

<!-- Use this link to open the repository in HACS and click on Download

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=davidss20&repository=home-assistant-24h-timer-integration&category=integration) -->

1. Open HACS in Home Assistant
2. Click on "Integrations"
3. Click the "+" button in the bottom right corner
4. Search for "Timer 24H Integration"
5. Click "Install"
6. **Restart Home Assistant**
7. **Add the Integration** (Settings → Devices & Services → Add Integration → Timer 24H)

**✨ That's it!** The Lovelace resource is registered **automatically**!

> **Note:** In rare cases, if the automatic registration fails, you'll see a warning in the logs.
> If this happens, manually add the resource:
> - Go to: `Settings → Dashboards → Resources`
> - Click: `+ Add Resource`
> - **URL**: `/local/timer-24h-card/timer-24h-card.js` (version is added automatically)
> - **Type**: `JavaScript Module`
> - Click: `Create`

### Manual Installation

1. Download the latest release from [GitHub Releases](https://github.com/davidss20/home-assistant-24h-timer-integration/releases)
2. Extract the `custom_components/timer_24h` folder into your `config/custom_components/` directory
3. **Restart Home Assistant**
4. **Add the Integration** (Settings → Devices & Services → Add Integration → Timer 24H)

**✨ The Lovelace resource is registered automatically!**

> **Note:** If automatic registration fails (check logs), manually add:
> `Settings → Dashboards → Resources → Add Resource`
> - **URL**: `/local/timer-24h-card/timer-24h-card.js`
> - **Type**: `JavaScript Module`

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
   - **Slot interval** — `15` minutes (quarters) or `30` minutes (classic two rings)
   - **Activation Conditions** (optional) - Sensors that determine when timer activates entities
   - **Condition Logic** (OR/AND)
5. Click **"Submit"**

Your timer is created! Now you can add the card to your dashboard.

### Adding the Card to Your Dashboard

The card is automatically installed with the integration.

#### Via UI

1. Enter edit mode in your dashboard
2. Click **"Add Card"**
3. Search for **"Timer 24H Card"**
4. Select the timer entity you created
5. Optionally choose **15 minutes** or **30 minutes** (saved to the timer, not the card)

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
| `home_sensors` | list | ❌ | Activation condition sensors (e.g., home presence, Shabbat mode, vacation) |
| `home_logic` | string | ❌ | Condition logic: OR or AND |
| `slot_resolution` | string | ❌ | Slot interval: `15` or `30` minutes (also in the card editor) |

### Card Settings

| Name | Type | Default | Description |
|----|-----|------------|-------|
| `entity` | string | - | Timer entity (required) |
| `show_title` | boolean | `true` | Show title |

### Supported Entity Types for Control

- `light.*` - Lights
- `switch.*` - Switches
- `fan.*` - Fans (speed controls appear on the card)
- `climate.*` - Climate / AC (temperature & mode controls appear on the card)
- `media_player.*` - Media players
- `cover.*` - Covers and blinds
- `input_boolean.*` - Virtual switches

### Supported Sensor Types for Activation Conditions

- `person.*` - People
- `device_tracker.*` - Device tracking
- `binary_sensor.*` - Binary sensors
- `sensor.*` - General sensors
- `input_boolean.*` - Virtual switches

## 🎯 How It Works

1. **🎨 Setting Times**: Click on segments in the circle
   - **15-minute view**: tap an hour, then tap a quarter (`:00` / `:15` / `:30` / `:45`)
   - **30-minute view**: outer ring = full hours, inner ring = half hours
   - Switch between views from the card editor or timer Configure

2. **🎯 Activation Conditions**: The integration checks configured sensors every minute
   - **OR**: At least one condition must be met (active/on/true)
   - **AND**: All conditions must be met (active/on/true)
   - Leave empty to always activate entities

3. **🔧 Entity Control**: If activation conditions are met and the time is active, entities will turn on automatically
   - For **climate** entities: applies the selected HVAC mode and temperature from the card
   - For **fan** entities: applies the selected speed percentage from the card

4. **❄️ Climate / Fan Buttons**: When a climate or fan entity is in the controlled list, extra buttons appear under the timer to set temperature/mode or fan speed. These settings are used whenever the timer turns that entity on.

5. **💾 Persistence**: Settings are automatically saved in the integration

## 🎨 Card Appearance

- **🟢 Green**: Active segments
- **⚪ White / gray**: Inactive segments
- **🔵 Blue outline**: Selected hour in 15-minute view
- **🔴 Red outline**: Current time slot
- **🟢 Green status**: Conditions met — click to edit conditions
- **🟡 Yellow status**: Conditions not met — click to edit conditions

## 🔧 Services

The integration provides services to control the timer:

### `timer_24h.toggle_slot`

Toggle a specific time slot.

```yaml
service: timer_24h.toggle_slot
data:
  entity_id: sensor.timer_24h_lighting
  hour: 14
  minute: 30  # 0, 15, 30, or 45
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

### `timer_24h.set_activation_conditions`

Update activation condition sensors and logic. Changes are saved to the **integration options** (not Lovelace card YAML), so the timer keeps working in the background.

You can also edit these from the card by clicking the **Active / Inactive** status badge.

```yaml
service: timer_24h.set_activation_conditions
data:
  entity_id: sensor.timer_24h_lighting
  home_sensors:
    - person.john
    - binary_sensor.shabbat_mode
  home_logic: OR  # or AND
```

## 📋 Examples

### Simple Lighting Timer

```yaml
# Add via UI:
# Settings → Integrations → Add Integration → Timer 24H
# Name: "Lighting"
# Entities: light.living_room, light.kitchen
```

### Advanced Timer with Activation Conditions

```yaml
# Add via UI:
# Settings → Integrations → Add Integration → Timer 24H
# Name: "Smart Home System"
# Entities: light.all_lights, switch.water_heater, climate.living_room
# Activation Conditions: person.john, person.jane, binary_sensor.shabbat_mode
# Condition Logic: OR
#
# Examples of conditions:
# - Home presence: person.*, device_tracker.*
# - Shabbat mode: binary_sensor.shabbat_mode, input_boolean.jewish_calendar
# - Vacation mode: input_boolean.vacation_mode
# - Temperature: binary_sensor.cold_weather
# - Any sensor/input_boolean that returns on/off, true/false, home/away
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

## 🎯 Using Timer Attributes in Automations

The timer sensor exposes several attributes that you can use in automations and templates:

### Available Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `time_slots` | list | All 96 time slots (15-minute segments) |
| `current_slot` | dict | Current time slot with hour, minute, and isActive |
| `home_status` | boolean | Whether activation conditions are met |
| `home_sensors` | list | Activation condition entity IDs |
| `home_logic` | string | Condition logic (`OR` / `AND`) |
| `controlled_entities` | list | List of entities controlled by the timer |
| `enabled` | boolean | Whether the timer is enabled |
| `slot_resolution` | int | View interval: `15` or `30` minutes |
| `last_update` | string | Last update timestamp |

### Automation Examples

#### Monitor When Activation Conditions Change

```yaml
automation:
  - alias: "Alert when home status changes"
    trigger:
      - platform: template
        value_template: "{{ state_attr('sensor.timer_24h_lighting', 'home_status') }}"
    action:
      - service: notify.mobile_app
        data:
          title: "🏠 Timer Status Changed"
          message: >
            Timer activation conditions are now: 
            {{ 'Active ✅' if state_attr('sensor.timer_24h_lighting', 'home_status') else 'Blocked 🚫' }}
```

#### Alert When Timer State Changes

```yaml
automation:
  - alias: "Timer state notifications"
    trigger:
      - platform: state
        entity_id: sensor.timer_24h_lighting
    action:
      - service: notify.mobile_app
        data:
          title: "⏰ Timer Update"
          message: >
            Timer is now: {{ states('sensor.timer_24h_lighting') }}
            {% if is_state('sensor.timer_24h_lighting', 'active') %}
              🟢 Entities are being activated
            {% elif is_state('sensor.timer_24h_lighting', 'blocked') %}
              🔴 Activation conditions not met
            {% else %}
              ⚪ Waiting for active time slot
            {% endif %}
```

#### Count Active Time Slots

```yaml
template:
  - sensor:
      - name: "Timer Active Hours Count"
        unique_id: timer_lighting_active_count
        state: >
          {% set slots = state_attr('sensor.timer_24h_lighting', 'time_slots') %}
          {{ (slots | selectattr('isActive', 'equalto', true) | list | count) / 2 }}
        unit_of_measurement: "hours"
        icon: mdi:clock-check
```

#### Display Current Time Slot

```yaml
template:
  - sensor:
      - name: "Timer Current Slot"
        unique_id: timer_lighting_current_slot
        state: >
          {% set slot = state_attr('sensor.timer_24h_lighting', 'current_slot') %}
          {% if slot %}
            {{ '%02d:%02d' | format(slot.hour, slot.minute) }}
          {% else %}
            Unknown
          {% endif %}
        icon: mdi:clock-outline
```

#### Check If Specific Time Slot Is Active

```yaml
template:
  - binary_sensor:
      - name: "Timer 14:30 Slot Active"
        unique_id: timer_lighting_1430_active
        state: >
          {% set slots = state_attr('sensor.timer_24h_lighting', 'time_slots') %}
          {% set slot = slots | selectattr('hour', 'equalto', 14) | selectattr('minute', 'equalto', 30) | list | first %}
          {{ slot.isActive if slot else false }}
        icon: mdi:clock-check-outline
```

#### Override Timer Control

```yaml
automation:
  - alias: "Emergency override - turn off all timer entities"
    trigger:
      - platform: state
        entity_id: input_boolean.emergency_mode
        to: "on"
    action:
      - service: homeassistant.turn_off
        target:
          entity_id: "{{ state_attr('sensor.timer_24h_lighting', 'controlled_entities') }}"
      - service: notify.mobile_app
        data:
          message: "🚨 Emergency mode - all timer entities turned off"
```

#### Daily Report

```yaml
automation:
  - alias: "Daily timer report"
    trigger:
      - platform: time
        at: "08:00:00"
    action:
      - service: notify.mobile_app
        data:
          title: "📊 Daily Timer Report"
          message: >
            Timer: {{ state_attr('sensor.timer_24h_lighting', 'friendly_name') }}
            
            Status: {{ states('sensor.timer_24h_lighting') }}
            
            Active slots: {{ (state_attr('sensor.timer_24h_lighting', 'time_slots') | selectattr('isActive', 'equalto', true) | list | count) / 2 }} hours
            
            Controlled entities: {{ state_attr('sensor.timer_24h_lighting', 'controlled_entities') | length }}
            
            Conditions met: {{ '✅ Yes' if state_attr('sensor.timer_24h_lighting', 'home_status') else '❌ No' }}
```

## 🔄 Updating Settings

You can change timer settings at any time:

1. Go to **Settings → Devices & Services**
2. Find **"Timer 24H"**
3. Click **"Configure"** (⚙️)
4. Edit the settings
5. Click **"Submit"**

**Activation conditions** can also be edited from the Lovelace **card editor**. Changes are saved to the integration (not card YAML).

## 🌍 Hebrew Support

The integration includes full Hebrew support:

- **📝 Hebrew Interface** - All texts in Hebrew
- **🔄 RTL Support** - Right-to-left text direction
- **⚙️ Hebrew Editor** - Configuration interface in Hebrew

### 15 / 30 minutes

- **15 דקות**: לחיצה על שעה בוחרת אותה (מסגרת כחולה), לחיצה על רבע מדליקה/מכבה אותו. לחיצה על הטבעת החיצונית מדליקה את כל השעה.
- **30 דקות**: שתי טבעות קלאסיות — שעה בחוץ, חצי שעה בפנים.
- מחליפים בתפריט עריכת הכרטיס או ב-Configure של הטיימר.

## 🔧 Troubleshooting

### Card Not Appearing

**The resource should register automatically!** Check your Home Assistant logs first.

**Automatic Registration Status:**
1. Check logs: `Settings → System → Logs`
2. Look for: `✅ Timer 24H Card resource registered successfully`
3. If you see: `⚠️ Timer 24H Card resource could not be registered automatically`

**Manual Registration (if automatic fails):**
1. Go to: `Settings → Dashboards → Resources`
2. Click: `+ Add Resource`
3. **URL**: `/local/timer-24h-card/timer-24h-card.js`
4. **Type**: `JavaScript Module`
5. Click: `Create`
6. Refresh browser: `Ctrl + Shift + R`

**To verify:**
- Go to: `Settings → Dashboards → Resources`
- You should see: `/local/timer-24h-card/timer-24h-card.js` (with version parameter)

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
3. Ensure activation conditions are met according to configured sensors
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
