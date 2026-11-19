# Content Schema — English Bimbel Teaching Companion

**Document revision:** 1.1  
**Data schema version:** 1  
**Format:** Markdown body + YAML frontmatter  
**Purpose:** Stable contract between AI-generated topic files, GitHub,
and the website.

------------------------------------------------------------------------

## 1. Core rule

One topic equals one `.md` file.

The file contains: 1. YAML frontmatter for machine-readable metadata. 2.
A Markdown body for the actual teaching material.

The website must not depend on hard-coded topic names. It discovers
topics from files in `content/topics/`.

Suggested path:

``` text
content/topics/<category>/<id>.md
```

Example:

``` text
content/topics/grammar/simple-present-tense.md
```

The filename must match the metadata `id`.

------------------------------------------------------------------------

## 2. YAML frontmatter

### 2.1 Example

``` yaml
---
schema_version: 1
id: simple-present-tense
title: Simple Present Tense
category: grammar
summary: Use the simple present to describe routines, facts, and repeated actions.
grades: [10, 11, 12]
proficiency:
  starting: [pre-a1]
  target: [a1]
difficulty: beginner
exam_relevance:
  - school-assessment
  - sas
tags:
  - grammar
  - verbs
  - routines
status: published
updated: 2026-11-18
---
```

### 2.2 Fields

| Field                  | Type              | Required | Rules                                                                     |
|------------------------|-------------------|---------:|---------------------------------------------------------------------------|
| `schema_version`       | integer           |      Yes | Must be `1` for this version                                              |
| `id`                   | string            |      Yes | Unique lowercase slug; letters, numbers, hyphens                          |
| `title`                | string            |      Yes | Human-readable topic title                                                |
| `category`             | string            |      Yes | Must match an allowed category                                            |
| `summary`              | string            |      Yes | Short description for cards and search                                    |
| `grades`               | array of integers |      Yes | One or more values from 7 to 12                                           |
| `proficiency.starting` | array of strings  |      Yes | One or more allowed levels                                                |
| `proficiency.target`   | array of strings  |      Yes | One or more allowed levels                                                |
| `difficulty`           | string            |      Yes | `beginner`, `elementary`, `intermediate`, or `advanced`                   |
| `exam_relevance`       | array of strings  |      Yes | Use `[]` when no specific exam connection is claimed                      |
| `tags`                 | array of strings  |      Yes | Searchable keywords; use lowercase kebab-case where practical             |
| `status`               | string            |      Yes | `draft`, `published`, or `archived`                                       |
| `updated`              | date              |      Yes | ISO date: `YYYY-MM-DD`                                                    |
| `prerequisites`        | array of strings  |       No | IDs of prerequisite topics, if they exist                                 |
| `related_topics`       | array of strings  |       No | IDs of related topics                                                     |
| `author_notes`         | string            |       No | Internal editorial note; never show publicly unless explicitly configured |
| `sources`              | array             |       No | Traceable sources for research-dependent claims                           |

### 2.3 Allowed categories

- `grammar`
- `vocabulary`
- `reading`
- `writing`
- `speaking`
- `listening`
- `examination`
- `mixed-skills`

### 2.4 Allowed proficiency labels

- `pre-a1`
- `a1`
- `a2`
- `b1`
- `b2`

Starting and target levels are arrays to support multiple learner
pathways. They do not mean every learner must start or finish at every
listed level.

### 2.5 Allowed difficulty labels

- `beginner`
- `elementary`
- `intermediate`
- `advanced`

Difficulty is a broad browsing aid. It must not override the specific
starting and target proficiency information.

### 2.6 Suggested exam relevance values

- `school-assessment`
- `sas`
- `tka`
- `utbk-snbt`

Use only relevant tags. Do not claim examination alignment without
evidence. `school-assessment` is broad; specific school alignment
requires the school’s syllabus or assessment blueprint.

------------------------------------------------------------------------

## 3. Markdown body contract

