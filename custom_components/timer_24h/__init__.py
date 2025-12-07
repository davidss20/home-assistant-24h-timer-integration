"""The Timer 24H integration."""
from __future__ import annotations

import asyncio
import json
import logging
import os
import shutil
from pathlib import Path

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, ServiceCall
import homeassistant.helpers.config_validation as cv
from homeassistant.helpers import entity_registry as er

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
    
    # Register resource after Home Assistant starts (legacy fallback)
    async def _register_on_start(event):
        """Register resource when Home Assistant starts."""
        integration_path = Path(__file__).parent
        manifest_path = integration_path / "manifest.json"
        version = "1.0.0"
        try:
            with open(manifest_path) as f:
                manifest = json.load(f)
                version = manifest.get("version", "1.0.0")
        except Exception:
            pass
        await _async_register_lovelace_resource(hass, version, attempt=1)
    
    hass.bus.async_listen_once("homeassistant_started", _register_on_start)
    
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Timer 24H from a config entry."""
    coordinator = Timer24HCoordinator(hass, entry)
    await coordinator.async_config_entry_first_refresh()

    # Setup state listeners for immediate response to condition changes
    coordinator.setup_state_listeners()

    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = {
        "coordinator": coordinator,
    }

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # Register services
    await _async_register_services(hass)
    
    # Register Lovelace resource with retry mechanism
    async def _delayed_resource_registration():
        """Try to register resource with delay for lovelace to be ready."""
        integration_path = Path(__file__).parent
        manifest_path = integration_path / "manifest.json"
        version = "1.0.0"
        try:
            with open(manifest_path) as f:
                manifest = json.load(f)
                version = manifest.get("version", "1.0.0")
        except Exception:
            pass
        
        # Try up to 3 times with delay
        for attempt in range(3):
            if attempt > 0:
                await asyncio.sleep(5)  # Wait 5 seconds between attempts
            
            try:
                success = await _async_register_lovelace_resource(hass, version, attempt + 1)
                if success:
                    break
            except Exception as err:
                _LOGGER.debug("Attempt %d to register resource failed: %s", attempt + 1, err)
    
    # Call the function asynchronously
    hass.async_create_task(_delayed_resource_registration())

    # Register update listener
    entry.async_on_unload(entry.add_update_listener(async_update_options))

    return True


async def async_update_options(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Update options."""
    # Reload will cleanup old listeners and setup new ones
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    # Cleanup state listeners before unloading
    coordinator = hass.data[DOMAIN][entry.entry_id]["coordinator"]
    coordinator.cleanup_state_listeners()
    
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

        _LOGGER.info("🔵 SERVICE CALLED: toggle_slot(entity=%s, hour=%s, minute=%s)", entity_id, hour, minute)

        # Find the coordinator for this entity
        for entry_id, data in hass.data[DOMAIN].items():
            if isinstance(data, dict) and "coordinator" in data:
                coordinator = data["coordinator"]
                
                # Get all sensor entities for this integration instance
                entity_registry = er.async_get(hass)
                for entity_entry in entity_registry.entities.values():
                    if (entity_entry.config_entry_id == coordinator.config_entry.entry_id 
                        and entity_entry.entity_id == entity_id):
                        _LOGGER.info("✅ Found matching coordinator for entity_id=%s", entity_id)
                        await coordinator.async_toggle_slot(hour, minute)
                        return
        
        _LOGGER.warning("❌ No coordinator found for entity_id=%s", entity_id)

    async def handle_set_slots(call: ServiceCall) -> None:
        """Handle the set_slots service call."""
        entity_id = call.data.get("entity_id")
        slots = call.data.get(ATTR_SLOTS)

        for entry_id, data in hass.data[DOMAIN].items():
            if isinstance(data, dict) and "coordinator" in data:
                coordinator = data["coordinator"]
                
                entity_registry = er.async_get(hass)
                for entity_entry in entity_registry.entities.values():
                    if (entity_entry.config_entry_id == coordinator.config_entry.entry_id 
                        and entity_entry.entity_id == entity_id):
                        await coordinator.async_set_slots(slots)
                        return

    async def handle_clear_all(call: ServiceCall) -> None:
        """Handle the clear_all service call."""
        entity_id = call.data.get("entity_id")

        for entry_id, data in hass.data[DOMAIN].items():
            if isinstance(data, dict) and "coordinator" in data:
                coordinator = data["coordinator"]
                
                entity_registry = er.async_get(hass)
                for entity_entry in entity_registry.entities.values():
                    if (entity_entry.config_entry_id == coordinator.config_entry.entry_id 
                        and entity_entry.entity_id == entity_id):
                        await coordinator.async_clear_all()
                        return

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
        
        # Get version from manifest
        manifest_path = integration_path / "manifest.json"
        version = "1.0.0"
        try:
            with open(manifest_path) as f:
                manifest = json.load(f)
                version = manifest.get("version", "1.0.0")
        except Exception as err:
            _LOGGER.warning("Could not read version from manifest: %s", err)
        
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
            "✅ Timer 24H Card v%s files installed successfully to www/timer-24h-card/",
            version
        )
        
    except Exception as err:
        _LOGGER.error("Failed to install Timer 24H Card: %s", err)


async def _async_register_lovelace_resource(hass: HomeAssistant, version: str, attempt: int = 1) -> bool:
    """Register the Lovelace resource automatically with retry support."""
    url = f"/local/timer-24h-card/timer-24h-card.js?v={version}"
    
    try:
        # Try to use the lovelace resources API
        lovelace_resources = hass.data.get("lovelace", {}).get("resources")
        
        if lovelace_resources is None:
            _LOGGER.debug("Attempt %d: Lovelace resources not yet available", attempt)
            return False
            
        # Check if resource already exists
        existing_resource = None
        try:
            for item in lovelace_resources.async_items():
                if "timer-24h-card" in item.get("url", ""):
                    existing_resource = item
                    break
        except Exception as err:
            _LOGGER.debug("Attempt %d: Could not check existing resources: %s", attempt, err)
            return False
        
        try:
            # Update or create resource
            if existing_resource:
                # Update existing resource with new version
                if existing_resource.get("url") != url:
                    await lovelace_resources.async_update_item(
                        existing_resource["id"],
                        {"url": url, "type": "module"}
                    )
                    _LOGGER.info("✅ Updated Timer 24H Card resource to version %s (attempt %d)", version, attempt)
                    return True
                else:
                    _LOGGER.info("✅ Timer 24H Card resource already up to date (v%s)", version)
                    return True
            else:
                # Create new resource
                await lovelace_resources.async_create_item(
                    {"url": url, "type": "module"}
                )
                _LOGGER.info("✅ Registered Timer 24H Card resource version %s (attempt %d)", version, attempt)
                return True
        except Exception as create_err:
            _LOGGER.debug("Attempt %d: Could not create/update resource: %s", attempt, create_err)
            return False
        
    except Exception as err:
        _LOGGER.debug("Attempt %d: Error in resource registration: %s", attempt, err)
        return False
    
    # If we reached here after 3 attempts, warn the user
    if attempt >= 3:
        _LOGGER.warning(
            "⚠️ Could not auto-register Lovelace resource after 3 attempts. "
            "Please add manually:\n"
            "   Settings → Dashboards → Resources → Add Resource\n"
            "   URL: %s\n"
            "   Type: JavaScript Module",
            url
        )
    return False

