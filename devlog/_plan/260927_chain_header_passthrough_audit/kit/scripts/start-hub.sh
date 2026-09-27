#!/usr/bin/env bash
# start-hub.sh <config.json> [redirect|tee]   (tee: record then forward to the real host; see ocx-launcher.ts)
set -euo pipefail
W="$(cd "$(dirname "$0")/.." && pwd)"; REPO="${REPO:-$(cd "$W/../.." && pwd)}"
cfg="$1"; mode="${2:-redirect}"
# Keep issued client keys (config.apiKeys) across config swaps.
if [[ -f "$W/hub/.apikeys.json" ]]; then jq --slurpfile k "$W/hub/.apikeys.json" '.apiKeys = $k[0]' "$cfg" > "$W/hub/config.json"; else cp "$cfg" "$W/hub/config.json"; fi
chmod 600 "$W/hub/config.json"
"$W/scripts/hermetic.sh" "$W/hub/home" OPENCODEX_HOME="$W/hub" CODEX_HOME="$W/hub/codex-home" OCX_DISABLE_UPDATE_CHECK=1 OPENCODEX_API_AUTH_TOKEN="$(cat "$W/hub/.service-token")" \
  LAUNCH_MODE="$mode" MOCK_URL="http://127.0.0.1:${MOCK_PORT:-10300}" \
  TEE_CAPTURE_DIR="$W/report/captures" TEE_RUN_FILE="$W/report/captures/.current-run" TEE_REDACT="${TEE_REDACT:-1}" ${TEE_HOSTS:+TEE_HOSTS="$TEE_HOSTS"} -- \
  bun "$W/scripts/ocx-launcher.ts" "$REPO/src/cli/index.ts" start --port "${HUB_PORT:-10200}" >> "$W/logs/hub.log" 2>&1 &
echo $! > "$W/hub/.launcher.pid"
for i in $(seq 1 60); do curl -sf "http://${HUB_IP:-192.0.2.2}:${HUB_PORT:-10200}/healthz" >/dev/null && { echo hub up; exit 0; }; sleep 0.5; done
echo "hub failed to start"; tail -30 "$W/logs/hub.log"; exit 1
