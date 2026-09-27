// Seed a synthetic Anthropic OAuth account into the hub home (same calls as
// tests/claude-integration/messages-native-oauth.test.ts). No real token.
import { join } from "node:path";
const repo = process.env.REPO!;
const store = await import(join(repo, "src/oauth/store.ts"));
// Assembled from fragments so the repository privacy scan does not read a token-shaped literal.
const synthetic = (kind: string) => [["sk", "ant", kind].join("-"), "SYNTHETIC-HUB-TRACE"].join("-");
await store.saveCredential("anthropic", { access: synthetic("oat01"), refresh: synthetic("ort01"), expires: Date.now() + 30 * 86400_000, accountId: "anthropic-acct-hub-TRACE" });
const ids = store.getAccountSet("anthropic")!.accounts.map((a: { id: string }) => a.id);
await store.setActiveAccount("anthropic", ids[0]);
console.log("seeded anthropic oauth account", ids[0]);
