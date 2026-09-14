# AI Instructions for the Nuxt Presentation Template

The authoritative guide is [AGENTS.md](AGENTS.md). This file is the quick tour of the
file structure and the three conventions that everything else depends on.

## Conventions

1. Each slide has a permanent id like `PRE-0004`, allocated by `npm run slide:new` and
   never reused. `PRE-0004` means `pages/slides/pre-0004.vue` at route `/slides/pre-0004`.
2. Order lives in `slides.config.ts` only. Shared chrome — page number, progress bar,
   deck title, sync button — lives in `layouts/`, drawn on top of the slide.
3. The room's slide moves only from `/control` and `/presenter`, and only with the room
   key. Every slide view has its own local position and syncs back on demand.

## File structure

- `slides.config.ts`: the deck. `slides` is the ordered array of entries (`id`,
  `title`, `subtitle`, `parent`, `layout`, `teleprompter`, `transition`, `duration`,
  `backgroundColor`, `hidden`, `interactive`), and `deckConfig` holds the deck-wide
  values the layouts render.
- `slides.counter.json`: deck prefix and the next free slide number. Owned by
  `npm run slide:new`; it never counts down.
- `utils/slideId.ts`: id formatting, parsing, and route conversion.
- `pages/slides/<id lowercased>.vue`: every slide page in one folder, content only.
- `pages/index.vue`: start page with one button per view: projector, presenter, control panel, follow along.
- `layouts/slide.vue`, `slide-bare.vue`, `slide-section.vue`, `slide-interactive.vue`:
  the chrome. `app.vue` chooses one per route from the config and the device's view mode.
- `pages/presenter.vue`: presenter view — live and next slide, notes, timer, deck list,
  audience counts. Writes the room's slide.
- `pages/join.vue`: follow-along landing page, opened by the title slide's QR code. The
  device picks German or English, stays in stage mode and follows the room's slide.
- `pages/print.vue`: handout — every slide with its notes, one per page, for PDF.
- `server/api/navigate.post.ts`, `server/api/command.post.ts`: controller writes with
  collision suppression. `server/api/room-peers.get.ts` reports what the server sees.
- `scripts/check-slides.mjs`, `scripts/check-sync.mjs`, `scripts/drive-deck.mjs`:
  `npm run slides:check`, `check:sync`, `check:deck`.
- `components/slides/SyncPill.vue`: the off-sync indicator and sync button.
- `components/interactive/`: `InteractionGuardModal.vue` plus the demo components
  `InteractiveSteps.vue` and `InteractiveQuiz.vue`.
- `components/presenter/SlidePreview.vue`: scaled live thumbnail of a slide route.
- `components/slides/`: `TitleSlide`, `ContentSlide`, `SplitSlide`, `CodeSlide`,
  `ImageSlide` — the content components used inside slide pages.
- `composables/useSlideData.ts`: order, numbering, routes, and the slide tree.
- `composables/usePresentation.ts`: navigation by slide id, local first, global only for
  a controller.
- `composables/useDeckRole.ts`: role from the route, and the device's view mode.
- `composables/useInteraction.ts` and `stores/interactionStore.ts`: per-device
  interaction progress, which is what the guard modal reads.
- `composables/useCurrentSlide.ts`: route-first lookup of the current slide, used by
  the layouts and the teleprompter.

## Adding a slide

```bash
npm run slide:new -- "Roadmap"                       # main slide
npm run slide:new -- "Q3 detail" --parent PRE-0004   # sub-slide
```

Then write the page content and the `teleprompter` text in `slides.config.ts`. The new
entry is appended at the end of the deck; move it in the array if it belongs earlier.

## Best practices

- Use the components in `components/slides/` so slides stay visually consistent.
- Keep `teleprompter` notes filled in, since the remote control reads them.
- Never hardcode a page number or a slide count in a page. Read it from the layout.
- Never broadcast a slide change from a slide view. Only `/control` and `/presenter`
  write the room's position, and the server rejects anything else.
- Build interactive components on `useInteraction`, so the guard modal and the step
  indicator work without extra wiring.
- Run `npm run slides:check` after editing the config, and the two behaviour checks
  before claiming the deck works.
