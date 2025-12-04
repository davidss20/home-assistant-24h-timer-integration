"""Timer entity for Timer 24H integration."""
from __future__ import annotations

from datetime import datetime
import logging
from typing import Any

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import (
    ATTR_CONTROLLED_ENTITIES,
    ATTR_CURRENT_SLOT,
    ATTR_HOME_STATUS,
    ATTR_LAST_UPDATE,
    ATTR_TIME_SLOTS,
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

    _attr_has_entity_name = True
    _attr_icon = "mdi:timer-outline"

    def __init__(self, coordinator, config_entry: ConfigEntry) -> None:
        """Initialize the timer entity."""
        super().__init__(coordinator)
        self.config_entry = config_entry
        self._attr_unique_id = config_entry.entry_id
        self._attr_name = config_entry.options.get("name", config_entry.title)
        self._attr_device_info = {
            "identifiers": {(DOMAIN, config_entry.entry_id)},
            "name": self._attr_name,
            "manufacturer": "Timer 24H",
            "model": "24 Hour Timer",
            "sw_version": "4.6.6",
        }

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
            ATTR_TIME_SLOTS: self.coordinator.time_slots,
            ATTR_CURRENT_SLOT: current_slot,
            ATTR_HOME_STATUS: self.coordinator.home_status,
            ATTR_CONTROLLED_ENTITIES: self.config_entry.options.get("entities", []),
            ATTR_LAST_UPDATE: datetime.now().isoformat(),
        }

    @callback
    def _handle_coordinator_update(self) -> None:
        """Handle updated data from the coordinator."""
        self.async_write_ha_state()

