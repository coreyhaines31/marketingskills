#!/bin/bash
#
# Regression tests for validate-skills.sh false-negatives (issue #450 / PR #451).
#
# Guards two bugs where spec-violating skills used to PASS the validator:
#   1. a `name` with consecutive hyphens (e.g. page--cro)
#   2. a top-level `version:` with no `metadata:` block
#
# Each fixture lives in its own directory under tests/fixtures/invalid/:
#   <name>/SKILL.md.fixture   the intentionally-invalid skill (named .fixture so
#                             it is not treated as a real skill by the validator
#                             or the SKILL.md-triggered CI workflow)
#   <name>/expected-error.txt the error substring validate-skills.sh must emit
#
# For each fixture the runner builds a temp skills dir containing only that skill
# and points validate-skills.sh at it via the SKILLS_DIR override, then asserts a
# non-zero exit with the expected error.

set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FIXTURES="$ROOT/tests/fixtures/invalid"
fail=0
ran=0

echo "Running validate-skills.sh regression tests..."
echo ""

for fixture_dir in "$FIXTURES"/*/; do
    name="$(basename "$fixture_dir")"
    src="$fixture_dir/SKILL.md.fixture"
    expected_file="$fixture_dir/expected-error.txt"

    if [[ ! -f "$src" || ! -f "$expected_file" ]]; then
        echo "FAIL: '$name' — fixture is missing SKILL.md.fixture or expected-error.txt"
        fail=1
        continue
    fi
    expected="$(cat "$expected_file")"

    tmp="$(mktemp -d)"
    mkdir "$tmp/$name"
    cp "$src" "$tmp/$name/SKILL.md"

    out="$(cd "$ROOT" && SKILLS_DIR="$tmp" bash validate-skills.sh 2>&1)"
    code=$?
    rm -rf "$tmp"
    ((ran++))

    if [[ $code -eq 0 ]]; then
        echo "FAIL: '$name' — validator exited 0, expected non-zero"
        fail=1
        continue
    fi
    if ! grep -qF "$expected" <<<"$out"; then
        echo "FAIL: '$name' — missing expected error: $expected"
        echo "----- validator output -----"
        echo "$out"
        echo "----------------------------"
        fail=1
        continue
    fi
    echo "PASS: '$name' rejected (exit $code): $expected"
done

echo ""
if [[ $ran -eq 0 ]]; then
    echo "No fixtures found under $FIXTURES — nothing to test."
    exit 1
fi
if [[ $fail -eq 0 ]]; then
    echo "All $ran regression test(s) passed."
else
    echo "Regression tests FAILED."
fi
exit $fail
