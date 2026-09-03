#!/usr/bin/env python3
"""Build the Timer 24H Lovelace card into custom_components/timer_24h/dist/."""
import os
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def main() -> bool:
    print("Building Timer 24H Card...")
    print("-" * 50)

    npm_executable = "npm.cmd" if os.name == "nt" else "npm"

    try:
        result = subprocess.run(
            [npm_executable, "run", "build"],
            cwd=ROOT,
            check=True,
            capture_output=True,
            text=True,
        )
        print("Build successful!")
        if result.stdout:
            print(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Build failed: {e}")
        if e.stderr:
            print(e.stderr)
        return False

    dist_dir = ROOT / "custom_components" / "timer_24h" / "dist"
    print(f"Card files are in {dist_dir}")
    print("-" * 50)
    return True


if __name__ == "__main__":
    raise SystemExit(0 if main() else 1)
