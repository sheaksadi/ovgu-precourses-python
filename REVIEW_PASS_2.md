# Revision plan: second review pass (2026-09-19)

A second walk through the finished deck, turned into work. Slide numbers are the
page labels the deck shows (`27.3` = main slide 27, sub-slide 3); ids are listed
because the numbers shift as slides are added. Work top to bottom, one task at a
time: look at the code first, then build.

## A. Functions: maths and physics (slides 27 to 29)

- [x] **1. After 27** (PRE-0104): the circle formula, written a second time.
      The same code becomes a `quadrat()` function and a `PI` variable, so the
      body reads like the formula on the board instead of like arithmetic. Show
      the before and the after, and say why the second one is the one to write.
- [x] **2. After 27.1** (PRE-0105): comments. Right now nobody can tell what
      `c * 9 / 5 + 32` is. Two comment lines above the `return` explain the
      formula, and the slide introduces `#` as a note for humans.
- [x] **3. After 27.2** (PRE-0106): nested calls. A second function
      (acceleration from two speeds) calls the speed function, and a third
      averages two accelerations — a call inside a call, on purpose.
- [x] **4. Replace 27.3** (PRE-0107): the call-stack slide is covered by task 3.
      Put something a step harder in its place, to build intuition for what
      comes after this course.
- [x] **5. Drop slide 29** (PRE-0108 to PRE-0111, "Tiere, die miteinander
      reden"): the maths slides now cover what it taught. Keep at most one
      compact slide of examples if something is lost.

## B. Built-ins and dictionaries

- [x] **6. After 33.4** (PRE-0117): pipelines. Built-in functions chained into
      one another to get something done. Keep it simple — two or three links.
- [x] **7. Before 36** (PRE-0119): one slide that states the dictionary problem
      before the solution arrives. Three cats with their details in parallel
      lists, and no good way to look one up.
- [ ] **8. Highlighting audit:** several lessons light the `print` line while
      the interesting line — the one that stores or changes the value — stays
      dim. Fix the `focus` of the dictionary slides first, then sweep the rest.

## C. Modules and APIs

- [ ] **9. Module section** (PRE-0124 to PRE-0126): add reading a text file,
      and a second stage that loops over its lines.
- [ ] **10. Move PRE-0150** ("Nachschlagen: die Katzen-API") to after the API
      section instead of in the middle of it.
- [ ] **11. Live cat slide** (PRE-0135): while a fetch runs, trace the lines the
      way the loop lessons do — hold on the request line until the answer
      arrives, then carry on.

## D. Across the deck

- [ ] **12. Sound:** look at what the portfolio project uses and reuse the same
      sounds where they fit the deck.
- [ ] **13. Replay for everyone:** every animation can be restarted from the
      presenter view and from any follow-along device, with the same spam
      protection the spinner has. On a device the button takes the place the
      puzzle dock has now; in the presenter view it sits in the middle of the
      navigation. The puzzle dock moves to the last slide, or to its own
      `/puzzles` page.
