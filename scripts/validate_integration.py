#!/usr/bin/env python3
"""Local pre-push checks mirroring hassfest/HACS integration validation."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "timer_24h"
MANIFEST_PATH = INTEGRATION / "manifest.json"
INIT_PATH = INTEGRATION / "__init__.py"
SERVICES_YAML = INTEGRATION / "services.yaml"
VERSION_PATH = ROOT / "VERSION"

errors: list[str] = []
warnings: list[str] = []


def fail(msg: str) -> None:
    errors.append(msg)


def warn(msg: str) -> None:
    warnings.append(msg)


def check_manifest() -> dict:
    if not MANIFEST_PATH.exists():
        fail(f"Missing manifest: {MANIFEST_PATH}")
        return {}

    data = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    keys = list(data.keys())

    if keys[:2] != ["domain", "name"]:
        fail(
            "Manifest keys must start with 'domain', 'name'. "
            f"Got: {keys[:2]}"
        )

    rest = keys[2:]
    if rest != sorted(rest):
        fail(
            "Manifest keys after domain/name must be alphabetical. "
            f"Got: {rest} Expected: {sorted(rest)}"
        )

    forbidden = {"icon"}
    bad = forbidden.intersection(data)
    if bad:
        fail(f"Manifest has forbidden keys: {sorted(bad)}")

    init_text = INIT_PATH.read_text(encoding="utf-8") if INIT_PATH.exists() else ""
    deps = set(data.get("dependencies", []) or [])
    after = set(data.get("after_dependencies", []) or [])
    declared = deps | after

    if "hass.http" in init_text or "StaticPathConfig" in init_text:
        if "http" not in declared:
            fail("Uses http but 'http' not in dependencies/after_dependencies")

    if "lovelace" in init_text or "init_lovelace_resource" in init_text:
        if "lovelace" not in declared:
            fail("Uses lovelace but 'lovelace' not in dependencies/after_dependencies")

    return data


def check_services(init_text: str) -> None:
    registered = set(re.findall(r'SERVICE_([A-Z0-9_]+)', init_text))
    # Also catch string literals in async_register second arg via const usage
    has_register = "services.async_register" in init_text
    if not has_register:
        return

    if not SERVICES_YAML.exists():
        fail("Registers services but services.yaml is missing")
        return

    yaml_text = SERVICES_YAML.read_text(encoding="utf-8")
    # Map SERVICE_TOGGLE_SLOT -> toggle_slot from const.py
    const_text = (INTEGRATION / "const.py").read_text(encoding="utf-8")
    service_names = re.findall(
        r'SERVICE_([A-Z0-9_]+):\s*Final\s*=\s*"([^"]+)"', const_text
    )
    for const_name, service_name in service_names:
        if f"SERVICE_{const_name}" in init_text and not re.search(
            rf"^{re.escape(service_name)}\s*:", yaml_text, re.M
        ):
            fail(f"Service '{service_name}' registered but missing in services.yaml")


def check_config_schema(init_text: str) -> None:
    has_setup = bool(re.search(r"^async def async_setup\b|^def setup\b", init_text, re.M))
    if has_setup and "CONFIG_SCHEMA" not in init_text:
        fail(
            "Has async_setup/setup but no CONFIG_SCHEMA "
            "(use cv.config_entry_only_config_schema(DOMAIN))"
        )


def check_versions(manifest: dict) -> None:
    if not VERSION_PATH.exists():
        fail("Missing VERSION file")
        return
    version_file = VERSION_PATH.read_text(encoding="utf-8").strip()
    version_manifest = str(manifest.get("version", "")).strip()
    if version_file != version_manifest:
        fail(
            f"Version mismatch: VERSION={version_file!r} "
            f"manifest={version_manifest!r}"
        )


def check_dist() -> None:
    dist = INTEGRATION / "dist"
    for name in ("timer-24h-card.js", "timer-24h-card-editor.js"):
        path = dist / name
        if not path.exists():
            fail(f"Missing required HACS artifact: {path.relative_to(ROOT)}")


def main() -> int:
    init_text = INIT_PATH.read_text(encoding="utf-8") if INIT_PATH.exists() else ""
    manifest = check_manifest()
    check_services(init_text)
    check_config_schema(init_text)
    if manifest:
        check_versions(manifest)
    check_dist()

    for w in warnings:
        print(f"WARNING: {w}")
    for e in errors:
        print(f"ERROR: {e}")

    if errors:
        print(f"\nvalidate_integration: FAILED ({len(errors)} error(s))")
        return 1

    print("validate_integration: OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
