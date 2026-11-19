# Convert a lesson PDF for Teach EFL

Give this guide and the lesson PDF to an AI that can read the attachment. You can say, “Convert this PDF into one upload-ready Teach EFL lesson. Follow the attached guide.” If you have a separate teacher handover, attach it too.

## Instructions for the AI

Your reader is an Indonesian bimbel teacher who may have only a phone and whiteboard. Produce one self-contained UTF-8 Markdown topic. The teacher should be able to upload that same file through GitHub or the site's admin editor.

### 1. Read and reconcile the source

Read all pages, including tables, captions, highlighted replacement targets, exercises, solutions and teacher notes. Use OCR for scans and check its reading order. Inventory the sections, patterns, numbered starters and matched banks before drafting. Separate student material from private planning notes. Use a handover to guide your choices without reproducing private notes in a public lesson.

For a conversion, preserve the source's sequence, wording, examples, languages, alternatives and scope wherever they work. Remove page furniture, repair line breaks, and carry meaningful highlighting into Markdown. Check blanks, negatives, timelines and numbering against the PDF. If a diagram is needed, convey its information in words or a narrow table. Ask about unreadable or missing material that affects an activity. Never invent a missing page, answer, curriculum claim or PDF URL. If the PDF contains several independent lessons, ask which to convert or whether the teacher wants separate files.

For a requested adaptation, use the teaching approach below to fill gaps. For an exact conversion, preserve the source; flag meaningful ambiguities separately for the teacher. For collaborative drafting, work one pattern at a time unless asked for the complete lesson. An approved source can be converted in full in one pass.

### 2. Shape a lesson the teacher can use immediately

- Open with a familiar situation and a complete, natural English model. Give a short Indonesian explanation and invite the learner to try the pattern aloud.
- Teach one genuine use at a time. Keep the context accessible as the English grows harder. Use fictional friends, food, travel or familiar choices so no one needs a particular possession or personal experience. Let kindness, boundaries or feelings come up naturally.
- For grammar production lessons following the handover, give each target pattern ten progressively graded starters. Make 1–2 easy to enter, 3–5 accessible with short chunks, 6–7 more independent, 8–9 invite reasoning, and 10 a stretch. The teacher selects useful items. For a reading passage, listening activity or an exact conversion, preserve the task that suits the source.
- Put a same-numbered vocabulary bank immediately after each starter set. Supply two or more fitting choices where practical. Use words and short chunks that still leave the learner something to construct. Check every option in the actual sentence, including verb form and agreement.
- For quick-fire practice, give a complete model. Highlight one word to change, then a phrase, then fade the highlighting and ask for a new clause or idea. Keep the target pattern and intended meaning. Verify that the model still works after each substitution.
- Keep closed-task answers and short reasons beside their questions. For open tasks give illustrative completions and accept grammatical, relevant alternatives. Finish with something the teacher can hear or see the learner do. If the learner stalls, return to the model and offer two choices.

### 3. Make the file compatible with the site

Start at the first character with a line of three hyphens. Use the following example as a syntax reference. Replace every example value with the lesson's actual metadata. Preserve the existing id and category when revising a lesson so its URL stays stable.

```yaml
---
schema_version: 1
id: describing-routines
title: "Describing routines"
category: grammar
summary: "Say what people usually do using familiar verbs and time expressions."
grades: [10, 11, 12]
proficiency:
  starting: [pre-a1, a1]
  target: [a1, a2]
difficulty: beginner
exam_relevance: []
tags: [routines, simple-present]
status: published
updated: "2026-11-19"
---
```

- Use a unique lowercase id consisting of letters or numbers, with single hyphens between words. Use the exact filename `<id>.md`.
- Category must be one of `grammar`, `vocabulary`, `reading`, `writing`, `speaking`, `listening`, `examination`, `mixed-skills`.
- Grades are a nonempty list of integers from 7 through 12. Both proficiency lists must be nonempty and use only `pre-a1`, `a1`, `a2`, `b1`, `b2`. Difficulty is `beginner`, `elementary`, `intermediate` or `advanced`. Use the teacher's stated audience. If grades are unknown, ask. Treat inferred proficiency as a browsing estimate and tell the teacher separately.
- Give the lesson at least one searchable tag. Leave exam relevance as an empty list unless supported. Set the actual revision date as YYYY-MM-DD. Quote titles or summaries that contain YAML punctuation.
- Use `published` when the teacher requests a ready-to-add lesson. The upload or commit is their publication decision. Use `draft` for review-only work or `archived` for retired content. Only published topics appear in the library.

After the closing hyphens, write the Markdown body. Use one `#` title and put **all visible lesson content under level-two headings**. For nested stage accordions, spell the parent heading exactly `## Teaching stages` and use `###` for each stage or expression. Use `####` for work within that stage. Keep tables narrow. For optional answers or a vocabulary bank, use this supported structure with blank lines around the Markdown list:

```markdown
<details>
<summary>Vocabulary choices</summary>

1. a pen / a notebook
2. tea / juice

</details>
```

A single-file conversion must work on its own. Include a printable link only if the teacher supplies a real public URL or separately uploads an asset. A local attachment path cannot serve a file on the website.

### 4. Verify and deliver

Check that the filename, id and folder category agree, every required field is present, the grade and level labels are valid, and the UTF-8 file is at most 1,000,000 bytes. Count the original activities and banks again; check the final page, each answer link by number, and the independent practice. Remove placeholders. Deliver the actual named Markdown file if possible. In a text-only tool, give the filename separately and put the entire file in one copyable block, using an outer fence longer than any fence inside the lesson. Keep commentary outside the file.

## How the teacher adds the result

- **GitHub:** Open `gasihbudi-teacher/teach-efl`, go to `content/topics/<category>/`, and choose **Add file → Upload files**. For an existing lesson, edit its file in place. Commit to `main`. Once Cloudflare finishes rebuilding, open the **Topics** library or `https://teach-efl.pages.dev/#/topic/<id>`. The production site discovers the Markdown automatically.
- **Configured admin editor:** Open `/admin/`, sign in, choose the generated `.md` file, select **Validate**, inspect the preview, then choose **Save to GitHub**. Saving an existing id in the same category updates that file. GitHub upload also works independently of the admin editor.
- The separate static preview uses generated indexes. A repository maintainer who also updates that preview can run `python3 scripts/build_content.py` with the dependencies from `scripts/requirements.txt` and commit both generated JSON files.
