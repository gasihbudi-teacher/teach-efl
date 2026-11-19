import { requireOwner, type Env } from '../../_lib/auth';
import { json, validateTopic } from '../../_lib/topic';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    await requireOwner(request, env);
    const body = await request.json() as { filename?: string; content?: string };
    const filename = String(body.filename || '');
    const content = String(body.content || '');
    if (!filename.endsWith('.md') || filename.includes('/') || filename.includes('..')) return json({ error: 'Use a single .md filename.' }, 400);
    if (new TextEncoder().encode(content).length > 1_000_000) return json({ error: 'Topic file exceeds the 1 MB limit.' }, 413);
    const result = validateTopic(content, filename);
    return json({ valid: result.errors.length === 0, errors: result.errors });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Validation failed.';
    return json({ error: message }, message.startsWith('Unauthorized') ? 401 : message.startsWith('Forbidden') ? 403 : 500);
  }
};
