#!/bin/bash
#
# Regression test for validate-skills-official.sh: a skill that skills-ref
# rejects must be reported as failed, and the script must exit non-zero.
#
# skills-ref prints "Validation failed for <path>:" when a skill is invalid,
# and "Valid skill: <path>" when it is valid. The script used to grep the output
# for "valid" case-insensitively, which also matches "Validation failed", so
# every skill passed.
#
# The test runs a copy of the script against a temp skills/ dir with one valid
# and one invalid skill. A stub skills-ref, placed where the script looks for
# its venv, mirrors the real CLI's messages and exit codes, so no network or
# Python install is needed.

set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

work="$tmp/repo"
mkdir -p "$work/skills/good-skill" "$work/skills/bad-skill"
cp "$ROOT/validate-skills-official.sh" "$work/"
printf -- '---\nname: good-skill\ndescription: A valid skill.\n---\n# Good\n' > "$work/skills/good-skill/SKILL.md"
printf -- '---\nname: wrong-name\ndescription: Name does not match the directory.\n---\n# Bad\n' > "$work/skills/bad-skill/SKILL.md"

# Stub skills-ref, activated through the venv the script checks for.
venv="$tmp/agentskills/skills-ref/.venv"
mkdir -p "$venv/bin"
cat > "$venv/bin/skills-ref" <<'STUB'
#!/bin/bash
# Mirrors `skills-ref validate <dir>`: name must match the directory name.
dir="${2%/}"
name="$(grep -m1 '^name:' "$dir/SKILL.md" | sed 's/^name:[[:space:]]*//')"
if [[ "$name" == "$(basename "$dir")" ]]; then
    echo "Valid skill: $dir"
else
    echo "Validation failed for $dir:" >&2
    echo "  - Directory name '$(basename "$dir")' must match skill name '$name'" >&2
    exit 1
fi
STUB
chmod +x "$venv/bin/skills-ref"
printf 'export PATH="%s:$PATH"\n' "$venv/bin" > "$venv/bin/activate"

out="$(TMPDIR="$tmp" bash "$work/validate-skills-official.sh" 2>&1)"
code=$?

fail=0
check() {
    if eval "$1"; then
        echo "PASS: $2"
    else
        echo "FAIL: $2"
        fail=1
    fi
}

check '[[ $code -ne 0 ]]' "exits non-zero when a skill is invalid (exit $code)"
check 'grep -qE "bad-skill +✗" <<<"$out"' "invalid skill is marked ✗"
check 'grep -qE "good-skill +✓" <<<"$out"' "valid skill is marked ✓"
check 'grep -qF "Failed: 1" <<<"$out"' "summary counts one failure"

if [[ $fail -ne 0 ]]; then
    echo "----- validator output -----"
    echo "$out"
    echo "----------------------------"
    echo "Regression test FAILED."
fi
exit $fail
