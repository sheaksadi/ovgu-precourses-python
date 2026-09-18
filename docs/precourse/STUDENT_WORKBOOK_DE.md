# Vier Tage: Denken wie eine Programmiererin oder ein Programmierer

Deine Lehrperson wählt die Route. Nutze die Hilfen, die dir beim Denken helfen. Eine gute Erklärung und ein guter Test sind wichtiger als schnelles Tippen.

Für jede Aufgabe notierst du: **Was ist gegeben? Was soll herauskommen? Wie könnte es gehen? Woran erkenne ich einen Fehler?**

## Tag 1 – Kann Momo deiner Anleitung folgen?

### Einstieg: Du programmierst, eine andere Person spielt Momo

Es gibt vier Felder in einer Reihe. Momo beginnt auf Feld 1, der Schlüssel liegt auf Feld 3, die Tür ist auf Feld 4. Momo schaut nach rechts. Er versteht nur `GEHE EIN FELD`, `NIMM SCHLÜSSEL` und `ÖFFNE TÜR`. Die Tür lässt sich nur öffnen, wenn Momo den Schlüssel vorher aufgenommen hat.

1. Schreibt eine genaue Anleitung. Keine Gesten und keine nachträglichen Zusatzhinweise.
2. Tauscht die Rollen. Führt jeden Befehl wörtlich aus.
3. Was passiert bei „Gehe zur Tür“? Welche Information fehlt dem Ausführenden?
4. Versetzt den Schlüssel auf Feld 2. Funktioniert die alte Anleitung noch?

Zusatzfrage: Welche zusätzliche Information und welche Entscheidung braucht Momo, wenn der Schlüssel an verschiedenen Stellen liegen kann? Dafür brauchen wir heute noch keine Python-Schreibweise.

### Tagesproblem: Wie lange sind 135 Minuten?

Ein Kursblock dauert eine nichtnegative ganze Anzahl Minuten. Gib die Anzahl vollständiger Stunden und die übrigen Minuten aus. Beispiel: 135 Minuten sind 2 Stunden und 15 Minuten.

| Eingabe | Volle Stunden | Übrige Minuten |
|---:|---:|---:|
| 45 | ? | ? |
| 60 | ? | ? |
| 135 | 2 | 15 |
| 0 | ? | ? |

Vor dem Programmieren: Zeichne Gruppen mit je 60 Minuten. Formuliere danach einen Plan in Alltagssprache.

- Grundlagen: Beginne mit `minuten = 135`. Ergänze ein Gerüst mit `//` (ganze Gruppen) und `%` (Rest). Verfolge die Werte auf Papier.
- Aufbau: Lies Minuten ein, wandle den Text in eine Zahl um und schreibe die Berechnung mit beschrifteter Ausgabe.
- Vertiefung: Vergleiche den Rest `minuten % 60` mit `minuten - stunden * 60`. Erkläre, warum bei unseren erlaubten Eingaben dasselbe entsteht. Teste außerdem 59, 61 und 120.

Werkzeugkarte, wenn du sie brauchst:

```python
minuten = int(input("Minuten: "))
stunden = minuten // 60
rest = minuten % 60
print(stunden, "Stunden und", rest, "Minuten")
```

Keine Pflicht zur Behandlung von Text wie „abc“: Der Auftrag erlaubt zunächst nur gültige Zahlen.

Exit-Ticket: Welche Werte entstehen bei 121 Minuten? Erkläre den Unterschied zwischen dem Namen `minuten` und seinem aktuellen Wert.

## Tag 2 – Wo liegt die Grenze?

Ein fiktives Raumthermometer soll eine Meldung anzeigen. Die Werte sind Übungsregeln, keine Gesundheitsempfehlung.

- Unter 20 °C: „kühl“.
- Ab 20 °C und unter 25 °C: „angenehm“.
- Ab 25 °C: „warm“.

Zeichne zuerst einen Zahlenstrahl. Ordne 19, 20, 24, 25 und 26 zu. Schreibe dann Entscheidungen als Fragen.

- Grundlagen: Vereinfache auf zwei Meldungen: unter 20 „kühl“, sonst „nicht kühl“. Nutze einen Entscheidungsbaum und `if/else`.
- Aufbau: Setze alle drei Meldungen mit `if/elif/else` um. Jede Eingabe soll genau eine Meldung erzeugen.
- Vertiefung: Untersuche diese fehlerhafte Lösung. Finde mindestens zwei Eingaben, die den Fehler sichtbar machen, und repariere sie.

```python
if temperatur >= 20:
    print("angenehm")
elif temperatur >= 25:
    print("warm")
else:
    print("kühl")
```

Testidee: Prüfe direkt unter, genau auf und direkt über einer Grenze. Ist 20 selbst enthalten? Welche Bedingung wird zuerst geprüft?

Transfer, nur falls Zeit bleibt: Die Meldung „Lüften“ soll erscheinen, wenn `temperatur >= 25` UND `fenster_offen` falsch ist. Zeichne zunächst die vier möglichen Kombinationen der beiden Wahrheitswerte.

Exit-Ticket: Welche Meldung gibt deine Route bei 20 und bei 25 aus? Begründe ohne Ausführen.

## Tag 3 – Eine Regel, viele Messwerte

Gegeben sind Temperaturen `[18, 21, 20, 25, 17]`. Wie viele Werte sind mindestens 20? Für diese Auswertung nennen wir Werte ab der gewählten Grenze „warm“. Das ist eine neue Auswertungsregel, unabhängig von den drei Meldungen des Thermometers an Tag 2.

