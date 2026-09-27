#!/usr/bin/env bash
# Shared helpers for run-matrix.sh. Source, don't execute.
W="${W:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
REPO="${REPO:-$(cd "$W/../.." && pwd)}"
HUB_IP="${HUB_IP:-$(hostname -I | awk '{print $1}')}"
MOCK_PORT="${MOCK_PORT:-10300}"; HUB_PORT="${HUB_PORT:-10200}"; LOCAL_PORT="${LOCAL_PORT:-10100}"
TEE_PORT="${TEE_PORT:-10400}"; MID_PORT="${MID_PORT:-10401}"
CAP="$W/report/captures"
export W REPO HUB_IP MOCK_PORT HUB_PORT LOCAL_PORT TEE_PORT MID_PORT CAP
mkdir -p "$CAP" "$W/logs" "$W/clients" "$W/work"

log() { printf '[%s] %s\n' "$(date +%H:%M:%S)" "$*" >&2; }

set_run() { # set_run <run> <ingress-target-url>
  echo "$1" > "$CAP/.current-run"   # read by the launcher in tee mode
  curl -sf "http://127.0.0.1:$MOCK_PORT/__ctl/run?name=$1" >/dev/null
  curl -sf "http://127.0.0.1:$TEE_PORT/__ctl/run?name=$1&target=${2:-http://127.0.0.1:$LOCAL_PORT}" >/dev/null
  curl -sf "http://$HUB_IP:$MID_PORT/__ctl/run?name=$1" >/dev/null
}

stop_pidfile() { local f="$1"; [[ -f "$f" ]] || return 0; local p; p=$(cat "$f"); pkill -TERM -P "$p" 2>/dev/null || true; kill "$p" 2>/dev/null || true; rm -f "$f"; }
stop_hub()   { stop_pidfile "$W/hub/.launcher.pid";   for i in $(seq 1 40); do curl -sf "http://$HUB_IP:$HUB_PORT/healthz" >/dev/null || return 0; sleep 0.25; done; }
stop_local() { stop_pidfile "$W/local/.launcher.pid"; for i in $(seq 1 40); do curl -sf "http://127.0.0.1:$LOCAL_PORT/healthz" >/dev/null || return 0; sleep 0.25; done; }
# hub/local configs are templates: HUB_IP/port placeholders are substituted here.
render() { sed -e "s/192\.0\.2\.2/$HUB_IP/g" -e "s/:10300/:$MOCK_PORT/g" -e "s/:10401/:$MID_PORT/g" -e "s/\"port\": 10200/\"port\": $HUB_PORT/" -e "s/\"port\": 10100/\"port\": $LOCAL_PORT/" "$1"; }
restart_hub()   { curl -sf "http://127.0.0.1:$MOCK_PORT/__ctl/run?name=zz-restarts" >/dev/null; stop_hub;   render "$1" > "$W/hub/.cfg.json";   "$W/scripts/start-hub.sh" "$W/hub/.cfg.json" "${2:-redirect}" >&2; }
restart_local() { curl -sf "http://127.0.0.1:$MOCK_PORT/__ctl/run?name=zz-restarts" >/dev/null; stop_local; render "$1" > "$W/local/.cfg.json"; "$W/scripts/start-local.sh" "$W/local/.cfg.json" >&2; }

# Endpoint the client dials for a topology: a=mock, b=tee→hub, c=tee→local
client_base() { case "$1" in a) echo "http://127.0.0.1:$MOCK_PORT";; b|c) echo "http://127.0.0.1:$TEE_PORT";; esac; }
tee_target()  { case "$1" in a) echo "none";; b) echo "http://$HUB_IP:$HUB_PORT";; c) echo "http://127.0.0.1:$LOCAL_PORT";; esac; }

