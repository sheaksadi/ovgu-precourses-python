# Agent Instructions

Nuxt 3 presentation template: Tailwind CSS v4, Pinia, and Nitro WebSockets for the
phone remote. Read this file before adding, removing, reordering, or restyling slides.

## The three rules that matter

1. **Slide ids are permanent.** Every slide owns an id such as `PRE-0004`: a three
   letter deck prefix, a hyphen, and a zero padded counter. Ids are allocated once
   and never reused or renumbered.
2. **Presentation order is the array order in `slides.config.ts`, and nothing else.**
   Page numbers, progress bar, and every other piece of shared chrome are drawn by a
   layout in `layouts/`. Reordering a slide therefore touches one file: the config.
3. **Only `/control` and `/presenter` move the room.** Every other screen, the
   projector included, keeps its own local position and rejoins with the sync button.
   The server enforces this, so never add a write path around it.

## Slide ids

- Format: `^[A-Z]{3}-\d{4,}$`. The prefix and the next free number live in
  `slides.counter.json`; that file is the only source of truth for the counter.
- The counter only ever moves forward. Deleting a slide leaves a permanent gap, and
  the next new slide still takes the next unused number.
- Past `PRE-9999` the number simply grows to five digits (`PRE-10000`), then six, and
  so on. Nothing else changes: the padding is a minimum width, not a maximum.
- The id decides the page file and the route. Every slide page lives in one folder:
  `PRE-0004` is `pages/slides/pre-0004.vue`, served at `/slides/pre-0004`. Old root
  addresses (`/pre-0004`) redirect there (`server/middleware/legacy-slide-routes.ts`).
- Helpers for ids are in `utils/slideId.ts` (`formatSlideId`, `parseSlideId`,
  `slideIdToRoute`, `routeToSlideId`). Use them instead of writing new string logic.
- Never pick an id by hand, and never edit `slides.counter.json` to go backwards.

## Adding a slide

Always use the generator, because it owns the counter:

```bash
npm run slide:new -- "Roadmap"                          # main slide, default layout
npm run slide:new -- "Q3 detail" --parent PRE-0004      # sub-slide of PRE-0004
npm run slide:new -- "Closing" --layout slide-section   # different layout
npm run slide:new -- "Architecture" --template split    # different page template
```

Options: `--parent <id>`, `--layout <slide|slide-bare|slide-section>`,
`--template <title|content|split|code|image>`, `--subtitle "..."`.

The generator allocates the next id, creates `pages/slides/<id lowercased>.vue`, and
appends the config entry immediately before the `// <slides:end>` marker. New slides
land at the end of the deck, so move the entry in `slides.config.ts` if it belongs
somewhere else. Afterwards, fill in the `teleprompter` text and the page content.

## Reordering, re-parenting, deleting

- **Reorder:** move the entry inside the `slides` array. Do not touch pages, ids, or
  routes. Numbering is recomputed from the array on every render.
- **Re-parent:** set or clear `parent` on the entry. A slide with a `parent` becomes a
  sub-slide and is numbered `2.1`, `2.2`, and so on under its parent's number.
- **Hide without deleting:** set `hidden: true`. The page and the id stay; the slide
  drops out of the presentation and out of the numbering.
- **Delete:** remove the entry from `slides.config.ts` and delete `pages/slides/<id>.vue`. Leave
  `slides.counter.json` alone, so the number stays retired.

## Layouts

`layouts/` holds everything that repeats across slides:

| Layout          | Use for                                                                |
| --------------- | ---------------------------------------------------------------------- |
| `slide`             | Default. Deck title, slide id, progress bar, page number.          |
| `slide-bare`        | Title slides and full-bleed images: background only.               |
| `slide-section`     | Section breaks and closing slides: accent rule, centred page number. |
| `slide-interactive` | Chosen automatically on a device in interactive mode: step indicator and local navigation. |

`app.vue` picks the layout per route: a page that sets `layout` in `definePageMeta`
keeps control, a device in interactive mode on a slide that declares `interactive` gets
`slide-interactive`, any other slide gets the layout named in its config entry, and
everything else renders with no layout.

Rules for slide pages:

- A slide page renders content only. No page number, no progress bar, no deck title,
  and no `definePageMeta` — the config decides its layout.
- To change chrome for the whole deck, edit the layout or `deckConfig` in
  `slides.config.ts` (`title`, `author`, `showSlideId`, `showPageNumber`,
  `showProgressBar`).
