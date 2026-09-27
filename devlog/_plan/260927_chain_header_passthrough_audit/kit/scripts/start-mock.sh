#!/usr/bin/env bash
set -euo pipefail
W="$(cd "$(dirname "$0")/.." && pwd)"
[[ -f "$W/logs/.mock.pid" ]] && kill "$(cat "$W/logs/.mock.pid")" 2>/dev/null && sleep 0.5 || true
CAPTURE_DIR="$W/report/captures" MOCK_PORT="${MOCK_PORT:-10300}" nohup bun "$W/scripts/mock-upstream.ts" >> "$W/logs/mock.log" 2>&1 &
echo $! > "$W/logs/.mock.pid"
for i in $(seq 1 40); do curl -sf "http://127.0.0.1:${MOCK_PORT:-10300}/__ctl/health" >/dev/null && { echo mock up; exit 0; }; sleep 0.25; done; exit 1
