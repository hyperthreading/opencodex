#!/usr/bin/env bash
# start-local.sh <config.json>   (substitutes __HUB_KEY__ from hub/.client-key)
set -euo pipefail
W="$(cd "$(dirname "$0")/.." && pwd)"; REPO="${REPO:-$(cd "$W/../.." && pwd)}"
mkdir -p "$W/local"
sed "s/__HUB_KEY__/$(cat "$W/hub/.client-key")/g" "$1" > "$W/local/config.json"; chmod 600 "$W/local/config.json"
"$W/scripts/hermetic.sh" "$W/local/home" OPENCODEX_HOME="$W/local" CODEX_HOME="$W/local/codex-home" OCX_DISABLE_UPDATE_CHECK=1 LAUNCH_MODE=redirect MOCK_URL="http://127.0.0.1:${MOCK_PORT:-10300}" -- \
  bun "$W/scripts/ocx-launcher.ts" "$REPO/src/cli/index.ts" start --port "${LOCAL_PORT:-10100}" >> "$W/logs/local.log" 2>&1 &
echo $! > "$W/local/.launcher.pid"
for i in $(seq 1 60); do curl -sf "http://127.0.0.1:${LOCAL_PORT:-10100}/healthz" >/dev/null && { echo local up; exit 0; }; sleep 0.5; done
echo "local failed"; tail -30 "$W/logs/local.log"; exit 1
