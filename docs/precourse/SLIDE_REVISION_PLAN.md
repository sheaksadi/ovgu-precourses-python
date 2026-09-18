# Four-day slide map and instructor run sheet

Inspected against `slides.config.ts` on 2026-09-18. The full deck remains a
reference library. **Next does not follow this run sheet.** Use the existing
`/presenter` or `/control` deck list to jump to the listed permanent IDs. The
instructor chooses one route for the whole class; no automated route selector
has been added. Page numbers may change; IDs do not.

The [curriculum timetable](FOUR_DAY_COURSE_DE.md) supplies the exact 120 minutes
per day. Slides are brief visual support inside those blocks, not additional
teaching time. Existing `duration` values and the presenter's full-deck pacing
sum describe the larger library; use a separate session timer for this course.

## Ordered selections

All three routes use these same ordered selections. Grundlagen uses scaffolds
and paper; Aufbau writes short programs; Vertiefung adds boundary cases and
optional small functions. Use the German workbook for the exact tasks.

| Day | Ordered slide IDs | Teacher / student actions and fallback |
| --- | --- | --- |
| Mon 28 Sep | PRE-0033 → PRE-0152 → PRE-0034 → PRE-0035 → PRE-0040 → PRE-0041 → PRE-0042 → PRE-0044 → PRE-0039 → PRE-0046 | Diagnose during 00–10, introduce Momo during 10–25, trace values during 25–55. After the break, solve the minutes problem from the workbook. PRE-0039/0046 are optional execution/input support, not a setup assignment. Paper: four-field Momo and groups of 60. |
| Tue 29 Sep | PRE-0034 → PRE-0035 → PRE-0036 → PRE-0037 | Revisit the picture, ask for predictions, then show pseudocode/Python. Transfer to the workbook temperature problem and number line during 25–55; pair work after the break. Grundlagen uses two outcomes; Aufbau/Vertiefung three. Find a counterexample before repairing the faulty conditions. |
| Wed 30 Sep | PRE-0059 → PRE-0060 → PRE-0061 → PRE-0071 → PRE-0072 → PRE-0073 → PRE-0074 → PRE-0077 | Model one list and a loop during 10–40. PRE-0077 counts fish using its existing rule; explicitly replace it with the workbook temperature list and inclusive threshold. Trace each counter state during 40–55, then implement/debug after the break. Paper: one table row per value. |
| Thu 1 Oct | PRE-0153; optionally PRE-0095 → PRE-0096 → PRE-0097 → PRE-0098 → PRE-0099 → PRE-0100 → PRE-0101 → PRE-0102; return to PRE-0153 | Introduce the project briefly, use at most 10–25 for decomposition/functions, then hold PRE-0153 during planning and work. Grundlagen can stay on the project throughout. Aufbau adds a function only if ready; Vertiefung uses small functions. Protect 95–110 for peer tests; close with the workbook exit ticket. |

Do not show all optional function stages just to complete the list. Jump back
to PRE-0153 from the controller and finish there. Without devices, use the
workbook's pseudocode and trace tables; demonstrate locally when available.
The Day 1 minute conversion and Day 2 temperature boundary problem remain
workbook/board activities, not new animated lessons.

## Current library disposition

Ranges below identify material, not array positions; explicit selections above
win where a range overlaps. No old slides are deleted or globally hidden.

| Existing IDs | Decision |
| --- | --- |
| PRE-0033, PRE-0038 | Title updated with dates; introduction spinner optional inside the opening budget, never an extra ten minutes |
| PRE-0034–PRE-0037 | Retain Momo problem/picture/pseudocode/Python; delay formal conditions until Tuesday |
| PRE-0039–PRE-0047 | Select assignment, arithmetic and essential input/output; type catalogue, f-strings and naming detail are reserve |
| PRE-0048, PRE-0052–PRE-0056 | Setup reference outside the 480-minute course |
| PRE-0059–PRE-0064 | List story/creation core; indexing and editing reserve |
| PRE-0065–PRE-0069 | Maximum-finding/if-chain story reserve; use the simpler workbook boundary problem |
| PRE-0071–PRE-0075, PRE-0077 | Loop and counter visuals core as selected above; sum is optional transfer |
| PRE-0076, PRE-0078–PRE-0088, PRE-0090–PRE-0093 | Maximum, filtering, range, while, nesting and simulation reserve |
| PRE-0070, PRE-0089, PRE-0137–PRE-0142 | Generated puzzles, solution walkthroughs and ranking optional; not required practice |
| PRE-0095–PRE-0102 | Optional function/decomposition support at the chosen level |
| PRE-0103–PRE-0135, PRE-0143–PRE-0151 | Extended functions, maths, dictionaries, built-ins, libraries, lookup, APIs and further puzzles are reserve |
| PRE-0010–PRE-0032 and PRE-0136, where registered | Design-system reference, outside course delivery |
| PRE-0152 (new) | Four-day overview, immediately after the title |
| PRE-0153 (new) | Fixed-data Temperatur-Check, after basic function explanations; final stop in the manual course route |

## Implemented scope and follow-up

This contribution adds two content-only slides using the existing ContentSlide
component, updates title dates and opening notes, and removes duplicate subtitle
keys in five existing exercise entries, retaining the wording matching their
current problems. New classroom wording is German in both locale structures;
existing English translations are preserved. No navigation/state changes.

Before teaching, rehearse the selected material on a projector and a phone,
including 1024×768 and 1280×800, and print the workbook separately from the full
`/print` library. Verify room following and local browsing on actual devices.

Future work, on separate branches after rehearsal:

- A shared route/day manifest, only if manual jumps prove too cumbersome; it must
  keep navigation, preview, numbering and print consistent without renumbering IDs.
- Night mode needs a semantic-color and diagram contrast audit, device-local
  persistence and a readable print theme. It is deliberately not implemented here.
- Dedicated minute-conversion and temperature-boundary scenes only if they improve
  classroom delivery enough to justify new slides and visual checks.

## Validation for this contribution

- `npm run slides:check`: passes, 132 entries/pages, next ID PRE-0154.
- `npm run build`: passes; existing browser-data/chunk-size warnings remain.
- `git diff --check`: passes. No lint/format scripts are configured.
- Local documentation links and nine project reference-function cases: pass.
- `nuxi typecheck`: blocked. Missing `vue-tsc` first triggered a registry lookup;
  retrying with network access failed with `ERR_PACKAGE_PATH_NOT_EXPORTED` in
  the downloaded Vue/TypeScript tooling. The wrapper returned zero despite the
  error, so this is **not** recorded as a passing type check.
- `npm run check:problems` against the running app: most assertions pass, but
  “room heard three solves”, “standings put A (2 parts) above B (1 part)” and
  “every problem keeps its own room” fail. No room/server code was changed;
  baseline attribution has not been established. Investigate separately.
- `npm run check:deck`: blocked because no Chromium debugging endpoint is
  available on port 9222. Visual layout and device rehearsal remain outstanding.

No dependency upgrades or room/security refactors were attempted to force checks
through. The full-library pacing and manual slide jumps remain deliberate limits.
