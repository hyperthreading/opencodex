# ocx 2-hop chaining: header / metadata passthrough audit (stage 1, no credentials)

Status: stage 1 done (mock upstream, synthetic credentials). Stage 2 (real OAuth) is open.

- Pinned opencodex: `lidge-jun/opencodex` `93f4231e4b9314f746902b336e7a77762643eaf1` (main, v2.68.0).
- Clients: `codex-cli 0.157.1`, `Claude Code 2.1.283`. Runtime: Bun 1.3.11.
- Verdict:
  - topology (c) client → local ocx → hub ocx → upstream: **NO-GO**. The local→hub hop drops every client header; no config key restores them.
  - topology (b) client → hub ocx → upstream: **conditional GO**.
- Security invariant: no ocx admission secret (`ocx_data_…` / `ocx_admin_…` / `ocx_session_…`) reached the upstream: 0 hits across 181 upstream capture records.

## Documents

| File | Contents |
|---|---|
| [`010_report.md`](./010_report.md) | Results (Korean): item × (a/b/c) tables, cause `file:line` + config keys, security results, grading (확인 / 네이티브 확인 / 미검증) |
| [`020_handoff.md`](./020_handoff.md) | Stage-2 handoff: GO/NO-GO, pinned versions, topology/config, unverified items with how to verify, tee-mode launcher, observed client headers |

## Kit layout (`kit/` = `$W` in the documents)

```
kit/scripts/     mock upstream, recording tees, fetch/WebSocket-patching launcher, run-matrix.sh, stage2.sh, diff tool
kit/fixtures/    curl bodies/headers for compaction, compaction_trigger and header/body probes
kit/report/diffs/                 26 generated per-scenario diff tables (make-diffs.sh output)
kit/report/security-scan.txt      security-scan.sh output of the final run
kit/report/admission-negatives.txt
kit/report/captures/              raw captures of the final run-matrix run (see note below)
```

The committed evidence (`kit/report/*`) is the output of a from-scratch run of the committed `kit/scripts/run-matrix.sh` (pinned SHA, exit 0, all 26 tables consistent with the earlier runs). The captures were then passed through `kit/scripts/export-captures.ts`, so they are **redacted and slimmed** relative to the originals:

- Every `ocx_data_…` / `ocx_admin_…` value is replaced with `ocx_…_REDACTED`.
- Every JWT (all synthetic, unsigned) is replaced with `<jwt acct=…>`, which keeps the ChatGPT account claim the tables compare.
- Long strings are cut to 120 chars plus a `<N chars>` marker. This covers `instructions`, message and input `text`, and system text.
- `tools` entries keep only `type`, `name`, nested namespace names, and `cache_control`.

Headers and every other body field are verbatim. Because of this, `diff-captures.ts` run on these files reproduces `kit/report/diffs/*.md` exactly except the `instructions` length row. All other credentials in the captures are synthetic `*-TRACE` / `*-SYNTHETIC-*` dummies.

Token-shaped dummy literals in the kit are assembled from fragments at runtime, and the fake emails use `example.test`, so `bun run privacy:scan` passes on this unit.

## How another agent can verify

1. **Offline re-check of the tables.** Run from the repository root:
   ```bash
   U=devlog/_plan/260927_chain_header_passthrough_audit/kit
   bun $U/scripts/diff-captures.ts $U/report/captures "check" cc-2t-a cc-2t-b cc-2t-c | diff - $U/report/diffs/cc-2t.md
   ```
2. **Full re-run from scratch**, about 3 minutes. It needs `bun`, `jq`, `curl`, `openssl`, `npm i -g @openai/codex@0.157.1 @anthropic-ai/claude-code@2.1.283`, and a non-loopback interface address.
   ```bash
   git checkout 93f4231e4b9314f746902b336e7a77762643eaf1   # or a branch at that tree
   mkdir -p .tmp && cp -r devlog/_plan/260927_chain_header_passthrough_audit/kit .tmp/chain-audit
   HUB_IP=$(hostname -I | awk '{print $1}') .tmp/chain-audit/scripts/run-matrix.sh
   ```
   - Run it from the `.tmp/` copy, never in place. The scripts derive `REPO` from `$W/../..` and rewrite `report/`.
   - The copy's `report/captures` will then hold unredacted local `ocx_data_…` keys of a throwaway hub.
3. **Stage 2** (real OAuth): see `020_handoff.md` §3–§5 and `kit/scripts/stage2.sh`. `STAGE2_REHEARSAL=1` exercises the same flow offline first.

Clients must only be started through `kit/scripts/hermetic.sh` (`env -i`). The report's §6 records why: an inherited session credential reached the loopback mock once during exploration. It was deleted on the spot and never left the host.
