# English Bimbel — Website Blueprint

**Document type:** Product and technical blueprint  
**Version:** 1.1  
**Status:** Initial build specification  
**Primary audience:** Product owner and implementation developer

------------------------------------------------------------------------

## 1. Product vision

Build a mobile-first, public English teaching companion for an
Indonesian tutor. The site should feel lively, colorful, encouraging,
and game-like, taking broad visual inspiration from Duolingo without
copying its logo, mascot, illustrations, or exact interface.

The product is a **teacher’s tool, not a student learning-management
system**. Its core promise is:

> Open a topic on a phone, teach immediately with a whiteboard, and do
> not need to prepare the material beforehand.

The website displays ready-to-teach material created and reviewed in an
external AI chat. The website itself does not need to generate AI
content.

### 1.1 Current teaching focus

- Initial audience: Grades 10–12 (SMA/SMK).
- Future expansion: Grades 7–12.
- Student proficiency: mixed.
- Default starting point: pre-A1 unless the teacher specifies otherwise.
- Grade is not proof of proficiency. Materials must allow a Grade 12
  learner to begin at a foundational level.
- Main content priorities: grammar, vocabulary, and school/examination
  preparation.
- Teaching explanations: concise Indonesian.
- Examples: English, with Indonesian meanings when useful.
- Delivery context: teacher’s phone and a whiteboard; internet may be
  unstable.

### 1.2 Product principles

1.  **Teach-now usability:** no slides, printing, worksheets, or
    external preparation should be required.
2.  **Phone first:** one-column layout, readable type, large touch
    targets, and short navigation paths.
3.  **Content/code separation:** each topic is an independent Markdown
    file; adding content must not require changing application code.
4.  **Teacher control:** public visitors can read; only the owner can
    create, edit, publish, or delete content.
5.  **Full topic access:** a topic opens with all its approved teaching
    stages available. Sections may be collapsible for easier classroom
    navigation.
6.  **Scaffolding over arbitrary difficulty:** reduce support as
    students become ready; do not simply make sentences longer.
7.  **Flexible growth:** support multiple grades, proficiency ranges,
    categories, and exam tags.
8.  **Offline resilience:** previously opened topics remain readable
    offline; editing and publishing require an internet connection.
9.  **Traceability:** curriculum and examination claims must be
    supported by reliable, current sources and clearly distinguished
    from teaching recommendations.

------------------------------------------------------------------------

## 2. Confirmed product decisions

| Area                | Decision                                                                                       |
|---------------------|------------------------------------------------------------------------------------------------|
| Interface language  | English                                                                                        |
| Visual direction    | Duolingo-inspired, vibrant, playful, rounded, animated                                         |
| Homepage            | Teaching dashboard                                                                             |
| Topic experience    | Complete teaching material, not a timed lesson plan                                            |
| Topic sections      | Accordion interface; all sections and stages collapsed by default                              |
| Accordion behavior  | Independent sections; multiple may stay open; Expand All / Collapse All                        |
| Accordion memory    | No persistence; every topic visit starts fully collapsed                                       |
| Topic source format | Markdown with YAML frontmatter                                                                 |
| Content creation    | External AI using the two teaching reference documents                                         |
| Publishing          | Website admin dashboard or direct GitHub commit                                                |
| Source of truth     | GitHub repository                                                                              |
| Public access       | Anyone can browse published topics                                                             |
| Admin access        | Owner only                                                                                     |
| Offline             | Previously opened topics remain accessible                                                     |
| Teaching aids       | Include tables, board layouts, diagrams, cards, and other useful visual aids where appropriate |

------------------------------------------------------------------------

## 3. User roles

### 3.1 Public visitor

Can: - Open the dashboard and browse published topics. - Search and
filter topics. - Read complete teaching materials. - Use on-page
navigation, reveal/hide answer keys, and adjust reading size. - Revisit
previously cached topics offline.

Cannot: - Upload, edit, publish, archive, or delete content. - Access
administrative APIs.

### 3.2 Administrator / owner

Can: - Sign in through a protected admin route. - Upload a `.md` topic
file. - Create a topic in a structured editor or raw Markdown editor. -
Edit metadata and body content. - Preview the rendered topic before
publishing. - Validate the file and see actionable errors. - Publish,
replace, archive, restore, or delete a topic. - View the GitHub
commit/result for each saved change.

All administrative permissions must be checked on the server, not only
by hiding buttons in the browser.

------------------------------------------------------------------------

## 4. Information architecture

### 4.1 Main navigation

Recommended mobile navigation:

- **Home** — teaching dashboard.
- **Topics** — full topic library.
- **Categories** — grammar, vocabulary, reading, writing, speaking,
  listening, examination.
