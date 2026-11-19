# English Bimbel Teaching Companion — v0.1

A phone-first teaching library for an Indonesian English tutor. The first topic is **Simple Past vs Past Perfect**. Content is stored as one Markdown file per topic with YAML frontmatter.

## What's included

- React + TypeScript + Vite application source.
- Markdown topic discovery with `import.meta.glob`; a new topic file under `content/topics/<category>/` is picked up at build time without editing application code.
- Search and filters for category, grade, proficiency, difficulty, and exam relevance.
- Dashboard, recent topics, favorites, category browsing, and topic cards.
- Topic pages with independent two-level accordions, collapsed by default, Expand All / Collapse All, adjustable reading size, copy action, and native answer reveal controls.
- PWA manifest and service worker for app-shell caching and previously loaded assets.
- Admin editor with file upload, structured metadata fields, raw Markdown editing, validation, preview, and save action.
- Cloudflare Pages Functions for owner-verified validation and server-side GitHub commits.
- A dependency-light static preview under `preview/` for immediate inspection without installing Node packages.
- Two Markdown topic files: Simple Past vs Past Perfect (main topic) and a compact Simple Present sample (content-discovery check).

## Run the React/Vite app

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Build for Cloudflare Pages:

```bash
npm run build
```

The Pages output directory is `dist/`.

> Dependencies could not be installed or built in the authoring environment because the npm registry was unreachable. The source is provided in the agreed Vite/React structure; run the commands above in an environment with npm registry access before deployment.

## Open the static preview

This preview is a convenience build of the same two sample topics. It does not require npm packages.

```bash
cd preview
python3 -m http.server 4173
```

Then open `http://localhost:4173`. Do not open the HTML file directly with `file://`; the preview loads `data/topics.json` using fetch.

Rebuild the preview topic index after adding/editing Markdown:

```bash
pip install -r scripts/requirements.txt
python scripts/build_content.py
```

The preview's admin screen is intentionally preview-only. Live publishing is implemented in the Vite/Cloudflare Pages app and requires the protected deployment configuration below.

## Add a topic without changing application code

1. Create `content/topics/<category>/<topic-id>.md`.
2. Add schema-version-1 YAML frontmatter matching `CONTENT_SCHEMA.md`.
3. Set `status: published` only after review; drafts and archived topics are excluded from the public app.
4. Run `npm run build`. Vite discovers Markdown files automatically.
5. For the static preview, run `python scripts/build_content.py` to regenerate the JSON index.

The filename must match the metadata `id`.

## Secure admin publishing on Cloudflare Pages

Protect both `/admin*` and `/api/admin/*` with a Cloudflare Access application/policy. The Pages Functions independently verify the `Cf-Access-Jwt-Assertion` JWT, its issuer and audience, and the email allowlist. Do not rely on hiding the admin link in the browser.

Set these as **server-side Cloudflare Pages environment variables/secrets**:

- `CF_ACCESS_TEAM_DOMAIN` — e.g. `your-team.cloudflareaccess.com` (domain only).
- `CF_ACCESS_AUD` — Access application audience tag.
- `ADMIN_EMAILS` — comma-separated owner email allowlist.
- `GITHUB_TOKEN` — narrowly scoped repository credential or GitHub App token; secret only.
- `GITHUB_OWNER` — GitHub account or organization.
- `GITHUB_REPO` — canonical repository name.
- `GITHUB_BRANCH` — optional; defaults to `main`.

The save function only writes to `content/topics/<validated-category>/<validated-id>.md`. It validates the file and size before calling the GitHub Contents API. A GitHub commit can then trigger the Pages deployment through the repository integration.

No real GitHub repository, domain, Cloudflare account, Access application, or credentials were supplied, so publishing has not been connected or deployed. Never place secrets in `.env` files committed to Git or in frontend code.

## Content and teaching notes

- The topic follows the supplied Scaffolding Companion: concise Indonesian, natural English examples, phone/whiteboard usability, staged support, answers, readiness checkpoints, and remedial options.
- The Indonesian Main Guide mentions Simple Past and recount work among Phase D practical priorities; it does not establish Past Perfect as a required topic for a particular grade. This topic makes no school-specific or examination-alignment claim.
- `CONTENT_SCHEMA.md`, `WEBSITE_BLUEPRINT.md`, and `AI_TOPIC_GENERATOR.md` are preserved under `docs/`.

## Known first-release limits

- Static preview admin is preview-only; use the Vite/Pages build for protected GitHub publishing. The first admin pass supports structured metadata and raw Markdown editing; delete/restore workflows are not included yet.
- Cloudflare Access and GitHub secrets still need owner configuration.
- Real-device accessibility, offline, and production deployment tests remain to be run.
- The external Google Fonts import is optional; system font fallbacks are provided.
