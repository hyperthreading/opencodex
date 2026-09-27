// Unsigned (alg:none) ChatGPT-shaped JWT for credential-free tests.
export function fakeJwt(accountId: string, email: string, extra: Record<string, unknown> = {}): string {
  const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  return `${b64({ alg: "none", typ: "JWT" })}.${b64({
    iss: "https://auth.openai.com", aud: ["https://api.openai.com/v1"], iat: now, exp: now + 30 * 86400, email,
    "https://api.openai.com/auth": { chatgpt_account_id: accountId, chatgpt_plan_type: "pro", chatgpt_user_id: `user-${accountId}` },
    "https://api.openai.com/profile": { email }, ...extra,
  })}.fakesig`;
}
export function codexAuthJson(accountId: string, email: string) {
  const jwt = fakeJwt(accountId, email);
  return { OPENAI_API_KEY: null, auth_mode: "chatgpt", tokens: { id_token: jwt, access_token: jwt, refresh_token: `rt_${accountId}`, account_id: accountId }, last_refresh: new Date().toISOString() };
}
if (import.meta.main) {
  const [accountId, email] = process.argv.slice(2);
  console.log(JSON.stringify(codexAuthJson(accountId ?? "acct-TRACE", email ?? "trace@example.test"), null, 2));
}
