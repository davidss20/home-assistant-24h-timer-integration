"""DataUpdateCoordinator for Timer 24H integration."""
from __future__ import annotations

from datetime import datetime, timedelta
import logging
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback, Event
from homeassistant.helpers.event import async_track_state_change_event
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .const import (
    CONF_ENTITIES,
    CONF_ENTITY_SETTINGS,
    CONF_HOME_LOGIC,
    CONF_HOME_SENSORS,
    DEFAULT_CLIMATE_HVAC_MODE,
    DEFAULT_CLIMATE_TEMPERATURE,
    DEFAULT_FAN_PERCENTAGE,
    DEFAULT_HOME_LOGIC,
    DOMAIN,
    SLOT_MINUTES,
    SLOT_RESOLUTION_15,
    SLOT_RESOLUTION_30,
    CONF_SLOT_RESOLUTION,
    UPDATE_INTERVAL,
)

_LOGGER = logging.getLogger(__name__)


class Timer24HCoordinator(DataUpdateCoordinator):
    """Class to manage fetching Timer 24H data."""

    def __init__(self, hass: HomeAssistant, config_entry: ConfigEntry) -> None:
        """Initialize."""
        self.config_entry = config_entry
        self.hass = hass
        self._time_slots: list[dict[str, Any]]
        self._home_status: bool = True
        self._enabled: bool = True
        self._slot_resolution: int = SLOT_RESOLUTION_15
        self._needs_persist: bool = False
        self._last_controlled_states: dict[str, Any] = {}
        self._state_change_unsubscribe = None

        saved_slots = config_entry.options.get("time_slots")
        self._time_slots, was_legacy = self._normalize_time_slots(saved_slots)

        saved_resolution = config_entry.options.get(CONF_SLOT_RESOLUTION)
        if saved_resolution in ("15", "30", 15, 30):
            self._slot_resolution = int(saved_resolution)
        elif was_legacy:
            self._slot_resolution = SLOT_RESOLUTION_30
        else:
            self._slot_resolution = SLOT_RESOLUTION_15

        self._needs_persist = bool(
            was_legacy
            or saved_slots is None
            or len(saved_slots) != 96
            or CONF_SLOT_RESOLUTION not in config_entry.options
        )

        if "enabled" in config_entry.options:
            self._enabled = config_entry.options["enabled"]

        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            update_interval=timedelta(seconds=UPDATE_INTERVAL),
        )

    def get_entity_settings(self, entity_id: str | None = None) -> dict[str, Any]:
        """Return entity settings for all entities or a specific one."""
        all_settings = self.config_entry.options.get(CONF_ENTITY_SETTINGS, {})
        if entity_id is None:
            return dict(all_settings)
        return dict(all_settings.get(entity_id, {}))

    def _is_entity_on(self, entity_id: str, entity: Any) -> bool:
        """Return True if the entity is considered on."""
        domain = entity_id.split(".", 1)[0]
        state = (entity.state or "").lower()

        if state in ("unavailable", "unknown"):
            return False

        if domain == "climate":
            return state not in ("off",)

        return state == "on"

    def _build_desired_control(
        self, entity_id: str, should_be_on: bool
    ) -> dict[str, Any]:
        """Build a comparable desired control payload for an entity."""
        settings = self.get_entity_settings(entity_id)
        domain = entity_id.split(".", 1)[0]
        desired: dict[str, Any] = {"on": should_be_on}

        if not should_be_on:
            return desired

        if domain == "climate":
            desired["hvac_mode"] = settings.get(
                "hvac_mode", DEFAULT_CLIMATE_HVAC_MODE
            )
            desired["temperature"] = settings.get(
                "temperature", DEFAULT_CLIMATE_TEMPERATURE
            )
        elif domain == "fan":
            desired["percentage"] = settings.get(
                "percentage", DEFAULT_FAN_PERCENTAGE
            )

        return desired

    async def _async_turn_on_entity(self, entity_id: str, desired: dict[str, Any]) -> None:
        """Turn on an entity with domain-specific settings."""
        domain = entity_id.split(".", 1)[0]

        if domain == "climate":
            hvac_mode = desired.get("hvac_mode", DEFAULT_CLIMATE_HVAC_MODE)
            temperature = desired.get("temperature", DEFAULT_CLIMATE_TEMPERATURE)

            if hvac_mode:
                await self.hass.services.async_call(
                    "climate",
                    "set_hvac_mode",
                    {"entity_id": entity_id, "hvac_mode": hvac_mode},
                    blocking=False,
                )

            if temperature is not None and hvac_mode not in (None, "off", "fan_only"):
                await self.hass.services.async_call(
                    "climate",
                    "set_temperature",
                    {"entity_id": entity_id, "temperature": temperature},
                    blocking=False,
                )
            return

        if domain == "fan":
            percentage = desired.get("percentage", DEFAULT_FAN_PERCENTAGE)
            if percentage is not None:
                try:
                    await self.hass.services.async_call(
                        "fan",
                        "set_percentage",
                        {"entity_id": entity_id, "percentage": int(percentage)},
                        blocking=False,
                    )
                    return
                except Exception as err:
                    _LOGGER.warning(
                        "fan.set_percentage failed for %s (%s), falling back to turn_on",
                        entity_id,
                        err,
                    )

            await self.hass.services.async_call(
                "homeassistant",
                "turn_on",
                {"entity_id": entity_id},
                blocking=False,
            )
            return

        await self.hass.services.async_call(
            "homeassistant",
            "turn_on",
            {"entity_id": entity_id},
            blocking=False,
        )

    async def _async_turn_off_entity(self, entity_id: str) -> None:
        """Turn off an entity with domain-aware service calls."""
        domain = entity_id.split(".", 1)[0]

        if domain == "climate":
            await self.hass.services.async_call(
                "climate",
                "set_hvac_mode",
                {"entity_id": entity_id, "hvac_mode": "off"},
                blocking=False,
            )
            return

        await self.hass.services.async_call(
            "homeassistant",
            "turn_off",
            {"entity_id": entity_id},
            blocking=False,
        )

    def _empty_slots(self) -> list[dict[str, Any]]:
        """Create 96 quarter-hour slots."""
        return [
            {"hour": hour, "minute": minute, "isActive": False}
            for hour in range(24)
            for minute in SLOT_MINUTES
        ]

    def _normalize_time_slots(
        self, saved: list[dict[str, Any]] | None
    ) -> tuple[list[dict[str, Any]], bool]:
        """Expand stored slots to 96 quarters. Copy :00→:15 and :30→:45 for legacy 30-min data."""
        if not saved:
            slots = self._empty_slots()
            _LOGGER.info("Initialized %d unique time slots", len(slots))
            return slots, False

        lookup: dict[tuple[int, int], bool] = {}
        minutes_seen: set[int] = set()
        for slot in saved:
            hour = slot.get("hour")
            minute = slot.get("minute")
            if hour is None or minute is None:
                continue
            hour_i = int(hour)
            minute_i = int(minute)
            lookup[(hour_i, minute_i)] = bool(slot.get("isActive", False))
            minutes_seen.add(minute_i)

        was_legacy = (
            15 not in minutes_seen
            and 45 not in minutes_seen
            and (0 in minutes_seen or 30 in minutes_seen)
        )

        slots: list[dict[str, Any]] = []
        for hour in range(24):
            for minute in SLOT_MINUTES:
                if (hour, minute) in lookup:
                    active = lookup[(hour, minute)]
                elif was_legacy and minute == 15:
                    active = lookup.get((hour, 0), False)
                elif was_legacy and minute == 45:
                    active = lookup.get((hour, 30), False)
                else:
                    active = False
                slots.append({"hour": hour, "minute": minute, "isActive": active})

        _LOGGER.info(
            "Normalized %d time slots (legacy 30-min migrate: %s)",
            len(slots),
            was_legacy,
        )
        return slots, was_legacy

    async def async_persist_migration_if_needed(self) -> None:
        """Write migrated 15-minute slots and resolution back to the config entry."""
        if not self._needs_persist:
            return
        time_slots_copy = [dict(slot) for slot in self._time_slots]
        new_options = {
            **self.config_entry.options,
            "time_slots": time_slots_copy,
            CONF_SLOT_RESOLUTION: str(self._slot_resolution),
        }
        self.hass.config_entries.async_update_entry(
            self.config_entry, options=new_options
        )
        self._needs_persist = False
        _LOGGER.info(
            "Persisted migrated slots (resolution=%s min)", self._slot_resolution
        )

    @property
    def time_slots(self) -> list[dict[str, Any]]:
        """Return the time slots."""
        return self._time_slots

    @property
    def home_status(self) -> bool:
        """Return home status."""
        return self._home_status
    
    @property
    def enabled(self) -> bool:
        """Return enabled status."""
        return self._enabled

    @property
    def slot_resolution(self) -> int:
        """Return slot resolution in minutes (15 or 30)."""
        return self._slot_resolution

    def get_current_slot(self) -> dict[str, Any] | None:
        """Get the current time slot."""
        now = datetime.now()
        hour = now.hour
        minute = (now.minute // 15) * 15
        
        for slot in self._time_slots:
            if slot["hour"] == hour and slot["minute"] == minute:
                return slot
        return None

    async def _async_update_data(self) -> dict[str, Any]:
        """Fetch data from API endpoint."""
        try:
            # Check home status
            self._check_home_status()
            
            # Control entities based on current time and home status
            await self._control_entities()
            
            return {
                "time_slots": self._time_slots,
                "home_status": self._home_status,
                "enabled": self._enabled,
            }
        except Exception as err:
            raise UpdateFailed(f"Error communicating with API: {err}")

    def _check_home_status(self) -> None:
        """Check activation conditions based on configured sensors."""
        condition_sensors = self.config_entry.options.get(CONF_HOME_SENSORS, [])
        
        if not condition_sensors:
            self._home_status = True
            return

        logic = self.config_entry.options.get(CONF_HOME_LOGIC, DEFAULT_HOME_LOGIC)
        system_status = logic == "AND"

        for sensor_id in condition_sensors:
            sensor = self.hass.states.get(sensor_id)
            if not sensor:
                continue

            # Check if sensor/condition is active/true
            is_true = sensor.state.lower() in ["on", "home", "true", "1", "yes"]

            if logic == "OR":
                if is_true:
                    system_status = True
                    break
            else:  # AND
                if not is_true:
                    system_status = False
                    break

        self._home_status = system_status

    def _entity_matches_desired(
        self, entity_id: str, entity: Any, desired: dict[str, Any]
    ) -> bool:
        """Return True if the entity already matches the desired control state."""
        is_on = self._is_entity_on(entity_id, entity)
        should_be_on = bool(desired.get("on"))

        if is_on != should_be_on:
            return False

        if not should_be_on:
            return True

        domain = entity_id.split(".", 1)[0]
        if domain == "climate":
            desired_mode = desired.get("hvac_mode")
            if desired_mode and entity.state != desired_mode:
                return False
            desired_temp = desired.get("temperature")
            current_temp = entity.attributes.get("temperature")
            if desired_temp is not None and current_temp is not None:
                try:
                    if abs(float(current_temp) - float(desired_temp)) > 0.4:
                        return False
                except (TypeError, ValueError):
                    return False
            return True

        if domain == "fan":
            desired_pct = desired.get("percentage")
            current_pct = entity.attributes.get("percentage")
            if desired_pct is not None and current_pct is not None:
                try:
                    if abs(int(current_pct) - int(desired_pct)) > 1:
                        return False
                except (TypeError, ValueError):
                    return False
            return True

        return True

    async def _control_entities(self) -> None:
        """Control entities based on time slots and activation conditions."""
        if not self._enabled:
            _LOGGER.debug("Timer is disabled, skipping entity control")
            return
        
        if not self._home_status:
            _LOGGER.debug("Activation conditions not met, skipping entity control")
            return

        entities = self.config_entry.options.get(CONF_ENTITIES, [])
        if not entities:
            return

        current_slot = self.get_current_slot()
        should_be_on = current_slot.get("isActive", False) if current_slot else False

        for entity_id in entities:
            entity = self.hass.states.get(entity_id)
            if not entity:
                continue

            desired = self._build_desired_control(entity_id, should_be_on)
            last_controlled_state = self._last_controlled_states.get(entity_id)

            if last_controlled_state == desired:
                continue

            if self._entity_matches_desired(entity_id, entity, desired):
                self._last_controlled_states[entity_id] = desired
                continue

            try:
                if should_be_on:
                    await self._async_turn_on_entity(entity_id, desired)
                else:
                    await self._async_turn_off_entity(entity_id)

                _LOGGER.info(
                    "%s %s based on timer schedule (desired=%s)",
                    "Turned on" if should_be_on else "Turned off",
                    entity_id,
                    desired,
                )

                self._last_controlled_states[entity_id] = desired

                @callback
                def _clear_memory(eid=entity_id, payload=desired):
                    if self._last_controlled_states.get(eid) == payload:
                        self._last_controlled_states.pop(eid, None)

                self.hass.loop.call_later(30, _clear_memory)

            except Exception as err:
                _LOGGER.error("Failed to control %s: %s", entity_id, err)

    async def async_set_entity_settings(
        self,
        target_entity_id: str,
        temperature: float | None = None,
        hvac_mode: str | None = None,
        percentage: int | None = None,
    ) -> None:
        """Update per-entity climate/fan settings used when the timer turns entities on."""
        entities = self.config_entry.options.get(CONF_ENTITIES, [])
        if target_entity_id not in entities:
            _LOGGER.warning(
                "Cannot set settings for %s - not in controlled entities",
                target_entity_id,
            )
            return

        all_settings = dict(
            self.config_entry.options.get(CONF_ENTITY_SETTINGS, {})
        )
        entity_settings = dict(all_settings.get(target_entity_id, {}))

        domain = target_entity_id.split(".", 1)[0]
        if domain == "climate":
            if temperature is not None:
                entity_settings["temperature"] = float(temperature)
            if hvac_mode is not None:
                entity_settings["hvac_mode"] = hvac_mode
        elif domain == "fan":
            if percentage is not None:
                entity_settings["percentage"] = int(percentage)
        else:
            _LOGGER.warning(
                "Entity settings are only supported for climate/fan, got %s",
                domain,
            )
            return

        all_settings[target_entity_id] = entity_settings
        new_options = {
            **self.config_entry.options,
            CONF_ENTITY_SETTINGS: all_settings,
        }
        self.hass.config_entries.async_update_entry(
            self.config_entry, options=new_options
        )

        self._last_controlled_states.pop(target_entity_id, None)
        await self._control_entities()

        self.async_set_updated_data(
            {
                "time_slots": self._time_slots,
                "home_status": self._home_status,
                "enabled": self._enabled,
                "entity_settings": all_settings,
            }
        )
        _LOGGER.info(
            "✅ Updated entity settings for %s: %s",
            target_entity_id,
            entity_settings,
        )

    async def async_set_activation_conditions(
        self,
        home_sensors: list[str] | None = None,
        home_logic: str | None = None,
    ) -> None:
        """Update activation conditions persisted in config entry options.

        Source of truth remains the integration options (not Lovelace card YAML),
        so entity control continues to work when the card is closed.
        """
        allowed_domains = {
            "person",
            "device_tracker",
            "binary_sensor",
            "sensor",
            "input_boolean",
        }

        if home_sensors is None:
            validated = list(self.config_entry.options.get(CONF_HOME_SENSORS, []))
        else:
            validated = []
            for entity_id in home_sensors:
                if not isinstance(entity_id, str) or "." not in entity_id:
                    _LOGGER.warning("Skipping invalid condition entity_id: %s", entity_id)
                    continue
                domain = entity_id.split(".", 1)[0]
                if domain not in allowed_domains:
                    _LOGGER.warning(
                        "Skipping unsupported condition entity domain: %s", entity_id
                    )
                    continue
                if entity_id not in validated:
                    validated.append(entity_id)

        if home_logic is None:
            logic = self.config_entry.options.get(CONF_HOME_LOGIC, DEFAULT_HOME_LOGIC)
        else:
            logic = home_logic.upper() if isinstance(home_logic, str) else DEFAULT_HOME_LOGIC
            if logic not in ("OR", "AND"):
                _LOGGER.warning("Invalid home_logic %s, using %s", home_logic, DEFAULT_HOME_LOGIC)
                logic = DEFAULT_HOME_LOGIC

        new_options = {
            **self.config_entry.options,
            CONF_HOME_SENSORS: validated,
            CONF_HOME_LOGIC: logic,
        }
        self.hass.config_entries.async_update_entry(
            self.config_entry, options=new_options
        )

        # Refresh listeners immediately; entry reload will also reconfigure them
        self.cleanup_state_listeners()
        self.setup_state_listeners()

        self._check_home_status()
        self._last_controlled_states.clear()
        await self._control_entities()

        self.async_set_updated_data(
            {
                "time_slots": self._time_slots,
                "home_status": self._home_status,
                "enabled": self._enabled,
                CONF_HOME_SENSORS: validated,
                CONF_HOME_LOGIC: logic,
            }
        )
        _LOGGER.info(
            "✅ Updated activation conditions: sensors=%s logic=%s home_status=%s",
            validated,
            logic,
            self._home_status,
        )

    async def async_set_slot_resolution(self, resolution: int) -> None:
        """Switch 15/30-minute view. Same 96-slot store; pairing only changes."""
        if resolution not in (SLOT_RESOLUTION_15, SLOT_RESOLUTION_30):
            _LOGGER.warning("Invalid slot_resolution %s", resolution)
            return

        self._slot_resolution = resolution
        new_options = {
            **self.config_entry.options,
            CONF_SLOT_RESOLUTION: str(resolution),
        }
        self.hass.config_entries.async_update_entry(
            self.config_entry, options=new_options
        )
        self.async_set_updated_data(
            {
                "time_slots": self._time_slots,
                "home_status": self._home_status,
                "enabled": self._enabled,
                CONF_SLOT_RESOLUTION: resolution,
            }
        )
        _LOGGER.info("✅ Slot resolution updated to %s minutes", resolution)

    def _minutes_for_toggle(self, minute: int) -> list[int]:
        """Minutes affected by a toggle, honoring 30-minute grouping."""
        if minute not in SLOT_MINUTES:
            return [minute]
        if self._slot_resolution == SLOT_RESOLUTION_30:
            if minute in (0, 15):
                return [0, 15]
            return [30, 45]
        return [minute]

    async def async_toggle_slot(self, hour: int, minute: int) -> None:
        """Toggle a time slot."""
        _LOGGER.info("🎯 Toggle slot called: hour=%s, minute=%s", hour, minute)
        
        # Log BEFORE state
        active_before = [f"{s['hour']}:{s['minute']:02d}" for s in self._time_slots if s["isActive"]]
        _LOGGER.info("📋 Active slots BEFORE toggle: %s", ", ".join(active_before) if active_before else "None")
        
        slot_found = False
        minutes = self._minutes_for_toggle(minute)
        matching = [
            slot
            for slot in self._time_slots
            if slot["hour"] == hour and slot["minute"] in minutes
        ]
        all_on = bool(matching) and all(slot["isActive"] for slot in matching)
        new_state = not all_on

        new_slots = []
        for slot in self._time_slots:
            if slot["hour"] == hour and slot["minute"] in minutes:
                old_state = slot["isActive"]
                new_slot = {**slot, "isActive": new_state}
                new_slots.append(new_slot)
                _LOGGER.info(
                    "Toggled slot %s:%02d: %s → %s",
                    hour,
                    slot["minute"],
                    old_state,
                    new_state,
                )
                slot_found = True
            else:
                new_slots.append({**slot})
        
        if not slot_found:
            _LOGGER.error("❌ Slot %s:%02d NOT FOUND in time_slots!", hour, minute)
        
        # Replace the entire list - this creates a NEW reference
        self._time_slots = new_slots
        
        # Log AFTER state
        active_after = [f"{s['hour']}:{s['minute']:02d}" for s in self._time_slots if s["isActive"]]
        _LOGGER.info("📋 Active slots AFTER toggle: %s", ", ".join(active_after) if active_after else "None")

        # Save to config entry options
        await self._save_time_slots()
        
        # Clear control memory when manually changing settings
        self._last_controlled_states.clear()
        
        # Immediately check and control entities
        await self._control_entities()
        
        # Update the entity - NOW with a NEW list reference
        self.async_set_updated_data(
            {
                "time_slots": self._time_slots,
                "home_status": self._home_status,
                "enabled": self._enabled,
            }
        )
        
        _LOGGER.info("✅ Toggle slot completed for %s:%02d", hour, minute)

    async def async_set_slots(self, slots: list[dict[str, Any]]) -> None:
        """Set multiple time slots."""
        for new_slot in slots:
            hour = new_slot.get("hour")
            minute = new_slot.get("minute")
            is_active = new_slot.get("isActive", False)
            
            for slot in self._time_slots:
                if slot["hour"] == hour and slot["minute"] == minute:
                    slot["isActive"] = is_active
                    break

        await self._save_time_slots()
        self._last_controlled_states.clear()
        await self._control_entities()
        
        self.async_set_updated_data(
            {
                "time_slots": self._time_slots,
                "home_status": self._home_status,
                "enabled": self._enabled,
            }
        )

    async def async_clear_all(self) -> None:
        """Clear all time slots."""
        for slot in self._time_slots:
            slot["isActive"] = False

        await self._save_time_slots()
        self._last_controlled_states.clear()
        await self._control_entities()
        
        self.async_set_updated_data(
            {
                "time_slots": self._time_slots,
                "home_status": self._home_status,
                "enabled": self._enabled,
            }
        )

    async def _save_time_slots(self) -> None:
        """Save time slots to config entry options."""
        new_options = {**self.config_entry.options, "time_slots": self._time_slots}
        self.hass.config_entries.async_update_entry(
            self.config_entry, options=new_options
        )
    
    async def async_set_enabled(self, enabled: bool) -> None:
        """Set timer enabled state."""
        _LOGGER.info("Setting timer enabled state: %s → %s", self._enabled, enabled)
        self._enabled = enabled
        
        # Save to config entry options
        new_options = {**self.config_entry.options, "enabled": enabled}
        self.hass.config_entries.async_update_entry(
            self.config_entry, options=new_options
        )
        
        # Clear control memory when changing enabled state
        self._last_controlled_states.clear()
        
        # Control entities based on new state
        await self._control_entities()
        
        # Update the entity
        self.async_set_updated_data(
            {
                "time_slots": self._time_slots,
                "home_status": self._home_status,
                "enabled": self._enabled,
            }
        )
        
        _LOGGER.info("✅ Timer enabled state updated to: %s", enabled)

    def setup_state_listeners(self) -> None:
        """Setup state change listeners for home sensors."""
        condition_sensors = self.config_entry.options.get(CONF_HOME_SENSORS, [])
        
        if not condition_sensors:
            _LOGGER.debug("No condition sensors configured, skipping state listeners")
            return
        
        @callback
        def sensor_state_changed(event: Event) -> None:
            """Handle sensor state change."""
            entity_id = event.data.get("entity_id")
            new_state = event.data.get("new_state")
            old_state = event.data.get("old_state")
            
            if new_state is None:
                return
            
            _LOGGER.debug(
                "Condition sensor changed: %s (%s → %s)",
                entity_id,
                old_state.state if old_state else "unknown",
                new_state.state
            )
            
            # Check home status immediately
            old_home_status = self._home_status
            self._check_home_status()
            
            # If status changed, control entities immediately and update UI
            if old_home_status != self._home_status:
                _LOGGER.info(
                    "🏠 Home status changed: %s → %s (triggered by %s)", 
                    "Active" if old_home_status else "Inactive",
                    "Active" if self._home_status else "Inactive",
                    entity_id
                )
                
                # Control entities immediately
                self.hass.async_create_task(self._control_entities())
                
                # Update the data to refresh UI
                self.async_set_updated_data({
                    "time_slots": self._time_slots,
                    "home_status": self._home_status,
                    "enabled": self._enabled,
                })
        
        # Unsubscribe from previous listeners if any
        if self._state_change_unsubscribe:
            self._state_change_unsubscribe()
        
        # Subscribe to state changes of all condition sensors
        self._state_change_unsubscribe = async_track_state_change_event(
            self.hass,
            condition_sensors,
            sensor_state_changed
        )
        
        _LOGGER.info(
            "✅ State listeners configured for %d condition sensor(s): %s",
            len(condition_sensors),
            ", ".join(condition_sensors)
        )

    def cleanup_state_listeners(self) -> None:
        """Cleanup state change listeners."""
        if self._state_change_unsubscribe:
            self._state_change_unsubscribe()
            self._state_change_unsubscribe = None
            _LOGGER.debug("State listeners cleaned up")