- **Favorites** — topics saved by the teacher.
- **Admin** — visible only after owner authentication.

Keep the number of primary navigation items small. Search should be
available from the dashboard and topic library.

### 4.2 Dashboard

The homepage should prioritize speed:

1.  Greeting / product identity.
2.  Prominent search field: “Find a topic…”
3.  Recently opened topics.
4.  Favorite topics.
5.  Browse by category.
6.  Recently added topics.
7.  Optional “Suggested progression” area.

Do not make a student streak, student score, or student leaderboard the
primary homepage feature. Gamified visual styling is for
approachability, not for turning this into a student account platform.

### 4.3 Topic library

Support: - Search by title, tag, topic summary, or keyword. - Filter by
category. - Filter by grade (one or multiple). - Filter by
starting/target proficiency. - Filter by difficulty. - Filter by exam
relevance (school assessment, SAS, TKA, UTBK-SNBT). - Sort
alphabetically, recently updated, or recently added.

A topic card should show: - Title. - Category. - Short summary. - Grade
tags. - Proficiency range. - Difficulty indicator. - Relevant exam tags,
if any. - Favorite control.

Do not infer student proficiency from grade.

------------------------------------------------------------------------

## 5. Topic reading experience

A topic should open as a complete, phone-friendly teaching resource.

### 5.1 Topic header

Display: - Topic title and short summary. - Category. - Applicable
grades. - Starting and target proficiency. - Difficulty. - Exam
relevance and tags. - Last updated date. - Favorite control.

### 5.2 Topic navigation

Use a compact sticky or jump-link navigation where practical: Overview,
Teaching path, Stages, Practice, Answers, Remediation / extension, and
Sources.

Render each main topic section as an accordion. The Teaching Stages
section contains a second accordion level for its individual numbered
stages. Keep the hierarchy predictable so the teacher can find material
quickly while teaching. Do not turn every paragraph, example, or small
subheading into another accordion.

### 5.3 Teaching content

The exact sections depend on the topic. A grammar topic will differ from
a reading or vocabulary topic. The following are available content
blocks, not a mandatory checklist to force into every topic:

- Learning objectives.
- Target competencies.
- Prerequisites.
- Short opening explanation in Indonesian.
- Progression map.
- Teacher explanation / suggested teacher script.
- Whiteboard-ready layout.
- Worked examples.
- English examples and Indonesian meanings.
- Teacher prompts and likely student responses.
- Student tasks.
- Answer keys and brief explanations.
- Readiness checkpoints.
- Support adjustment when students struggle.
- Guided and independent application.
- Remedial practice.
- Enrichment or advanced extensions.
- Exit check / quick formative assessment.
- Curriculum or examination notes, where relevant.
- Traceable sources and verification notes.

The content must not become a rigid timed lesson plan. Avoid requiring
the teacher to prepare slides, print materials, find texts, or invent
questions.

### 5.4 Classroom-friendly controls

Recommended controls:

- “Expand All” and “Collapse All” for the topic’s accordion sections.
- “Show answers” / “Hide answers” for answer keys within a section.
- “Copy example” and “Copy board layout”.
- Text-size adjustment.
- Favorite / unfavorite.
- Jump to next stage.
- Offline availability indicator.
- Optional “Keep screen awake” only if it can be implemented reliably
  and accessibly.

For a question set, keep answers close to the task or in an immediately
accessible reveal panel. Answer reveals are not a third accordion level.

### 5.5 Accordion interaction contract

The accordion behavior is a permanent, site-wide requirement for topic
pages.

**Structure** - Level 1: every main topic section (normally Markdown
`##` headings) is a primary accordion. - Level 2: each numbered teaching
stage (for example, `### Stage 1 — ...`) inside the Teaching Stages
section is a nested accordion. - Smaller content headings inside a stage
(teacher explanation, model, whiteboard plan, student task, answers,
readiness checkpoint, and support adjustment) remain visible content
when the stage is open. - Do not create a third accordion level.

**Default and state behavior** - All primary sections and nested stages
start collapsed whenever a topic page is opened. - Returning to a topic
later also starts with everything collapsed. - Do not save accordion
state in localStorage, sessionStorage, cookies, or a user profile. -
Opening one section must not close any other section. - Multiple primary
sections and multiple stages may remain open at the same time. - “Expand
All” opens all primary sections and all nested stages. - “Collapse All”
closes all primary sections and nested stages. - Accordion state is
temporary UI state for the current page visit only. - The same default
behavior applies when a cached topic is opened offline.

