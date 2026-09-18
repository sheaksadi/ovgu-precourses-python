# Python-Vorkurs: Probleme lösen in vier Tagen

Planungsstand: 18.09.2026. Unterricht: Montag, 28.09., bis Donnerstag, 01.10.2026, jeweils 120 Minuten. Insgesamt 480 Minuten einschließlich vier Pausen à 10 Minuten; 440 Minuten Lernaktivitäten.

Status: neuer Lehrplanvorschlag. Nach gemeinsamer Freigabe ersetzt er die bisherige Stoffplanung als verbindlichen Zeitrahmen. `COURSE_PLAN.md` und die vorhandenen Folien bleiben vorerst als Materialsammlung erhalten. Diese Markdown-Dateien ändern die laufende App nicht.

## Unser Versprechen an die Studierenden

Du musst keine Befehle auswendig lernen. Am Ende kannst du ein kleines Problem in Schritte zerlegen, einen Ablauf vorhersagen, eine Lösung testen und erklären, warum sie funktioniert. Je nach gewählter Kursroute setzt du diese Schritte mit mehr oder weniger Unterstützung in Python um.

Unser Arbeitsrhythmus: **Vermuten → Planen → Nachverfolgen → Ausführen → Prüfen.** Erst ein Beispiel und eine Idee, dann die benötigte Schreibweise. Fehler sind Hinweise auf eine noch unklare Annahme.

## Drei Routen, eine Lerngruppe

Die Lehrperson wählt eine Route für die ganze Gruppe. Es gibt keine drei gleichzeitig laufenden Kurse und keine dauerhaften Etiketten für einzelne Studierende. Die Route kann am Tageswechsel angepasst werden. Maßgeblich sind erklärte Lösungen, nicht Gerätebesitz, Selbstvertrauen oder Tippgeschwindigkeit.

| Route | Voraussetzung | Unterstützung und Ziel |
|---|---|---|
| Grundlagen | Keine sichere Programmiererfahrung | Bilder, Befehls-/Codekarten, kurze Gerüste; Abläufe nachvollziehen, Lücken begründen und eigene Tests entwickeln |
| Aufbau | Zuweisungen und einfache Entscheidungen werden verstanden | Kurze Programme selbst schreiben; am Ende eine Funktion mit Parametern und Rückgabewert |
| Vertiefung | Auch einfache Schleifen und Funktionsaufrufe werden sicher erklärt | Gleiche Kernprobleme selbstständig lösen, Gegenbeispiele finden, Lösungen zerlegen und Grenzfälle prüfen |

Vertiefung bedeutet mehr Denkarbeit, nicht mehr Bibliotheken. Auch diese Route bleibt bei 8 Stunden.

## Vier Tage auf einen Blick

| Datum | Leitfrage und sichtbares Ergebnis | Grundlagen | Aufbau | Vertiefung |
|---|---|---|---|---|
| Mo 28.09. | Wie beschreibe ich einen eindeutigen Ablauf? Momo steuern; Minuten in Stunden/Restminuten umrechnen | Befehle ordnen, Werte verfolgen, Rechengerüst ergänzen | Eingabe → Berechnung → Ausgabe selbst schreiben | Annahmen festlegen, zwei Lösungen vergleichen, Ausgaben prüfen |
| Di 29.09. | Wie entscheidet ein Programm? Temperaturmeldungen mit eindeutigen Grenzen | Ein `if/else`, Vergleich und Wahrheitswert | `if/elif/else`, sich ausschließende Fälle | Kombinierte Regeln und Gegenbeispiele; überlappende Bedingungen reparieren |
| Mi 30.09. | Wie wende ich dieselbe Regel auf viele Werte an? Warme Tage zählen | Kurze Liste, `for`, Zähler; Tabelle für jede Wiederholung | Zählen und Summieren mit Bedingung selbst umsetzen | Eine zusammenhängende Folge untersuchen; `while` nur als Ersatz für einen Transferblock |
| Do 01.10. | Wie baue und prüfe ich eine kleine Lösung? Projekt Temperatur-Check | Gerüst vervollständigen, bereitgestellte Funktion aufrufen und erklären | Eigene Funktion `anzahl_warm(werte, grenze)` mit `return` | Zwei kleine Funktionen, längste warme Folge, gezielte Funktionstests |

Strings nutzen wir für Nachrichten und Eingaben, Listen für mehrere Messwerte. Eingebaute Funktionen lernen wir bei Bedarf kennen, nicht als separate Liste zum Auswendiglernen. `input()` liefert Text; eine Zahl entsteht erst durch Umwandlung. Am ersten Tag gelten ausdrücklich gültige, nichtnegative ganze Zahlen als Eingabe.

## Der Zeitplan gilt für jede Route

### Tage 1–3: je 120 Minuten

