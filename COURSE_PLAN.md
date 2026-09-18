> **Four-day delivery (28 Sep–1 Oct 2026):** use the current
> [curriculum](docs/precourse/FOUR_DAY_COURSE_DE.md) and
> [slide run sheet](docs/precourse/SLIDE_REVISION_PLAN.md).
> This file preserves the longer deck’s content inventory/backlog, not required
> work or teaching time for the eight-hour course.

# Course plan: from lists to APIs

Working plan for the part of the deck that follows "Code ausführen" (PRE-0056).
Each lesson follows the pattern of the if/else and variables lessons:
a small problem with the cast, the idea played out as a picture, the same idea
written down, then Python. Every stage is one slide, and it opens on the
previous stage's last frame, so pressing "next" feels like one continuous scene.

Status markers: `[ ]` not started, `[~]` in progress, `[x]` built and checked.

## Principles

- **Problem first.** Every section opens with something the cast needs to do,
  and the student feels the pain before the new tool arrives.
- **One idea per stage.** A stage adds one thing. Everything else stays still.
- **Picture ↔ code.** The picture and the code use the same words, and hovering a
  token lights up its part of the picture (`useCodeLink`).
- **Callbacks.** Later sections solve earlier problems better: the loop replaces
  the if/elif chain, `max()` replaces the loop we wrote, a function replaces the
  copy-pasted block.
- **Increasing scale.** Each section ends with exercises that grow: warm-up, a
  real task, then a stretch task.
- **Animation.** Small, focused, and polished: one move per beat, 0.3 to 0.7 s,
  eased, `animation-fill-mode: both`. Reduced motion lands on the last frame.
- **4:3 and 16:9.** Check every lesson at 1280×800 and 1024×768.

## Cast and props (from `utils/sprites.ts`)

| Sprite | Meaning in the course |
| --- | --- |
| Momo (`cat`, `cat-stand`, `cat-peek`, `cat-sleep`, `cat-loaf`) | The protagonist. Walking cat = one pass of a loop |
| `dog` (Bello) | A second animal: interactions, a second instance |
| `fish` | An item in a list |
| `basket` | A list |
| `box` | A variable |
| `fence` | A range or a limit |
| `road` | A sequence to walk along |
| `flag` | `break`, the end of a loop |
| `book` | A function definition, a recipe, a module |
| `ball` | A value passed into a function or returned |
| `lever` | A boolean; the `while` condition |
| `sign` | `print`, a label |
| `bunny` | Counting and multiplication |
| `frog` | True/False, jumping (steps in `range`) |

## Shared building blocks to build first

1. `[x]` **`LessonShell`** (`components/lesson/Shell.vue`): the frame the variables
   lesson draws by hand. Header with step dots, eyebrow and headline; scene card
   on the left; `CodePanel` and an output card on the right; a takeaway line at
   the bottom. Slots for the scene. This saves about 300 lines per lesson.
2. **`useTimeline`** (`composables/useTimeline.ts`): `useDemoPlayer` without the
   pointer. For scenes whose beat count depends on data (a loop over 5 or 8
   items), where pure CSS delays get unwieldy. `useDemoPlayer` then builds on it.
3. `[x]` **Problem rounds** (`components/problems/`): every "Jetzt du" slide
   poses an Advent of Code style puzzle or a code task instead of printed
   exercises. See REVISION_PLAN.md.
4. **`LoopTrace`** (`components/lesson/LoopTrace.vue`): a row of items, the
   walking cat, the loop variable box, a pass counter, the current code line
   lit, and output lines appearing per pass. Driven by `useTimeline`.

## Sections

### 1. Listen: lists (about 14 slides)

**1.1 Momos Fische** (problem → list), 6 stages `[x]` PRE-0059–PRE-0064

1. *Problem*: Momo caught five fish. Five boxes `fisch_1` … `fisch_5`, five lines
   of code. The question "Und bei 100 Fischen?" pops in.
2. *Lösen*: the five boxes slide together and fold into one basket with five
   numbered slots. Each fish drops into its slot one after another.
3. *Python*: `fische = [3, 5, 2, 4, 1]`. The brackets draw around the basket, the
   commas tick between the slots, and the name tag reads `fische`.
4. *Index*: the slot numbers 0 to 4 appear under the fish. `print(fische[0])` lights
   slot 0 and the output shows `3`. Callout: counting starts at 0.
5. *Ändern*: `fische[2] = 7`. The old fish lifts out and a bigger one drops in,
   the same move as the variables lesson. `len(fische)` counts the slots: 5.
6. *Hinzufügen*: `fische.append(6)` makes the basket stretch and a new slot
   arrive at the end. `fische.pop()` takes it out again.

**1.2 Listen und if: so wird's mühsam** (the pain), 5 stages `[x]` PRE-0065–PRE-0069

1. *Aufgabe*: which of three fish is the heaviest? Momo holds two fish up and
   compares, then the next pair.
2. *if/elif*: the chain `if a > b and a > c: …` types itself in, and a line counter
   ticks up.
