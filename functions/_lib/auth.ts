import { createRemoteJWKSet, jwtVerify } from 'jose';

export interface Env {
  CF_ACCESS_TEAM_DOMAIN: string;
  CF_ACCESS_AUD: string;
  ADMIN_EMAILS: string;
  GITHUB_TOKEN: string;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  GITHUB_BRANCH?: string;
}

export async function requireOwner(request: Request, env: Env): Promise<string> {
  const assertion = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!assertion) throw new Error('Unauthorized: Cloudflare Access assertion is missing.');
  if (!env.CF_ACCESS_TEAM_DOMAIN || !env.CF_ACCESS_AUD) throw new Error('Admin authentication is not configured.');
  const issuer = `https://${env.CF_ACCESS_TEAM_DOMAIN}`;
  const jwks = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`));
  const { payload } = await jwtVerify(assertion, jwks, { issuer, audience: env.CF_ACCESS_AUD });
  const email = String(payload.email || '').toLowerCase();
  const allowed = (env.ADMIN_EMAILS || '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
  if (!email || !allowed.includes(email)) throw new Error('Forbidden: this account is not on the owner allowlist.');
  return email;
}
