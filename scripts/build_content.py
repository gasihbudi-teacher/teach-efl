#!/usr/bin/env python3
"""Build the static topic index from one-Markdown-file-per-topic content."""
from __future__ import annotations
import json, re, sys
from datetime import date, datetime
from pathlib import Path
import yaml
import mistune
import bleach

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / 'content' / 'topics'
OUTPUTS = [ROOT / 'data' / 'topics.json', ROOT / 'preview' / 'data' / 'topics.json']
ALLOWED_TAGS = set(bleach.sanitizer.ALLOWED_TAGS) | {
    'h1','h2','h3','h4','h5','h6','p','pre','code','hr','br','blockquote',
    'table','thead','tbody','tr','th','td','details','summary','div','span'
}
ALLOWED_ATTRS = {'a': ['href','title','rel'], 'th': ['align'], 'td': ['align'], 'code': ['class'], 'pre': ['class']}
markdown = mistune.create_markdown(escape=False, plugins=['table'])


def split_frontmatter(text: str):
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)$', text, re.S)
    if not match:
        raise ValueError('Missing YAML frontmatter fences')
    meta = yaml.safe_load(match.group(1)) or {}
    body = match.group(2)
    return meta, body


def validate(meta, body, path):
    required = ['schema_version','id','title','category','summary','grades','proficiency','difficulty','exam_relevance','tags','status','updated']
    missing = [key for key in required if key not in meta]
    if missing: raise ValueError(f'{path}: missing fields {missing}')
    if meta['schema_version'] != 1: raise ValueError(f'{path}: unsupported schema_version')
    if meta['id'] != path.stem: raise ValueError(f'{path}: filename must match id')
    if meta['category'] != path.parent.name: raise ValueError(f'{path}: folder category must match metadata category')
    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', str(meta['id'])): raise ValueError(f'{path}: invalid id')
    if meta['category'] not in ['grammar','vocabulary','reading','writing','speaking','listening','examination','mixed-skills']: raise ValueError(f'{path}: invalid category')
    if not isinstance(meta['grades'], list) or not meta['grades'] or any(not isinstance(x, int) or x < 7 or x > 12 for x in meta['grades']): raise ValueError(f'{path}: invalid grades')
    levels = ['pre-a1','a1','a2','b1','b2']
    prof = meta['proficiency'] or {}
    if not prof.get('starting') or any(x not in levels for x in prof['starting']): raise ValueError(f'{path}: invalid starting proficiency')
    if not prof.get('target') or any(x not in levels for x in prof['target']): raise ValueError(f'{path}: invalid target proficiency')
    if meta['difficulty'] not in ['beginner','elementary','intermediate','advanced']: raise ValueError(f'{path}: invalid difficulty')
    if meta['status'] not in ['draft','published','archived']: raise ValueError(f'{path}: invalid status')
    if not body.strip(): raise ValueError(f'{path}: empty body')


def clean_html(body):
    raw = markdown(body)
    return bleach.clean(raw, tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRS, protocols=['http','https','mailto'], strip=True)


def build():
    items = []
    errors = []
    seen_ids = set()
    for path in sorted(CONTENT.glob('*/*.md')):
        try:
            raw = path.read_text(encoding='utf-8')
            meta, body = split_frontmatter(raw)
            validate(meta, body, path)
            if meta['id'] in seen_ids:
                raise ValueError(f'{path}: duplicate topic id {meta["id"]}')
            seen_ids.add(meta['id'])
            if meta['status'] != 'published':
                continue
            updated = meta['updated']
            if isinstance(updated, (date, datetime)):
                updated = updated.isoformat()[:10]
            items.append({
                **meta,
                'updated': str(updated),
                'body': body,
                'html': clean_html(body),
                'sourcePath': str(path.relative_to(ROOT)).replace('\\','/'),
            })
        except Exception as exc:
            errors.append(str(exc))
    if errors:
        print('\n'.join(errors), file=sys.stderr)
        raise SystemExit(1)
    payload = json.dumps(items, ensure_ascii=False, indent=2)
    for output in OUTPUTS:
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(payload + '\n', encoding='utf-8')
    print(f'Built {len(items)} published topics into {len(OUTPUTS)} indexes.')

if __name__ == '__main__':
    build()