3. *Mehr Fische*: the basket grows to 8 fish. The code scrolls and grows, the line
   counter turns red, and "So nicht!" stamps across it.
4. *Teaser*: "Wir brauchen etwas, das jeden Fisch einzeln anschaut." Momo walks
   along the basket, which leads into section 2.

**1.3 Jetzt du: Listen**, 1 exercise slide `[x]` PRE-0070 (placed right after 1.1, before 1.2)

- Warm-up: a shopping list with three items; print the first and the last.
- Task: add an item and print how many there are.
- Stretch: swap the first and the last item.

### 2. Schleifen: loops (about 30 slides, the biggest section)

**2.1 for: jeden Fisch anschauen**, 5 stages `[x]` PRE-0071–PRE-0075

1. *Problem*: printing each fish takes five `print` lines.
2. *Lösen*: Momo walks along the row. At each fish the box `fisch` gets that
   value and a sign prints it. The pass counter goes 1/5 … 5/5.
3. *Python*: `for fisch in fische:` / `print(fisch)`. The walking cat and the lit
   code line move in step (`LoopTrace`).
4. *Einrückung*: an indented line runs every pass, a line that isn't indented runs
   once after the loop. A second line is added, `print("fertig")`.
5. *Summe*: the accumulator box `gesamt` grows: 0 → 3 → 8 → 10 → 14 → 15.

**2.2 Schleifen lösen unsere Probleme**, 4 stages `[x]` PRE-0076–PRE-0079
Callback to 1.2.

1. *Schwerster Fisch*: `schwerster = fische[0]`. While walking, a new heavier fish
   replaces the one in the box.
2. *Zählen*: how many fish weigh more than 3? An `if` sits inside the loop and a
   counter box ticks.
3. *Filtern*: big fish go into a new basket `grosse` with `append`.
4. *Vergleich*: the 30-line if-chain next to the 4-line loop. The chain shrinks
   away.

**2.3 range: zählen ohne Liste**, 4 stages `[x]` PRE-0080–PRE-0083

1. *Problem*: Momo should jump 5 times, but there is no list.
2. *range(5)*: fence posts 0 to 4 appear, and the frog jumps post by post.
3. *start, stop, step*: `range(2, 10, 2)` makes the posts reposition, and the
   frog skips every second one.
4. *Einmaleins*: `for i in range(1, 11): print(i, "x 7 =", i * 7)`, with bunnies
   multiplying.

**2.4 while: solange …**, 5 stages `[x]` PRE-0084–PRE-0088

1. *Problem*: Momo eats until she is full. Nobody knows in advance how many bites.
2. *while*: the lever `hat_hunger` stays on, bites happen, the hunger bar drains,
   and the lever flips off, which ends the loop.
3. *Endlosschleife*: Bello chases his tail and the counter runs away. The fix is
   to change the condition inside the loop.
4. *break*: a guessing game with `input`. The flag means "found it, stop".
5. *continue*: skip the rotten fish and keep walking.

**2.5 Schleifen überall**, 5 stages `[x]` PRE-0090–PRE-0094
Loops are not only for lists.

1. *Buchstaben*: `for buchstabe in "Momo":`.
2. *Verschachtelt*: a 5×5 grid of tiles fills row by row (nested loops), then the
   multiplication table.
3. *Muster*: a triangle of stars grows line by line.
4. *Simulation*: savings with interest over 10 years, as a bar chart that grows
   year by year.
5. *Zufall*: dice rolls with `random.randint` until a 6 comes up (`while`).

**2.6 Jetzt du: Schleifen**, 2 or 3 exercise slides `[x]` PRE-0089 (countdown, Momo/Bello, password)

- Countdown from 10 to 0.
- Momo/Bello (FizzBuzz with the cast): multiples of 3 print "Momo", multiples
  of 5 print "Bello", multiples of both print "MomoBello".
- Password with three tries (`while` and `break`).
- Average grade of a list.
- Stretch: is a number prime?

### 3. Funktionen: functions (about 22 slides)

**3.1 Zu viel Code** (problem), 4 stages `[x]` PRE-0095–PRE-0098

1. The same five lines, which greet an animal and print its food, appear three
   times for Momo, Bello and Hoppel. The copies highlight in the same colour.
2. A bug fix has to go into all three copies. One copy gets missed and prints the
   wrong thing.
3. *Lösen*: the block lifts into a book (recipe) named `begruessen`. The three
   copies collapse into three one-line calls.
4. *Python*: `def begruessen(tier):` and three calls.

**3.2 Wie Funktionen arbeiten**, 5 stages `[x]` PRE-0099–PRE-0103

1. *Aufruf*: the call jumps into the book, runs its lines, and comes back. An
   arrow traces the jump.
2. *Parameter*: a ball carries the value into the book, and the box `tier` inside
   gets it.
3. *return*: a ball rolls back out and lands in a box outside:
   `x = verdoppeln(4)`.
4. *print vs return*: something shown vs something handed back.
5. *Mehrere Parameter und Standardwerte*: `def fuettern(tier, futter="Fisch")`.

