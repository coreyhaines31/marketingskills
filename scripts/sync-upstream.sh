#!/usr/bin/env bash
# sync-upstream.sh
# Syncs skills and plugin config from the upstream marketingskills repo,
# then rebuilds the .plugin file. Safe to run repeatedly.
#
# Usage: bash scripts/sync-upstream.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
UPSTREAM_URL="https://github.com/coreyhaines31/marketingskills.git"
CACHE_DIR="${REPO_ROOT}/.upstream-cache"

echo "Syncing from upstream: ${UPSTREAM_URL}"

if [ -d "${CACHE_DIR}/.git" ]; then
  echo "Cache found — fetching latest..."
  git -C "${CACHE_DIR}" fetch origin main
  git -C "${CACHE_DIR}" reset --hard origin/main
else
  echo "No cache found — cloning (shallow)..."
  rm -rf "${CACHE_DIR}"
  git clone --depth 1 "${UPSTREAM_URL}" "${CACHE_DIR}"
fi

echo "Copying skills/..."
rsync -a --delete "${CACHE_DIR}/skills/" "${REPO_ROOT}/skills/"

echo "Copying .claude-plugin/..."
rsync -a --delete "${CACHE_DIR}/.claude-plugin/" "${REPO_ROOT}/.claude-plugin/"

echo "Copying supporting docs..."
for doc in AGENTS.md VERSIONS.md; do
  if [ -f "${CACHE_DIR}/${doc}" ]; then
    cp "${CACHE_DIR}/${doc}" "${REPO_ROOT}/${doc}"
  fi
done

echo "Rebuilding plugin..."
bash "${REPO_ROOT}/scripts/build-cowork-plugin.sh"

echo ""
echo "Sync complete."
