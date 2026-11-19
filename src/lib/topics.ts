import { Buffer } from 'buffer/';
import matter from 'gray-matter';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// gray-matter uses Buffer.from even when the input is a Markdown string.
Object.assign(globalThis, { Buffer });

export type TopicMeta = {
  schema_version: number;
  id: string;
  title: string;
  category: string;
  summary: string;
  grades: number[];
  proficiency: { starting: string[]; target: string[] };
  difficulty: string;
  exam_relevance: string[];
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  updated: string | Date;
  [key: string]: unknown;
};

export type Stage = { id: string; title: string; html: string };
export type TopicSection = { id: string; title: string; html: string; stages?: Stage[] };
export type Topic = TopicMeta & { body: string; sections: TopicSection[]; sourcePath: string };

const rawFiles = import.meta.glob('../../content/topics/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function safeHtml(tokens: any[]): string {
  const html = marked.parser(tokens as any);
  return DOMPurify.sanitize(String(html), {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onerror', 'onclick', 'onload'],
  });
}

function splitSections(body: string): TopicSection[] {
  const tokens = marked.lexer(body) as any[];
  const groups: { title: string; tokens: any[] }[] = [];
  let current: { title: string; tokens: any[] } | null = null;

  for (const token of tokens) {
    if (token.type === 'heading' && token.depth === 2) {
      current = { title: String(token.text), tokens: [] };
      groups.push(current);
    } else if (current) {
      current.tokens.push(token);
    }
  }

  return groups.map((group, index) => {
    const id = `section-${index}`;
    if (group.title.trim().toLowerCase() !== 'teaching stages') {
      return { id, title: group.title, html: safeHtml(group.tokens) };
    }

    const prefix: any[] = [];
    const completedStages: Stage[] = [];
    let stage: { title: string; tokens: any[] } | null = null;
    let stageIndex = -1;
    for (const token of group.tokens) {
      if (token.type === 'heading' && token.depth === 3) {
        if (stage) completedStages.push({ id: `stage-${stageIndex}`, title: stage.title, html: safeHtml(stage.tokens) });
        stageIndex += 1;
        stage = { title: String(token.text), tokens: [] };
      } else if (stage) {
        stage.tokens.push(token);
      } else {
        prefix.push(token);
      }
    }
    if (stage) completedStages.push({ id: `stage-${stageIndex}`, title: stage.title, html: safeHtml(stage.tokens) });
    return { id, title: group.title, html: safeHtml(prefix), stages: completedStages };
  });
}

function normalizeDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? '');
}

export function loadTopics(): Topic[] {
  const topics: Topic[] = [];
  const seenIds = new Set<string>();
  for (const [sourcePath, raw] of Object.entries(rawFiles)) {
    try {
      const filename = sourcePath.split('/').pop() || '';
      const validationErrors = validateTopicMarkdown(raw, filename);
      if (validationErrors.length) throw new Error(validationErrors.join(' '));
      const parsed = matter(raw);
      const meta = parsed.data as TopicMeta;
      if (!meta) continue;
      const categoryFolder = sourcePath.split('/').slice(-2, -1)[0];
      if (categoryFolder !== meta.category) throw new Error(`Folder category must match metadata category for ${meta.id}`);
      if (seenIds.has(meta.id)) throw new Error(`Duplicate topic id: ${meta.id}`);
      seenIds.add(meta.id);
      if (meta.status !== 'published') continue;
      topics.push({
        ...meta,
        updated: normalizeDate(meta.updated),
        body: parsed.content,
        sections: splitSections(parsed.content),
        sourcePath,
      });
    } catch (error) {
      console.error(`Could not parse topic ${sourcePath}`, error);
    }
  }
  return topics.sort((a, b) => a.title.localeCompare(b.title));
}

export function validateTopicMarkdown(raw: string, filename = ''): string[] {
  const errors: string[] = [];
  try {
    const parsed = matter(raw);
    const m = parsed.data as Partial<TopicMeta>;
    const categories = ['grammar', 'vocabulary', 'reading', 'writing', 'speaking', 'listening', 'examination', 'mixed-skills'];
    const levels = ['pre-a1', 'a1', 'a2', 'b1', 'b2'];
    const difficulties = ['beginner', 'elementary', 'intermediate', 'advanced'];
    const statuses = ['draft', 'published', 'archived'];
    if (m.schema_version !== 1) errors.push('schema_version must be 1.');
    if (!m.id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(m.id)) errors.push('id must be a lowercase hyphenated slug.');
    if (filename && m.id && filename.replace(/\.md$/i, '') !== m.id) errors.push('Filename must match the metadata id.');
    if (!m.title) errors.push('title is required.');
    if (!m.summary) errors.push('summary is required.');
    if (!categories.includes(String(m.category))) errors.push('category is not allowed.');
    if (!Array.isArray(m.grades) || !m.grades.length || m.grades.some((g) => !Number.isInteger(g) || g < 7 || g > 12)) errors.push('grades must contain integers from 7 to 12.');
    if (!m.proficiency || !Array.isArray(m.proficiency.starting) || !m.proficiency.starting.length || m.proficiency.starting.some((v) => !levels.includes(v))) errors.push('proficiency.starting must contain allowed levels.');
    if (!m.proficiency || !Array.isArray(m.proficiency.target) || !m.proficiency.target.length || m.proficiency.target.some((v) => !levels.includes(v))) errors.push('proficiency.target must contain allowed levels.');
    if (!difficulties.includes(String(m.difficulty))) errors.push('difficulty is not allowed.');
    if (!Array.isArray(m.exam_relevance)) errors.push('exam_relevance must be an array.');
    if (!Array.isArray(m.tags) || !m.tags.length) errors.push('tags must be a non-empty array.');
    if (!statuses.includes(String(m.status))) errors.push('status must be draft, published, or archived.');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizeDate(m.updated))) errors.push('updated must use YYYY-MM-DD.');
    if (!parsed.content.trim()) errors.push('Markdown body cannot be empty.');
  } catch {
    errors.push('Could not parse YAML frontmatter. Check the opening and closing --- lines.');
  }
  return errors;
}

export function renderMarkdownPreview(markdown: string): string {
  try {
    const parsed = matter(markdown);
    return DOMPurify.sanitize(String(marked.parse(parsed.content)), {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
      FORBID_ATTR: ['onerror', 'onclick', 'onload'],
    });
  } catch {
    return '<p>Preview unavailable. Check the Markdown and YAML frontmatter.</p>';
  }
}