**Interaction and accessibility** - Use clear expand/collapse indicators
and large touch targets. - Support keyboard operation and visible
focus. - Expose expanded/collapsed state to assistive technology. - Use
subtle transitions; respect reduced-motion preferences. - Do not delay
access to content for the sake of animation.

------------------------------------------------------------------------

## 6. Content creation workflow

The website is not an AI authoring platform. Content is generated and
reviewed in an external AI chat.

### 6.1 Source documents

The content-generation chat receives: 1.
`Indonesian_English_Bimbel_Research_and_Teaching_Guide_Nov_2026.md` 2.
`English_Bimbel_Scaffolding_Companion.md` 3. `AI_TOPIC_GENERATOR.md`

The Main Guide provides the educational, curriculum, assessment, and
research framework. The Scaffolding Companion governs staged delivery,
scaffolding, and commands. The AI Topic Generator defines the
website-ready export contract.

### 6.2 Authoring workflow

1.  Upload the two reference documents and the AI Topic Generator
    instructions to the external AI chat.
2.  Give the topic and any known grade, proficiency, or exam context.
3.  AI drafts the material using the references and any required current
    research.
4.  Teacher reviews and requests corrections.
5.  When satisfied, teacher types `website export`.
6.  AI produces one complete `.md` file for that topic, including all
    appropriate stages and metadata.
7.  Teacher uploads the file through the admin dashboard or commits it
    to GitHub.
8.  The site validates the file, previews it, and publishes it after
    owner confirmation.

### 6.3 Important distinction

The companion’s normal chat behavior can deliver a progression map and
the first stage, then wait for `next`. The `website export` command is a
deliberate final compilation step: it gathers all appropriate stages
into the complete topic file for the website.

------------------------------------------------------------------------

## 7. Technical architecture

### 7.1 Recommended stack

| Layer                       | Recommendation                                   |
|-----------------------------|--------------------------------------------------|
| Frontend                    | React + TypeScript                               |
| Build tool                  | Vite                                             |
| Styling                     | Tailwind CSS                                     |
| Hosting                     | Cloudflare Pages                                 |
| Server-side admin endpoints | Cloudflare Pages Functions                       |
| Content files               | Markdown + YAML frontmatter                      |
| Content repository          | GitHub                                           |
| Markdown rendering          | A maintained Markdown parser with safe rendering |
| Metadata validation         | JSON Schema or equivalent runtime validation     |
| Offline                     | PWA service worker and cache                     |
| Version history             | Git commits                                      |

This is a proposed implementation stack, not a requirement imposed by
the uploaded teaching documents.

### 7.2 Source of truth

GitHub is the canonical storage location for: - Application source
code. - Published topic Markdown files. - Topic schema and validation
rules. - PWA assets and static resources. - Project documentation.

Do not introduce a separate content database in the initial version. A
database may be added later only if a real requirement emerges.

### 7.3 Suggested repository structure

``` text
english-bimbel/
├── public/
│   ├── icons/
│   ├── images/
│   └── manifest.webmanifest
├── src/
│   ├── components/
│   ├── pages/
│   ├── features/
│   │   ├── dashboard/
│   │   ├── topics/
│   │   ├── search/
│   │   └── admin/
│   ├── lib/
│   └── styles/
├── functions/
│   └── api/
│       └── admin/
│           ├── upload.ts
│           ├── save.ts
│           ├── delete.ts
│           └── validate.ts
├── content/
│   └── topics/
│       ├── grammar/
│       ├── vocabulary/
│       ├── reading/
│       ├── writing/
│       ├── speaking/
│       ├── listening/
│       └── examination/
├── schemas/
│   └── topic.schema.json
├── docs/
│   ├── WEBSITE_BLUEPRINT.md
│   ├── AI_TOPIC_GENERATOR.md
│   ├── CONTENT_SCHEMA.md
│   └── PROJECT_HANDOVER.pdf
├── package.json
└── README.md
```

The exact folder names can change during implementation, but the content
folder and schema must remain predictable.

### 7.4 Public content flow

1.  The build process reads Markdown files from `content/topics/`.
2.  It parses YAML metadata and validates required fields.
3.  Only topics with `status: published` enter the public topic index.
4.  The frontend renders topic pages and search/filter metadata.
5.  A GitHub commit triggers a Cloudflare Pages build/deployment.
6.  The new content becomes public after the deployment succeeds.

### 7.5 Admin publishing flow

1.  Owner signs in.
2.  Owner uploads a Markdown file or opens a topic in the editor.
3.  Server validates metadata and file structure.
4.  The browser displays a rendered preview.
5.  Owner confirms save/publish.
6.  A server-side Pages Function writes the file to the GitHub
    repository through the GitHub API.
