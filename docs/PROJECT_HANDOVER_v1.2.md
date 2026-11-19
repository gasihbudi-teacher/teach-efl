# ENGLISH BIMBEL — PROJECT HANDOVER

## Teaching Companion · Updated Build Brief

**Revision:** 1.2  
**Date:** 18 November 2026  
**Status:** First implementation package prepared; deployment configuration outstanding.

---

## 1. Purpose and product promise

A public, phone-first English teaching resource library for an Indonesian tutor. The teacher opens a topic and gets ready-to-use explanations, examples, whiteboard layouts, student tasks, answers, readiness checkpoints, and adaptive scaffolding.

This is a teacher's tool, not a student learning-management system. The interface is English; teaching explanations are concise Indonesian; examples are natural English with Indonesian meanings where useful. The initial audience is Grades 10–12, with future coverage of Grades 7–12. Learner proficiency is mixed and pre-A1 remains the default support assumption. Grade is not proof of proficiency.

## 2. Governing references

The build and topic content use these owner-provided documents:

1. `Indonesian_English_Bimbel_Research_and_Teaching_Guide_Nov_2026.md` — Indonesian curriculum context, Grades 7–12, assessment, TKA, UTBK-SNBT, source hierarchy, and teaching methodology.
2. `English_Bimbel_Scaffolding_Companion.md` — pre-A1 default, staged delivery, phone/whiteboard usability, explanations, practice, answer handling, readiness checkpoints, natural SEL, and follow-up commands.
3. `WEBSITE_BLUEPRINT.md` — product requirements, UX, architecture, security, offline behavior, accordion behavior, MVP phases, and acceptance criteria.
4. `AI_TOPIC_GENERATOR.md` — content generation and website export contract.
5. `CONTENT_SCHEMA.md` — YAML metadata, Markdown body contract, validation, lifecycle, and accordion presentation contract.

The Main Guide's research reference date is 17 November 2026. Current official policy and examination claims must be rechecked when they are relevant. No school-specific alignment may be claimed without that school's documents.

## 3. Confirmed product decisions (unchanged)

- Public browsing; owner-only administration.
- Vibrant, playful, rounded, accessible visual direction with an original identity.
- Dashboard with search, recently opened topics, favorites, and category browsing.
- Topic library with filters for category, grade, proficiency, difficulty, and exam relevance.
- One Markdown file per topic with YAML frontmatter; schema version 1.
- GitHub is the canonical source of truth; Cloudflare Pages is the intended hosting/deployment target.
- No separate content database or AI API in the first version.
- Two-level accordions: H2 primary sections, H3 numbered stages within Teaching Stages; no third level.
- All accordions start collapsed on every topic visit. Sections open independently; multiple may remain open. Expand All and Collapse All are available. Accordion state is never persisted.
- Previously opened topics should be readable offline after caching. Offline publishing is out of scope.

## 4. First topic completed

**Topic:** `Simple Past vs Past Perfect`  
**File:** `content/topics/grammar/simple-past-vs-past-perfect.md`  
**Status:** `published` in the starter content set.

The topic includes four stages:

1. Understand the sequence of past events.
2. Build and compare the forms.
3. Choose the tense and correct common errors.
4. Tell a past story independently.

It also includes learning objectives, prerequisites, teaching path, board-ready examples, student tasks, answer explanations, readiness checkpoints, support adjustments, quick review, remedial support, enrichment, assessment connection, and source notes.

**Curriculum boundary:** The Main Guide lists Simple Past and recount-related work among Phase D practical priorities (Grades 7–9). It does not establish Past Perfect as a required topic for a particular grade. This resource is a grammar teaching recommendation/extension for the initial Grades 10–12 library; it makes no school-specific or examination-alignment claim.

A compact `simple-present-tense.md` sample is also included to demonstrate that another topic can be discovered from a Markdown file without application-code changes.

## 5. First implementation package

### Implemented in source

- React + TypeScript + Vite application structure.
- Markdown topic discovery through Vite's file glob; topic metadata and body remain separate from application code.
- Schema-oriented topic validation in the client and Pages Functions.
- Markdown rendering sanitized before display.
- Dashboard, topic library, search, category browsing, filters, topic cards, favorites, and recently opened topics.
- Topic reader with independent two-level accordions, default-collapsed behavior, Expand All / Collapse All, reading-size controls, copy action, and native details/summary answer reveal support.
- Phone-first responsive styling, touch-friendly controls, keyboard-operable native buttons, visible focus, and reduced-motion support.
- PWA manifest and service worker for app-shell/static asset caching. Previously opened topics can be served from cache after the first successful load; device/offline verification is still required.
- Admin editor UI with `.md` upload, structured metadata fields, raw Markdown editing, validation feedback, sanitized preview, and explicit save confirmation.
- Cloudflare Pages Functions for owner verification, topic validation, and server-side GitHub Contents API commits.
- Static preview under `preview/` with a prebuilt JSON content index, so the interface can be inspected without installing Node packages.

### Security design

- The `/admin*` and `/api/admin/*` routes must be protected by Cloudflare Access.
- Every admin API request independently verifies the `Cf-Access-Jwt-Assertion` signature, issuer, audience, and owner email allowlist.
- GitHub credentials are read only from server-side Cloudflare environment secrets.
- Save paths are constructed from validated category and topic ID; callers cannot supply arbitrary repository paths.
- Markdown is sanitized before public rendering; upload size is limited to 1 MB.

