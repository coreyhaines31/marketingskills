#!/bin/bash

# Validation script using official skills-ref library
# https://github.com/agentskills/agentskills/tree/main/skills-ref
#
# Works on Unix (bash/zsh) and on Windows under Git Bash, where venvs use
# .venv/Scripts instead of .venv/bin and `python3` is often not on PATH.

SKILLS_DIR="skills"
SKILLS_REF_DIR="${TMPDIR:-/tmp}/agentskills/skills-ref"

echo "🔍 Validating Skills Using Official skills-ref Library"
echo "========================================================"
echo "Reference: https://github.com/agentskills/agentskills"
echo ""

# Find a usable Python interpreter. On Windows, `python`/`python3` are often
# non-functional Microsoft Store alias stubs even when `command -v` finds
# them, so actually probe each candidate instead of trusting PATH lookup.
PYTHON=""
for candidate in python3 python "py -3"; do
    if $candidate --version &> /dev/null; then
        PYTHON="$candidate"
        break
    fi
done

# Locate a venv's activate script regardless of platform layout
find_activate() {
    local venv_dir="$1"
    if [ -f "$venv_dir/bin/activate" ]; then
        echo "$venv_dir/bin/activate"
    elif [ -f "$venv_dir/Scripts/activate" ]; then
        echo "$venv_dir/Scripts/activate"
    fi
}

INSTALL_FAILED=0

# Check if skills-ref is already installed
ACTIVATE_SCRIPT=$(find_activate "$SKILLS_REF_DIR/.venv")
if [ -z "$ACTIVATE_SCRIPT" ]; then
    echo "📦 Installing skills-ref library..."
    echo ""

    if [ ! -d "$SKILLS_REF_DIR" ]; then
        git clone https://github.com/agentskills/agentskills.git "$(dirname "$SKILLS_REF_DIR")"
    fi

    (
        cd "$SKILLS_REF_DIR" || exit 1

        if command -v uv &> /dev/null; then
            echo "Using uv to install..."
            uv sync
        elif [ -n "$PYTHON" ]; then
            echo "Using pip to install..."
            $PYTHON -m venv .venv
            activate=$(find_activate "$(pwd)/.venv")
            if [ -n "$activate" ]; then
                source "$activate"
                pip install -e .
            else
                echo "⚠️  Could not create a venv; falling back to a user-site install." >&2
                $PYTHON -m pip install --user -e .
            fi
        else
            echo "❌ No Python interpreter (python3/python/py) found on PATH." >&2
            exit 1
        fi
    ) || INSTALL_FAILED=1
    echo ""
fi

if [ "$INSTALL_FAILED" -eq 1 ]; then
    echo "❌ Failed to install skills-ref. See errors above."
    exit 1
fi

# Activate the virtual environment if one exists; otherwise rely on a
# user-site install already being on PATH (see fallback above).
ACTIVATE_SCRIPT=$(find_activate "$SKILLS_REF_DIR/.venv")
if [ -n "$ACTIVATE_SCRIPT" ]; then
    source "$ACTIVATE_SCRIPT"
fi

if ! command -v skills-ref &> /dev/null; then
    # User-site installs on Windows put console scripts in the Python
    # install's Scripts/ dir, which pip doesn't always add to PATH.
    if [ -n "$PYTHON" ]; then
        USER_BASE=$($PYTHON -m site --user-base 2>/dev/null)
        if [ -n "$USER_BASE" ]; then
            export PATH="$USER_BASE/Scripts:$USER_BASE/bin:$PATH"
        fi
    fi
fi

if ! command -v skills-ref &> /dev/null; then
    echo "❌ skills-ref command not found after install. Try adding your Python Scripts/bin directory to PATH." >&2
    exit 1
fi

# Return to the original directory
cd "$(dirname "$0")"

# Track results
PASSED=0
FAILED=0
FAILED_SKILLS=()

echo "Running validation..."
echo ""

# Validate each skill
for skill_dir in "$SKILLS_DIR"/*/; do
    skill_name=$(basename "$skill_dir")
    printf "  %-30s" "$skill_name"

    output=$(skills-ref validate "$skill_dir" 2>&1)
    if echo "$output" | grep -qi "valid"; then
        echo "✓"
        ((PASSED++))
    else
        echo "✗"
        ((FAILED++))
        FAILED_SKILLS+=("$skill_name")
        echo "$output" | sed 's/^/    /'
    fi
done

echo ""
echo "========================================================"
echo "Summary:"
echo "  ✓ Passed: $PASSED"
echo "  ✗ Failed: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "✅ All skills are valid!"
    exit 0
else
    echo "❌ Failed skills:"
    for skill in "${FAILED_SKILLS[@]}"; do
        echo "  - $skill"
    done
    exit 1
fi
