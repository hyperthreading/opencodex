#!/usr/bin/env bash
# Run a client with a scrubbed environment: no inherited credentials, external
# egress pointed at a dead proxy so only loopback / the hub IP are reachable.
# usage: hermetic.sh <home-dir> [VAR=val ...] -- cmd args...
set -euo pipefail
home="$1"; shift
vars=()
while [[ $# -gt 0 && "$1" != "--" ]]; do vars+=("$1"); shift; done
shift
mkdir -p "$home"
# ALLOW_EGRESS=1 (stage 2, real upstream): no dead proxy; EGRESS_PROXY=<url> sets a real one.
if [[ "${ALLOW_EGRESS:-0}" == 1 ]]; then
  p="${EGRESS_PROXY:-}"
  proxy=(${p:+HTTPS_PROXY=$p https_proxy=$p HTTP_PROXY=$p http_proxy=$p})
else
  proxy=(HTTPS_PROXY=http://127.0.0.1:9 https_proxy=http://127.0.0.1:9 HTTP_PROXY=http://127.0.0.1:9 http_proxy=http://127.0.0.1:9)
fi
exec env -i HOME="$home" PATH="$PATH" TERM=dumb LANG=C.UTF-8 \
  "${proxy[@]}" \
  NO_PROXY="127.0.0.1,localhost,${HUB_IP:-192.0.2.2}" no_proxy="127.0.0.1,localhost,${HUB_IP:-192.0.2.2}" \
  DISABLE_TELEMETRY=1 DISABLE_ERROR_REPORTING=1 CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1 DISABLE_AUTOUPDATER=1 \
  "${vars[@]}" "$@"
