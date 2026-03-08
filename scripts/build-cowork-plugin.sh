#!/usr/bin/env bash
# build-cowork-plugin.sh
# Builds marketing-skills.plugin (a zip archive) for upload to Claude Cowork.
# Output: <repo-root>/marketing-skills.plugin
#
# Requires: zip (macOS/Linux) or PowerShell (Windows fallback)

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLUGIN_NAME="marketing-skills.plugin"
OUTPUT="${REPO_ROOT}/${PLUGIN_NAME}"

cd "${REPO_ROOT}"

echo "Building Cowork plugin..."

# Files/dirs to include in the archive
INCLUDE_ITEMS=(
  ".claude-plugin"
  "skills"
  "README.md"
  "LICENSE"
  "AGENTS.md"
)

# Add VERSIONS.md if it exists
[ -f "VERSIONS.md" ] && INCLUDE_ITEMS+=("VERSIONS.md")

if command -v zip &>/dev/null; then
  # ---- zip (macOS / Linux) ----
  TMP_FILE="/tmp/${PLUGIN_NAME}"
  rm -f "${TMP_FILE}"

  zip -r "${TMP_FILE}" "${INCLUDE_ITEMS[@]}" \
    --exclude "*.git*" \
    --exclude "*/.DS_Store" \
    --exclude "*/node_modules/*"

  # cp instead of mv to handle cross-device moves (e.g. Docker volumes)
  cp "${TMP_FILE}" "${OUTPUT}"
  rm -f "${TMP_FILE}"

elif command -v powershell &>/dev/null || command -v pwsh &>/dev/null; then
  # ---- PowerShell (Windows fallback) ----
  PS_CMD="powershell"
  command -v pwsh &>/dev/null && PS_CMD="pwsh"

  # Build a temp staging directory then compress
  STAGING="$(mktemp -d)"
  for item in "${INCLUDE_ITEMS[@]}"; do
    if [ -d "${item}" ]; then
      cp -r "${item}" "${STAGING}/${item}"
    elif [ -f "${item}" ]; then
      cp "${item}" "${STAGING}/${item}"
    fi
  done

  # Convert paths for PowerShell
  STAGING_WIN="$(cygpath -w "${STAGING}" 2>/dev/null || echo "${STAGING}")"
  OUTPUT_WIN="$(cygpath -w "${OUTPUT}" 2>/dev/null || echo "${OUTPUT}")"

  # PowerShell only accepts .zip extension; compress then rename
  TMP_ZIP="${OUTPUT%.plugin}.zip"
  TMP_ZIP_WIN="$(cygpath -w "${TMP_ZIP}" 2>/dev/null || echo "${TMP_ZIP}")"

  rm -f "${OUTPUT}" "${TMP_ZIP}"
  ${PS_CMD} -NoProfile -Command \
    "Compress-Archive -Path '${STAGING_WIN}\\*' -DestinationPath '${TMP_ZIP_WIN}' -Force"

  mv "${TMP_ZIP}" "${OUTPUT}"
  rm -rf "${STAGING}"

else
  echo "Error: neither 'zip' nor PowerShell found. Install zip and retry." >&2
  exit 1
fi

echo "Built: ${OUTPUT}"
echo ""
echo "Verify contents with:"
echo "  unzip -l ${PLUGIN_NAME}"
