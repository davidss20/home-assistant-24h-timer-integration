"""Config flow for Timer 24H integration."""
from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.const import CONF_NAME
from homeassistant.core import HomeAssistant, callback
from homeassistant.data_entry_flow import FlowResult
from homeassistant.helpers import selector
import homeassistant.helpers.config_validation as cv

from .const import (
    DOMAIN,
    CONF_ENTITIES,
    CONF_HOME_SENSORS,
    CONF_HOME_LOGIC,
    CONF_SHOW_ENABLE_SWITCH,
    DEFAULT_NAME,
    DEFAULT_HOME_LOGIC,
)

_LOGGER = logging.getLogger(__name__)

SUPPORTED_ENTITY_DOMAINS = [
    "light",
    "switch",
    "fan",
    "climate",
    "media_player",
    "cover",
    "input_boolean",
    "group",
]

SUPPORTED_SENSOR_DOMAINS = [
    "person",
    "device_tracker",
    "binary_sensor",
    "sensor",
    "input_boolean",
]


def _filter_entities(hass: HomeAssistant, domains: list[str]) -> list[str]:
    """Filter entities by domain."""
    entities = []
    for domain in domains:
        entities.extend(
            [
                entity_id
                for entity_id in hass.states.async_entity_ids(domain)
            ]
        )
    return sorted(entities)


class Timer24HConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Timer 24H."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle the initial step."""
        errors: dict[str, str] = {}

        if user_input is not None:
            # Validate name is unique
            await self.async_set_unique_id(user_input[CONF_NAME].lower())
            self._abort_if_unique_id_configured()

            return self.async_create_entry(
                title=user_input[CONF_NAME],
                data={},
                options=user_input,
            )

        # Get available entities
        controlled_entities = _filter_entities(self.hass, SUPPORTED_ENTITY_DOMAINS)
        sensor_entities = _filter_entities(self.hass, SUPPORTED_SENSOR_DOMAINS)

        data_schema = vol.Schema(
            {
                vol.Required(CONF_NAME, default=DEFAULT_NAME): cv.string,
                vol.Optional(CONF_ENTITIES, default=[]): selector.EntitySelector(
                    selector.EntitySelectorConfig(
                        domain=SUPPORTED_ENTITY_DOMAINS,
                        multiple=True,
                    ),
                ),
                vol.Optional(CONF_HOME_SENSORS, default=[]): selector.EntitySelector(
                    selector.EntitySelectorConfig(
                        domain=SUPPORTED_SENSOR_DOMAINS,
                        multiple=True,
                    ),
                ),
                vol.Optional(CONF_HOME_LOGIC, default=DEFAULT_HOME_LOGIC): vol.In(
                    ["OR", "AND"]
                ),
                vol.Optional(CONF_SHOW_ENABLE_SWITCH, default=False): cv.boolean,
            }
        )

        return self.async_show_form(
            step_id="user",
            data_schema=data_schema,
            errors=errors,
            description_placeholders={
                "show_enable_switch_help": "Display enable/disable switch in the card"
            },
        )

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> Timer24HOptionsFlow:
        """Get the options flow for this handler."""
        return Timer24HOptionsFlow(config_entry)


class Timer24HOptionsFlow(config_entries.OptionsFlow):
    """Handle options flow for Timer 24H."""

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        """Initialize options flow."""
        self.config_entry = config_entry

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Manage the options."""
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        options = self.config_entry.options
        data_schema = vol.Schema(
            {
                vol.Required(
                    CONF_NAME,
                    default=options.get(CONF_NAME, DEFAULT_NAME),
                ): cv.string,
                vol.Optional(
                    CONF_ENTITIES,
                    default=options.get(CONF_ENTITIES, []),
                ): selector.EntitySelector(
                    selector.EntitySelectorConfig(
                        domain=SUPPORTED_ENTITY_DOMAINS,
                        multiple=True,
                    ),
                ),
                vol.Optional(
                    CONF_HOME_SENSORS,
                    default=options.get(CONF_HOME_SENSORS, []),
                ): selector.EntitySelector(
                    selector.EntitySelectorConfig(
                        domain=SUPPORTED_SENSOR_DOMAINS,
                        multiple=True,
                    ),
                ),
                vol.Optional(
                    CONF_HOME_LOGIC,
                    default=options.get(CONF_HOME_LOGIC, DEFAULT_HOME_LOGIC),
                ): vol.In(["OR", "AND"]),
                vol.Optional(
                    CONF_SHOW_ENABLE_SWITCH,
                    default=options.get(CONF_SHOW_ENABLE_SWITCH, False),
                ): cv.boolean,
            }
        )

        return self.async_show_form(
            step_id="init",
            data_schema=data_schema,
            description_placeholders={
                "show_enable_switch_help": "Display enable/disable switch in the card"
            },
        )

