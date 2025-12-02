"""The Timer 24H integration."""
from __future__ import annotations

import logging
import os
import shutil
from pathlib import Path

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, ServiceCall
import homeassistant.helpers.config_validation as cv

from .const import (
    ATTR_HOUR,
    ATTR_MINUTE,
    ATTR_SLOTS,
    DOMAIN,
    SERVICE_CLEAR_ALL,
    SERVICE_SET_SLOTS,
    SERVICE_TOGGLE_SLOT,
)
from .coordinator import Timer24HCoordinator

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = [Platform.SENSOR]


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up the Timer 24H component."""
    hass.data.setdefault(DOMAIN, {})
    
    # Install card files automatically
    await _async_install_card(hass)
    
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Timer 24H from a config entry."""
    coordinator = Timer24HCoordinator(hass, entry)
    await coordinator.async_config_entry_first_refresh()

    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = {
        "coordinator": coordinator,
    }

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # Register services
    await _async_register_services(hass)

    # Register update listener
    entry.async_on_unload(entry.add_update_listener(async_update_options))

    return True


async def async_update_options(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Update options."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id)

    return unload_ok


async def _async_register_services(hass: HomeAssistant) -> None:
    """Register services for Timer 24H."""

    async def handle_toggle_slot(call: ServiceCall) -> None:
        """Handle the toggle_slot service call."""
        entity_id = call.data.get("entity_id")
        hour = call.data.get(ATTR_HOUR)
        minute = call.data.get(ATTR_MINUTE)

        # Find the coordinator for this entity
        for entry_id, data in hass.data[DOMAIN].items():
            if isinstance(data, dict) and "coordinator" in data:
                coordinator = data["coordinator"]
                entity_entry_id = coordinator.config_entry.entry_id
                
                # Check if this is the right coordinator
                timer_entity_id = f"sensor.{coordinator.config_entry.options.get('name', 'timer_24h').lower().replace(' ', '_')}"
                if entity_id == timer_entity_id or entity_id == entity_entry_id:
                    await coordinator.async_toggle_slot(hour, minute)
                    break

    async def handle_set_slots(call: ServiceCall) -> None:
        """Handle the set_slots service call."""
        entity_id = call.data.get("entity_id")
        slots = call.data.get(ATTR_SLOTS)

        for entry_id, data in hass.data[DOMAIN].items():
            if isinstance(data, dict) and "coordinator" in data:
                coordinator = data["coordinator"]
                entity_entry_id = coordinator.config_entry.entry_id
                
                timer_entity_id = f"sensor.{coordinator.config_entry.options.get('name', 'timer_24h').lower().replace(' ', '_')}"
                if entity_id == timer_entity_id or entity_id == entity_entry_id:
                    await coordinator.async_set_slots(slots)
                    break

    async def handle_clear_all(call: ServiceCall) -> None:
        """Handle the clear_all service call."""
        entity_id = call.data.get("entity_id")

        for entry_id, data in hass.data[DOMAIN].items():
            if isinstance(data, dict) and "coordinator" in data:
                coordinator = data["coordinator"]
                entity_entry_id = coordinator.config_entry.entry_id
                
                timer_entity_id = f"sensor.{coordinator.config_entry.options.get('name', 'timer_24h').lower().replace(' ', '_')}"
                if entity_id == timer_entity_id or entity_id == entity_entry_id:
                    await coordinator.async_clear_all()
                    break

    # Register services if not already registered
    if not hass.services.has_service(DOMAIN, SERVICE_TOGGLE_SLOT):
        hass.services.async_register(
            DOMAIN,
            SERVICE_TOGGLE_SLOT,
            handle_toggle_slot,
            schema=vol.Schema(
                {
                    vol.Required("entity_id"): cv.entity_id,
                    vol.Required(ATTR_HOUR): cv.positive_int,
                    vol.Required(ATTR_MINUTE): vol.In([0, 30]),
                }
            ),
        )

    if not hass.services.has_service(DOMAIN, SERVICE_SET_SLOTS):
        hass.services.async_register(
            DOMAIN,
            SERVICE_SET_SLOTS,
            handle_set_slots,
            schema=vol.Schema(
                {
                    vol.Required("entity_id"): cv.entity_id,
                    vol.Required(ATTR_SLOTS): vol.All(cv.ensure_list, [dict]),
                }
            ),
        )

    if not hass.services.has_service(DOMAIN, SERVICE_CLEAR_ALL):
        hass.services.async_register(
            DOMAIN,
            SERVICE_CLEAR_ALL,
            handle_clear_all,
            schema=vol.Schema(
                {
                    vol.Required("entity_id"): cv.entity_id,
                }
            ),
        )


async def _async_install_card(hass: HomeAssistant) -> None:
    """Install the card automatically."""
    try:
        # Get the integration path
        integration_path = Path(__file__).parent
        
        # Source files
        card_js_source = integration_path / "dist" / "timer-24h-card.js"
        editor_js_source = integration_path / "dist" / "timer-24h-card-editor.js"
        
        # Destination directory
        www_dir = Path(hass.config.path("www"))
        card_dir = www_dir / "timer-24h-card"
        
        # Create directory if it doesn't exist
        card_dir.mkdir(parents=True, exist_ok=True)
        
        # Copy files if they exist
        if card_js_source.exists():
            shutil.copy2(card_js_source, card_dir / "timer-24h-card.js")
            _LOGGER.info("Timer 24H Card installed to www/timer-24h-card/")
        else:
            _LOGGER.warning(
                "Timer 24H Card source file not found at %s. "
                "You may need to build the card first.",
                card_js_source,
            )
            
        if editor_js_source.exists():
            shutil.copy2(editor_js_source, card_dir / "timer-24h-card-editor.js")
            
        _LOGGER.info(
            "Timer 24H Card installed successfully. "
            "Please add the card resource manually or clear your browser cache."
        )
        
    except Exception as err:
        _LOGGER.error("Failed to install Timer 24H Card: %s", err)

