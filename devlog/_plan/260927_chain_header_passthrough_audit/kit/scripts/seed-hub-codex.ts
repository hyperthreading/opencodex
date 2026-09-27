// Seed canonical-openai credentials into the hub home without any real account:
//  - pool account "pool-a" in $OPENCODEX_HOME/codex-accounts.json (same call the tests use)
//  - main ChatGPT login in $CODEX_HOME/auth.json (used by direct mode when the
//    caller authenticated with an ocx_ key and the main credential is substituted)
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fakeJwt, codexAuthJson } from "./fake-jwt";
const repo = process.env.REPO!;
const { saveCodexAccountCredential } = await import(join(repo, "src/codex/account-store.ts"));
saveCodexAccountCredential("pool-a", {
  accessToken: fakeJwt("acct-pool-TRACE", "pool-a@example.test"),
  refreshToken: "rt_pool_TRACE",
  expiresAt: Date.now() + 30 * 86400_000,
  chatgptAccountId: "acct-pool-TRACE",
});
const codexHome = process.env.CODEX_HOME!;
mkdirSync(codexHome, { recursive: true });
writeFileSync(join(codexHome, "auth.json"), JSON.stringify(codexAuthJson("acct-hubmain-TRACE", "hub-main@example.test"), null, 2), { mode: 0o600 });
console.log("seeded pool-a (acct-pool-TRACE) and hub main (acct-hubmain-TRACE)");
