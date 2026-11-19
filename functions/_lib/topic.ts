import matter from 'gray-matter';

const categories = ['grammar', 'vocabulary', 'reading', 'writing', 'speaking', 'listening', 'examination', 'mixed-skills'];
const levels = ['pre-a1', 'a1', 'a2', 'b1', 'b2'];
const difficulties = ['beginner', 'elementary', 'intermediate', 'advanced'];
const statuses = ['draft', 'published', 'archived'];

export function validateTopic(content: string, filename: string) {
  const errors: string[] = [];
  let parsed: ReturnType<typeof matter>;
  try { parsed = matter(content); } catch { return { errors: ['YAML frontmatter could not be parsed.'] }; }
  const m = parsed.data as Record<string, any>;
  const id = String(m.id || '');
  if (m.schema_version !== 1) errors.push('schema_version must be 1.');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) errors.push('id must be a lowercase hyphenated slug.');
  if (`${id}.md` !== filename) errors.push('Filename must match the metadata id.');
  if (!m.title) errors.push('title is required.');
  if (!m.summary) errors.push('summary is required.');
  if (!categories.includes(m.category)) errors.push('category is not allowed.');
  if (!Array.isArray(m.grades) || !m.grades.length || m.grades.some((x: unknown) => !Number.isInteger(x) || Number(x) < 7 || Number(x) > 12)) errors.push('grades must contain integers from 7 to 12.');
  if (!Array.isArray(m.proficiency?.starting) || !m.proficiency.starting.length || m.proficiency.starting.some((x: string) => !levels.includes(x))) errors.push('proficiency.starting must contain allowed levels.');
  if (!Array.isArray(m.proficiency?.target) || !m.proficiency.target.length || m.proficiency.target.some((x: string) => !levels.includes(x))) errors.push('proficiency.target must contain allowed levels.');
  if (!difficulties.includes(m.difficulty)) errors.push('difficulty is not allowed.');
  if (!Array.isArray(m.exam_relevance)) errors.push('exam_relevance must be an array.');
  if (!Array.isArray(m.tags) || !m.tags.length) errors.push('tags must be a non-empty array.');
  if (!statuses.includes(m.status)) errors.push('status must be draft, published, or archived.');
  const updated = m.updated instanceof Date ? m.updated.toISOString().slice(0, 10) : String(m.updated || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(updated) || Number.isNaN(Date.parse(updated))) errors.push('updated must use YYYY-MM-DD.');
  if (!parsed.content.trim()) errors.push('Markdown body cannot be empty.');
  return { errors, metadata: m };
}

export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
}
