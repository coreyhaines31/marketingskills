#!/usr/bin/env python3
"""Banana Claude -- Brand/Style Presets

Manage reusable brand and style presets for consistent image generation.

Usage:
    presets.py list
    presets.py show NAME
    presets.py create NAME --colors "#hex,#hex" --style "..." [options]
    presets.py delete NAME --confirm
"""

import argparse
import json
import re
import sys
from pathlib import Path

PRESETS_DIR = Path.home() / ".banana" / "presets"


def _ensure_dir():
    """Ensure presets directory exists."""
    PRESETS_DIR.mkdir(parents=True, exist_ok=True)


def _sanitize_name(name):
    """Sanitize preset name to prevent path traversal."""
    # Strip path separators and keep only safe characters
    safe = re.sub(r'[^a-zA-Z0-9_\-]', '', name)
    if not safe:
        print("Error: Preset name must contain only letters, numbers, hyphens, and underscores.", file=sys.stderr)
        sys.exit(1)
    return safe


def _preset_path(name):
    """Get path for a preset file."""
    safe_name = _sanitize_name(name)
    return PRESETS_DIR / f"{safe_name}.json"


def _load_preset(name):
    """Load a preset by name."""
    path = _preset_path(name)
    if not path.exists():
        print(f"Error: Preset '{name}' not found.", file=sys.stderr)
        sys.exit(1)
    with open(path, "r") as f:
        return json.load(f)


def cmd_list(args):
    """List available presets."""
    _ensure_dir()
    presets = sorted(PRESETS_DIR.glob("*.json"))
    if not presets:
        print("No presets found. Create one with: presets.py create NAME --style \"...\"")
        return
    print(f"Available presets ({len(presets)}):\n")
    for p in presets:
        try:
            with open(p, "r") as f:
                data = json.load(f)
            desc = data.get("description", "No description")
            print(f"  {p.stem:20s} -- {desc}")
        except (json.JSONDecodeError, KeyError):
            print(f"  {p.stem:20s} -- (invalid preset file)")


def cmd_show(args):
    """Show full preset details."""
    preset = _load_preset(args.name)
    print(json.dumps(preset, indent=2))


def cmd_create(args):
    """Create a new preset."""
    _ensure_dir()
    path = _preset_path(args.name)
    if path.exists():
        print(f"Error: Preset '{args.name}' already exists. Use a different name.", file=sys.stderr)
        sys.exit(1)

    colors = [c.strip() for c in args.colors.split(",")] if args.colors else []

    preset = {
        "name": args.name,
        "description": args.description or f"Custom preset: {args.name}",
        "colors": colors,
        "style": args.style or "",
        "typography": args.typography or "",
        "lighting": args.lighting or "",
        "mood": args.mood or "",
        "default_ratio": args.ratio or "16:9",
        "default_resolution": args.resolution or "2K",
    }

    with open(path, "w") as f:
        json.dump(preset, f, indent=2)

    print(f"Preset '{args.name}' created at {path}")
    print(json.dumps(preset, indent=2))


def cmd_delete(args):
    """Delete a preset."""
    if not args.confirm:
        print("Error: Pass --confirm to delete the preset.", file=sys.stderr)
        sys.exit(1)
    path = _preset_path(args.name)
    if not path.exists():
        print(f"Error: Preset '{args.name}' not found.", file=sys.stderr)
        sys.exit(1)
    path.unlink()
    print(f"Preset '{args.name}' deleted.")


def main():
    parser = argparse.ArgumentParser(description="Banana Claude Brand/Style Presets")
    sub = parser.add_subparsers(dest="command", required=True)

    # list
    sub.add_parser("list", help="List available presets")

    # show
    p_show = sub.add_parser("show", help="Show preset details")
    p_show.add_argument("name", help="Preset name")

    # create
    p_create = sub.add_parser("create", help="Create a new preset")
    p_create.add_argument("name", help="Preset name (e.g., tech-saas, luxury-brand)")
    p_create.add_argument("--colors", default="", help="Comma-separated hex colors")
    p_create.add_argument("--style", default="", help="Visual style description")
    p_create.add_argument("--typography", default="", help="Typography description")
    p_create.add_argument("--lighting", default="", help="Lighting description")
    p_create.add_argument("--mood", default="", help="Mood/emotion description")
    p_create.add_argument("--description", default="", help="Brief preset description")
    p_create.add_argument("--ratio", default="16:9", help="Default aspect ratio")
    p_create.add_argument("--resolution", default="2K", help="Default resolution")
    p_create.add_argument("--force", action="store_true", help="Overwrite existing preset")

    # delete
    p_delete = sub.add_parser("delete", help="Delete a preset")
    p_delete.add_argument("name", help="Preset name")
    p_delete.add_argument("--confirm", action="store_true", help="Confirm deletion")

    args = parser.parse_args()
    cmds = {"list": cmd_list, "show": cmd_show, "create": cmd_create, "delete": cmd_delete}
    cmds[args.command](args)


if __name__ == "__main__":
    main()