7.  GitHub records a commit and triggers deployment.
8.  Admin UI reports success or failure and links to the
    commit/deployment where possible.

**Security requirements:** - Never put a GitHub personal access token or
private key in frontend JavaScript. - Store credentials only as
server-side secrets. - Prefer a GitHub App or a narrowly scoped,
repository-specific credential. - Grant only the minimum permissions
needed to read and write repository contents. - Enforce admin
authentication and authorization in every admin API endpoint. - Validate
paths to prevent writing outside `content/topics/`. - Sanitize rendered
Markdown and disallow unsafe script execution. - Add upload size limits
and clear error handling. - Keep an audit trail through Git commits.

The exact authentication provider and GitHub credential mechanism must
be selected during implementation. Check current Cloudflare plan and
product requirements before choosing Cloudflare Access or another
provider.

------------------------------------------------------------------------

## 8. Offline behavior

### 8.1 Version 1 offline scope

- Cache the application shell.
- Cache a topic when it is opened while online.
- Cache the topic’s local images and essential assets.
- Make cached topics readable offline.
- Show a clear offline indicator.
- Refresh cached content when the device reconnects.

### 8.2 Not required in version 1

- Offline publishing.
- Offline GitHub commits.
- Offline admin editing or conflict resolution.
- Offline AI generation.
- Guaranteed access to a topic that has never been opened or cached.

The teacher should understand that a new topic needs an internet
connection and a successful deployment before it can be opened on the
public site.

------------------------------------------------------------------------

## 9. Visual and interaction direction

### 9.1 Style

Use: - Bright, friendly colors. - Rounded cards and buttons. - Bold but
readable typography. - Playful original illustrations and icons. -
Small, purposeful animations. - Encouraging microcopy. - Clear visual
hierarchy. - A distinct original mascot or visual identity if useful.

Do not copy Duolingo’s owl, logos, proprietary illustrations, or exact
screen designs.

### 9.2 Usability

- Design for a phone in portrait orientation first.
- Use a single-column reading layout.
- Use large touch targets.
- Keep the main teaching action easy to find.
- Avoid tiny tables; make wide tables horizontally scrollable or convert
  them to cards on mobile.
- Keep contrast accessible.
- Respect reduced-motion preferences.
- Do not let animations delay access to lesson content.

### 9.3 Visual teaching aids

Where pedagogically useful, render: - Grammar comparison tables. -
Color-coded sentence structures. - Word and phrase cards. - Whiteboard
layouts. - Timelines and simple diagrams. - Example dialogues. -
Before/after corrections. - Expandable answer keys.

These aids should remain readable on a phone and should not require an
external image to explain a simple concept.

------------------------------------------------------------------------

## 10. Functional requirements

### 10.1 Public website

- [ ] Responsive dashboard.
- [ ] Topic library.
- [ ] Search.
- [ ] Filters for category, grade, proficiency, difficulty, and exam
  relevance.
- [ ] Topic detail page.
- [ ] Complete topic content.
- [ ] Main topic sections render as independent accordions, collapsed by
  default.
- [ ] Numbered teaching stages render as nested accordions, collapsed by
  default.
- [ ] Multiple sections can remain open simultaneously.
- [ ] Expand All / Collapse All controls.
- [ ] Accordion state is not persisted; each topic visit starts
  collapsed.
- [ ] Answer reveal/hide.
- [ ] Favorites.
- [ ] Recently opened topics.
- [ ] Text-size controls.
- [ ] Offline cache for previously opened topics.
- [ ] Clear loading, empty, error, and offline states.

### 10.2 Admin

- [ ] Secure owner sign-in.
- [ ] Admin route protected on both client and server.
- [ ] Upload `.md`.
- [ ] Structured metadata editor.
- [ ] Raw Markdown editor.
- [ ] Live preview.
- [ ] Validation errors with line/field guidance where possible.
- [ ] Create and update GitHub files.
- [ ] Publish/unpublish.
- [ ] Archive/restore.
- [ ] Delete with explicit confirmation.
- [ ] Commit/deployment result feedback.

### 10.3 Content validation

- [ ] Required metadata exists.
- [ ] IDs and file slugs are unique.
- [ ] Grade values are valid.
- [ ] Proficiency labels are valid.
- [ ] Category and exam tags are valid.
- [ ] Status is valid.
- [ ] Markdown can be parsed.
- [ ] Unsafe HTML/scripts are not executed.
- [ ] Public index excludes drafts and archived topics.

------------------------------------------------------------------------

## 11. MVP and implementation phases

