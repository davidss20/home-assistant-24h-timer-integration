#!/usr/bin/env python3
"""
Build and install Timer 24H Card
"""
import subprocess
import shutil
import os
from pathlib import Path

def main():
    print("🔨 Building Timer 24H Card...")
    print("-" * 50)

    # On Windows, "npm" is typically a .cmd shim which CreateProcess can't execute directly
    # when shell=False. Use npm.cmd explicitly.
    npm_executable = "npm.cmd" if os.name == "nt" else "npm"
    
    # Step 1: Run npm build
    print("\n📦 Step 1: Running npm build...")
    try:
        result = subprocess.run(
            [npm_executable, "run", "build"],
            check=True,
            capture_output=True,
            text=True
        )
        print("✅ Build successful!")
        if result.stdout:
            print(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"❌ Build failed: {e}")
        if e.stderr:
            print(e.stderr)
        return False
    
    # Step 2: Copy files
    print("\n📋 Step 2: Copying files...")
    files_to_copy = [
        "timer-24h-card.js",
        "timer-24h-card-editor.js"
    ]
    
    dest_dir = Path("custom_components/timer_24h/dist")
    dest_dir.mkdir(parents=True, exist_ok=True)
    
    for filename in files_to_copy:
        src = Path(filename)
        dest = dest_dir / filename
        
        if src.exists():
            try:
                shutil.copy2(src, dest)
                print(f"✅ Copied: {filename}")
            except Exception as e:
                print(f"❌ Failed to copy {filename}: {e}")
                return False
        else:
            print(f"⚠️  Warning: {filename} not found")
    
    print("\n✨ Done! Files are ready in custom_components/timer_24h/dist/")
    print("\n📌 Next steps:")
    print("1. Copy the 'custom_components/timer_24h' folder to your Home Assistant")
    print("2. Restart Home Assistant")
    print("3. Clear browser cache (Ctrl+F5)")
    print("-" * 50)
    return True

if __name__ == "__main__":
    main()