**3.3 Funktionen für Mathe und Physik**, 4 stages `[x]` PRE-0104–PRE-0107

1. `flaeche_kreis(r)`: the circle grows with `r` and the area updates.
2. `celsius_zu_fahrenheit(c)`: a thermometer.
3. `geschwindigkeit(strecke, zeit)`: Momo runs a distance while a timer runs.
4. *Funktionen rufen Funktionen*: `kinetische_energie(m, v)` uses `quadrat(v)`,
   and the call stack builds up and unwinds.
5. *Wiederverwenden*: a loop over several radii calls `flaeche_kreis`.

**3.4 Tiere, die miteinander reden**, 4 stages `[x]` PRE-0108–PRE-0111

1. Animals as data: `momo = ["Momo", 3, "Fisch"]` (and later dictionaries).
2. `def treffen(tier_a, tier_b)`: Momo and Bello meet and say hello.
3. `def fressen(tier, menge)` changes the hunger value, and a function returns the
   new state.
4. A small simulation: a loop of days, and each day the animals meet and eat.
   This hints at objects later.

**3.5 Jetzt du: Funktionen**, 1 exercise slide `[x]` PRE-0112
The exercises grow from one function, to functions using loops, to functions
calling functions.

### 4. Eingebaute Funktionen (about 8 slides)

**4.1 Python hat schon viel eingebaut**, 5 stages `[x]` PRE-0113–PRE-0117

1. Callback: the heaviest-fish loop from 2.2 next to `max(fische)`, and it shrinks
   to one line.
2. `len`, `sum`, `min`, `max`, `sorted`, `round`, `abs` as a toolbox of books.
3. Conversion: `int`, `float`, `str`, `type`.
4. `enumerate` and `zip`: Momo walks with a pass number, two baskets side by side.
5. String methods: `upper`, `split`, `join`, `replace`.

**4.2 Jetzt du**, 1 exercise slide `[x]` PRE-0118

### 5. Dictionaries (about 6 slides)

Needed before the JSON in the API section.

**5.1 Tiere mit Eigenschaften**, 4 stages `[x]` PRE-0119–PRE-0122

1. *Problem*: which list slot was the age again? `momo[1]` doesn't say.
2. *Lösen*: slots get name labels instead of numbers (key props).
3. *Python*: `momo = {"name": "Momo", "alter": 3}`, then access by key.
4. Loop over a list of dictionaries: every animal in the shelter.

**5.2 Jetzt du**, 1 exercise slide `[x]` PRE-0123

### 6. Bibliotheken für KI und ML (about 12 slides)

**6.1 import**, 3 stages `[x]` PRE-0124–PRE-0126
`import math`, `import random`, `from random import choice`. A module is a shelf
of books.

**6.2 Pakete installieren**, folded into one lesson with 6.3–6.6 `[x]` PRE-0127 (terminal instead of the Python Packages window)
A PyCharm demo in the `useDemoPlayer` style: Python Packages window, search for
`numpy`, Install. Also the terminal variant `pip install numpy`.

**6.3 NumPy** `[x]` PRE-0128
A list vs an array. `gewichte * 2` doubles every fish at once, with no loop.
Then `mean` and `max`.

**6.4 pandas** `[x]` PRE-0129
A table of animals, filtering rows (`df[df["alter"] > 2]`).

**6.5 matplotlib** `[x]` PRE-0130
A bar chart of fish weights that draws itself.

**6.6 Ausblick ML** `[x]` PRE-0131
scikit-learn fits a line through points: "the computer learns a function",
tying back to section 3. Name-drop PyTorch.

### 7. APIs (about 8 slides)

**7.1 Was ist eine API?** `[x]` PRE-0132
Restaurant metaphor: Momo orders (request), the waiter Bello brings it to the
kitchen (server) and back (response).

**7.2 Daten aus dem Internet** `[x]` PRE-0133–PRE-0134
`requests.get(...)`, JSON as lists and dictionaries (callback to 5), then
`response.json()`.

**7.3 Live: Hunde-API** `[x]` PRE-0135 (Enter fetches a new dog; offline fallback)
The slide calls `https://dog.ceo/api/breeds/image/random` live. The Enter key
fetches a new dog, and the code panel shows the exact Python that does the same.
A variant uses The Cat API.

## Work estimate

| Item | Slides | Effort |
| --- | --- | --- |
| Shared blocks (`LessonShell`, `useTimeline`, `Exercise`, `LoopTrace`) | – | large, pays back from lesson 2 on |
| 1. Lists | ~14 | 3 lesson components |
| 2. Loops | ~30 | 6 lesson components, `LoopTrace` reused heavily |
| 3. Functions | ~22 | 4 lesson components |
| 4. Built-ins | ~8 | 1 lesson component |
| 5. Dictionaries | ~6 | 1 lesson component |
| 6. Libraries | ~12 | 1 PyCharm demo plus 4 small lessons |
| 7. APIs | ~8 | 2 lessons plus 1 live slide |

About 100 slides. Build them in section order, and check each lesson in the
browser at both sizes before moving on.
