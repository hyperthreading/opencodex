#!/usr/bin/env bash
# Stage 2: the same (b)/(c) topology against the REAL upstreams with real OAuth,
# the hub launcher in TEE mode (record → forward unchanged), credentials redacted
# in every capture.
#
#   REPO=<opencodex checkout at the pinned SHA> HUB_IP=<non-loopback ip> \
#   CODEX_AUTH_JSON=<client's real ~/.codex/auth.json> ./stage2.sh [phase ...]
#
# phases (default: all): openai-pool openai-direct anthropic anthropic-native
#
# Prerequisites (one-time, see HANDOFF.md §3):
#   - hub home $W/hub has real credentials: `ocx login codex` (pool) and/or
#     $W/hub/codex-home/auth.json (main, for direct), `ocx login anthropic`.
#   - hub/.client-key exists (issued by this script on first run).
#
# STAGE2_REHEARSAL=1 runs the identical flow offline against the mock with synthetic
# credentials (redirect mode) — use it to check the wiring before spending real quota.
set -uo pipefail
SCRIPTS="$(cd "$(dirname "$0")" && pwd)"
export W="${W:-$(cd "$SCRIPTS/.." && pwd)}"
source "$SCRIPTS/lib.sh"
PINNED_SHA=93f4231e4b9314f746902b336e7a77762643eaf1
MODEL_OAI="${MODEL_OAI:-gpt-5.5}"
MODEL_ANT="${MODEL_ANT:-claude-sonnet-4-6}"
REHEARSAL="${STAGE2_REHEARSAL:-0}"
PHASES=("$@"); [[ ${#PHASES[@]} -eq 0 ]] && PHASES=(openai-pool openai-direct anthropic anthropic-native)
PFX="s2"; [[ "$REHEARSAL" == 1 ]] && PFX="s2r"

head_sha="$(git -C "$REPO" rev-parse HEAD)"
[[ "$head_sha" == "$PINNED_SHA" ]] || { echo "opencodex HEAD $head_sha != pinned $PINNED_SHA"; exit 1; }
[[ "$HUB_IP" == 127.* ]] && { echo "HUB_IP must be non-loopback"; exit 1; }
log "stage2 rehearsal=$REHEARSAL phases=${PHASES[*]} codex=$(codex --version 2>/dev/null) claude=$(claude --version 2>/dev/null) bun=$(bun --version)"

cleanup() {
  stop_local; stop_hub
  for f in "$W/logs/.tee-ingress.pid" "$W/logs/.tee-mid.pid" "$W/logs/.mock.pid"; do [[ -f "$f" ]] && kill "$(cat "$f")" 2>/dev/null; rm -f "$f"; done
}
trap cleanup EXIT

mkdir -p "$W/hub/codex-home" "$W/local/codex-home" "$CAP"
start_tee() {
  CAPTURE_DIR="$CAP" TEE_REDACT=1 TEE_SUFFIX="$1" TEE_HOST="$2" TEE_PORT="$3" TEE_TARGET="$4" \
    nohup bun "$SCRIPTS/ingress-tee.ts" >> "$W/logs/tee-$1.log" 2>&1 &
  echo $! > "$W/logs/.tee-$1.pid"
  for i in $(seq 1 40); do curl -sf "http://$2:$3/__ctl/run?name=boot" >/dev/null && return 0; sleep 0.25; done; return 1
}
start_tee ingress 127.0.0.1 "$TEE_PORT" "http://127.0.0.1:$LOCAL_PORT" || exit 1
start_tee mid "$HUB_IP" "$MID_PORT" "http://$HUB_IP:$HUB_PORT" || exit 1

if [[ "$REHEARSAL" == 1 ]]; then
  MODE=redirect; EGRESS=""
  "$SCRIPTS/start-mock.sh" >&2 || exit 1
  unset CODEX_AUTH_JSON
else
  MODE=tee; EGRESS=".tee"
  export ALLOW_EGRESS=1   # hermetic.sh: no dead proxy for hub/local/clients
fi
[[ -f "$W/hub/.service-token" ]] || { openssl rand -hex 32 > "$W/hub/.service-token"; chmod 600 "$W/hub/.service-token"; }

# Stage-2 hub configs: canonical providers only (no mock rows).
mkcfg() { jq "$2" "$SCRIPTS/hub-base.json" > "$W/hub/.s2-$1.json"; echo "$W/hub/.s2-$1.json"; }
C_POOL=$(mkcfg pool   '.providers={openai:{adapter:"openai-responses",baseUrl:"https://chatgpt.com/backend-api/codex",authMode:"forward",codexAccountMode:"pool"}} | .defaultProvider="openai" | .websockets=true | .openaiProviderTierVersion=2 | .subagentModelsVersion=2')
C_DIRECT=$(mkcfg direct '.providers={openai:{adapter:"openai-responses",baseUrl:"https://chatgpt.com/backend-api/codex",authMode:"forward",codexAccountMode:"direct"}} | .defaultProvider="openai" | .websockets=true | .openaiProviderTierVersion=2 | .subagentModelsVersion=2')
C_ANT=$(mkcfg ant     '.providers={anthropic:{adapter:"anthropic",baseUrl:"https://api.anthropic.com",authMode:"oauth"}} | .defaultProvider="anthropic" | .anthropicAccountPool={enabled:false} | .websockets=true')
C_ANTN=$(mkcfg antn   '.providers={anthropic:{adapter:"anthropic",baseUrl:"https://api.anthropic.com",authMode:"oauth"}} | .defaultProvider="anthropic" | .anthropicAccountPool={enabled:false} | .websockets=true | .protocols={rollout:{managedMessagesNative:true,managedMessagesNativeOAuth:true}}')
if [[ "$REHEARSAL" == 1 ]]; then
  # Rehearsal keeps the pool account rows the seed script expects.
  for c in "$C_POOL" "$C_DIRECT"; do jq '.codexAccounts=[{id:"main",email:"hub-main@example.test",isMain:true},{id:"pool-a",email:"pool-a@example.test",isMain:false,chatgptAccountId:"acct-pool-TRACE"}] | .activeCodexAccountId="pool-a"' "$c" > "$c.tmp" && mv "$c.tmp" "$c"; done
fi

hub() { restart_hub "$1" "$MODE"; }
hub "$C_POOL" || exit 1
[[ -f "$W/hub/.client-key" ]] || { "$SCRIPTS/issue-hub-key.sh" >&2 || exit 1; hub "$C_POOL" || exit 1; }
if [[ "$REHEARSAL" == 1 ]]; then
  H="$SCRIPTS/hermetic.sh"
  "$H" "$W/clients/cli-home" OPENCODEX_HOME="$W/hub" CODEX_HOME="$W/hub/codex-home" REPO="$REPO" -- bun "$SCRIPTS/seed-hub-codex.ts" >&2
  "$H" "$W/clients/cli-home" OPENCODEX_HOME="$W/hub" CODEX_HOME="$W/hub/codex-home" REPO="$REPO" -- bun "$SCRIPTS/seed-hub-anthropic.ts" >&2
fi

# Real upstreams reject the fixtures' fake encrypted_content, so stage 2 curl bodies carry none.
for f in trigger-body compact-body; do
  jq --arg m "$MODEL_OAI" '.model=$m | .input |= map(select(.type != "reasoning"))' "$W/fixtures/$f-gpt.json" > "$W/fixtures/s2-$f.json"
  jq --arg m "hub/$MODEL_OAI" '.model=$m | .input |= map(select(.type != "reasoning"))' "$W/fixtures/$f-gpt.json" > "$W/fixtures/s2-$f-hub.json"
done

D() { # D <title> <runB> <runC> <name> : baseline column = what the client sent in (b)
  EGRESS_SUFFIX="$EGRESS" BASELINE_SUFFIX=".ingress" bun "$SCRIPTS/diff-captures.ts" "$CAP" "$1" "$2" "$2" "$3" > "$W/report/diffs/$4.md"
}
mkdir -p "$W/report/diffs"

for phase in "${PHASES[@]}"; do
  case "$phase" in
  openai-pool|openai-direct)
    m=${phase#openai-}; [[ $m == pool ]] && hub "$C_POOL" || hub "$C_DIRECT"
    restart_local "$SCRIPTS/local-oai.json" || exit 1
    codex_chatgpt_run $PFX-cxn-$m-2t-b b "USE_TOOL: run 'echo TOOL_RAN' with your shell tool, then reply DONE." false "$MODEL_OAI"
    codex_chatgpt_run $PFX-cxn-$m-2t-c c "USE_TOOL: run 'echo TOOL_RAN' with your shell tool, then reply DONE." false "hub/$MODEL_OAI"
    D "STAGE2 Codex HTTP 2-turn → canonical ($m)" $PFX-cxn-$m-2t-b $PFX-cxn-$m-2t-c $PFX-cxn-$m-2t
    if [[ $m == pool ]]; then
      codex_chatgpt_run $PFX-cxn-pool-ws-b b "Reply with the single word PONG." true "$MODEL_OAI"
      codex_chatgpt_run $PFX-cxn-pool-ws-c c "Reply with the single word PONG." true "hub/$MODEL_OAI"
      D "STAGE2 Codex WS → canonical (pool)" $PFX-cxn-pool-ws-b $PFX-cxn-pool-ws-c $PFX-cxn-pool-ws
      curl_run $PFX-cxn-trigger-b b /v1/responses "$W/fixtures/s2-trigger-body.json" -H @"$W/fixtures/trigger-headers.txt"
      curl_run $PFX-cxn-trigger-c c /v1/responses "$W/fixtures/s2-trigger-body-hub.json" -H @"$W/fixtures/trigger-headers.txt"
      D "STAGE2 compaction_trigger → canonical (pool)" $PFX-cxn-trigger-b $PFX-cxn-trigger-c $PFX-cxn-trigger
      curl_run $PFX-cxn-compact-b b /v1/responses/compact "$W/fixtures/s2-compact-body.json" -H @"$W/fixtures/compact-headers.txt"
      curl_run $PFX-cxn-compact-c c /v1/responses/compact "$W/fixtures/s2-compact-body-hub.json" -H @"$W/fixtures/compact-headers.txt"
      D "STAGE2 /v1/responses/compact → canonical (pool)" $PFX-cxn-compact-b $PFX-cxn-compact-c $PFX-cxn-compact
    fi ;;
  anthropic|anthropic-native)
    [[ $phase == anthropic ]] && hub "$C_ANT" || hub "$C_ANTN"
    tag=${phase#anthropic}; tag=${tag#-}; tag=${tag:-bridge}
    restart_local "$SCRIPTS/local-ant.json" || exit 1
    claude_run $PFX-ccn-$tag-b b "USE_TOOL: run 'echo TOOL_RAN' with Bash, then reply DONE." "$MODEL_ANT"
    claude_run $PFX-ccn-$tag-c c "USE_TOOL: run 'echo TOOL_RAN' with Bash, then reply DONE." "$MODEL_ANT"
    D "STAGE2 Claude Code → canonical anthropic ($tag, local bridge)" $PFX-ccn-$tag-b $PFX-ccn-$tag-c $PFX-ccn-$tag
    if [[ $phase == anthropic-native ]]; then
      restart_local "$SCRIPTS/local-ant-native.json" || exit 1
      claude_run $PFX-ccn-nativeHL-c c "USE_TOOL: run 'echo TOOL_RAN' with Bash, then reply DONE." "$MODEL_ANT"
      D "STAGE2 Claude Code → canonical anthropic (hub+local native)" $PFX-ccn-native-b $PFX-ccn-nativeHL-c $PFX-ccn-nativeHL
    fi ;;
  *) echo "unknown phase $phase"; exit 1 ;;
  esac
done

"$SCRIPTS/security-scan.sh" > "$W/report/security-scan-$PFX.txt"
cat "$W/report/security-scan-$PFX.txt" >&2
log "stage2 done: diffs in report/diffs/$PFX-*.md, raw captures report/captures/$PFX-*"
