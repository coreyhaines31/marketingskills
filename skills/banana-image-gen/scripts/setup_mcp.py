#!/usr/bin/env python3
"""
Setup script for Banana Claude MCP server in Claude Code.

Configures @ycse/nanobanana-mcp in Claude Code's settings.json
with the user's Google AI API key.

Usage:
    python3 setup_mcp.py                    # Interactive (prompts for key)
    python3 setup_mcp.py --key YOUR_KEY     # Non-interactive
    python3 setup_mcp.py --check            # Verify existing setup
    python3 setup_mcp.py --remove           # Remove MCP config
    python3 setup_mcp.py --help             # Show usage
"""

import json
import sys
import os
from pathlib import Path

SETTINGS_PATH = Path.home() / ".claude" / "settings.json"
MCP_NAME = "nanobanana-mcp"
MCP_PACKAGE = "@ycse/nanobanana-mcp"
DEFAULT_MODEL = "gemini-3.1-flash-image-preview"


def load_settings() -> dict:
    """Load Claude Code settings.json."""
    if not SETTINGS_PATH.exists():
        return {}
    with open(SETTINGS_PATH, "r") as f:
        return json.load(f)


def save_settings(settings: dict) -> None:
    """Save Claude Code settings.json."""
    SETTINGS_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(SETTINGS_PATH, "w") as f:
        json.dump(settings, f, indent=2)
    print(f"Settings saved to {SETTINGS_PATH}")


def check_setup() -> bool:
    """Check if MCP is already configured."""
    settings = load_settings()
    servers = settings.get("mcpServers", {})
    if MCP_NAME in servers:
        env = servers[MCP_NAME].get("env", {})
        key = env.get("GOOGLE_AI_API_KEY", "")
        masked = key[:8] + "..." + key[-4:] if len(key) > 12 else "(not set)"
        print(f"MCP server '{MCP_NAME}' is configured.")
        print(f"  Package: {MCP_PACKAGE}")
        print(f"  API Key: {masked}")
        print(f"  Model:   {env.get('NANOBANANA_MODEL', DEFAULT_MODEL)}")
        return True
    print(f"MCP server '{MCP_NAME}' is NOT configured.")
    return False


def remove_mcp() -> None:
    """Remove MCP configuration."""
    settings = load_settings()
    servers = settings.get("mcpServers", {})
    if MCP_NAME in servers:
        del servers[MCP_NAME]
        settings["mcpServers"] = servers
        save_settings(settings)
        print(f"Removed '{MCP_NAME}' from Claude Code settings.")
    else:
        print(f"'{MCP_NAME}' not found in settings.")


def setup_mcp(api_key: str) -> None:
    """Configure MCP server in Claude Code settings."""
    if not api_key or not api_key.strip():
        print("Error: API key cannot be empty.")
        sys.exit(1)

    api_key = api_key.strip()
    settings = load_settings()

    if "mcpServers" not in settings:
        settings["mcpServers"] = {}

    settings["mcpServers"][MCP_NAME] = {
        "command": "npx",
        "args": ["-y", MCP_PACKAGE],
        "env": {
            "GOOGLE_AI_API_KEY": api_key,
            "NANOBANANA_MODEL": DEFAULT_MODEL,
        },
    }

    save_settings(settings)
    print(f"\nMCP server '{MCP_NAME}' configured successfully!")
    print(f"  Package: {MCP_PACKAGE}")
    print(f"  Model:   {DEFAULT_MODEL}")
    print(f"\nRestart Claude Code for changes to take effect.")
    print(f"Generated images will be saved to: ~/Documents/nanobanana_generated/")


def main() -> None:
    args = sys.argv[1:]

    if "--help" in args or "-h" in args:
        print("Usage: python3 setup_mcp.py [OPTIONS]")
        print()
        print("Options:")
        print("  --key KEY        Provide API key non-interactively")
        print("  --check          Verify existing setup")
        print("  --remove         Remove MCP configuration")
        print("  --help, -h       Show this help message")
        print()
        print("Get a free API key at: https://aistudio.google.com/apikey")
        sys.exit(0)

    if "--check" in args:
        check_setup()
        return

    if "--remove" in args:
        remove_mcp()
        return

    # Get API key
    api_key = None
    for i, arg in enumerate(args):
        if arg == "--key" and i + 1 < len(args):
            api_key = args[i + 1]
            break

    if not api_key:
        # Check environment
        api_key = os.environ.get("GOOGLE_AI_API_KEY")

    if not api_key:
        print("Banana Claude -- MCP Setup")
        print("=" * 40)
        print(f"\nGet your free API key at: https://aistudio.google.com/apikey")
        print()
        try:
            api_key = input("Enter your Google AI API key: ")
        except (EOFError, KeyboardInterrupt):
            print("\nError: No input received. Provide a key with --key or set GOOGLE_AI_API_KEY env var.")
            sys.exit(1)

    setup_mcp(api_key)


if __name__ == "__main__":
    main()
