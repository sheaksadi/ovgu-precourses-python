# Revision plan: first review pass (2026-09-15)

Feedback from walking through the deck slide by slide, turned into work. Slide
numbers are the page labels the deck shows (`19.3` = main slide 19, sub-slide 3);
ids are listed so the numbers can shift without losing track.

Work top to bottom. Each phase gets a short sub-plan written into this file when
it starts, because most items need a closer look at the code before building.
Tick items off as they land. Content after the APIs section is discussed later.

## Principles from the review

- **Advent of Code style wherever possible.** The projector shows the full
  problem description. Each follow-along device shows the same problem plus its
  own puzzle input and one answer field. Only the answer is checked, not how the
  program got there.
- **Function-building tasks are the exception.** There is no single answer, so
  the student writes the function on their device, runs the tests, and submits
  once they pass.
- **Solving is visible to the room.** A solve raises a toast in the top-right
  corner of the projector ("Mira solved Part 1"), which holds for a moment and
  leaves. A small leaderboard ranks who solved first.
- **After a problem round, walk through the solutions.** Zoom into the solution
  code, run it step by step, zoom back out; one per problem.
- **The presenter view and the remote stay the controls.** The projector shows
  results but moves nothing.

---

## Phase 0: quick fixes

- [x] **Slide 1** (PRE-0033): remove the instructor and tutor names.
- [x] **Every slide:** remove the "Design System" label in the top-left corner.
- [x] **Slide 20** (PRE-0099 to PRE-0103): the dotted lines of the second
      `return` are not aligned.
- [x] **Slide 21.3** (PRE-0107): the call-stack animation is too fast. Slow it
      down and play it step by step.
- [x] **Slide 22.1** (PRE-0109): the `a` and `b` labels are not centred in
      their circles.
- [x] **Slide 30** (PRE-0132 to PRE-0135): use The Cat API instead of the dog
      API, with the real URL `https://api.thecatapi.com/v1/images/search`.

## Phase 1: audience identity and notifications

- [x] **Names on the follow-along view.** Opening `/join` (or a slide on a
      phone) offers an optional name field. Skipping it gives a generated cute
      name (e.g. "Sleepy Otter", "Kleiner Pinguin"), kept per device in a
      cookie and changeable later. The server knows every audience member by
      a stable client id and name.
- [x] **Notification system.** One toast component in the design system: stacks
      in the top-right, enters and leaves with the deck's motion, holds a few
      seconds. It gets a page in the style guide section, so every notification
      in the deck looks the same.

## Phase 2: introductions spinner, played by the audience

Slide 2 (PRE-0038). Today every screen spins on its own.

- [x] Each student spins on their own follow-along device; the result is sent to
      the room.
- [x] The projector has no spin button and ignores Enter. It shows who spun
      what, and "waiting for a spin" in between.
- [x] The presenter view and the remote keep a spin button, for students without
      a phone.
- [x] Confirmed with the user: projector shows, presenter view and remote spin.

## Phase 3: problem engine

The shared machinery for every practice round in phases 4 and 5.

- [ ] **Puzzle rounds (Advent of Code style).** A problem has a description, a
      generator that makes a personal puzzle input from a seed (the client id),
      and a solver that computes the expected answer on the server. The device
      shows the description, a "copy input" button and an answer field. Wrong
      answers get a gentle retry message; right answers are recorded once.
- [ ] **Code tasks (function building).** The device has a small editor that runs
      Python in the browser (Pyodide), runs hidden and visible tests against the
      student's function, and submits when they pass.
      Decided: Pyodide is bundled with the deck, so it works without internet.
- [ ] **Room state.** Solves live in the WebSocket room: who solved which part,
      when. It resets with the room.
- [ ] **Projector view of a round.** The problem description, a live count of
      solves, the solve toasts, and a leaderboard (first solvers first).
- [ ] **Presenter view and dashboard.** The same solves, plus who is still
      working, so the presenter knows whom to help.
- [ ] **Solution walkthrough scene.** A reusable slide: zoom into the solution
      code, step through it with values changing, zoom back out.

## Phase 4: practice rounds, in deck order

Every "Jetzt du" slide changes. Rounds use the puzzle format unless the task is
building a function.

- [ ] **Slide 11** (PRE-0070, lists): convert to a puzzle round.
- [ ] **Slide 17.4** (PRE-0094, loops everywhere, randomness): drop
      `random.randint` from the loops section. The dice scene moves to the
      package slide (phase 5, slide 29).
