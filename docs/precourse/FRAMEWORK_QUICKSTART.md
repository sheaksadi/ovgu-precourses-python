# Presentation framework quickstart

Adapted from the prepared course package and checked against this checkout.
Nuxt organizes the Vue app and Nitro server; Tailwind/CSS controls presentation;
Pinia stores reactive browser state. Node runs this tooling. Python is the subject
being taught, using a local interpreter or the existing browser exercise runner.

## Run and navigate

```bash
cd ~/projects/ovgu-precourses-python
node --version
npm ci
npm run dev
```

Use the working Node 22 setup. Install dependencies initially or after lockfile
changes, not before every lesson. Keep the server terminal open; Ctrl+C stops it.
Open the URL Nuxt prints. Use a second terminal for Git and edits.

Only `/presenter` and `/control` move the shared room position. Slide viewers
can browse locally and rejoin with Sync. `/join` selects language and follows
read-only; `/print` renders the full library. Presenter previews use `?peek=1`.
The four-day routes are teaching choices, not browser roles or view modes.

A phone's localhost is the phone itself. Use a reachable laptop address and the
actual server port. Check local app access, phone page access, then live following;
a working Windows localhost page alone does not prove phone/WSL connectivity.
Keep the printed workbook available when classroom networking is unavailable.

## Edit the right file

| Change | File |
| --- | --- |
| Order, titles, speaker notes | `slides.config.ts` |
| One slide's content | `pages/slides/pre-xxxx.vue` and its component |
| Classroom wording | `locales/de.ts`, matching structure in `locales/en.ts` |
| Repeated content shapes | `components/slides/` |
| Shared chrome | `layouts/`, `app.vue` |
| Visual conventions | `DESIGN_SYSTEM.md`, `assets/css/main.css` |

Read `AGENTS.md` before editing slides. Generate a new permanent ID:

```bash
npm run slide:new -- "New lesson" --template content
```

The generator advances the counter and appends the entry. Move only that entry
to change order. Fill its content and notes. Never reuse IDs, decrement the
counter, or add slide-local page numbering. Avoid editing generated `.nuxt/`,
`.output/` or `node_modules/` files.

Repository explanations are mainly English; German exercises, teaching phrases
and slide copy belong in classroom material. Keep route names Grundlagen,
Aufbau and Vertiefung. Do not translate identifiers or filenames for this work.

## Verify and commit

```bash
npm run slides:check
npx nuxi typecheck
npm run build
git diff --check
```

Typecheck needs its Vue/TypeScript tooling installed. Do not infer browser
correctness from a build. With the app running, the existing browser check needs
Chromium with remote debugging (run in a separate terminal):

```bash
chromium --headless=new --no-sandbox --remote-debugging-port=9222 \
  --user-data-dir=/tmp/deck-profile about:blank
```

Then run `npm run check:deck`; screenshots default to `deck-shots/` (or set
`OUT_DIR`). `npm run check:sync` checks room behavior when that code changes.
There are no configured formatter or lint scripts in this checkout.

Review `git diff`, stage exact files, review `git diff --staged`, and make one
meaningful commit per coherent change. Commit locally; pushing publishes work
and is a separate step. The target branch for this contribution is
`deck/course-content`.

## Reuse later

For another subject, retain the framework and first replace the learning goals
and tasks in a separate branch/repository. Manim videos can be rendered ahead
of time under `public/`, with a still-image/print fallback; no live Python renderer
is needed on student devices. Automated curriculum routes and night mode remain
future work, not prerequisites for the four-day course.

With the app running, `npm run check:problems` verifies the existing exercise service.