# ---------------- Codex ----------------
# codex_run <run> <topo a|b|c> <prompt> [ws=false] [model] [extra toml lines]
codex_run() {
  local run="$1" topo="$2" prompt="$3" ws="${4:-false}" model="${5:-mock-oai/gpt-5.5}" extra="${6:-}"
  local home="$W/clients/codex-$run"; rm -rf "$home"; mkdir -p "$home"
  local key="sk-client-dummy-TRACE"; [[ "$topo" == b ]] && key="$(cat "$W/hub/.client-key")"
  cat > "$home/config.toml" <<EOF
model = "$model"
model_provider = "chain"
model_reasoning_effort = "medium"
approval_policy = "never"
sandbox_mode = "danger-full-access"
$extra
[model_providers.chain]
name = "chain"
base_url = "$(client_base "$topo")/v1"
wire_api = "responses"
requires_openai_auth = false
env_key = "CHAIN_CLIENT_KEY"
supports_websockets = $ws
EOF
  set_run "$run" "$(tee_target "$topo")"
  log "codex $run ($topo, ws=$ws, model=$model)"
  ( cd "$W/work" && "$W/scripts/hermetic.sh" "$home/h" CODEX_HOME="$home" CHAIN_CLIENT_KEY="$key" -- \
      timeout 120 codex exec --skip-git-repo-check "$prompt" </dev/null ) > "$W/logs/client-$run.log" 2>&1 || log "  codex exit $?"
  grep -o 'MOCK_REPLY [^ ]*' "$W/logs/client-$run.log" | tail -1 >&2 || log "  (no MOCK_REPLY in client output)"
}

# ---------------- Claude Code ----------------
# claude_run <run> <topo> <prompt> [model] [key-mode: xapikey|bearer] [key override]
claude_run() {
  local run="$1" topo="$2" prompt="$3" model="${4:-claude-sonnet-4-6}" mode="${5:-xapikey}" key="${6:-}"
  local home="$W/clients/claude-$run"; rm -rf "$home"; mkdir -p "$home"
  if [[ -z "$key" ]]; then key="dummy-client-key-TRACE"; [[ "$topo" == b ]] && key="$(cat "$W/hub/.client-key")"; fi
  local authvar="ANTHROPIC_API_KEY=$key"; [[ "$mode" == bearer ]] && authvar="ANTHROPIC_AUTH_TOKEN=$key"
  set_run "$run" "$(tee_target "$topo")"
  log "claude $run ($topo, $mode, model=$model)"
  ( cd "$W/work" && "$W/scripts/hermetic.sh" "$home" CLAUDE_CONFIG_DIR="$home/cfg" ANTHROPIC_BASE_URL="$(client_base "$topo")" "$authvar" -- \
      timeout 120 claude -p "$prompt" --model "$model" --allowedTools "Bash(echo:*)" </dev/null ) > "$W/logs/client-$run.log" 2>&1 || log "  claude exit $?"
  grep -o 'MOCK_REPLY [^ ]*' "$W/logs/client-$run.log" | tail -1 >&2 || log "  (no MOCK_REPLY in client output)"
}

# ---------------- curl (compact, targeted probes) ----------------
# curl_run <run> <topo> <path> <json-body-file> [extra curl args...]
curl_run() {
  local run="$1" topo="$2" path="$3" body="$4"; shift 4
  set_run "$run" "$(tee_target "$topo")"
  local auth=(-H "authorization: Bearer sk-client-dummy-TRACE")
  [[ "$topo" == b ]] && auth=(-H "authorization: Bearer $(cat "$W/hub/.client-key")")
  log "curl $run ($topo) $path"
  curl -sS -N "$(client_base "$topo")$path" "${auth[@]}" -H 'content-type: application/json' "$@" --data-binary @"$body" > "$W/logs/client-$run.log" 2>&1 || log "  curl exit $?"
  head -c 300 "$W/logs/client-$run.log" | tr '\n' ' ' >&2; echo >&2
}

abc() { # abc <fn> <scenario> args... : run the same case for a, b, c
  local fn="$1" sc="$2"; shift 2
  for t in a b c; do "$fn" "$sc-$t" "$t" "$@"; done
}

