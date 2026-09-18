"""Check timer entity control when activation conditions change.

Verifies:
  1. Unmet conditions during an active slot do not turn an already-on climate off
  2. Unmet conditions during an active slot do not turn an off climate on
  3. An inactive slot still turns entities off even if conditions are false
  4. An inactive slot with conditions true still turns entities off
  5. An active slot with conditions true still turns entities on
  6. A disabled timer still skips all entity control

Run: python scripts/verify_entity_control.py
"""
from __future__ import annotations

import asyncio
import sys
import types
from pathlib import Path
from unittest.mock import MagicMock

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT))

STUB_ROOTS = ("homeassistant", "voluptuous")


class _StubFinder:
    """Fabricate empty modules for Home Assistant imports on demand."""

    def find_module(self, fullname, path=None):  # pragma: no cover - legacy API
        return self if self._handles(fullname) else None

    def find_spec(self, fullname, path=None, target=None):
        if not self._handles(fullname):
            return None
        return importlib.util.spec_from_loader(fullname, self)

    def create_module(self, spec):
        module = types.ModuleType(spec.name)
        module.__path__ = []  # allow submodule imports
        module.__getattr__ = lambda attr: MagicMock()  # type: ignore[attr-defined]
        return module

    def exec_module(self, module) -> None:
        if module.__name__ == "homeassistant.helpers.update_coordinator":
            module.DataUpdateCoordinator = type(
                "DataUpdateCoordinator", (), {"__init__": lambda self, *a, **k: None}
            )
            module.UpdateFailed = type("UpdateFailed", (Exception,), {})

    @staticmethod
    def _handles(fullname: str) -> bool:
        root = fullname.split(".", 1)[0]
        return root in STUB_ROOTS


import importlib.util  # noqa: E402

sys.meta_path.insert(0, _StubFinder())

sys.path.insert(0, str(REPO_ROOT / "custom_components"))
from timer_24h.const import (  # noqa: E402
    CONF_ENTITIES,
    CONF_ENTITY_SETTINGS,
    CONF_HOME_LOGIC,
    CONF_HOME_SENSORS,
)
from timer_24h.coordinator import Timer24HCoordinator  # noqa: E402

results: list[tuple[str, bool, str]] = []
CLIMATE_ID = "climate.living_room"
SENSOR_ID = "binary_sensor.at_home"


def check(name: str, ok: bool, detail: str = "") -> None:
    results.append((name, bool(ok), detail))


class FakeState:
    def __init__(self, state: str, attributes: dict | None = None) -> None:
        self.state = state
        self.attributes = attributes or {}


class FakeStates:
    def __init__(self) -> None:
        self._states: dict[str, FakeState] = {}

    def get(self, entity_id: str) -> FakeState | None:
        return self._states.get(entity_id)

    def set(
        self, entity_id: str, state: str, attributes: dict | None = None
    ) -> None:
        self._states[entity_id] = FakeState(state, attributes)


class FakeServices:
    def __init__(self) -> None:
        self.calls: list[tuple[str, str, dict]] = []

    async def async_call(
        self,
        domain: str,
        service: str,
        service_data: dict | None = None,
        blocking: bool = False,
    ) -> None:
        self.calls.append((domain, service, dict(service_data or {})))


class FakeHass:
    def __init__(self) -> None:
        self.states = FakeStates()
        self.services = FakeServices()


def climate_off_calls(hass: FakeHass) -> list[tuple[str, str, dict]]:
    return [
        call
        for call in hass.services.calls
        if call[0] == "climate"
        and call[1] == "set_hvac_mode"
        and call[2].get("entity_id") == CLIMATE_ID
        and call[2].get("hvac_mode") == "off"
    ]


def climate_on_calls(hass: FakeHass) -> list[tuple[str, str, dict]]:
    return [
        call
        for call in hass.services.calls
        if call[0] == "climate"
        and call[1] == "set_hvac_mode"
        and call[2].get("entity_id") == CLIMATE_ID
        and call[2].get("hvac_mode") != "off"
    ]


