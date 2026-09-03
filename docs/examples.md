# Examples

YAML snippets for automations and templates. Install and configure the integration in the UI first; these examples assume an entity such as `sensor.timer_24h_lighting`.

## Simple lighting timer

Add via **Settings → Devices & Services → Add Integration → Timer 24H**:

- Name: `Lighting`
- Entities: `light.living_room`, `light.kitchen`

## Timer with activation conditions

- Name: `Smart Home System`
- Entities: lights, water heater, climate, as needed
- Activation conditions: `person.john`, `person.jane`, `binary_sensor.shabbat_mode`
- Logic: `OR`

Useful condition sources: `person.*`, `device_tracker.*`, Shabbat/vacation `input_boolean`s, or any sensor that reports `on`/`off`, `true`/`false`, or `home`/`away`.

## Notify when the timer becomes active

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

## Monitor activation conditions

```yaml
automation:
  - alias: "Alert when home status changes"
    trigger:
      - platform: template
        value_template: "{{ state_attr('sensor.timer_24h_lighting', 'home_status') }}"
    action:
      - service: notify.mobile_app
        data:
          title: "Timer Status Changed"
          message: >
            Timer activation conditions are now:
            {{ 'Active' if state_attr('sensor.timer_24h_lighting', 'home_status') else 'Blocked' }}
```

## Count active hours

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

## Current slot

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

## Specific slot

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

## Emergency override

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
```

## Disable from an automation

```yaml
service: timer_24h.set_enabled
data:
  entity_id: sensor.timer_24h_lighting
  enabled: false
```

## Set several slots at once

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
