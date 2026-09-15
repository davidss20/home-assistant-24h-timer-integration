"""Check the coordinator slot-toggle rules without a Home Assistant install.

Verifies:
  1. 15-minute mode: every tap (including :00) affects only that quarter
  2. 30-minute mode: a tap still affects the tapped half-hour pair
  3. async_toggle_hour fills a whole hour, and turns it off when already full

Run: python scripts/verify_toggle_logic.py
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
from timer_24h.coordinator import Timer24HCoordinator  # noqa: E402

results: list[tuple[str, bool, str]] = []


def check(name: str, ok: bool, detail: str = "") -> None:
    results.append((name, bool(ok), detail))


def make_coordinator(resolution: int, active: set[tuple[int, int]]) -> Timer24HCoordinator:
    coordinator = object.__new__(Timer24HCoordinator)
    coordinator._time_slots = [
        {"hour": hour, "minute": minute, "isActive": (hour, minute) in active}
        for hour in range(24)
        for minute in (0, 15, 30, 45)
    ]
    coordinator._slot_resolution = resolution
    coordinator._home_status = True
    coordinator._enabled = True
    # Persistence and entity control are out of scope for this logic check
    coordinator._save_time_slots = _noop_async  # type: ignore[method-assign]
    coordinator._clear_control_memory = lambda *a, **k: None  # type: ignore[method-assign]
    coordinator._control_entities = _noop_async  # type: ignore[method-assign]
    coordinator.async_set_updated_data = lambda *a, **k: None  # type: ignore[method-assign]
    return coordinator


async def _noop_async(*args, **kwargs) -> None:
    return None


def active_of(coordinator: Timer24HCoordinator, hour: int) -> list[int]:
    return sorted(
        slot["minute"]
        for slot in coordinator._time_slots
        if slot["hour"] == hour and slot["isActive"]
    )


# --- 1. 15-minute mode: taps are per quarter -------------------------------
coord = make_coordinator(15, set())
minutes, new_state = coord._toggle_target(9, 0)
check(
    "15 min: tapping :00 targets only :00",
    minutes == [0] and new_state is True,
    f"{minutes} -> {new_state}",
)

minutes, new_state = coord._toggle_target(9, 30)
check(
    "15 min: tapping :30 targets only :30",
    minutes == [30] and new_state is True,
    f"{minutes} -> {new_state}",
)

coord = make_coordinator(15, {(9, 0)})
minutes, new_state = coord._toggle_target(9, 0)
check(
    "15 min: tapping an active :00 turns just it off",
    minutes == [0] and new_state is False,
    f"{minutes} -> {new_state}",
)

coord = make_coordinator(15, {(9, 15), (9, 30), (9, 45)})
minutes, new_state = coord._toggle_target(9, 0)
check(
    "15 min: :00 does not fill the hour when other quarters are on",
    minutes == [0] and new_state is True,
    f"{minutes} -> {new_state}",
)

# --- 2. 30-minute mode keeps the half-hour pairing -------------------------
coord = make_coordinator(30, set())
minutes, new_state = coord._toggle_target(9, 0)
check(
    "30 min: outer ring toggles :00 and :15 together",
    minutes == [0, 15] and new_state is True,
    f"{minutes} -> {new_state}",
)

minutes, new_state = coord._toggle_target(9, 30)
check(
    "30 min: inner ring toggles :30 and :45 together",
    minutes == [30, 45] and new_state is True,
    f"{minutes} -> {new_state}",
)

# --- 3. whole-hour toggle --------------------------------------------------
coord = make_coordinator(15, {(21, 15)})
asyncio.run(coord.async_toggle_hour(21))
check(
    "toggle_hour fills every quarter of the hour",
    active_of(coord, 21) == [0, 15, 30, 45],
    str(active_of(coord, 21)),
)

asyncio.run(coord.async_toggle_hour(21))
check(
    "toggle_hour clears a full hour on the second call",
    active_of(coord, 21) == [],
    str(active_of(coord, 21)),
)

coord = make_coordinator(15, {(6, 0), (7, 30)})
asyncio.run(coord.async_toggle_hour(7))
check(
    "toggle_hour leaves other hours untouched",
    active_of(coord, 6) == [0] and active_of(coord, 7) == [0, 15, 30, 45],
    f"hour 6: {active_of(coord, 6)}, hour 7: {active_of(coord, 7)}",
)

failed = 0
for name, ok, detail in results:
    if not ok:
        failed += 1
    print(f"{'PASS' if ok else 'FAIL'}  {name}" + ("" if ok else f" — {detail}"))

print(f"\n{len(results) - failed}/{len(results)} checks passed")
sys.exit(0 if failed == 0 else 1)
