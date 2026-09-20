# Review pass 3

Five pieces of work from one round of feedback. Each one is done and ticked
before the next one starts.

## A — Slide 10 plays in one go

- [x] Merge the three project stages (PRE-0053, PRE-0054, PRE-0055) and the run
      walk-through (PRE-0056) into one scene on PRE-0053: welcome window, the
      dialog, Create, the new file, typing the program, Run.
- [x] The animation does not start on its own. A "Los geht's" button starts it,
      and the whole room starts together.
- [x] Retire the three merged slides: entries out of `slides.config.ts`, pages
      deleted, ids never reused.

## B — Everything a device sends is kept

- [x] A SQLite file holds the room: who joined, what they solved, when.
      `node:sqlite`, no dependency.
- [x] The standings survive a server restart.
- [x] The presenter view has a button that empties the database, for testing.

## C — The start page has two doors

- [x] Projector and Follow along are the only public views.
- [x] Admin asks for a password (1337 for now, hard-coded) and then shows the
      presenter view, the control panel and the remote.
- [x] Those three pages ask for the password themselves, so a typed URL is the
      same door.

## D — The follow-along views work on a phone

- [ ] Every slide readable at 390 x 844, no sideways scroll, nothing clipped.
</content>
</invoke>
