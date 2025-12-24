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
    CONF_HOME_LOGIC,
    CONF_HOME_SENSORS,
    DEFAULT_HOME_LOGIC,
    DOMAIN,
    UPDATE_INTERVAL,
)

_LOGGER = logging.getLogger(__name__)


class Timer24HCoordinator(DataUpdateCoordinator):
    """Class to manage fetching Timer 24H data."""

    def __init__(self, hass: HomeAssistant, config_entry: ConfigEntry) -> None:
        """Initialize."""
        self.config_entry = config_entry
        self.hass = hass
        self._time_slots: list[dict[str, Any]] = self._initialize_time_slots()
        self._home_status: bool = True
        self._enabled: bool = True
        self._last_controlled_states: dict[str, bool] = {}
        self._state_change_unsubscribe = None
        
        # Load saved time slots from options
        if "time_slots" in config_entry.options:
            self._time_slots = config_entry.options["time_slots"]
        
        # Load saved enabled state from options
        if "enabled" in config_entry.options:
            self._enabled = config_entry.options["enabled"]

        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            update_interval=timedelta(seconds=UPDATE_INTERVAL),
        )

    def _initialize_time_slots(self) -> list[dict[str, Any]]:
        """Initialize 48 time slots (24 hours × 2 = half hours)."""
        slots = []
        for hour in range(24):
            slots.append({"hour": hour, "minute": 0, "isActive": False})
            slots.append({"hour": hour, "minute": 30, "isActive": False})
        
        # Validate no duplicates
        keys = [f"{s['hour']}:{s['minute']}" for s in slots]
        if len(keys) != len(set(keys)):
            _LOGGER.error("❌ DUPLICATE SLOTS DETECTED IN INITIALIZATION!")
        else:
            _LOGGER.info("✅ Initialized %d unique time slots", len(slots))
        
        return slots

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

    def get_current_slot(self) -> dict[str, Any] | None:
        """Get the current time slot."""
        now = datetime.now()
        hour = now.hour
        minute = 0 if now.minute < 30 else 30
        
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

            current_state = entity.state == "on"
            last_controlled_state = self._last_controlled_states.get(entity_id)

            # Only send command if state differs and we haven't sent this command
            if current_state != should_be_on and last_controlled_state != should_be_on:
                try:
                    service = "turn_on" if should_be_on else "turn_off"
                    await self.hass.services.async_call(
                        "homeassistant",
                        service,
                        {"entity_id": entity_id},
                        blocking=False,
                    )
                    _LOGGER.info(
                        "%s %s based on timer schedule",
                        "Turned on" if should_be_on else "Turned off",
                        entity_id,
                    )

                    # Remember what command we sent
                    self._last_controlled_states[entity_id] = should_be_on

                    # Clear the memory after some time
                    @callback
                    def _clear_memory():
                        if self._last_controlled_states.get(entity_id) == should_be_on:
                            self._last_controlled_states.pop(entity_id, None)

                    self.hass.loop.call_later(30, _clear_memory)

                except Exception as err:
                    _LOGGER.error("Failed to control %s: %s", entity_id, err)

    async def async_toggle_slot(self, hour: int, minute: int) -> None:
        """Toggle a time slot."""
        _LOGGER.info("🎯 Toggle slot called: hour=%s, minute=%s", hour, minute)
        
        # Log BEFORE state
        active_before = [f"{s['hour']}:{s['minute']:02d}" for s in self._time_slots if s["isActive"]]
        _LOGGER.info("📋 Active slots BEFORE toggle: %s", ", ".join(active_before) if active_before else "None")
        
        slot_found = False
        # CREATE A NEW LIST - this ensures HA detects the change!
        new_slots = []
        for slot in self._time_slots:
            if slot["hour"] == hour and slot["minute"] == minute:
                old_state = slot["isActive"]
                # Create new dict with toggled state
                new_slot = {**slot, "isActive": not slot["isActive"]}
                new_slots.append(new_slot)
                _LOGGER.info("✅ Found and toggled slot %s:%02d: %s → %s", 
                           hour, minute, old_state, new_slot["isActive"])
                slot_found = True
            else:
                # Keep other slots as-is (but create new dict)
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
        # Build a lookup map for incoming slots
        slot_updates = {(s.get("hour"), s.get("minute")): s.get("isActive", False) for s in slots}

        # CREATE A NEW LIST - this ensures HA detects the change!
        new_slots = []
        for slot in self._time_slots:
            key = (slot["hour"], slot["minute"])
            if key in slot_updates:
                new_slots.append({**slot, "isActive": slot_updates[key]})
            else:
                new_slots.append({**slot})
        self._time_slots = new_slots

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
        _LOGGER.info("Clearing all time slots")
        active_before = [f"{s['hour']}:{s['minute']:02d}" for s in self._time_slots if s["isActive"]]
        _LOGGER.info("Active slots BEFORE clear: %s", ", ".join(active_before) if active_before else "None")

        # CREATE A NEW LIST - this ensures HA detects the change!
        new_slots = []
        for slot in self._time_slots:
            new_slots.append({**slot, "isActive": False})
        self._time_slots = new_slots

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

        _LOGGER.info("✅ All time slots cleared successfully")

    async def _save_time_slots(self) -> None:
        """Save time slots to config entry options."""
        # Deep copy the slots to ensure no shared references with HA config system
        time_slots_copy = [dict(slot) for slot in self._time_slots]
        new_options = {**self.config_entry.options, "time_slots": time_slots_copy}
        self.hass.config_entries.async_update_entry(
            self.config_entry, options=new_options
        )
        _LOGGER.debug("Saved %d time slots to config entry", len(time_slots_copy))
    
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

