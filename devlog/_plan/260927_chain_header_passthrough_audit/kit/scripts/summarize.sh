#!/usr/bin/env bash
# summarize.sh <run> : one line per inference request at each capture point
W="$(cd "$(dirname "$0")/.." && pwd)"
for sfx in ingress mid ""; do
  f="$W/report/captures/$1${sfx:+.$sfx}.jsonl"; [[ -f "$f" ]] || continue
  echo "-- ${sfx:-upstream}"
  jq -c 'select((.kind=="http" and .method=="POST") or (.kind=="ws-frame") or .kind=="ws-handshake")
    | {k:.kind, p:.path, gen:.body.generate,
       rk:((.body.client_metadata["x-codex-turn-metadata"] // .headers["x-codex-turn-metadata"] // "{}")|fromjson?|[.request_kind, (.compaction.implementation // empty)]|join(":")),
       prev:.body.previous_response_id, it:([.body.input[]?|.type]|join(","))}' "$f"
done