- [ ] **Slide 18** (PRE-0089, loops): puzzle round of simple logic problems,
      then one solution walkthrough slide per problem.
- [ ] **New round after slide 21** (maths and physics functions): problems that
      can be solved without functions but get easier with a few small ones.
      The device offers hint functions to copy.
- [ ] **Slide 23** (PRE-0112, functions): code tasks. The projector keeps the
      Python examples; the devices get the editor, tests and submit.
- [ ] **Slide 25** (PRE-0118, built-ins): convert to a puzzle round.
- [ ] **Slide 27** (PRE-0123, dictionaries): convert to a puzzle round.

## Phase 5: libraries, documentation, APIs

- [ ] **Slide 29** (PRE-0127, libraries for AI and ML): the install part shows
      installing one package first, then several one after another, then an
      animated step that imports one and uses it. The dice scene from 17.4 lands
      here as the example. The rest of the libraries scene stays; it was liked.
- [ ] **New problem round after slide 29:** school maths and physics the students
      already know, now solved in code, easier with built-ins and libraries.
      Puzzle format, not too hard.
- [ ] **New slide: "But how do you know what exists?"** An animated browser demo
      (like the PyCharm install): search "python built-in functions", open
      docs.python.org, scroll through the functions and a use case or two.
- [ ] **New slide: finding a third-party library.** Same demo style: search for
      pandas, open its documentation, find a function the course uses.
- [ ] **Slide 30** (APIs): cat API, see phase 0.

## Later

- [ ] What comes after the APIs section: to discuss.

---

## Sub-plans

Written here as each phase starts.

### Phase 1: identity and notifications

- `utils/cuteNames.ts`: adjective + animal, 16 × 16 names, in German with the
  right adjective ending or in English. A generated name is stored as text but
  can be read back into its parts, so it follows the language switch.
  `avatarFor(name)` gives a colour from the name and the cast sprite when the
  animal has one.
- `composables/useAudience.ts`: `deck-audience` (device id) and `deck-name`
  cookies, generated on first use, so server render and reload agree.
- `/join`: optional name field; empty shows "Without a name you are
  [Fluffy Otter 🎲]", the die rolls another. Opening the slides saves the name.
- WebSocket hello carries `audienceId` and `name` for viewers; the server keeps
  them per peer (`wsManager.getAudience()`), trimmed to 24 characters. Nothing is
  broadcast yet; phases 2 and 3 use it.
- `composables/useToasts.ts` + `components/deck/ToastCard.vue` (look) +
  `components/deck/ToastStack.vue` (live, in `app.vue`). Style guide slide
  PRE-0136 "Notifications" under Typography, and a section in DESIGN_SYSTEM.md.
- Later, when names are editable from a slide (not only `/join`), add a small
  name chip next to the language pill on touch devices.

### Phase 2: the room spins together

- `server/utils/spinRoom.ts`: one shuffle bag for the room, a history of the
  last 12 spins, and a 4.6 s lock while a spin plays. Resets with the room.
- A follow-along device sends `{ type: 'spin' }` over the WebSocket; the server
  checks it has an audience identity, draws, and broadcasts `spin` to everyone
  (or answers `spin_busy`). The presenter view and the remote go through the
  existing `slide_action` command, which now draws on the server too.
  New connections get `spin_state`, so a late screen shows the last result.
- `useSpins` holds what this screen heard; `useWebSocket` fills it and fires
  `deck:spin`, which the spinner plays.
- `useDeckRole().isProjector`: `?screen=projector` from the start page's
  Projector button, remembered per device; `/join` sets `audience`.
- Spinner: phones get Spin, Enter and a tappable reel; the projector and peek
  frames get "Mira is spinning …" / "Mira spun" with her avatar, "waiting for
  the next spin", and chips of who spun before. Audio primes on the first tap or
  key, since browsers block sound until then.
- Remote gets a Spin button and the latest line; the presenter view shows the
  latest line under its Spin button.

### Phase 3: problem engine (to build, in this order)

**Decisions**

- Answers are checked on the server. Solvers live only in `server/problems/`,
  so the answer is never in the client bundle. The server also generates each
  device's puzzle input, from a seeded random generator on problem id plus
  device id, so a reload shows the same input.
