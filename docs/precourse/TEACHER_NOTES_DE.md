# Teacher preparation and German classroom answer key

Companion to [the course plan](FOUR_DAY_COURSE_DE.md) and [workbook](STUDENT_WORKBOOK_DE.md). The German sections below are classroom prompts, teaching phrases and answer wording. Keep this answer key separate from student handouts; reveal solutions only after independent work. Functions are optional in Grundlagen and Aufbau; the loop-and-condition solution is sufficient.

## Zehnminütige Diagnose am Montag

Eine Minute erklären, sechs Minuten einzeln bearbeiten, drei Minuten Antworten sammeln. Keine Bewertung; „weiß ich noch nicht“ ist nützlich. Niemand muss dafür Python installieren. Pseudocode und Python beschreiben dieselbe Aufgabe, keine acht getrennten Aufgaben.

1. Zuweisung: `x = 2`, danach `x = x + 3`. Pseudocode: „Merke 2 als x; erhöhe x um 3“. Welchen Wert hat x? **5**.
2. Entscheidung: `temperatur = 20`; gilt `temperatur >= 20`? Pseudocode: „Ist die Temperatur mindestens 20?“ **Ja/True; die Grenze gehört dazu.**
3. Wiederholung: Starte mit Summe 0, addiere nacheinander die Werte `[2, 4, 1]`. Zeige Startzustand, aktuellen Listenwert und neue Summe in einer Tabelle. **Start 0; danach 2, 6, 7**. Was passiert, wenn die Summe vor JEDER Addition wieder auf 0 gesetzt wird? **Endwert 1 statt 7**. Nur das Ergebnis 7 ist kein ausreichender Nachweis einer verstandenen Schleife.

```python
summe = 0
for wert in [2, 4, 1]:
    summe = summe + wert
```

4. Funktion: Verfolge dieses Programm. Welchen Wert bekommt x, was wird zurückgegeben, welcher Wert steht anschließend in ergebnis und was wird angezeigt? **3; Rückgabe 6; ergebnis 7; Anzeige 7**. Die Funktion selbst zeigt nichts an. Pseudocode: „Rufe Verdoppeln mit 3 auf; verwende den gelieferten Wert und addiere 1; zeige das Ergebnis“.

```python
def doppelt(x):
    return 2 * x

ergebnis = doppelt(3) + 1
print(ergebnis)
```

Ein Punkt pro korrekt erklärter Aufgabe. Route nicht allein nach Gesamtpunktzahl wählen: Vertiefung erst bei mindestens 80 % mit allen vier Aufgaben einschließlich der Ablaufspuren; sonst Aufbau, wenn mindestens 70 % Aufgabe 1 und 2 lösen; sonst Grundlagen. Sind die Ablaufspuren unklar, trotz richtiger Rechenergebnisse höchstens Aufbau wählen und im ersten Programm erneut prüfen. Bei sehr kleinen Gruppen Prozentwerte mit tatsächlicher Anzahl und Beobachtung abgleichen. Kein öffentliches Ranking.

## Gemeinsame Unterrichtssprache

| Begriff | Nützlicher Satz |
|---|---|
| Algorithmus / Ablauf | „Welche Schritte funktionieren auch beim nächsten Beispiel?“ |
| Variable / Zuweisung | „Welcher Wert ist jetzt unter diesem Namen gespeichert?“ |
| Bedingung / Wahrheitswert | „Ist diese Aussage hier wahr oder falsch?“ |
| Schleife / Durchlauf | „Was wiederholt sich, was verändert sich dabei?“ |
| Parameter / Argument | „Der Parameter ist der Name im Rezept; das Argument ist der eingesetzte Wert.“ |
| Rückgabewert | „Welches Ergebnis erhält die aufrufende Stelle zurück?“ |
| Grenzfall | „Was passiert genau auf der Grenze?“ |
| Fehlersuche | „Bei welchem kleinsten Beispiel weicht das Ergebnis ab?“ |

Nicht fragen: „Habt ihr alles verstanden?“ Besser: „Welche Ausgabe erwartet ihr, und warum?“ Erst einzeln denken lassen, dann zu zweit besprechen, dann Antworten sammeln.

## Hinweise zu den Tagesaufgaben

### Tag 1

Momo: GEHE, GEHE, NIMM SCHLÜSSEL, GEHE, ÖFFNE TÜR. Die Tür darf nur mit Schlüssel geöffnet werden. Die Grenzen des Befehlssatzes vorab festlegen; niemand soll an einer absichtlich verschwiegenen Regel scheitern. Beim verlegten Schlüssel funktioniert diese feste Sequenz nicht mehr. Das motiviert Entscheidungen, ohne schon `if` erklären zu müssen.