The body should use normal Markdown headings, paragraphs, lists,
blockquotes, and tables. Avoid unsafe HTML and scripts.

### 3.1 Recommended outline

This is a flexible outline, not a mandatory set of sections.

``` markdown
# Simple Present Tense

## At a glance
- What this topic teaches
- Who it is for
- What students should be able to do

## Learning objectives
...

## Prerequisites
...

## Teaching path
| Stage | Students do | Support |
|---|---|---|
| ... | ... | ... |

## Teaching stages

### Stage 1 — Notice the meaning
...

### Stage 2 — Choose the correct form
...

### Stage 3 — Build a sentence
...

### Stage 4 — Use it independently
...

## Quick review
...

## Remedial support
...

## Enrichment
...

## Assessment connection
...

## Sources and verification
...
```

Do not create artificial stages or empty sections. The topic may need
fewer or more stages.

### 3.2 Useful stage blocks

Use only those that make sense for the stage:

- **Teacher explanation:** concise Indonesian explanation.
- **Suggested teacher language:** words the teacher can say, in English
  or Indonesian as useful.
- **Whiteboard plan:** compact layout the teacher can copy.
- **Model:** completed example with a brief explanation.
- **Ask the students:** oral prompts and likely responses.
- **Student task:** complete activity with all necessary information.
- **Answers and explanations:** close to the task or in a clearly
  labelled reveal section.
- **Readiness checkpoint:** observable evidence that students can move
  on.
- **If students struggle:** immediate support adjustment.

### 3.3 Practice and answer rules

- Normally 4–8 items per short practice set, adjusted to task
  complexity.
- Every closed question must have an answer and a brief reason.
- Identify acceptable alternatives.
- For open tasks, provide illustrative sample answers, not a single
  mandatory answer.
- Do not create ambiguous questions.
- Do not make the teacher find missing texts, images, or audio.

### 3.4 Whiteboard and phone usability

- Keep tables narrow.
- Prefer short examples and stacked layouts.
- Provide a teacher-read-aloud alternative for listening tasks when no
  audio is included.
- Use visual structures that can be drawn or written on a board.
- Avoid relying on color alone to communicate meaning.
- Keep content readable on a phone.

------------------------------------------------------------------------

### 3.5 Accordion presentation contract

The website renders the Markdown body using a fixed, two-level accordion
pattern. This is a presentation rule; it does not change the YAML data
schema, so topic frontmatter continues to use `schema_version: 1`.

**Heading-to-accordion mapping** - Each main topic section written with
an H2 heading (`##`) becomes an independent primary accordion. - Inside
the `## Teaching stages` section, each numbered stage written with an H3
heading (`### Stage 1 — ...`) becomes a nested accordion. - Smaller
headings inside a stage (H4 headings or bold labels) are ordinary
content headings. They remain visible when the stage is expanded. - Do
not create a third accordion level. - The topic title (H1) and metadata
header are not accordions.

**Required interaction** - Every primary section and nested stage starts
collapsed whenever the topic page is opened. - Returning to a topic
always starts with all sections collapsed. - Do not persist accordion
state in localStorage, sessionStorage, cookies, or user profiles. -
Opening a section must not close any other section. - Multiple primary
sections and nested stages may remain open at once. - Provide global
**Expand All** and **Collapse All** controls. Expand All opens all
primary sections and nested stages; Collapse All closes them. -
Accordion state is temporary for the current page visit only. - The same
default behavior applies when a cached topic is opened offline.

**Usability and accessibility** - Use large touch targets and clear
expand/collapse indicators. - Support keyboard interaction and visible
focus. - Expose expanded/collapsed state to assistive technology. - Use
subtle transitions and respect reduced-motion preferences. - Do not
delay content display for animation. - Answer reveal/hide controls may
appear inside a stage, but they are not a third accordion level.

A structurally valid topic file is not required to store accordion state
or any UI-specific open/closed values.

## 4. Sources format