# Built-in `openai` provider with openai_base_url + API-key auth.json: this is the
# Codex path that uses WebSocket by default and remote compaction v2
# (compaction_trigger + previous_response_id on the socket).
# codex_oa_run <run> <topo> <prompt> [model] [extra toml]
codex_oa_run() {
  local run="$1" topo="$2" prompt="$3" model="${4:-mock-oai/gpt-5.5}" extra="${5:-}"
  local home="$W/clients/codex-$run"; rm -rf "$home"; mkdir -p "$home"
  local key="sk-client-dummy-TRACE"; [[ "$topo" == b ]] && key="$(cat "$W/hub/.client-key")"
  cat > "$home/config.toml" <<EOT
model = "$model"
model_provider = "openai"
openai_base_url = "$(client_base "$topo")/v1"
approval_policy = "never"
sandbox_mode = "danger-full-access"
model_auto_compact_token_limit = 20000
model_context_window = 200000
$extra
EOT
  printf '{"OPENAI_API_KEY":"%s","auth_mode":"apikey"}' "$key" > "$home/auth.json"; chmod 600 "$home/auth.json"
  set_run "$run" "$(tee_target "$topo")"
  log "codex(openai-builtin) $run ($topo, model=$model)"
  ( cd "$W/work" && "$W/scripts/hermetic.sh" "$home/h" CODEX_HOME="$home" -- \
      timeout 120 codex exec --skip-git-repo-check "$prompt" </dev/null ) > "$W/logs/client-$run.log" 2>&1 || log "  codex exit $?"
  grep -o 'MOCK_REPLY [^ ]*' "$W/logs/client-$run.log" | tail -1 >&2 || log "  (no MOCK_REPLY in client output)"
}

# Codex logged in with a (fake, unsigned) ChatGPT account: custom provider with
# requires_openai_auth=true so the client attaches its ChatGPT bearer + chatgpt-account-id.
# codex_chatgpt_run <run> <topo> <prompt> [ws] [model]
codex_chatgpt_run() {
  local run="$1" topo="$2" prompt="$3" ws="${4:-false}" model="${5:-gpt-5.5}" extra="${6:-}"
  local home="$W/clients/codex-$run"; rm -rf "$home"; mkdir -p "$home"
  local base; base="$(client_base "$topo")/v1"; [[ "$topo" == a ]] && base="http://127.0.0.1:$MOCK_PORT/__chatgpt/backend-api/codex"
  local hdr=""; [[ "$topo" == b ]] && hdr="http_headers = { \"x-opencodex-api-key\" = \"$(cat "$W/hub/.client-key")\" }"
  cat > "$home/config.toml" <<EOT
model = "$model"
model_provider = "chain"
model_reasoning_effort = "medium"
approval_policy = "never"
sandbox_mode = "danger-full-access"
$extra
[model_providers.chain]
name = "chain"
base_url = "$base"
wire_api = "responses"
requires_openai_auth = true
supports_websockets = $ws
$hdr
EOT
  # Stage 2: CODEX_AUTH_JSON=<real ~/.codex/auth.json of the CLIENT account> replaces the fake JWT.
  if [[ -n "${CODEX_AUTH_JSON:-}" ]]; then cp "$CODEX_AUTH_JSON" "$home/auth.json"; else bun "$W/scripts/fake-jwt.ts" acct-client-TRACE client@example.test > "$home/auth.json"; fi
  chmod 600 "$home/auth.json" "$home/config.toml"
  set_run "$run" "$(tee_target "$topo")"
  log "codex(chatgpt-login) $run ($topo, ws=$ws, model=$model)"
  ( cd "$W/work" && "$W/scripts/hermetic.sh" "$home/h" CODEX_HOME="$home" -- \
      timeout 120 codex exec --skip-git-repo-check "$prompt" </dev/null ) > "$W/logs/client-$run.log" 2>&1 || log "  codex exit $?"
  grep -o 'MOCK_REPLY [^ ]*' "$W/logs/client-$run.log" | tail -1 >&2 || log "  (no MOCK_REPLY in client output)"
}
