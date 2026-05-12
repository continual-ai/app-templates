#!/usr/bin/env bash
# Simulate the create-site skill's scaffold flow against a temporary site dir,
# using the local $HOME/site-templates checkout as a stand-in for the sandbox's
# /opt/site-templates. Exits non-zero if any step fails.
#
# Usage: bash scripts/simulate-scaffold.sh
set -euo pipefail

TEMPLATES_ROOT="${TEMPLATES_ROOT:-$HOME/site-templates}"
SITE_DIR="$(mktemp -d -t continual-site-scaffold-XXXXXX)"
trap 'rm -rf "$SITE_DIR"' EXIT

echo "▸ Templates root: $TEMPLATES_ROOT"
echo "▸ Simulated site: $SITE_DIR"
echo

# Step 1: cp template (mirrors the skill's `cp -a /opt/...` step).
echo "▸ [1/6] cp -a template → site"
cp -a "$TEMPLATES_ROOT/templates/astro-default/." "$SITE_DIR/"

# Step 2: rewrite workspace:* → link:<absolute path>. Replicates the sed step
# in SKILL.md, parameterized so the simulation can run anywhere.
echo "▸ [2/6] rewrite workspace:* → link:$TEMPLATES_ROOT/packages/sites-sdk"
# Use a delimiter sed doesn't choke on for paths with slashes.
sed -i.bak \
  "s|\"@continual/sites-sdk\": \"workspace:\\*\"|\"@continual/sites-sdk\": \"link:$TEMPLATES_ROOT/packages/sites-sdk\"|" \
  "$SITE_DIR/package.json"
rm "$SITE_DIR/package.json.bak"
grep '"@continual/sites-sdk"' "$SITE_DIR/package.json" \
  || { echo "ERROR: rewrite produced no SDK dep line"; exit 1; }

# Step 3: install. With link:, pnpm symlinks the SDK source and hoists tsx
# into .bin.
echo "▸ [3/6] pnpm install"
(cd "$SITE_DIR" && pnpm install --frozen-lockfile=false 2>&1 | tail -3)

# Step 4: verify SDK symlink + tsx bin.
echo "▸ [4/6] verify symlinks"
SDK_LINK="$SITE_DIR/node_modules/@continual/sites-sdk"
[ -L "$SDK_LINK" ] || { echo "ERROR: SDK is not a symlink"; ls -la "$SDK_LINK"; exit 1; }
TARGET=$(readlink "$SDK_LINK")
echo "  SDK → $TARGET"
[ -x "$SITE_DIR/node_modules/.bin/tsx" ] || { echo "ERROR: tsx not in .bin"; exit 1; }
echo "  tsx → $(readlink "$SITE_DIR/node_modules/.bin/tsx" 2>/dev/null || echo "(file)")"

# Step 5: invoke call.ts with an obviously-bad token. The script should reach
# the fetch, fail at the network layer, and exit non-zero. That proves the
# script is reachable, parses argv, parses env, and imports the SDK.
echo "▸ [5/6] invoke call.ts (expecting graceful failure)"
set +e
output=$(cd "$SITE_DIR" && \
  CONTINUAL_PREVIEW_TOKEN=fake.jwt \
  CONTINUAL_APP_ORIGIN=https://app.continual.ai \
  pnpm exec tsx node_modules/@continual/sites-sdk/scripts/call.ts \
    system-tools platform_api '{"command":"threads list"}' 2>&1)
exit_code=$?
set -e
echo "$output" | sed 's/^/  /'
if [ "$exit_code" -eq 0 ]; then
  echo "ERROR: call.ts unexpectedly succeeded against a fake token"
  exit 1
fi
echo "  exit code: $exit_code (expected non-zero)"

# Step 6: build the site to confirm the SDK imports tree-shake and bundle.
echo "▸ [6/6] pnpm build"
(cd "$SITE_DIR" && pnpm build 2>&1 | tail -3)

echo
echo "✓ Scaffold simulation passed"