- Inputs early in the course (lists, loops) are a Python line to paste, such as
  `fische = [12, 7, 30, …]`, because reading files and `split` come later.
  Later rounds can hand out plain text.
- Advent of Code shape: Part 1, then Part 2 on the same input once Part 1 is
  solved. A wrong answer says "too high" or "too low" for numbers and locks
  the field for 5 seconds.
- Numbers compare as numbers (`18.0` equals `18`); words ignore case and
  surrounding spaces.
- One slide per problem. The projector shows that problem; each device shows
  every problem of the round as tabs, so students keep working while the
  presenter moves on. A round ends on a leaderboard slide.
- Ranking: parts solved, then who got there first. Times count from when the
  room first reached the round.
- Code tasks: the device runs Python in a Web Worker with Pyodide. Visible and
  hidden tests run after the student's code; the worker stops after 3 seconds,
  which also catches endless loops. Submitting sends the passing result, which
  the server trusts, since it cannot run Python itself. The editor is
  CodeMirror 6 with Python highlighting and indentation, because students write
  on laptops next to PyCharm.
- Pyodide files are copied from `node_modules/pyodide` into `public/pyodide`
  by a script on install and build, not committed.

**3a. Model and server** — done: `npm run check:problems` passes

- `server/problems/<section>.ts`: `{ id, parts, generate(rng), solve(input, part) }`.
  Text (story, example, part 2) lives in `locales/` under `problems.<id>`.
- `server/utils/problemRoom.ts`: solves per problem (device id, name, part,
  time), round start time, reset with the room.
- `GET /api/problems/:id/input` and `POST /api/problems/:id/answer`, identified
  by the `deck-audience` cookie. A correct answer broadcasts `solve` over the
  WebSocket; connecting sends `problem_state`.
- One sample problem to prove the loop end to end, plus a node check script
  for generate, solve and compare.

**3b. The device workspace** — done: problem slide PRE-0137, dock, solve toasts; the projector Stage already shows counts, clock and the top five

- `components/problems/Workspace.vue` on a problem slide for audience devices:
  a tab per problem, the story, "your input" with a copy button, the answer
  field, and the solved state with rank. Part 2 opens after Part 1. Works on a
  phone (stacked) and on a laptop (story and input side by side).
- Solve toasts on every screen: mint "Mira solved Part 1", sun for the first
  solver of each part.

**3c. Projector and presenter** — done: leaderboard slide PRE-0138, presenter panel, presence carries names

- `components/problems/Stage.vue` on the projector: the story large with its
  example, a live "7 / 23 solved" per part, and the top five with times.
- Round leaderboard slide component.
- Presenter view: for a problem slide, every audience name with ✓ per part,
  and the people who have not solved anything yet.

**3d. Solution walkthrough** — done: `utils/walks.ts` + `SolutionWalk.vue`, slides PRE-0139 to PRE-0142 for Momo's catch

- `components/problems/SolutionWalk.vue`, staged over sub-slides like the
  lessons. Stage 1 shows the whole solution, the middle stages zoom into one
  region each and trace it (variables change, output grows), the last stage
  zooms back out with the answer.

**3e. Code tasks** — done: bundled Pyodide in a module worker, CodeMirror editor, slide PRE-0143

- Pyodide copy script, `utils/python/worker.ts` (run with timeout, capture
  output, run tests), and `components/problems/CodeTask.vue` (CodeMirror
  editor, Run, test list, Submit).
- `POST /api/tasks/:id/submit` records the pass and broadcasts it like a solve.

### Phase 4: practice rounds, one round at a time

- The "Jetzt du" slides keep their ids: their pages are repointed at a problem
  instead of `LessonExercise`, so nothing is retired and the order stays put.
  A round that needs a second problem gets one new slide, and a leaderboard
  slide where it is worth celebrating.
- Each round only uses what the deck has taught by then. Lists (slide 11) come
  before loops, so that round is index arithmetic; the loops round is the first
  with counting and `break`.
- Solution walkthroughs only where they teach the most: the loops round (done)
  and the functions round.
- `components/lesson/Exercise.vue` and `exercises.*` in the locales go once the
  last round has replaced them.
- Order of work: lists (11) → loops (18, with PRE-0137/0138 already) →
  maths and physics (new, after 21) → functions (23, code tasks) →
  built-ins (25) → dictionaries (27).

