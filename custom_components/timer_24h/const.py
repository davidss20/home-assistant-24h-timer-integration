"""Constants for the Timer 24H integration."""
from typing import Final

DOMAIN: Final = "timer_24h"
PLATFORMS: Final = ["sensor"]

# Configuration and options
CONF_NAME: Final = "name"
CONF_ENTITIES: Final = "entities"
CONF_HOME_SENSORS: Final = "home_sensors"
CONF_HOME_LOGIC: Final = "home_logic"
CONF_SHOW_ENABLE_SWITCH: Final = "show_enable_switch"

# Defaults
DEFAULT_NAME: Final = "Timer 24H"
DEFAULT_HOME_LOGIC: Final = "OR"

# Services
SERVICE_TOGGLE_SLOT: Final = "toggle_slot"
SERVICE_SET_SLOTS: Final = "set_slots"
SERVICE_CLEAR_ALL: Final = "clear_all"
SERVICE_SET_ENABLED: Final = "set_enabled"

# Attributes
ATTR_TIME_SLOTS: Final = "time_slots"
ATTR_CURRENT_SLOT: Final = "current_slot"
ATTR_HOME_STATUS: Final = "home_status"
ATTR_CONTROLLED_ENTITIES: Final = "controlled_entities"
ATTR_LAST_UPDATE: Final = "last_update"
ATTR_HOUR: Final = "hour"
ATTR_MINUTE: Final = "minute"
ATTR_SLOTS: Final = "slots"

# States
STATE_ACTIVE: Final = "active"
STATE_BLOCKED: Final = "blocked"
STATE_IDLE: Final = "idle"

# Update interval
UPDATE_INTERVAL: Final = 60  # seconds