Minuten: 45 → (0,45), 60 → (1,0), 135 → (2,15), 0 → (0,0), 59 → (0,59), 61 → (1,1), 120 → (2,0), 121 → (2,1). Erklärung von `//` und `%` erst nach den 60er-Gruppen. Die Annahme nichtnegativer ganzer Zahlen ausdrücklich nennen.

Frischer Checkpoint, vorher nicht zeigen: 62 → (1,2) und 180 → (3,0) Minuten erklären. Bei Schwierigkeiten erst mit gezeichneten Gruppen weiterarbeiten, nicht zusätzliche Operatoren zeigen.

### Tag 2

Aufbau: `if t < 20`, `elif t < 25`, `else`. Die zweite Bedingung muss nicht erneut `t >= 20` prüfen: Dieser Fall wurde durch den ersten Zweig ausgeschlossen.

Ergebnisse: 19 kühl; 20 und 24 angenehm; 25 und 26 warm. In Grundlagen lauten die letzten vier Ergebnisse „nicht kühl“.

Fehlerbeispiel: Bei 25 oder 26 trifft bereits `>= 20` zu, deshalb wird der zweite Zweig nie erreicht. Entweder von oben mit `>= 25` beginnen oder von unten mit `< 20`. Gegenbeispiel statt bloß „falsche Reihenfolge“ verlangen.

Transfer Lüften: Nur wenn hohe Temperatur wahr und offenes Fenster falsch ist, wird gelüftet. Kein Transferblock, solange Grenzen unklar sind.

Frischer Checkpoint: Ändere die unteren/oberen Grenzen auf 18/23. Prüfe 18 und 23. Aufbau/Vertiefung: angenehm, warm; Grundlagen mit nur einer Grenze bei 18: beide nicht kühl. Erst die veränderte Regel nennen, dann begründen lassen.

### Tag 3

Zähler nach jedem Wert: 0,1,2,3,3. Summe der fünf Werte: 101. Bei leerer Liste bleibt der vorher gesetzte Zähler 0. Zähler zählt passende Elemente; er addiert nicht die Temperaturwerte.

Vertiefung `[20,21,18,25]`: aktuelle Folge 1,2,0,1; bisheriges Maximum 1,2,2,2. Zuerst Alltagssprache: „Länge der aktuellen Serie“ und „beste Serie bisher“. Der technische Begriff Invariante ist nicht nötig.

Frischer Checkpoint: Grenze 22, Listen `[22,19,24]` → 2 und `[21,22,22,18]` → 2. Beide unabhängig mit Zählerständen erklären lassen.

### Tag 4

Referenz für Aufbau; erst nach eigener Arbeitszeit zeigen:

```python
def anzahl_warm(temperaturen, grenze):
    anzahl = 0
    for temperatur in temperaturen:
        if temperatur >= grenze:
            anzahl = anzahl + 1
    return anzahl
```

Optional bekommen Grundlagen diesen Helfer fertig, rufen ihn mit zwei kleinen Listen auf und erklären das Ergebnis. Eigenständiges Schreiben von `def` ist hier kein Abschlusskriterium.

Referenz für Vertiefung:

```python
def laengste_warme_folge(temperaturen, grenze):
    aktuell = 0
    beste = 0
    for temperatur in temperaturen:
        if temperatur >= grenze:
            aktuell = aktuell + 1
            if aktuell > beste:
                beste = aktuell
        else:
            aktuell = 0
    return beste
```

Zusatztests bei Grenze 20: `[]` → 0, `[18,19]` → 0, `[20,21,22]` → 3, `[20,21,18,25]` → 2. Keine verschachtelte Schleife nötig. Ein `return` im Schleifenrumpf wäre zu früh: Die restlichen Werte würden fehlen.

Projektbeurteilung: Auftrag erfüllt; nachvollziehbarer Plan; mindestens normaler und Grenzfall geprüft; Erklärung ohne Ablesen. Bei der optionalen Funktion bzw. in Vertiefung zusätzlich Funktion ausführen und Rückgabewert prüfen. Papierleistung und tatsächliche Ausführung getrennt dokumentieren.

## Preparation checklist

1. Solve every workbook task, print the diagnostic and prepare code cards.
2. Rehearse the selected slides and German prompts; use the manual run sheet.
3. Rehearse a full two-hour session with another device, printed tasks and local
   data. Stop adding features once rehearsal begins.

Review only the reference material needed for a specific teaching uncertainty.
Prepare one clear example per concept; do not add the complete CS50P syllabus.