### Phase 1 — Foundation

- Create GitHub repository.
- Set up React, TypeScript, Vite, and Tailwind.
- Connect Cloudflare Pages.
- Add sample topic files.
- Implement metadata parsing and validation.
- Build topic library and topic detail pages.

### Phase 2 — Teaching experience

- Build dashboard.
- Add search and filters.
- Add answer reveal/hide.
- Implement two-level topic accordions, collapsed by default.
- Add independent open/close behavior and Expand All / Collapse All.
- Ensure accordion state resets on every topic visit and is never
  persisted.
- Add favorites and recently opened topics.
- Add responsive visual teaching blocks.
- Refine phone-first navigation.

### Phase 3 — Admin and GitHub publishing

- Implement owner authentication.
- Implement secure server-side GitHub integration.
- Add Markdown upload.
- Add structured and raw editors.
- Add preview and validation.
- Add publish, archive, restore, and delete workflows.

### Phase 4 — Offline and polish

- Add PWA manifest and service worker.
- Cache app shell and previously opened topics.
- Add offline indicator and update handling.
- Test on real phones and unstable connections.
- Accessibility and performance pass.

### Phase 5 — Growth

Potential later features: - Suggested topic progressions. -
Printable/exportable teaching views. - Topic relationships and
prerequisites. - Student-specific progress records (only if explicitly
wanted). - Additional grade bands. - Optional AI integrations (not part
of MVP).

------------------------------------------------------------------------

## 12. Acceptance criteria

The first release is acceptable when:

1.  A visitor can open the public website on a phone and find a topic
    quickly.
2.  A topic page displays all published teaching stages and relevant
    materials.
3.  A topic can be represented by one Markdown file plus YAML metadata.
4.  A new topic can be added without modifying application code.
5.  An administrator can upload, edit, preview, validate, and publish a
    topic.
6.  Admin changes are committed to GitHub through a server-side
    function.
7.  No GitHub credential is exposed to the browser.
8.  A GitHub content commit triggers a Cloudflare deployment.
9.  Draft and archived topics are not publicly listed.
10. A previously opened topic can be read offline after it has been
    cached.
11. The interface is usable with one hand on a phone.
12. The site does not assume that Grade 10–12 students are above
    beginner proficiency.
13. All main topic sections and numbered teaching stages are collapsed
    when a topic page is first opened.
14. Opening one accordion does not close another; multiple sections can
    remain open simultaneously.
15. Expand All opens all main sections and nested stages; Collapse All
    closes them.
16. Leaving a topic and returning to it resets all accordions to the
    collapsed state; no accordion state is persisted.
17. The Teaching Stages section has no more than two accordion levels;
    smaller stage content remains visible when its stage is expanded.
18. Accordion controls are touch-friendly, keyboard accessible, and
    respect reduced-motion preferences.

------------------------------------------------------------------------

## 13. Open implementation decisions

These should be resolved by the developer before or during
implementation:

- Final product name, domain, and logo.
- Exact authentication provider and plan compatibility.
- GitHub App versus narrowly scoped repository credential.
- Whether admin publishing commits directly to the main branch or uses a
  review branch.
- Exact Markdown parser and sanitization strategy.
- Whether topic content is parsed at build time or loaded from generated
  static JSON.
- Cache size and eviction strategy for offline topics.
- Image storage approach if the library later contains many images.

Prefer the simplest secure option that satisfies the confirmed workflow.
Do not add a database or AI API merely because it is possible.

------------------------------------------------------------------------

## 14. Reference documents and source boundaries

The product’s teaching requirements are based on two owner-provided
documents:

1.  `Indonesian_English_Bimbel_Research_and_Teaching_Guide_Nov_2026.md`
2.  `English_Bimbel_Scaffolding_Companion.md`

The Main Guide provides the Indonesian curriculum, assessment,
examination, source hierarchy, and teaching methodology context. It
distinguishes school assessment, TKA, formative assessment, and
UTBK-SNBT, and emphasizes checking current official requirements.

The Scaffolding Companion sets pre-A1 as the default unless otherwise
specified; asks for concise Indonesian explanations and English
examples; describes adaptive scaffolding; requires ready-to-use practice
and answers; and defines commands such as `next`, `more practice`,
`easier`, `all stages, compact`, and `advanced`.

The website’s content format and technical stack are product decisions
in this blueprint, not claims made by those education documents.

**Research caution:** The Main Guide carries a research reference date
of 17 November 2026. Examination structures, regulations, schedules, and
portals can change. AI-generated materials must verify current official
requirements when making current curriculum or examination claims, and
must not claim school-specific alignment without the relevant school
documents.
