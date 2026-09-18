# Python precourse at OVGU

A Nuxt 3 / Vue presentation with Tailwind CSS v4, Pinia and a phone remote.
The shortened course runs **28 September–1 October 2026**, Monday–Thursday,
**two hours daily**. The instructor chooses one route for the class:
**Grundlagen**, **Aufbau** or **Vertiefung**.

## Course material

- [Four-day curriculum](docs/precourse/FOUR_DAY_COURSE_DE.md): outcomes, timing and route decisions.
- [German student workbook](docs/precourse/STUDENT_WORKBOOK_DE.md): problems, scaffolds and Temperatur-Check.
- [Teacher notes and German answer key](docs/precourse/TEACHER_NOTES_DE.md).
- [Slide map and instructor run sheet](docs/precourse/SLIDE_REVISION_PLAN.md): selected slides and reference material.
- [Framework quickstart](docs/precourse/FRAMEWORK_QUICKSTART.md): running and extending the presentation.

Repository documentation is primarily English. Student tasks, slide wording and
teaching phrases are German; code identifiers and filenames retain their spelling.
Existing English translations remain available. The workbook is intentionally German.

## Run locally

With Node 22 and npm available:

```bash
npm ci
npm run dev
```

Open the URL printed by Nuxt. Use `/presenter` or `/control` to move the room;
`/join` is the read-only follow-along entry. The short course uses a manual run
sheet: Next still traverses the full content library. No route picker is required.

## Contributing and checks

Read [AGENTS.md](AGENTS.md) and [the design system](DESIGN_SYSTEM.md) first.
Allocate slides with `npm run slide:new -- "Title"`; preserve permanent IDs.
Only `slides.config.ts` controls presentation order.

```bash
npm run slides:check
npx nuxi typecheck
npm run build
```

With the app and a Chromium debugging session running, use `npm run check:deck`.
See the quickstart for prerequisites. There are no configured lint/format scripts;
use `git diff --check` and match surrounding conventions. Keep changes focused and
review the staged diff before committing.

With the app running, `npm run check:problems` verifies the existing exercise service.
