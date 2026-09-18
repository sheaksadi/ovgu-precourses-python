# Four-day Python precourse

Delivery plan: Monday **2026-09-28** through Thursday **2026-10-01**, two hours
per day. Total: **480 minutes**, including four 10-minute breaks; 440 minutes
of learning activities. This is the current short-course plan. The root
[course plan](../../COURSE_PLAN.md) remains a legacy content inventory.
The `_DE` filename is retained for existing links; planning prose is English.
Classroom wording and the [student workbook](STUDENT_WORKBOOK_DE.md) are German.

## Learning promise

> Du musst keine Befehle auswendig lernen. Du zerlegst ein kleines Problem in
> Schritte, sagst Ergebnisse voraus, prüfst deine Lösung und erklärst deinen Weg.

Use **Vermuten → Planen → Nachverfolgen → Ausführen → Prüfen**. Begin with a
problem and a concrete example; introduce syntax only when it serves the plan.
Debugging means finding the smallest example that contradicts an assumption.

## One instructor-selected route for the whole class

The instructor selects Grundlagen, Aufbau, or Vertiefung for everyone, based on
explained solutions rather than typing speed. Reassess at day boundaries; do not
run three simultaneous groups or label individual students by ability.

| Route | Support and completion target |
| --- | --- |
| Grundlagen | Pictures, code cards, supplied scaffolds; paper and pseudocode are valid. Trace values, justify missing steps and test a solution. Minimal independent syntax; calling a supplied function is optional. |
| Aufbau | Normal beginner route: short independent programs using lists, loops and decisions. Add a small function only after the core solution works. |
| Vertiefung | Same problems, with counterexamples, boundary cases and small functions; optionally investigate the longest warm sequence. More reasoning, not more libraries. |

## Daily outcomes

| Day | Guiding question / classroom task | Evidence |
| --- | --- | --- |
| Mon 28 Sep | „Kann Momo deiner Anleitung folgen?“; „Wie lange sind 135 Minuten?“ | Ordered instructions, traced assignments, whole hours and remaining minutes |
| Tue 29 Sep | „Wo liegt die Grenze?“ | Predict temperature messages, repair overlapping conditions, explain boundary tests |
| Wed 30 Sep | „Eine Regel, viele Messwerte“ | Trace a short list, count matching values, explain why the counter starts outside the loop |
| Thu 1 Oct | „Dein Temperatur-Check“ | Plan, implement or trace, test and explain a small solution; functions optional except for the Vertiefung extension |

Day 1 accepts valid nonnegative integer inputs only. `input()` returns text;
conversion is introduced when needed. No input-validation framework is required.
Day 2 uses three messages (below 20, below 25, otherwise); Grundlagen uses two.
Days 3–4 explicitly use a different counting rule: a value is warm when it meets
the selected threshold, initially 20. Explain this change before counting.

## Timing (all routes)

Days 1–3 each follow this 120-minute schedule:

| Minutes | Activity |
| --- | --- |
| 00–10 | Monday diagnostic; otherwise two retrieval questions |
| 10–25 | Concrete problem, examples and predictions |
| 25–40 | Shared model: picture/pseudocode → Python |
| 40–55 | Trace or debug a solution |
| 55–65 | Break |
| 65–90 | Pair work on the daily problem |
| 90–105 | Transfer OR consolidation |
| 105–115 | Compare solutions and investigate one mistake |
| 115–120 | Individual exit ticket |

Day 4:

| Minutes | Activity |
| --- | --- |
| 00–10 | Retrieval and route check |
| 10–25 | Decomposition; optional functions at the chosen level |
| 25–40 | Project brief, examples and personal plan |
| 40–55 | First implementation or paper trace |
| 55–65 | Break |
| 65–95 | Continue and improve |
| 95–110 | Peer tests and short demonstrations |
| 110–115 | Transfer to another kind of measurement |
| 115–120 | Individual exit ticket |

Protect practice, breaks and the project. Drop an extra example first if time is
lost. Explain for no more than 15 minutes before asking students to predict,
choose, trace or try something.

## Selecting and adjusting the route

Use the four diagnostic prompts in [teacher notes](TEACHER_NOTES_DE.md).
These thresholds are practical planning heuristics, not a validated assessment:

- Vertiefung: at least 80% explain all four tasks, including loop states and
  function input, return and subsequent use. A correct final number is insufficient.
- Otherwise Aufbau: at least 70% explain assignment and decision correctly.
- Otherwise Grundlagen. Do not accelerate based on the fastest three voices.

At the end of each day use two fresh core examples. Increase independence only
when at least 80% solve and explain both and have the next day's prerequisites.
If at least 30% still struggle after a hint, consolidate or lower the route the
next day. For small groups, interpret percentages alongside actual observations.

## Project and fallback

The **Temperatur-Check** counts values meeting a chosen threshold in a fixed list.
Use lists, a loop and a conditional; functions are an optional decomposition step.
No API, download, account, ranking or package installation is needed. The workbook
contains the exact contract, five expected results and route-specific support.

Pair students if devices are scarce; switch implementation, tracing and testing
roles every ten minutes. On phones, collect predictions rather than require
Python typing. Without devices/network, use printed tasks and trace tables; the
instructor can run Python locally. Paper demonstrates problem solving, not
independent interpreter use: record these outcomes separately. If setup takes
more than five minutes, use the pair/paper fallback.

## Deliberately outside the core

IDE installation, nested loops, method catalogues, dictionaries, files, regex,
OOP, package installation, NumPy/pandas/ML and APIs remain reference material.
`while`, `assert` or limited error handling may replace a transfer activity in
Vertiefung, never add required time. This is not a compressed complete CS50P.
See [sources](SOURCES.md) for the preparation package's references.

## Before delivery

- Rehearse each 120-minute session including the break.
- Print the workbook and keep the answer key separate.
- Check the chosen route's instructions, support and completion criteria.
- Test the actual classroom devices; keep paper and local Python available.
- Follow the [slide run sheet](SLIDE_REVISION_PLAN.md), not the full-deck Next button.