When a topic requires research, include traceable sources in the body
and/or frontmatter.

Suggested frontmatter shape:

``` yaml
sources:
  - title: "Official English Assessment Framework"
    organization: "Relevant official authority"
    url: "https://example.org/official-framework"
    accessed: 2026-11-18
    supports:
      - "The stated assessment competency"
```

The example URL above is a placeholder and must never be used as a real
citation. Replace it with a verified source or omit the source entry.

For source-dependent claims: - Prefer official Indonesian authorities
for Indonesian policy and examinations. - Distinguish official
requirements from teaching recommendations. - Do not invent URLs,
citations, regulations, or dates. - If current verification is
unavailable, disclose the limitation in the topic. - Do not claim
school-specific alignment without the relevant school documents.

------------------------------------------------------------------------

## 5. Publication lifecycle

| Status      | Meaning                                             | Publicly visible? |
|-------------|-----------------------------------------------------|------------------:|
| `draft`     | Work in progress or awaiting review                 |                No |
| `published` | Approved and available on the website               |               Yes |
| `archived`  | Retained in GitHub but removed from normal browsing |                No |

Recommended behavior: - New uploads default to `draft` unless the owner
explicitly chooses publish. - Preview works for drafts in the admin
session. - Publishing requires owner confirmation. - Archiving is
preferred to permanent deletion when the owner simply wants to remove a
topic from public browsing. - Permanent deletion requires explicit
confirmation and creates a Git history record.

------------------------------------------------------------------------

## 6. Validation rules

The website should reject or flag a file when: - YAML cannot be
parsed. - A required field is missing. - `schema_version` is
unsupported. - `id` is not a valid slug. - `id` does not match the
filename. - The ID duplicates another topic. - `category`, `difficulty`,
`status`, or proficiency values are invalid. - `grades` is empty or
contains values outside 7–12. - `proficiency.starting` or
`proficiency.target` is empty. - `updated` is not a valid ISO date. -
The Markdown body is empty. - The path attempts to write outside
`content/topics/`.

Warnings (not necessarily blockers) may include: - Missing learning
objectives. - No practice tasks. - Missing answers for a closed
exercise. - No source note for a current examination claim. - An
unusually wide table. - A grade/proficiency combination that deserves
human review.

Validation should distinguish syntax errors from pedagogical review
warnings. A structurally valid file is not automatically a pedagogically
correct file.

------------------------------------------------------------------------

## 7. Safe rendering

The public website must: - Render Markdown through a maintained
parser. - Sanitize HTML output. - Disallow scripts, event handlers, and
unsafe embedded content. - Restrict image sources to approved local
assets or safe remote sources. - Treat metadata as data, never as
executable code. - Escape user-provided text in the admin interface.

------------------------------------------------------------------------

## 8. Versioning and future changes

- Keep `schema_version` in every topic.
- Do not silently change field meanings.
- If a future schema changes required fields or structure, increment the
  version.
- Provide a migration or compatibility strategy before rejecting old
  published files.
- Keep the schema and example topic in the GitHub repository.
- Update the AI Topic Generator whenever the schema changes.

------------------------------------------------------------------------

## 9. Minimal valid topic file

``` markdown
---
schema_version: 1
id: sample-topic
title: Sample Topic
category: grammar
summary: A short description of the topic.
grades: [10, 11, 12]
proficiency:
  starting: [pre-a1]
  target: [a1]
difficulty: beginner
exam_relevance: []
tags: [sample, grammar]
status: draft
updated: 2026-11-18
---

# Sample Topic

## At a glance
This is a draft placeholder. Replace it with complete teaching content before publication.

## Teaching path
| Stage | Student action | Support |
|---|---|---|
| 1 | Notice an example | Teacher model |

## Teaching stages
### Stage 1 — First step
Add the actual explanation, model, student task, answers, and readiness checkpoint.

## Sources and verification
Add sources only when needed and only when verified.
```

------------------------------------------------------------------------

**End of content schema.**
