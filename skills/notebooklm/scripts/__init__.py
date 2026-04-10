#!/usr/bin/env python3
"""
NotebookLM Skill Scripts Package
Provides automatic environment management for all scripts
"""

import os
import sys
import subprocess
from pathlib import Path


def ensure_venv_and_run():
    """
    Ensure virtual environment exists and run the requested script.
    This is called when any script is imported or run directly.
    """
    # Only do this if we're not already in the skill's venv
    skill_dir = Path(__file__).parent.parent
    venv_dir = skill_dir / ".venv"

    # Check if we're in a venv
    in_venv = hasattr(sys, 'real_prefix') or (
        hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix
    )

    # Check if it's OUR venv
    if in_venv:
        venv_path = Path(sys.prefix)
        if venv_path == venv_dir:
            # We're already in the correct venv
            return

    # We need to set up or switch to our venv
    if not venv_dir.exists():
        print("🔧 First-time setup detected...")
        print("   Creating isolated environment for NotebookLM skill...")
        print("   This ensures clean dependency management...")

        # Create venv
        import venv
        venv.create(venv_dir, with_pip=True)

        # Install requirements
        requirements_file = skill_dir / "requirements.txt"
        if requirements_file.exists():
            if os.name == 'nt':  # Windows
                pip_exe = venv_dir / "Scripts" / "pip.exe"
            else:
                pip_exe = venv_dir / "bin" / "pip"

            print("   Installing dependencies in isolated environment...")
            subprocess.run(
                [str(pip_exe), "install", "-q", "-r", str(requirements_file)],
                check=True
            )

            # Also install patchright's chromium
            print("   Setting up browser automation...")
            if os.name == 'nt':
                python_exe = venv_dir / "Scripts" / "python.exe"
            else:
                python_exe = venv_dir / "bin" / "python"

            subprocess.run(
                [str(python_exe), "-m", "patchright", "install", "chromium"],
                check=True,
                capture_output=True
            )

        print("✅ Environment ready! All dependencies isolated in .venv/")

    # If we're here and not in the venv, we should recommend using the venv
    if not in_venv:
        print("\n⚠️  Running outside virtual environment")
        print("   Recommended: Use scripts/run.py to ensure clean execution")
        print("   Or activate: source .venv/bin/activate")


# Check environment when module is imported
ensure_venv_and_run()