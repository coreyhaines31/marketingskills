#!/bin/bash

set -euo pipefail

# Validation script using official skills-ref library
# https://github.com/agentskills/agentskills/tree/main/skills-ref

SKILLS_DIR="skills"
TARGET_PATH="${1:-$SKILLS_DIR}"
SKILLS_REF_REPO="${SKILLS_REF_REPO:-https://github.com/agentskills/agentskills.git}"
SKILLS_REF_SHA="${SKILLS_REF_SHA:-}"
SKILLS_REF_WORKDIR=""
SKILLS_REF_BIN=""

cleanup() {
    if [ -n "$SKILLS_REF_WORKDIR" ] && [ -d "$SKILLS_REF_WORKDIR" ]; then
        rm -rf "$SKILLS_REF_WORKDIR"
    fi
}

trap cleanup EXIT

resolve_skill_paths() {
    shopt -s nullglob

    if [[ -f "$TARGET_PATH" && "$(basename "$TARGET_PATH")" == "SKILL.md" ]]; then
        SKILL_PATHS=("$(dirname "$TARGET_PATH")/")
    elif [[ -d "$TARGET_PATH" && -f "$TARGET_PATH/SKILL.md" ]]; then
        SKILL_PATHS=("${TARGET_PATH%/}/")
    elif [[ -d "$TARGET_PATH" ]]; then
        SKILL_PATHS=("${TARGET_PATH%/}"/*/)
    else
        echo "❌ Invalid path: $TARGET_PATH"
        exit 1
    fi

    if [ "${#SKILL_PATHS[@]}" -eq 0 ]; then
        echo "❌ No skills found at: $TARGET_PATH"
        exit 1
    fi
}

bootstrap_skills_ref() {
    if command -v skills-ref >/dev/null 2>&1; then
        SKILLS_REF_BIN="$(command -v skills-ref)"
        return
    fi

    if [[ -z "$SKILLS_REF_SHA" ]]; then
        echo "❌ skills-ref is not installed."
        echo "   Set SKILLS_REF_SHA to an immutable commit SHA to bootstrap a pinned copy."
        echo "   Example: SKILLS_REF_SHA=<full-commit-sha> ./validate-skills-official.sh"
        exit 1
    fi

    if [[ ! "$SKILLS_REF_SHA" =~ ^[0-9a-fA-F]{7,40}$ ]]; then
        echo "❌ SKILLS_REF_SHA must be an immutable git commit SHA."
        exit 1
    fi

    SKILLS_REF_WORKDIR="$(mktemp -d "${TMPDIR:-/tmp}/marketingskills-skills-ref.XXXXXX")"
    local repo_dir="$SKILLS_REF_WORKDIR/repo"
    local sdk_dir="$repo_dir/skills-ref"

    echo "📦 Installing pinned skills-ref library at $SKILLS_REF_SHA..."
    echo ""

    git clone --filter=blob:none --no-checkout "$SKILLS_REF_REPO" "$repo_dir"
    git -C "$repo_dir" fetch --depth 1 origin "$SKILLS_REF_SHA"
    git -C "$repo_dir" checkout --detach "$SKILLS_REF_SHA"

    if command -v uv &> /dev/null; then
        echo "Using uv to install..."
        (cd "$sdk_dir" && uv sync)
    else
        echo "Using pip to install..."
        (
            cd "$sdk_dir"
            python3 -m venv .venv
            source .venv/bin/activate
            pip install -e .
        )
    fi
    echo ""

    SKILLS_REF_BIN="$sdk_dir/.venv/bin/skills-ref"
}

echo "🔍 Validating Skills Using Official skills-ref Library"
echo "========================================================"
echo "Reference: https://github.com/agentskills/agentskills"
echo ""

resolve_skill_paths
bootstrap_skills_ref

# Track results
PASSED=0
FAILED=0
FAILED_SKILLS=()

echo "Running validation..."
echo ""

# Validate each skill
for skill_dir in "${SKILL_PATHS[@]}"; do
    skill_name=$(basename "$skill_dir")
    printf "  %-30s" "$skill_name"

    if output=$("$SKILLS_REF_BIN" validate "$skill_dir" 2>&1); then
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