### Deliberate deployment boundary

No GitHub repository, Cloudflare account, domain, Access application, owner email allowlist, or GitHub credential was supplied. Therefore the package is not connected to a live repository and has not been deployed. Live publishing requires the owner to configure the server-side environment variables and Cloudflare Access policy described in `README.md`.

## 6. Repository layout

```text
english-bimbel-v1/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles.css
│   └── lib/topics.ts
├── public/
│   ├── _headers
│   ├── icon.svg
│   ├── manifest.webmanifest
│   └── sw.js
├── functions/
│   ├── _lib/auth.ts
│   ├── _lib/topic.ts
│   └── api/admin/{validate,save}.ts
├── content/topics/grammar/
│   ├── simple-past-vs-past-perfect.md
│   └── simple-present-tense.md
├── scripts/build_content.py
├── scripts/requirements.txt
├── data/topics.json
├── preview/
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   ├── sw.js
│   └── data/topics.json
└── docs/
    ├── PROJECT_HANDOVER_v1.2.md
    ├── WEBSITE_BLUEPRINT.md
    ├── AI_TOPIC_GENERATOR.md
    ├── CONTENT_SCHEMA.md
    └── the two teaching references
```

## 7. Run and build

### React/Vite application

Requires Node.js 20+ and npm:

```bash
npm install
npm run dev
npm run build
```

Cloudflare Pages build output: `dist/`.

### Static preview

```bash
cd preview
python3 -m http.server 4173
```

Open `http://localhost:4173`.

To regenerate the static topic index after editing or adding Markdown:

```bash
pip install -r scripts/requirements.txt
python scripts/build_content.py
```

The static preview's admin view is preview-only; use the React/Cloudflare Pages application for protected GitHub publishing.

## 8. Required Cloudflare Pages configuration

Set these server-side variables/secrets:

- `CF_ACCESS_TEAM_DOMAIN`
- `CF_ACCESS_AUD`
- `ADMIN_EMAILS`
- `GITHUB_TOKEN` (minimum repository content permissions; secret only)
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH` (optional; defaults to `main`)

Protect `/admin*` and `/api/admin/*` with a Cloudflare Access application. Connect the GitHub repository to Cloudflare Pages so a successful content commit triggers deployment.

## 9. Build status and outstanding work

| Workstream | Status | Notes |
|---|---|---|
| Topic 1 content | Complete | Four stages; full teaching materials and answer explanations. |
| Content schema | Included | Schema v1 retained; no new top-level metadata fields. |
| Vite/React app source | Prepared | npm packages could not be installed in the authoring environment because the npm registry was unreachable; run install/build in a connected environment. |
| Static preview | Prepared | Dependency-light version included with generated topic index. |
| Dashboard/library/search/filters | Implemented in source | Requires browser verification after install. |
| Two-level accordion contract | Implemented in source | Must be tested on actual phones and keyboard/screen-reader combinations. |
| Favorites/recent topics | Implemented in source | Uses localStorage; accordion state is not persisted. |
| PWA/offline | Implemented in source | Service worker included; test first-load caching and offline reopening on devices. |
| Admin editor/preview | Implemented in source | Requires Cloudflare Access for owner-only protection. |
| GitHub save endpoint | Implemented in source | Requires Access and GitHub secrets; not connected to a real repo. |
| Live deployment | Pending | Requires repository, Cloudflare project, domain decision, and owner configuration. |
| Real-device QA | Pending | Test portrait mobile, accessibility, reduced motion, offline cache, and production headers. |

**Important build note:** Network access to the npm registry was unavailable in the authoring environment, so `npm install` and `npm run build` could not be executed here. The static preview and Markdown content index were generated locally. Treat the React source as prepared but not yet build-verified until the commands in `README.md` pass in a connected environment.

## 10. Acceptance checklist for the next owner/developer pass

- [ ] Install dependencies and run `npm run build` without errors.
- [ ] Run the React app locally and compare its behavior with the static preview.
- [ ] Confirm the two sample topics are discovered automatically.
- [ ] Add a third Markdown topic and confirm no application code changes are needed.
- [ ] Verify every primary section and nested stage starts collapsed on each visit.
- [ ] Verify multiple accordions can stay open; Expand All / Collapse All work.
- [ ] Verify accordion state is not written to localStorage/sessionStorage/cookies.
- [ ] Verify answer reveal/hide, favorites, recent topics, and text-size controls.
- [ ] Verify draft and archived topics are excluded from public browsing.
- [ ] Configure Cloudflare Access and test unauthorized/authorized API requests.
- [ ] Configure GitHub secrets and verify a topic commit and Pages deployment.
- [ ] Verify previously opened topics remain readable offline on real phones.
- [ ] Run accessibility, performance, and security-header checks.

## 11. Open decisions retained

- Final public name/domain/logo and brand identity.
- Cloudflare Access policy details and owner email(s).
- GitHub App versus narrowly scoped repository token; branch protection/review branch strategy.
- Production cache limits/eviction and update UX.
- Real-device QA and accessibility test results.

Do not add a database or AI authoring API without a demonstrated requirement. Keep GitHub as the canonical source of truth.

---

**End of revision 1.2.**
