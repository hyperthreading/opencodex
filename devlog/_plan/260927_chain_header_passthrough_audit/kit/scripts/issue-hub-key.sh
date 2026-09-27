#!/usr/bin/env bash
# Issue the ocx_ client data key on the running hub via the real CLI path
# (`ocx access key create` → POST /api/keys) and persist it for later config swaps.
set -euo pipefail
W="$(cd "$(dirname "$0")/.." && pwd)"; REPO="${REPO:-$(cd "$W/../.." && pwd)}"
"$W/scripts/hermetic.sh" "$W/clients/cli-home" OPENCODEX_HOME="$W/hub" -- bun run "$REPO/src/cli/index.ts" access key create local-chain --json > "$W/hub/.key-create.json"
jq -r .key "$W/hub/.key-create.json" > "$W/hub/.client-key"; chmod 600 "$W/hub/.client-key" "$W/hub/.key-create.json"
jq '.apiKeys' "$W/hub/config.json" > "$W/hub/.apikeys.json"; chmod 600 "$W/hub/.apikeys.json"
echo "issued key id $(jq -r .id "$W/hub/.key-create.json") (prefix $(cut -c1-8 "$W/hub/.client-key")…)"
