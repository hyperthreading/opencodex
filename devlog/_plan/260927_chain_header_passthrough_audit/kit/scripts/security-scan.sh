#!/usr/bin/env bash
# Security invariants over the captures. Prints counts only, never secret values.
W="$(cd "$(dirname "$0")/.." && pwd)"; C="$W/report/captures"
cd "$C" || exit 1
egress=$(ls *.jsonl | grep -v -e '\.ingress\.jsonl$' -e '\.mid\.jsonl$')
# (a) runs are client→mock with no ocx in between: client credentials there are the baseline.
chained=$(echo "$egress" | grep -v -e '-a\.jsonl$')
mid=$(ls *.mid.jsonl 2>/dev/null)
n() { grep -c -- "$1" $2 2>/dev/null | awk -F: '{s+=$NF} END {print s+0}'; }
echo "# Security scan ($(date -u +%FT%TZ))"
echo "upstream (egress) capture files: $(echo "$egress" | wc -l), records: $(cat $egress | wc -l)"
echo "local→hub (mid) capture files:   $(echo "$mid" | wc -l), records: $(cat $mid | wc -l)"
echo
echo "## Invariant: no ocx admission secret reaches the upstream"
# Secret-shaped match: a bare 'ocx_' substring also hits prose (e.g. a path the client
# quoted from `git status` into its system prompt), which is not a credential.
SECRET_RE='ocx_(data|admin|session)_[A-Za-z0-9]'
ne() { grep -cE -- "$1" $2 2>/dev/null | awk -F: '{s+=$NF} END {print s+0}'; }
echo "ocx admission-secret shapes (ocx_data_/ocx_admin_/ocx_session_) upstream: $(ne "$SECRET_RE" "$egress")"
echo "(info) bare 'ocx_' substrings upstream, any context:  $(n 'ocx_' "$egress")"
echo "hub client key literal in upstream captures:        $(n "$(cat "$W/hub/.client-key")" "$egress")"
echo "hub admin token literal in upstream captures:       $(n "$(cat "$W/hub/admin-api-token")" "$egress")"
echo "hub service (data) token literal in upstream:       $(n "$(cat "$W/hub/.service-token")" "$egress")"
[[ -f "$W/local/admin-api-token" ]] && echo "local admin token literal in upstream captures:     $(n "$(cat "$W/local/admin-api-token")" "$egress")"
echo "files with an admission-secret shape upstream:"; grep -lE "$SECRET_RE" $egress 2>/dev/null | sed 's/^/  /'
echo
echo "## Expected: the ocx key is the local→hub credential"
echo "admission-secret shapes in local→hub (mid) captures: $(ne "$SECRET_RE" "$mid")"
echo
echo "## Client credentials reaching the upstream through ocx (b/c runs only: $(echo "$chained" | wc -l) files)"
echo "Codex dummy key 'sk-client-dummy-TRACE':            $(n 'sk-client-dummy-TRACE' "$chained")  (0 expected; replaced by provider/pool/main credential)"
echo "Claude dummy key 'dummy-client-key-TRACE':          $(n 'dummy-client-key-TRACE' "$chained")  (0 expected; replaced by provider key)"
echo "Codex client ChatGPT account 'acct-client-TRACE':   $(n 'acct-client-TRACE' "$chained") in:"; grep -l 'acct-client-TRACE' $chained | sed 's/^/  /'
echo "Claude sk-ant-* client key (passthrough lane, by design): $(n 'DUMMYCLIENT-TRACE' "$chained") in:"; grep -l 'DUMMYCLIENT-TRACE' $chained | sed 's/^/  /'
echo
echo "## ocx_ in ocx process logs"
echo "hub.log: $(grep -cE "$SECRET_RE" "$W/logs/hub.log")  local.log: $(grep -cE "$SECRET_RE" "$W/logs/local.log")"
