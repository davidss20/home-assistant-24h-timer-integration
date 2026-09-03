# Architecture

Timer 24H is a Home Assistant custom integration plus a Lovelace card. The Python side owns schedule state and entity control. The card is a UI over that state.

## Layout

```
custom_components/timer_24h/   Python integration (installed by HACS)
  __init__.py                  Setup, services, Lovelace resource, card copy
  config_flow.py               UI setup / options
  coordinator.py               Schedule, conditions, entity control, persistence
  sensor.py                    sensor.timer_24h_* entity
  dist/                        Built card JS shipped with the integration
src/                           TypeScript/Lit Lovelace card source
```

## Home Assistant integration

### Config Flow

`config_flow.py` creates a config entry from the UI: timer name, entities to control, optional activation-condition sensors, and OR/AND logic. Options can be changed later via **Configure**.

### Coordinator

`Timer24HCoordinator` is a `DataUpdateCoordinator`. It:

- Holds 48 half-hour slots (`hour`, `minute`, `isActive`)
- Evaluates activation conditions from configured sensors
- Calls `homeassistant.turn_on` / `turn_off` when the current slot and conditions say the controlled entities should change
- Refreshes about once a minute, and also on condition-sensor state changes
- Persists slots and enabled state in the config entry `options`

If no condition sensors are configured, conditions are treated as met.

### Sensor entity

Each config entry exposes one sensor (`sensor.py`):

| State | Meaning |
|-------|---------|
| `active` | Conditions met and the current slot is on |
| `idle` | Conditions met, current slot is off |
| `blocked` | Conditions not met |

Attributes include `time_slots`, `current_slot`, `home_status`, `controlled_entities`, `enabled`, and `last_update`.

### Services

Registered in `__init__.py` and implemented on the coordinator:

- `timer_24h.toggle_slot`
- `timer_24h.set_slots`
- `timer_24h.clear_all`
- `timer_24h.set_enabled`

### Persistence

Slot toggles and enabled state are written back with `async_update_entry` on the config entry options. They survive Home Assistant restarts without a separate database.

### Entity control

When the timer is enabled, conditions are met, and the current slot is active, the coordinator turns configured entities on. When the current slot is inactive, it turns them off. Commands are skipped if the entity is already in the desired state.

### Lovelace card loading

On setup, `__init__.py` copies `dist/timer-24h-card.js` (and the editor) to `www/timer-24h-card/`, serves `/local/timer-24h-card/timer-24h-card.js`, and registers a Lovelace module resource with `?v=<manifest version>` so browsers pick up updates.

## Frontend

`src/timer-24h-card.ts` is a Lit custom element (`timer-24h-card`). It reads the sensor from `hass.states` and renders the circular 24-hour UI. Clicks call `timer_24h.toggle_slot`; the optional enable switch calls `timer_24h.set_enabled`.

`src/timer-24h-card-editor.ts` is the visual card editor. `npm run build` (Rollup) writes both bundles to `custom_components/timer_24h/dist/`.

## Data flow

```
User taps a segment
  → card calls timer_24h.toggle_slot
  → coordinator updates slots and saves options
  → coordinator may turn entities on/off
  → sensor attributes update
  → card re-renders from hass state
```