| Minute | Aktivität |
|---|---|
| 00–10 | Am Montag Diagnose; danach zwei kurze Wiederholungsfragen |
| 10–25 | Konkretes Problem, Beispiele und Vermutungen sammeln |
| 25–40 | Ein Modell gemeinsam entwickeln: Bild/Pseudocode → Python |
| 40–55 | Ablauf nachverfolgen oder eine fehlerhafte Lösung reparieren |
| 55–65 | Pause |
| 65–90 | Partnerarbeit am Tagesproblem |
| 90–105 | Transferproblem ODER Grundlagen festigen |
| 105–115 | Lösungen vergleichen, einen typischen Fehler untersuchen |
| 115–120 | Individuelles Exit-Ticket |

### Tag 4: 120 Minuten

| Minute | Aktivität |
|---|---|
| 00–10 | Wiederholung und Routenentscheidung |
| 10–25 | Zerlegung/Funktionen auf dem Niveau der Route |
| 25–40 | Projektauftrag, Beispiele und eigener Plan |
| 40–55 | Erste Umsetzung bzw. Ablaufspur |
| 55–65 | Pause |
| 65–95 | Weiterarbeiten und verbessern |
| 95–110 | Gegenseitige Tests und kurze Vorführung |
| 110–115 | Was lässt sich auf andere Probleme übertragen? |
| 115–120 | Individuelles Exit-Ticket |

Bei Zeitverlust entfällt zuerst ein Zusatzbeispiel. Übungszeit, Pause und Abschlussprojekt bleiben geschützt. Maximal 15 Minuten am Stück erklären, dann müssen die Studierenden etwas vorhersagen, entscheiden oder ausprobieren.

## Route auswählen und anpassen

Die vier Diagnoseaufgaben stehen in `TEACHER_NOTES_DE.md`. Papier ist gleichwertig; es gibt keine Note. Folgende Schwellen sind praktische Planungsregeln, kein wissenschaftlich validierter Test:

- Vertiefung: Mindestens 80 % lösen alle vier Aufgaben und zeigen eine korrekte Zustandsfolge der Schleife sowie Eingabe, Rückgabe und anschließende Verwendung beim Funktionsaufruf. Reine Rechenergebnisse reichen nicht.
- Sonst Aufbau: Mindestens 70 % lösen Zuweisung und Entscheidung korrekt.
- Sonst Grundlagen. Sind Zuweisung und Entscheidung sicher, aber die weiterführenden Ablaufspuren unklar, höchstens Aufbau wählen und im ersten gemeinsamen Programm erneut prüfen.

Am Tagesende zwei neue Kernbeispiele prüfen. Erst aufsteigen, wenn mindestens 80 % beide selbstständig lösen und den Weg erklären; benötigte Vorkenntnisse des nächsten Tages zusätzlich prüfen. Wenn nach einem Hinweis mindestens 30 % noch am Kern scheitern: Festigungsblock nutzen oder am nächsten Tag zurückstufen. Nicht wegen der schnellsten drei Stimmen beschleunigen.

## Wenn Geräte oder Internet fehlen

- Ein Laptop pro Person: erst selbst versuchen, dann zu zweit vergleichen.
- Ein Laptop für zwei bis drei: Rollen Umsetzung, Ablaufkontrolle und Test wechseln alle zehn Minuten.
- Nur Handys: Antworten/Vermutungen sammeln; keine Pflicht zum Tippen von Python am Handy.
- Kein Schülergerät/kein Netz: gedruckte Aufgaben, Codekarten und Tabellen; Lehrperson führt lokal aus.
- Kein Beamer: Ausdrucke des Storyboards und Tafel.

Papierlösungen zeigen algorithmisches Verständnis, aber belegen keine selbstständige Python-Ausführung. Dieses Lernziel unterscheiden wir ausdrücklich. Browser-Python und Abstimmungen sind ein Zusatz; vorab am tatsächlich verwendeten Gerät prüfen. Keine spontane Installation oder Kontoerstellung im Unterricht. Wenn ein Setup nach fünf Minuten nicht läuft, Partner-/Papiermodus nutzen.

## Bewusst nicht im Pflichtprogramm

IDE-Installation, verschachtelte Schleifen, umfassende String-/Listenmethoden, Dictionaries, Datei-Ein-/Ausgabe, Regex, OOP, Paketinstallation, NumPy/pandas/ML, externe APIs und ein vollständiges Testframework. `while`, `assert` oder eine eng begrenzte Fehlerbehandlung sind höchstens Ersatzaufgaben in der Vertiefungsroute, nie zusätzliche Pflichtblöcke.

Der Kurs ist kein verkürztes vollständiges CS50P. Die Inspiration kommt vor allem aus den Wochen 0–2; Testfälle verwenden wir von Anfang an. Quellen: `SOURCES.md`.

## Abnahme des Lehrplans

- [ ] Alle vier Tage wurden mit Uhr und Pausen durchgesprochen.
- [ ] Für jede Route existieren Auftrag, Hilfen, erwartete Ergebnisse und ein Abschlusskriterium.
- [ ] Alle Pflichtaufgaben sind ohne Internet und ohne Rangliste lösbar.
- [ ] Gerätebedarf und Sprache wurden mit der Organisation geklärt; bis dahin gilt der Papier-/Partnermodus.
- [ ] Alte Folien gelten als Reserve, nicht als zusätzliche Pflicht.
