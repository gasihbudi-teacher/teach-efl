import { requireOwner, type Env } from '../../_lib/auth';
import { json, validateTopic } from '../../_lib/topic';

function toBase64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const ownerEmail = await requireOwner(request, env);
    if (!env.GITHUB_TOKEN || !env.GITHUB_OWNER || !env.GITHUB_REPO) return json({ error: 'GitHub publishing is not configured. Add the required server-side secrets.' }, 503);
    const body = await request.json() as { filename?: string; content?: string };
    const filename = String(body.filename || '');
    const content = String(body.content || '');
    if (!filename.endsWith('.md') || filename.includes('/') || filename.includes('..')) return json({ error: 'Use a single .md filename.' }, 400);
    if (new TextEncoder().encode(content).length > 1_000_000) return json({ error: 'Topic file exceeds the 1 MB limit.' }, 413);
    const validation = validateTopic(content, filename);
    if (validation.errors.length) return json({ error: 'Topic validation failed.', errors: validation.errors }, 400);
    const category = String(validation.metadata?.category || '');
    if (!/^[a-z-]+$/.test(category)) return json({ error: 'Invalid category path.' }, 400);
    const path = `content/topics/${category}/${filename}`;
    const branch = env.GITHUB_BRANCH || 'main';
    const apiBase = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}`;
    const headers = { Authorization: `Bearer ${env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'English-Bimbel-Teaching-Companion' };
    let sha: string | undefined;
    const existing = await fetch(`${apiBase}?ref=${encodeURIComponent(branch)}`, { headers });
    if (existing.ok) sha = (await existing.json() as { sha?: string }).sha;
    else if (existing.status !== 404) return json({ error: `GitHub lookup failed (${existing.status}).` }, 502);
    const saveResponse = await fetch(apiBase, {
      method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `${sha ? 'Update' : 'Add'} topic: ${String(validation.metadata?.title || filename)}`, content: toBase64(content), branch, ...(sha ? { sha } : {}) }),
    });
    const result = await saveResponse.json() as { commit?: { sha?: string; html_url?: string }; message?: string };
    if (!saveResponse.ok) return json({ error: result.message || `GitHub save failed (${saveResponse.status}).` }, 502);
    return json({ ok: true, path, owner: ownerEmail, commit: result.commit?.sha, commitUrl: result.commit?.html_url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Publishing failed.';
    return json({ error: message }, message.startsWith('Unauthorized') ? 401 : message.startsWith('Forbidden') ? 403 : 500);
  }
};