Zähle zunächst selbst. Überlege dann, was du dir beim Durchgehen der Liste merken musst.

| Aktueller Wert | Mindestens 20? | Zähler danach |
|---:|---|---:|
| Start | – | 0 |
| 18 | ? | ? |
| 21 | ? | ? |
| 20 | ? | ? |
| 25 | ? | ? |
| 17 | ? | ? |

- Grundlagen: Ergänze die Tabelle und dieses Gerüst. Erkläre besonders, warum der Zähler vor der Schleife auf 0 gesetzt wird.

```python
temperaturen = [18, 21, 20, 25, 17]
anzahl = 0
for temperatur in temperaturen:
    if temperatur >= ____:
        anzahl = anzahl + ____
print(anzahl)
```

- Aufbau: Schreibe die Lösung ohne Gerüst. Ändere anschließend den Auftrag: Berechne die Summe aller Temperaturen. Was bleibt am Ablauf gleich?
- Vertiefung: Wie lang ist die längste ununterbrochene Folge mit Werten ab 20? Welche zwei Informationen musst du speichern? Zeichne für `[20, 21, 18, 25]` eine Ablaufspur.

Ein absichtlicher Fehler: Jemand setzt `anzahl = 0` innerhalb der Schleife. Erkläre anhand der Liste, warum dadurch bisherige Ergebnisse verloren gehen.

Exit-Ticket: Was liefern `[19, 20, 21]` und die leere Liste `[]` beim Zählen? Erkläre, wie oft die Schleife jeweils läuft.

## Tag 4 – Dein Projekt: Temperatur-Check

Baue ein Werkzeug, das für eine Liste von Temperaturen und eine frei wählbare Grenze zählt, wie viele Werte mindestens diese Grenze erreichen. Die Daten stehen im Programm; ein Download, eine API und wiederholte Tastatureingaben sind nicht nötig.

### Auftrag und Tests

| Werte | Grenze | Erwartete Anzahl |
|---|---:|---:|
| `[18, 21, 20, 25, 17]` | 20 | 3 |
| `[19, 20, 21]` | 20 | 2 |
| `[20]` | 20 | 1 |
| `[]` | 20 | 0 |
| `[18, 21, 20, 25, 17]` | 25 | 1 |

1. Beschreibe Eingabe und gewünschtes Ergebnis.
2. Rechne zwei Beispiele von Hand.
3. Schreibe deinen Plan in Pseudocode.
4. Setze ihn um, teste und erkläre eine Verbesserung.

- Grundlagen: Nutze das Gerüst von Tag 3, ersetze die feste Grenze durch eine Variable und teste mindestens zwei Fälle. Rufe danach mit Hilfe der Lehrperson eine bereitgestellte Funktion auf.
- Aufbau: Schreibe `anzahl_warm(temperaturen, grenze)`. Sie gibt eine Zahl zurück; die Ausgabe mit `print()` erfolgt außerhalb. Prüfe alle fünf Fälle.
- Vertiefung: Ergänze `laengste_warme_folge(temperaturen, grenze)` als zweite Funktion. Definiere und prüfe leere Liste, nur kalte Werte, nur warme Werte und zwei getrennte warme Folgen.

Für das Beispiel `[18, 21, 20, 25, 17]` und Grenze 20 beträgt die längste Folge 3. Für `[20, 21, 18, 25]` beträgt sie 2.

### Woran erkennst du, dass du fertig bist?

- Deine Lösung erfüllt den Auftrag deiner Route.
- Du zeigst einen normalen Fall und einen Grenzfall mit erwarteten Ergebnissen.
- Du erklärst, was Zähler, Bedingung und Schleife tun.
- Du kannst einen Fehler beschreiben, den ein Test gefunden hat oder finden würde.

Ohne Computer gibst du Pseudocode und ausgefüllte Ablaufspuren ab. Das ist eine vollständige Problemlösearbeit; die Ausführung in Python kannst du anschließend nachholen.

Exit-Ticket: Was würde sich ändern, wenn wir statt Temperaturen Prüfungspunkte oder Längen untersuchen? Welcher Teil deines Plans bleibt gleich?

## Mini-Spickzettel: Werkzeuge nach Bedarf

| Absicht | Python-Beispiel |
|---|---|
| Etwas anzeigen | `print(anzahl)` |
| Einen Wert unter einem Namen merken | `anzahl = 0` |
| Text einlesen / in eine ganze Zahl umwandeln | `text = input("Wert: ")`, `zahl = int(text)` |
| Vergleichen | `==`, `!=`, `<`, `<=`, `>`, `>=` |
| Regeln verbinden | `and`, `or`, `not` |
| Ganze Gruppen / Rest | `135 // 60`, `135 % 60` |
| Mehrere Werte sammeln | `werte = [18, 21, 20]` |
| Jeden Wert betrachten | `for wert in werte:` |
| Ergebnis einer Funktion zurückgeben | `return anzahl` |

```python
def verdoppeln(zahl):
    return zahl * 2

ergebnis = verdoppeln(3)
print(ergebnis)
```

Einrückung zeigt, welche Anweisungen zusammengehören. `=` weist einen Wert zu; `==` stellt eine Vergleichsfrage. `print` zeigt etwas an; `return` liefert etwas an den aufrufenden Programmteil zurück.
