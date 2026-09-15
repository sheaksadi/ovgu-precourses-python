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

- [ ] **Names on the follow-along view.** Opening `/join` (or a slide on a
      phone) offers an optional name field. Skipping it gives a generated cute
      name (e.g. "Sleepy Otter", "Kleiner Pinguin"), kept per device in a
      cookie and changeable later. The server knows every audience member by
      a stable client id and name.
- [ ] **Notification system.** One toast component in the design system: stacks
      in the top-right, enters and leaves with the deck's motion, holds a few
      seconds. It gets a page in the style guide section, so every notification
      in the deck looks the same.

## Phase 2: introductions spinner, played by the audience

Slide 2 (PRE-0038). Today every screen spins on its own.

- [ ] Each student spins on their own follow-along device; the result is sent to
      the room.
- [ ] The projector has no spin button and ignores Enter. It shows who spun
      what, and "waiting for a spin" in between.
- [ ] The presenter view and the remote keep a spin button, for students without
      a phone.
- [ ] _To confirm when this phase starts:_ the review sentence moved between
      "presenter" and "projector". The reading above (projector shows, presenter
      and remote can spin) is the working assumption.

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
      _To decide:_ Pyodide from a CDN or vendored for offline rooms.
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
