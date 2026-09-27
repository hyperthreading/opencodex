#!/usr/bin/env bash
# Regenerate every per-scenario diff table from the captures.
W="$(cd "$(dirname "$0")/.." && pwd)"; C="$W/report/captures"; O="$W/report/diffs"; mkdir -p "$O"
d() { bun "$W/scripts/diff-captures.ts" "$C" "$1" "$2" "$3" "$4" > "$O/$5.md"; }
d "Codex HTTP 1-turn → custom openai-responses (mock-oai)"            cx-http-1t-a cx-http-1t-b cx-http-1t-c cx-http-1t
d "Codex HTTP 2-turn (tool) → custom"                                  cx-http-2t-a cx-http-2t-b cx-http-2t-c cx-http-2t
d "Codex WebSocket 2-turn → custom (hub/local websockets:true)"        cx-ws-2t-a cx-ws-2t-b cx-ws-2t-c cx-ws-2t
d "Codex inline auto-compaction (request_kind=compaction) → custom"   cx-compact-inline-a cx-compact-inline-b cx-compact-inline-c cx-compact-inline
d "Codex built-in openai provider (WS + remote compaction v2) → custom" cx-oa-ws-compact-a cx-oa-ws-compact-b cx-oa-ws-compact-c cx-oa-ws-compact
d "POST /v1/responses/compact (curl, Codex-shaped) → custom"           cx-compact-endpoint-a cx-compact-endpoint-b cx-compact-endpoint-c cx-compact-endpoint
d "Header/body probe (curl) → custom"                                  cx-probe-a cx-probe-b cx-probe-c cx-probe
d "Codex ChatGPT-login HTTP 2-turn → canonical openai (pool)"          cxn-pool-2t-a cxn-pool-2t-b cxn-pool-2t-c cxn-pool-2t
d "Codex ChatGPT-login WebSocket 2-turn → canonical openai (pool)"     cxn-pool-ws-a cxn-pool-ws-b cxn-pool-ws-c cxn-pool-ws
d "Codex ChatGPT-login inline auto-compaction → canonical (pool)"      cxn-pool-cmpv2-a cxn-pool-cmpv2-b cxn-pool-cmpv2-c cxn-pool-cmpv2
d "compaction_trigger turn (curl) → canonical (pool)"                  cxn-pool-trigger-a cxn-pool-trigger-b cxn-pool-trigger-c cxn-pool-trigger
d "POST /v1/responses/compact (curl) → canonical (pool)"               cx-compact-endpoint-a cxn-pool-compact-b cxn-pool-compact-c cxn-pool-compact
d "Codex ChatGPT-login HTTP 2-turn → canonical openai (direct)"        cxn-direct-2t-a cxn-direct-2t-b cxn-direct-2t-c cxn-direct-2t
d "Header/body probe (curl) → canonical (pool)"                        cxn-probe-a cxn-probe-b cxn-probe-c cxn-probe
d "Claude Code 1-turn → custom anthropic (mock-ant), bridge"           cc-1t-a cc-1t-b cc-1t-c cc-1t
d "Claude Code 2-turn → custom anthropic, bridge, x-api-key"           cc-2t-a cc-2t-b cc-2t-c cc-2t
d "Claude Code 2-turn, client Bearer (b) / local apiKeyTransport=bearer (c)" cc-2t-a cc-2t-cbearer-b cc-2t-lbearer-c cc-2t-bearer
d "Claude Code 2-turn, managedMessagesNative: hub on, local off"       cc-2t-a cc-2t-natH-b cc-2t-natH-c cc-2t-natH
d "Claude Code 2-turn, managedMessagesNative: hub off, local on"       cc-2t-a cc-2t-b cc-2t-natL-c cc-2t-natL
d "Claude Code 2-turn, managedMessagesNative: hub on, local on"        cc-2t-a cc-2t-natH-b cc-2t-natHL-c cc-2t-natHL
d "Claude Code 2-turn, caller sk-ant-* key (passthrough lane)"         cc-2t-a cc-skant-b cc-skant-c cc-skant
d "Claude Code 2-turn, OAuth-shaped Bearer sk-ant-oat01-* (c): passthrough lane" cc-2t-a cc-skant-b cc-oat-c cc-oat
d "Claude Code 2-turn, sk-ant-* key, local claudeCode.nativePassthrough=false" cc-2t-a cc-skant-b cc-skant-nopt-c cc-skant-nopt
d "Claude Code 2-turn → canonical anthropic OAuth (hub), bridge"       cc-2t-a ccn-bridge-b ccn-bridge-c ccn-bridge
d "Claude Code 2-turn → canonical anthropic OAuth, hub native(+OAuth) on, local off" cc-2t-a ccn-native-b ccn-native-c ccn-native
d "Claude Code 2-turn → canonical anthropic OAuth, hub+local native on" cc-2t-a ccn-native-b ccn-nativeHL-c ccn-nativeHL
ls "$O" | wc -l