- To add a layout: create `layouts/<name>.vue`, add `<name>` to the `SlideLayoutName`
  union in `slides.config.ts`, and add it to the `LAYOUTS` array in
  `scripts/new-slide.mjs`. Read the current slide with `useCurrentSlide()`, which
  resolves from the route first so the chrome is correct during server rendering.

## Reusable slide components

`components/slides/` holds the content components: `TitleSlide`, `ContentSlide`,
`SplitSlide`, `CodeSlide`, `ImageSlide`. They fill the layout's content area and draw
no chrome of their own. Prefer them over bespoke markup so slides stay consistent.

## Surfaces and who owns the order

| Surface | Route | Room's slide | Own slide |
| --- | --- | --- | --- |
| Phone remote | `/control` | writes | — |
| Presenter view | `/presenter` | writes | — |
| Slide view (projector or audience device) | `/slides/pre-xxxx` | reads | writes |
| Dashboard | `/dashboard` | reads | — |
| Follow-along landing page (read-only, picks language) | `/join` | reads | — |
| Handout | `/print` | reads | — |
| Preview frame inside the presenter view | `/slides/pre-xxxx?peek=1` | reads | driven by the presenter view |

Only a client that is showing a slide is a screen in the room: the landing page,
the join page and the handout are never navigated by the presenter's moves and
never appear in the audience counts.

`composables/useDeckRole.ts` derives the role from the route, so a slide view cannot
promote itself with a query parameter. It also owns the per-device view mode:
`stage` (clean render, the default) or `interactive`, taken from `?mode=` and remembered
in `localStorage`. The mode travels in the query on every navigation, so the server
renders the right chrome immediately.

The server is the second half of the rule: `server/utils/wsManager.ts` records the role a
peer announced in its `hello` message, and `server/routes/_ws.ts` drops `navigate` from
anything that is not `control` or `presenter`, replying with the authoritative state.

### Controller events

- Every `/control` and `/presenter` view may drive the room, regardless of where the
  server is hosted.
- Controllers write through `POST /api/navigate` and `POST /api/command`; WebSockets
  broadcast authoritative state and commands to all screens.
- The server accepts the first controller event in a 100 ms window and drops
  overlapping requests, preventing two controllers from racing the room position.
- `GET /api/room-peers` (loopback only) reports what the server believes: state,
  client count, roles and the audience summary. The checks use it.

### Liveness

Peers are keyed by `peer.id`, never by the peer object: each event hands over a fresh
wrapper, and keying by the object created a ghost client per message. Liveness comes
from the heartbeat, because the socket's close event is not guaranteed to arrive; the
prune loop in `server/routes/_ws.ts` drops clients after `PEER_TTL` and resets the room
once the last one is gone, so the next session starts at the first slide.

## Global and local position

