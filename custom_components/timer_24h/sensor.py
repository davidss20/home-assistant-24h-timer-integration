"""Timer entity for Timer 24H integration."""
from __future__ import annotations

from datetime import datetime
import logging
from typing import Any

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import (
    ATTR_CONTROLLED_ENTITIES,
    ATTR_CURRENT_SLOT,
    ATTR_ENTITY_SETTINGS,
    ATTR_HOME_LOGIC,
    ATTR_HOME_SENSORS,
    ATTR_HOME_STATUS,
    ATTR_LAST_UPDATE,
    ATTR_SLOT_RESOLUTION,
    ATTR_TIME_SLOTS,
    CONF_ENTITY_SETTINGS,
    CONF_HOME_LOGIC,
    CONF_HOME_SENSORS,
    DEFAULT_HOME_LOGIC,
    DOMAIN,
    STATE_ACTIVE,
    STATE_BLOCKED,
    STATE_IDLE,
)

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Timer 24H sensor from a config entry."""
    coordinator = hass.data[DOMAIN][config_entry.entry_id]["coordinator"]
    
    async_add_entities([Timer24HEntity(coordinator, config_entry)])


class Timer24HEntity(CoordinatorEntity, SensorEntity):
    """Representation of a Timer 24H entity."""

    # Use device name only (avoid "Name Name" / duplicated entity_id)
    _attr_has_entity_name = True
    _attr_name = None
    _attr_icon = "mdi:timer-outline"

    def __init__(self, coordinator, config_entry: ConfigEntry) -> None:
        """Initialize the timer entity."""
        super().__init__(coordinator)
        self.config_entry = config_entry
        self._attr_unique_id = config_entry.entry_id

    @property
    def device_info(self) -> DeviceInfo:
        """Return device information."""
        name = self.config_entry.options.get("name", self.config_entry.title)
        return DeviceInfo(
            identifiers={(DOMAIN, self.config_entry.entry_id)},
            name=name,
            manufacturer="Timer 24H",
            model="24 Hour Timer",
            sw_version="1.3.0-beta.9",
        )

    @property
    def state(self) -> str:
        """Return the state of the timer."""
        if not self.coordinator.home_status:
            return STATE_BLOCKED
        
        current_slot = self.coordinator.get_current_slot()
        if current_slot and current_slot.get("isActive"):
            return STATE_ACTIVE
        
        return STATE_IDLE

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return the state attributes."""
        current_slot = self.coordinator.get_current_slot()
        
        return {
            # Create a new list copy to ensure HA detects changes
            ATTR_TIME_SLOTS: [slot.copy() for slot in self.coordinator.time_slots],
            ATTR_CURRENT_SLOT: current_slot.copy() if current_slot else None,
            ATTR_HOME_STATUS: self.coordinator.home_status,
            ATTR_HOME_SENSORS: list(
                self.config_entry.options.get(CONF_HOME_SENSORS, [])
            ),
            ATTR_HOME_LOGIC: self.config_entry.options.get(
                CONF_HOME_LOGIC, DEFAULT_HOME_LOGIC
            ),
            ATTR_CONTROLLED_ENTITIES: self.config_entry.options.get("entities", []),
            ATTR_ENTITY_SETTINGS: self.config_entry.options.get(
                CONF_ENTITY_SETTINGS, {}
            ),
            ATTR_LAST_UPDATE: datetime.now().isoformat(),
            "enabled": self.coordinator.enabled,
            ATTR_SLOT_RESOLUTION: self.coordinator.slot_resolution,
        }

    @callback
    def _handle_coordinator_update(self) -> None:
        """Handle updated data from the coordinator."""
        self.async_write_ha_state()