def make_coordinator(
    *,
    enabled: bool = True,
    home_status: bool = True,
    slot_active: bool = True,
    climate_state: str = "cool",
    sensor_state: str = "on",
) -> Timer24HCoordinator:
    coordinator = object.__new__(Timer24HCoordinator)
    hass = FakeHass()
    hass.states.set(
        CLIMATE_ID,
        climate_state,
        {"temperature": 24, "hvac_mode": climate_state},
    )
    hass.states.set(SENSOR_ID, sensor_state)

    config_entry = MagicMock()
    config_entry.options = {
        CONF_ENTITIES: [CLIMATE_ID],
        CONF_HOME_SENSORS: [SENSOR_ID],
        CONF_HOME_LOGIC: "OR",
        CONF_ENTITY_SETTINGS: {},
    }

    coordinator.hass = hass  # type: ignore[assignment]
    coordinator.config_entry = config_entry
    coordinator._enabled = enabled
    coordinator._home_status = home_status
    coordinator._last_controlled_states = {}
    coordinator._last_command_times = {}
    coordinator._time_slots = []
    coordinator.get_current_slot = lambda: {  # type: ignore[method-assign]
        "hour": 10,
        "minute": 0,
        "isActive": slot_active,
    }
    coordinator.async_set_updated_data = lambda *a, **k: None  # type: ignore[method-assign]
    return coordinator


async def run_cases() -> None:
    # --- condition change during an active slot ----------------------------
    coord = make_coordinator(
        home_status=False, slot_active=True, climate_state="cool"
    )
    await coord._control_entities()
    check(
        "active slot + unmet conditions: already-on climate stays on",
        climate_off_calls(coord.hass) == [] and climate_on_calls(coord.hass) == [],
        f"calls={coord.hass.services.calls}",
    )

    coord = make_coordinator(
        home_status=False, slot_active=True, climate_state="off"
    )
    await coord._control_entities()
    check(
        "active slot + unmet conditions: off climate is not turned on",
        climate_on_calls(coord.hass) == [] and climate_off_calls(coord.hass) == [],
        f"calls={coord.hass.services.calls}",
    )

    # --- transition to the next inactive slot ------------------------------
    coord = make_coordinator(
        home_status=False, slot_active=False, climate_state="cool"
    )
    await coord._control_entities()
    check(
        "inactive slot + unmet conditions: climate is turned off",
        len(climate_off_calls(coord.hass)) == 1,
        f"calls={coord.hass.services.calls}",
    )

    # --- inactive slot with conditions true (regression) -------------------
    coord = make_coordinator(
        home_status=True, slot_active=False, climate_state="cool"
    )
    await coord._control_entities()
    check(
        "inactive slot + conditions true: climate is turned off",
        len(climate_off_calls(coord.hass)) == 1,
        f"calls={coord.hass.services.calls}",
    )

    # --- active slot with conditions true (existing on behavior) -----------
    coord = make_coordinator(
        home_status=True, slot_active=True, climate_state="off"
    )
    await coord._control_entities()
    check(
        "active slot + conditions true: climate is turned on",
        len(climate_on_calls(coord.hass)) == 1,
        f"calls={coord.hass.services.calls}",
    )

    # --- disabled timer keeps current skip behavior ------------------------
    coord = make_coordinator(
        enabled=False,
        home_status=False,
        slot_active=False,
        climate_state="cool",
    )
    await coord._control_entities()
    check(
        "disabled timer: no entity control even on inactive slot",
        coord.hass.services.calls == [],
        f"calls={coord.hass.services.calls}",
    )

    # --- minute tick: condition drop then inactive slot --------------------
    coord = make_coordinator(
        home_status=True,
        slot_active=True,
        climate_state="cool",
        sensor_state="on",
    )
    coord.hass.states.set(SENSOR_ID, "off")
    await coord._async_on_schedule_tick(None)  # type: ignore[arg-type]
    mid_calls = list(coord.hass.services.calls)
    check(
        "minute tick during active slot after condition drop: leave climate on",
        climate_off_calls(coord.hass) == [] and coord._home_status is False,
        f"home_status={coord._home_status} calls={mid_calls}",
    )

    coord.get_current_slot = lambda: {  # type: ignore[method-assign]
        "hour": 10,
        "minute": 15,
        "isActive": False,
    }
    coord.hass.services.calls.clear()
    await coord._async_on_schedule_tick(None)  # type: ignore[arg-type]
    check(
        "minute tick into inactive slot with conditions still false: turn climate off",
        len(climate_off_calls(coord.hass)) == 1,
        f"calls={coord.hass.services.calls}",
    )


asyncio.run(run_cases())

failed = 0
for name, ok, detail in results:
    if not ok:
        failed += 1
    print(f"{'PASS' if ok else 'FAIL'}  {name}" + ("" if ok else f" — {detail}"))

print(f"\n{len(results) - failed}/{len(results)} checks passed")
sys.exit(0 if failed == 0 else 1)