- `stores/presentationStore.ts` holds `globalSlideId` (the room, written only from a
  server `state` message), `localSlideId` (this device), and `following` (whether this
  device still adopts the room's slide). The `detached` getter is the difference.
- A viewer follows the room until it navigates on its own; then it is off-sync until
  `syncToGlobal()` runs, which is the `s` key or `components/slides/SyncPill.vue`,
  mounted top right in every slide layout. The pill says how far off the screen is,
  offers a live peek at the room's slide, and can turn on `autoFollow`, which catches
  the device up by itself once no interaction is pending.
- `composables/usePresentation.ts` is the navigation API: `requestSlide(id, options)`,
  `goToSlide`, `goToIndex`, `nextSlide`, `prevSlide`, `syncToGlobal`,
  `startPresentation`, `exitPresentation`. Every move changes the local position, and
  only a controller's move also changes the global one. Keep it that way.
- `composables/useSlideData.ts` derives `flatSlides` (presentation order, numbering,
  routes, layouts), `slideTree` (main slides with their sub-slides), and
  `mainSlideCount`.
- The WebSocket protocol in `composables/useWebSocket.ts`, `server/routes/_ws.ts`, and
  `server/utils/wsManager.ts` carries `slideId`, never an index. Message types:
  `hello`, `navigate`, `presence`, `sync_request`, `command`, `pointer` from the client;
  `state`, `clients_count`, `presence_summary`, `command`, `pointer` from the server.

## Interactive slides

An interactive slide is a normal slide with an `interactive` entry in
`slides.config.ts`:

```ts
{
  id: 'PRE-0009',
  title: 'Try It Yourself',
  interactive: { id: 'add-a-slide', steps: 3 },
}
```

- A device in stage mode renders the slide normally. A device in interactive mode gets
  `slide-interactive` and may work at its own pace.
- Components report progress through `composables/useInteraction.ts`
  (`markStarted`, `setStep`, `next`, `back`, `complete`, `reset`). Progress lives in
  `stores/interactionStore.ts`, per device, mirrored into `localStorage`. Nothing is
  sent to the server and no viewer sees another viewer's answers.
- Leaving a slide whose interaction is started and unfinished opens
  `components/interactive/InteractionGuardModal.vue`: **Skip now** goes to the new slide
  and marks the interaction skipped, **Stay here** keeps the viewer in place. Refusing
  the presenter's move also stops following, which is what makes the sync pill appear;
  refusing your own tap does not.
- `components/interactive/` holds the demo components `InteractiveSteps.vue` and
  `InteractiveQuiz.vue`. Write new ones against `useInteraction` so the guard and the
  step indicator work for free.
- The presenter view only ever learns counts: how many devices follow, how many drifted,
  how many are mid-interaction, from `presence_summary`.

## Language

Course text is German or English, chosen per device like the view mode.

- Every course-facing string lives in `locales/de.ts` (the source shape) and
  `locales/en.ts` (typed against it). Pages and components call
  `useI18n()` from `composables/useI18n.ts`: `t(key, vars)` for strings,
  `tm<T>(key)` for arrays, objects and code samples.
- The language lives in the `deck-lang` cookie, so the server renders the right
  words. A link sets it on any page and every navigation: `?lang=en`, `?lang=de`, or
  just `?en` / `?de` (`plugins/i18n-link.ts`). `setLocale` writes the cookie.
- `l` toggles it on a keyboard (`composables/useKeyBindings.ts`, handled in
  `app.vue`). Touch screens get `components/deck/LanguagePill.vue` in the slide
  layouts; the projector never shows it.
- Language is never sent to the server and never changes another screen.
- Design-system slides and the notes in `slides.config.ts` stay untranslated.

## Follow-along devices

The title slide's QR code opens `/join`, which is read-only: the device picks a
language, switches to stage mode and follows the room. It does not turn on
interactive mode. On a slide with an `interactive` entry, touch devices get the
small `components/deck/InteractiveHint.vue` pill, and only tapping it switches
that one device to interactive mode.

## Presenter view

`pages/presenter.vue` is the second controller. It shows the live slide and the next one
through `components/presenter/SlidePreview.vue`, the speaker notes, pacing, the deck
list and the audience counts. Typing a number jumps to that main slide.

Each preview is one iframe that boots once and is then driven by `postMessage`
(`{ type: 'deck:peek', slideId }`), handled in `app.vue`. A peek frame pins its own
position, never follows the room, cannot move it, and stays out of the audience counts,
so advancing a slide no longer reloads a second copy of the app.

Pacing comes from `duration` (planned minutes) on a slide entry: the presenter view sums
the deck, compares the elapsed time with the plan, and turns the clock amber then red as
it slips.

## Handout

`pages/print.vue` renders every slide in order with its notes, one per page, for "Print
to PDF". Each slide is a peek frame, so the handout always matches what the room saw.

## Deck conventions worth knowing

- Every slide gets the same soft entrance (`slide-rise` in `app.vue`, also set as
  `app.layoutTransition` in `nuxt.config.ts` for slides that switch layout); pages never
  animate their own elements in. `transition: 'none'` on a slide entry skips it, for
  the stages of one scene that must cut into each other (PRE-0035 to PRE-0037).
- `duration` is planned minutes, read by the presenter view.
- Storage keys are per deck (`deck:<PREFIX>:…`, see `storageKey` in
  `composables/useDeckRole.ts`), so two decks on one host never collide.
- Every animation respects `prefers-reduced-motion`, handled once in `app.vue`.

## Checks

```bash
npm run slides:check   # config and pages agree, ids and the counter are sane
npx nuxi typecheck
npm run build

# Behaviour, with the app running:
npm run check:sync     # who may move the room, presence, room reset
npm run check:deck     # drives every surface in headless Chromium, writes screenshots
```

`npm run check:deck` needs Chromium with remote debugging:

```bash
chromium --headless=new --no-sandbox --remote-debugging-port=9222 \
  --user-data-dir=/tmp/deck-profile about:blank &
```
