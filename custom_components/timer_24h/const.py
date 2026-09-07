"""Constants for the Timer 24H integration."""
from typing import Final

DOMAIN: Final = "timer_24h"
PLATFORMS: Final = ["sensor"]

# Configuration and options
CONF_NAME: Final = "name"
CONF_ENTITIES: Final = "entities"
CONF_HOME_SENSORS: Final = "home_sensors"
CONF_HOME_LOGIC: Final = "home_logic"
CONF_ENTITY_SETTINGS: Final = "entity_settings"
CONF_SLOT_RESOLUTION: Final = "slot_resolution"

# Defaults
DEFAULT_NAME: Final = "Timer 24H"
DEFAULT_HOME_LOGIC: Final = "OR"
DEFAULT_SLOT_RESOLUTION: Final = "15"
SLOT_MINUTES: Final = (0, 15, 30, 45)
SLOT_RESOLUTION_15: Final = 15
SLOT_RESOLUTION_30: Final = 30
# Hidden for now: set True to show the 15/30 setting again after community feedback.
ENABLE_THIRTY_MINUTE_UI: Final = False
DEFAULT_CLIMATE_TEMPERATURE: Final = 24
DEFAULT_CLIMATE_HVAC_MODE: Final = "cool"
DEFAULT_FAN_PERCENTAGE: Final = 50

# Services
SERVICE_TOGGLE_SLOT: Final = "toggle_slot"
SERVICE_SET_SLOTS: Final = "set_slots"
SERVICE_CLEAR_ALL: Final = "clear_all"
SERVICE_SET_ENABLED: Final = "set_enabled"
SERVICE_SET_ENTITY_SETTINGS: Final = "set_entity_settings"
SERVICE_SET_ACTIVATION_CONDITIONS: Final = "set_activation_conditions"
SERVICE_SET_SLOT_RESOLUTION: Final = "set_slot_resolution"

# Attributes
ATTR_TIME_SLOTS: Final = "time_slots"
ATTR_CURRENT_SLOT: Final = "current_slot"
ATTR_HOME_STATUS: Final = "home_status"
ATTR_HOME_SENSORS: Final = "home_sensors"
ATTR_HOME_LOGIC: Final = "home_logic"
ATTR_CONTROLLED_ENTITIES: Final = "controlled_entities"
ATTR_ENTITY_SETTINGS: Final = "entity_settings"
ATTR_LAST_UPDATE: Final = "last_update"
ATTR_HOUR: Final = "hour"
ATTR_MINUTE: Final = "minute"
ATTR_SLOTS: Final = "slots"
ATTR_SLOT_RESOLUTION: Final = "slot_resolution"
ATTR_TARGET_ENTITY_ID: Final = "target_entity_id"
ATTR_TEMPERATURE: Final = "temperature"
ATTR_HVAC_MODE: Final = "hvac_mode"
ATTR_PERCENTAGE: Final = "percentage"

# States
STATE_ACTIVE: Final = "active"
STATE_BLOCKED: Final = "blocked"
STATE_IDLE: Final = "idle"

# Update interval
UPDATE_INTERVAL: Final = 60  # seconds

