# Project Instructions

See [AGENTS.md](AGENTS.md) for how this presentation template works. The short
version:

- Slide ids (`PRE-0001`) are permanent, allocated only by `npm run slide:new`, and
  never reused after a slide is deleted.
- Presentation order is the array order in `slides.config.ts`. Reordering a slide
  means moving one entry, never editing pages.
- Page numbers and other shared chrome live in `layouts/`, on top of the slides.
  Slide pages contain content only.
- Only `/control` and `/presenter` expose controls that move the room's slide.
  Every slide view keeps
  its own local position and rejoins with the sync button, or the `s` key.
- Before saying the deck works, run `npm run slides:check`, then `npm run check:sync`
  and `npm run check:deck` against a running app.
