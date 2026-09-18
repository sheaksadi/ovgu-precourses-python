import counter from './slides.counter.json'

export interface SlideEntry {
  /** Permanent identifier, e.g. `PRE-0001`. Never renumber or reuse it. */
  id: string
  title: string
  subtitle?: string
  /** Id of the parent slide. Set it to turn this entry into a sub-slide. */
  parent?: string
  /** Layout file in `layouts/` that draws the chrome around this slide. */
  layout?: SlideLayoutName
  /**
   * Marks the slide as interactive. A device in interactive mode renders the
   * interactive chrome and asks before leaving an unfinished interaction.
   */
  interactive?: SlideInteractive
  /** Optional room-wide button shown beside presenter navigation. */
  presenterAction?: { label: string, command: string }
  /** Advent of Code style problem this slide poses, by id from `server/problems/`. */
  problem?: string
  teleprompter?: string
  /**
   * Every slide rises in softly. `none` skips that, for the stages of one scene
   * that must cut into each other invisibly.
   */
  transition?: SlideTransition
  /** Planned minutes on this slide, used by the presenter view's pacing. */
  duration?: number
  backgroundColor?: string
  /** Keep the page and the id, but skip the slide during the presentation. */
  hidden?: boolean
  /** Escape hatch for a page that does not live at `pages/slides/<id lowercased>.vue`. */
  route?: string
}

export type SlideTransition = 'none'

export type SlideLayoutName = 'slide' | 'slide-bare' | 'slide-section' | 'slide-interactive'

export interface SlideInteractive {
  /** Stable name for the interaction, for your own bookkeeping. */
  id?: string
  /** How many steps the viewer works through. Defaults to 1. */
  steps?: number
  /** Ask before leaving even when the viewer has not started yet. */
  required?: boolean
}

/** Deck prefix and the next free slide number. Owned by `npm run slide:new`. */
export const slideCounter: { prefix: string, next: number } = counter

/**
 * Presentation order is the order of this array, and nothing else.
 * Move an entry to reorder a slide; no page, id or route changes.
 */
export const slides: SlideEntry[] = [
  // <slides:start>
  {
    id: 'PRE-0033',
    title: 'Python-Vorkurs',
    subtitle: '28.09.–01.10.2026 · vier Tage · täglich zwei Stunden',
    layout: 'slide-bare',
    teleprompter: 'Willkommen! Vier Tage lang lösen wir kleine Probleme: vermuten, planen, nachverfolgen, ausführen und prüfen. Scannt den Code zum Mitlesen. Papier und Partnerarbeit sind gleichwertige Wege zum Mitdenken. Die Lehrperson wählt eine Route für die ganze Gruppe.',
  },
  {
    id: 'PRE-0152',
    title: 'Vier Tage: Probleme lösen',
    teleprompter: 'Vier Tage, jeweils zwei Stunden inklusive Pause. Eine Route für die ganze Gruppe wählen: Grundlagen mit Gerüsten und Papier, Aufbau mit kurzen eigenen Programmen, Vertiefung mit Grenzfällen und kleinen Funktionen. Erst vermuten und planen, dann Python. Den Ablaufzettel nutzen; Weiter führt weiterhin durch die ganze Materialsammlung.',
  },
  {
    id: 'PRE-0038',
    title: 'Vorstellungsrunde',
    subtitle: 'Name sagen, kurz vorstellen, Frage drehen',
    duration: 10,
    presenterAction: { label: 'Spin', command: 'spin' },
    teleprompter: 'Reihum: Name sagen, kurz vorstellen – Hobbys, etwas Schräges oder Besonderes, etwas Nettes über sich. Dann dreht die Person auf dem eigenen Handy die Frage; der Beamer zeigt, wer gedreht hat und welche Frage kam. Ohne Handy: Spin im Presenter oder auf der Fernbedienung. Keine Frage kommt doppelt, bis alle einmal dran waren. Den Beamer über den Projektor-Knopf der Startseite öffnen, sonst zeigt er selbst einen Drehen-Knopf. Selbst anfangen hilft.',
  },
  {
    id: 'PRE-0034',
    title: 'Kommt Momo ins Haus?',
    subtitle: 'Problem',
    teleprompter: 'Momo steht vor ihrer Haustür. Manchmal hat sie den Schlüssel dabei, manchmal nicht. Frag die Gruppe: Was passiert in beiden Fällen? Erst sammeln, dann weiter.',
  },
  {
    id: 'PRE-0035',
    title: 'Kommt Momo ins Haus? – Lösen',
    parent: 'PRE-0034',
    transition: 'none',
    teleprompter: 'Gleiche Situation, ein Unterschied. Beide Katzen laufen los. Mit Schlüssel geht die Tür auf und Momo ist drin. Ohne Schlüssel bleibt die Tür zu und Momo schläft davor. Eine Frage, zwei Wege.',
  },
  {
    id: 'PRE-0036',
    title: 'Kommt Momo ins Haus? – Aufschreiben',
    parent: 'PRE-0034',
    transition: 'none',
    teleprompter: 'Jetzt schreiben wir genau das auf. if steht vor der Frage, else vor dem anderen Weg. Alles andere ist ganz normales Deutsch. Fahr mit der Maus über ein Wort im Code, dann leuchtet es im Bild auf.',
  },
  {
    id: 'PRE-0037',
    title: 'Kommt Momo ins Haus? – Python',
    parent: 'PRE-0034',
    transition: 'none',
    teleprompter: 'Und jetzt als echtes Python. Oben unser Plan, unten derselbe Plan, den der Computer ausführen kann. if und else bleiben gleich, die Frage wird zu einer Variablen hat_schluessel, und was Momo tut, wird zu print. Ändere True zu False und frag: Was steht jetzt da?',
  },
  {
    id: 'PRE-0039',
    title: 'Probier’s selbst',
    subtitle: 'Online-Compiler öffnen und den Code ausführen',
    duration: 5,
    teleprompter: 'Jetzt selbst ausprobieren. Die Vorführung zeigt den Weg: suchen, Online-Compiler öffnen, Code einfügen, Run. Wer mag, scannt den Code. Aufgabe: den Text im print ändern, zum Beispiel in den eigenen Namen, und nochmal Run drücken. Enter zeigt die Vorführung nochmal.',
  },
  {
    id: 'PRE-0040',
    title: 'Variablen',
    duration: 15,
    teleprompter: 'Erinnerung an print("Hallo Welt!"). Jetzt kommt der Text in eine Box. Name links, Wert rechts, das = heißt: leg das hier hinein.',
  },
  {
    id: 'PRE-0041',
    title: 'Variablen – Wert benutzen',
    parent: 'PRE-0040',
    transition: 'none',
    teleprompter: 'print(gruss) ohne Anführungszeichen: Python schaut in die Box. Frag: Was würde mit Anführungszeichen ausgegeben? Genau, das Wort gruss.',
  },
  {
    id: 'PRE-0042',
    title: 'Variablen – Neuer Wert',
    parent: 'PRE-0040',
    transition: 'none',
    teleprompter: 'Gleiche Box, neuer Inhalt. Der alte Wert ist weg. Zwei prints, zwei Ausgaben, jeweils mit dem Wert, der gerade drin ist.',
  },
  {
    id: 'PRE-0043',
    title: 'Variablen – Typen',
    parent: 'PRE-0040',
    transition: 'none',
    teleprompter: 'Vier Typen für den Anfang: str, int, float, bool. Anführungszeichen machen den Unterschied zwischen "3" und 3. type() verrät den Typ.',
  },
  {
    id: 'PRE-0044',
    title: 'Variablen – Rechnen',
    parent: 'PRE-0040',
    transition: 'none',
    teleprompter: 'Rechte Seite zuerst: alter + 1 ergibt 4, das kommt zurück in alter. += ist die Kurzform. Am Ende steht 5 in der Box.',
  },
  {
    id: 'PRE-0045',
    title: 'Variablen – f-Strings',
    parent: 'PRE-0040',
    transition: 'none',
    teleprompter: 'f-Strings: ein f vor die Anführungszeichen, Variablen in geschweifte Klammern. Python setzt die Werte ein.',
  },
  {
    id: 'PRE-0046',
    title: 'Variablen – input()',
    parent: 'PRE-0040',
    transition: 'none',
    teleprompter: 'input() gibt immer Text zurück, auch wenn jemand eine Zahl tippt. Mit int() umwandeln, sonst gibt "5" + 1 einen Fehler.',
  },
  {
    id: 'PRE-0047',
    title: 'Variablen – Namen',
    parent: 'PRE-0040',
    transition: 'none',
    teleprompter: 'Namensregeln. Groß und klein zählt: alter und Alter sind zwei verschiedene Boxen, darum gibt print(alter) die 3 aus.',
  },
  {
    id: 'PRE-0048',
    title: 'PyCharm installieren',
    subtitle: 'Suchen, öffnen, runterscrollen, Community Edition',
    duration: 4,
    teleprompter: 'Für den Kurs brauchen wir PyCharm auf dem eigenen Rechner. Browser auf, pycharm download eintippen – genau das, was alle eintippen würden – und Suchen drücken. Dann das Ergebnis von jetbrains.com anklicken, keine Anzeigen und keine Download-Portale. Die Seite öffnet oben mit PyCharm Professional – das ist nicht die, die wir wollen. Nicht den ersten Download-Knopf drücken. Weiter nach unten scrollen, bis PyCharm Community Edition kommt. Die ist kostenlos und reicht für den ganzen Kurs. Unter Community Edition auf Download drücken und die Datei öffnen. Windows lädt eine .exe, macOS eine .dmg, Linux ein .tar.gz. Den Installer mit den Standardeinstellungen durchklicken. Enter zeigt die Vorführung nochmal.',
  },
  {
    id: 'PRE-0052',
    title: 'Jetzt du: PyCharm installieren',
    duration: 12,
    teleprompter: 'Jetzt arbeiten alle selbst. QR-Code scannen oder pycharm download suchen, runterscrollen zur Community Edition, herunterladen und installieren. Herumgehen und bei Betriebssystem-Warnungen helfen. Ziel: PyCharm lässt sich öffnen. Wer fertig ist, hilft der Person daneben.',
  },
  {
    id: 'PRE-0053',
    title: 'Neues Projekt',
    subtitle: 'New Project, Project venv, Python-Version',
    duration: 6,
    teleprompter: 'PyCharm öffnen. Beim ersten Start kommt das Willkommensfenster, dort New Project. Wer schon ein Projekt offen hat: File → New Project. Enter zeigt die Vorführung nochmal.',
  },
  {
    id: 'PRE-0054',
    title: 'Neues Projekt – Einstellungen',
    parent: 'PRE-0053',
    transition: 'none',
    teleprompter: 'Name eintragen, zum Beispiel vorkurs. Interpreter type bleibt Project venv: jedes Projekt bekommt seine eigene Python-Umgebung. Bei Python version muss etwas stehen. Ist die Liste leer, ist noch kein Python installiert: QR-Code links scannen, Python installieren, unter Windows „Add python.exe to PATH“ anhaken, PyCharm neu starten.',
  },
  {
    id: 'PRE-0055',
    title: 'Neues Projekt – Create',
    parent: 'PRE-0053',
    transition: 'none',
    teleprompter: 'Create drücken. PyCharm legt den Ordner und die virtuelle Umgebung .venv an, das dauert einen Moment. Danach steht unten rechts die Python-Version mit dem Projektnamen. Kurz rumgehen: Steht das bei allen?',
  },
  {
    id: 'PRE-0056',
    title: 'Code ausführen',
    subtitle: 'Datei anlegen, Code schreiben, Run',
    duration: 8,
    transition: 'none',
    teleprompter: 'Jetzt die erste eigene Datei. Rechtsklick auf den Projektordner, New, Python File, Namen eintippen, Enter. Die .py-Endung ergänzt PyCharm selbst. print("Hallo Welt!") in die Datei tippen. Speichern muss man nicht, PyCharm speichert automatisch. Auf Anführungszeichen und Klammern achten. Oben auf den grünen Pfeil drücken, oder Rechtsklick in den Code und Run. Unten öffnet sich das Run-Fenster mit Hallo Welt! und exit code 0. Aufgabe: den Text ändern und nochmal ausführen. Enter zeigt die Vorführung nochmal.',
  },
  {
    id: 'PRE-0059',
    title: 'Listen',
    subtitle: 'Momos Fische',
    duration: 12,
    teleprompter: 'Momo hat fünf Fische gefangen, jeder mit seiner Länge. Mit dem, was wir kennen, sind das fünf Variablen. Frag: Was machen wir bei 100 Fischen? 100 Zeilen, 100 Namen – das will niemand.',
  },
  {
    id: 'PRE-0060',
    title: 'Listen – Ein Korb',
    parent: 'PRE-0059',
    transition: 'none',
    teleprompter: 'Die fünf Boxen rücken zusammen und werden ein Korb mit Fächern. Ein Name für alle, und die Reihenfolge bleibt erhalten. Noch kein Python, erst die Idee.',
  },
  {
    id: 'PRE-0061',
    title: 'Listen – Python',
    parent: 'PRE-0059',
    transition: 'none',
    teleprompter: 'In Python ist der Korb eine Liste: eckige Klammern außen, Kommas zwischen den Werten. print(fische) zeigt die ganze Liste mit Klammern.',
  },
  {
    id: 'PRE-0062',
    title: 'Listen – Index',
    parent: 'PRE-0059',
    transition: 'none',
    teleprompter: 'Jedes Fach hat eine Nummer, den Index, und Python fängt bei 0 an. Frag vorher: Was gibt fische[3] aus? Viele sagen 8 – es ist 21, der vierte Fisch.',
  },
  {
    id: 'PRE-0063',
    title: 'Listen – Ändern',
    parent: 'PRE-0059',
    transition: 'none',
    teleprompter: 'fische[2] = 25 funktioniert wie bei einer Variablen, nur für ein Fach: der alte Wert fliegt raus, der neue kommt rein. len zählt die Fächer, nicht die Werte zusammen.',
  },
  {
    id: 'PRE-0064',
    title: 'Listen – append',
    parent: 'PRE-0059',
    transition: 'none',
    teleprompter: 'append hängt einen Wert hinten an, die Liste wird länger. Der neue Fisch bekommt Index 5, len ist jetzt 6. Frag: Welcher Index ist der letzte? Immer len minus 1.',
  },
  {
    id: 'PRE-0070',
    title: 'Jetzt du: Listen',
    subtitle: 'Erstes Rätsel: rechnen mit Stellen',
    problem: 'lists-basket',
    duration: 10,
    teleprompter: 'Erstes Rätsel, und gleich im Advent-of-Code-Stil: Jedes Gerät bekommt eine eigene Preisliste. Kopieren, in PyCharm die drei ersten Preise addieren, die Zahl hier abschicken. Teil 2 sind die letzten drei – da lohnt sich preise[-1]. Oben rechts erscheint, wer fertig ist; wer weiterblättert, findet das Rätsel unten rechts wieder.',
  },
  {
    id: 'PRE-0065',
    title: 'Listen und if',
    subtitle: 'Welcher Fisch ist der längste?',
    duration: 8,
    teleprompter: 'Drei Fische, welcher ist der längste? Wir sehen es sofort an den Balken. Frag: Wie würdet ihr das dem Computer mit if erklären? Erst Ideen sammeln.',
  },
  {
    id: 'PRE-0066',
    title: 'Listen und if – elif',
    parent: 'PRE-0065',
    transition: 'none',
    teleprompter: 'Mit if und elif geht es: für jeden Fisch prüfen, ob er länger als alle anderen ist. Die Vergleiche erscheinen rechts, der erste scheitert, der zweite passt. Bei drei Fischen ist das noch okay.',
  },
  {
    id: 'PRE-0067',
    title: 'Listen und if – 6 Fische',
    parent: 'PRE-0065',
    transition: 'none',
    teleprompter: 'Jetzt sechs Fische. Jede Bedingung muss mit allen anderen vergleichen: das Gitter zeigt jedes Paar, 30 Vergleiche. Der Code hat schon drei Blöcke und es fehlen noch drei.',
  },
  {
    id: 'PRE-0068',
    title: 'Listen und if – 100 Fische',
    parent: 'PRE-0065',
    transition: 'none',
    teleprompter: 'Hundert Fische: 9 900 Vergleiche. Und jeder neue Fisch heißt Code umschreiben. So nicht. Kurz wirken lassen.',
  },
  {
    id: 'PRE-0069',
    title: 'Listen und if – Idee',
    parent: 'PRE-0065',
    transition: 'none',
    teleprompter: 'Wie machen wir es selbst im Kopf? Einmal durchgehen und den längsten bisher merken. Momo läuft einmal am Korb entlang, bei der 30 tauscht sie, sonst nicht. Sechs Fische, sechs Blicke. Das ist eine Schleife – nächstes Thema.',
  },
  {
    id: 'PRE-0071',
    title: 'Schleifen: for',
    subtitle: 'Jeden Fisch anschauen',
    duration: 12,
    teleprompter: 'Wir wollen jeden Fisch ausgeben. Mit dem, was wir kennen: fünf print-Zeilen, die fast gleich aussehen. Frag: Was ändert sich von Zeile zu Zeile? Nur die Nummer.',
  },
  {
    id: 'PRE-0072',
    title: 'Schleifen: for – Momo läuft',
    parent: 'PRE-0071',
    transition: 'none',
    teleprompter: 'Die Idee aus dem letzten Kapitel: Momo läuft einmal am Korb entlang. Bei jedem Fisch landet der Wert in der Box fisch, oben zählt der Durchlauf mit, rechts erscheint die Ausgabe.',
  },
  {
    id: 'PRE-0073',
    title: 'Schleifen: for – Python',
    parent: 'PRE-0071',
    transition: 'none',
    teleprompter: 'Genau so in Python: for fisch in fische, Doppelpunkt, darunter eingerückt, was pro Fisch passiert. Den Namen fisch dürfen wir frei wählen. Mit der Maus über fisch im Code fahren, dann leuchtet die Box.',
  },
  {
    id: 'PRE-0074',
    title: 'Schleifen: for – Einrückung',
    parent: 'PRE-0071',
    transition: 'none',
    teleprompter: 'Wichtigster Stolperstein: Einrückung. Eingerückt gehört zur Schleife und läuft fünfmal. print("fertig") ist nicht eingerückt und läuft einmal danach. Frag: Was passiert, wenn wir fertig einrücken?',
  },
  {
    id: 'PRE-0075',
    title: 'Schleifen: for – Summe',
    parent: 'PRE-0071',
    transition: 'none',
    teleprompter: 'Unterwegs etwas sammeln. gesamt startet vor der Schleife bei 0, in jedem Durchlauf kommt ein Fisch dazu. print steht wieder außerhalb, sonst würde jede Zwischensumme ausgegeben.',
  },
  {
    id: 'PRE-0076',
    title: 'Schleifen lösen Probleme',
    subtitle: 'Längster, zählen, filtern',
    duration: 10,
    teleprompter: 'Zurück zum Problem mit den sechs Fischen. Jetzt mit Schleife: laengster startet mit dem ersten Fisch. Momo läuft durch, bei jedem Fisch die Frage: länger als laengster? Nur bei der 30 ist die Antwort ja, dann wird getauscht.',
  },
  {
    id: 'PRE-0077',
    title: 'Schleifen lösen Probleme – Zählen',
    parent: 'PRE-0076',
    transition: 'none',
    teleprompter: 'Gleiches Muster, andere Frage: Wie viele sind länger als 14? Ein Zähler startet bei 0, bei jedem Ja kommt 1 dazu. Die kleinen Fische treten zurück. Frag vorher: Was kommt raus? Vier.',
  },
  {
    id: 'PRE-0078',
    title: 'Schleifen lösen Probleme – Filtern',
    parent: 'PRE-0076',
    transition: 'none',
    teleprompter: 'Statt zählen sammeln: eine leere Liste, und append im if. Die großen Fische landen im neuen Korb. Das ist das Muster Filtern, das wir ständig brauchen, später auch mit Daten.',
  },
  {
    id: 'PRE-0079',
    title: 'Schleifen lösen Probleme – Vergleich',
    parent: 'PRE-0076',
    transition: 'none',
    teleprompter: 'Links die if-Kette von vorhin, rechts die Schleife. Die Kette wächst mit jedem Fisch, die Schleife bleibt fünf Zeilen, egal wie lang die Liste ist. Genau deshalb sind Schleifen so wichtig.',
  },
  {
    id: 'PRE-0080',
    title: 'Schleifen: range',
    subtitle: 'Zählen ohne Liste',
    duration: 8,
    teleprompter: 'Momo soll fünfmal springen. Es gibt keine Liste, also tippen wir eine: 0, 1, 2, 3, 4. Frag: Und wenn sie 100-mal springen soll?',
  },
  {
    id: 'PRE-0081',
    title: 'Schleifen: range – range(5)',
    parent: 'PRE-0080',
    transition: 'none',
    teleprompter: 'range(5) macht die Zahlenreihe für uns. Wichtig: Sie startet bei 0 und hört vor der 5 auf. Fünf Zahlen, aber die 5 ist nicht dabei – der gestrichelte Pfosten.',
  },
  {
    id: 'PRE-0082',
    title: 'Schleifen: range – Start, Stopp, Schritt',
    parent: 'PRE-0080',
    transition: 'none',
    teleprompter: 'Drei Zahlen in range: wo es losgeht, vor welcher Zahl es aufhört, wie groß der Schritt ist. Die Pfosten bleiben, nur die Nummern ändern sich. Frag: Wie bekommen wir 10, 20, 30?',
  },
  {
    id: 'PRE-0083',
    title: 'Schleifen: range – Einmaleins',
    parent: 'PRE-0080',
    transition: 'none',
    teleprompter: 'Mit i rechnen: Jede Runde i mal 7, die Balken wachsen mit. Zwei Zeilen Code für eine ganze Einmaleins-Reihe. Aufgabe zum Mitdenken: Was ändern wir für die 9er-Reihe bis 10?',
  },
  {
    id: 'PRE-0084',
    title: 'Schleifen: while',
    subtitle: 'Solange …',
    duration: 12,
    teleprompter: 'Neue Situation: Momo frisst, bis sie satt ist. Frag: Wie viele Bissen? Kommt drauf an. Bei for wissen wir vorher, wie oft. Bei while gibt es nur eine Frage, die vor jedem Bissen gestellt wird.',
  },
  {
    id: 'PRE-0085',
    title: 'Schleifen: while – Bedingung',
    parent: 'PRE-0084',
    transition: 'none',
    teleprompter: 'Der Hebel ist die Bedingung bauch < 12. Vor jedem Durchlauf wird sie geprüft: 0, 4, 8 sind kleiner als 12, also frisst Momo. Bei 12 ist sie falsch, der Hebel kippt, und print("Satt!") läuft.',
  },
  {
    id: 'PRE-0086',
    title: 'Schleifen: while – Endlosschleife',
    parent: 'PRE-0084',
    transition: 'none',
    teleprompter: 'Der häufigste while-Fehler: Die Variable in der Bedingung ändert sich nie. Dann ist die Bedingung für immer wahr, wie Bello, der seinen Schwanz jagt. In PyCharm mit dem roten Quadrat stoppen. Das passiert jedem mal.',
  },
  {
    id: 'PRE-0087',
    title: 'Schleifen: while – break',
    parent: 'PRE-0084',
    transition: 'none',
    teleprompter: 'while True läuft absichtlich für immer, und break ist der Notausgang. Ratespiel: 3 falsch, 9 falsch, 7 richtig, break. Gut, wenn man nicht weiß, wie viele Versuche jemand braucht.',
  },
  {
    id: 'PRE-0088',
    title: 'Schleifen: while – continue',
    parent: 'PRE-0084',
    transition: 'none',
    teleprompter: 'continue ist das Gegenstück: nicht aufhören, sondern diesen Durchlauf abbrechen und mit dem nächsten weitermachen. Der faule Fisch wird übersprungen, die anderen isst Momo. Funktioniert in for und while.',
  },
  {
    id: 'PRE-0090',
    title: 'Schleifen überall',
    subtitle: 'Text, verschachtelt, Muster, Simulation, Zufall',
    duration: 10,
    teleprompter: 'Schleifen gehen nicht nur über Listen. Ein Text besteht aus Buchstaben, also läuft for auch da durch. Frag: Was gibt for buchstabe in "Hallo" aus?',
  },
  {
    id: 'PRE-0091',
    title: 'Schleifen überall – verschachtelt',
    parent: 'PRE-0090',
    transition: 'none',
    teleprompter: 'Eine Schleife in einer Schleife: Die äußere zählt die Zeilen, die innere die Spalten. Die innere läuft für jede Zeile komplett durch. So funktionieren Tabellen, Bilder und Spielfelder.',
  },
  {
    id: 'PRE-0092',
    title: 'Schleifen überall – Muster',
    parent: 'PRE-0090',
    transition: 'none',
    teleprompter: 'Text mal Zahl wiederholt den Text. Mit i als Anzahl wird jede Zeile länger. Frag: Wie bekommen wir das Dreieck andersherum?',
  },
  {
    id: 'PRE-0093',
    title: 'Schleifen überall – Simulation',
    parent: 'PRE-0090',
    transition: 'none',
    teleprompter: 'Simulation heißt: Wir rechnen Schritt für Schritt aus, wie sich etwas entwickelt. Hier Geld mit 10 Prozent Zinsen. Das gleiche Muster steckt in Wettermodellen, Physik und beim Training von KI-Modellen – Runde für Runde.',
  },
  {
    id: 'PRE-0089',
    title: 'Jetzt du: Schleifen',
    subtitle: 'Zählen, und der längste Lauf am Stück',
    problem: 'loops-steps',
    duration: 20,
    teleprompter: 'Rätsel-Runde zu Schleifen, zwei Aufgaben. Hier: Bellos Schrittzähler, 40 Tage. Teil 1 zählt die Tage über 10000 – Schleife, if, Zähler. Teil 2 will den längsten Lauf am Stück: der Zähler muss bei einem schwachen Tag wieder auf 0. Danach kommt Momos Fang, dann die Rangliste und die Lösung.',
  },
  {
    id: 'PRE-0137',
    title: 'Rätsel: Momos Fang',
    subtitle: 'Zählen mit Schleife und if, dann Summe mit break',
    duration: 15,
    problem: 'loops-fish',
    teleprompter: 'Erstes Rätsel im Advent-of-Code-Stil. Jedes Gerät bekommt eine eigene Fischliste: kopieren, in PyCharm lösen, nur die Zahl abschicken. Teil 1 zählt Fische ab 20 cm, Teil 2 öffnet sich nach Teil 1: Momo frisst der Reihe nach, bis 300 cm nicht mehr passen – break. Oben rechts erscheint, wer gelöst hat. Wer weiterblättert, findet das Rätsel unten rechts wieder.',
  },
  {
    id: 'PRE-0138',
    title: 'Rätsel: Rangliste Schleifen',
    subtitle: 'Wer hat die meisten Sterne?',
    duration: 2,
    teleprompter: 'Die Rangliste der Schleifen-Runde: ein Stern pro gelöstem Teil, bei Gleichstand zählt, wer schneller war. Auf den Handys steht der eigene Platz. Kurz feiern, dann die Lösungen zeigen.',
  },
  {
    id: 'PRE-0139',
    title: 'Lösung: Momos Fang',
    subtitle: 'Die Lösung Zeile für Zeile',
    duration: 6,
    teleprompter: 'Die Lösung im Ganzen: oben Teil 1, unten Teil 2. Wir spielen sie mit der Beispielliste durch. Enter spielt eine Stufe nochmal ab.',
  },
  {
    id: 'PRE-0140',
    title: 'Lösung: Momos Fang – Teil 1',
    parent: 'PRE-0139',
    transition: 'none',
    teleprompter: 'Die Kamera fährt auf Teil 1. Mitlesen: Zeile 5 holt den nächsten Fisch, Zeile 6 prüft, Zeile 7 zählt nur bei True. Am Ende steht 3 in der Ausgabe.',
  },
  {
    id: 'PRE-0141',
    title: 'Lösung: Momos Fang – Teil 2',
    parent: 'PRE-0139',
    transition: 'none',
    teleprompter: 'Teil 2 mit einem kleinen Bauch von 50 cm, damit es schnell geht. Wichtig ist Zeile 14: erst prüfen, ob der Fisch noch passt, dann addieren. Bei 37 + 20 ist Schluss, break springt raus, Ausgabe 2.',
  },
  {
    id: 'PRE-0142',
    title: 'Lösung: Momos Fang – Deine Liste',
    parent: 'PRE-0139',
    transition: 'none',
    teleprompter: 'Zurück zum Ganzen. Mit der eigenen Liste und 300 statt 50 kommen die eigenen Antworten heraus. Wer noch nicht fertig ist: unten rechts ist das Rätsel weiter offen.',
  },
  {
    id: 'PRE-0095',
    title: 'Funktionen',
    subtitle: 'Zu viel Code',
    duration: 10,
    teleprompter: 'Neues Kapitel. Drei Tiere, jedes wird begrüßt und frisst etwas. Dafür kopieren wir zwei Zeilen dreimal und ändern Name und Futter. Frag: Was ist daran unpraktisch?',
  },
  {
    id: 'PRE-0096',
    title: 'Funktionen – Änderung',
    parent: 'PRE-0095',
    transition: 'none',
    teleprompter: 'Jetzt eine kleine Änderung: frisst gern. Zwei Kopien schaffen wir, die dritte vergessen wir. Genau so entstehen echte Bugs, wenn Code kopiert wird.',
  },
  {
    id: 'PRE-0097',
    title: 'Funktionen – Rezept',
    parent: 'PRE-0095',
    transition: 'none',
    teleprompter: 'Die Idee: Die zwei Zeilen einmal als Rezept aufschreiben, mit Lücken für Tier und Futter. Dann nur noch das Rezept aufrufen und die Lücken füllen. Ändern müssen wir nur noch an einer Stelle.',
  },
  {
    id: 'PRE-0098',
    title: 'Funktionen – def',
    parent: 'PRE-0095',
    transition: 'none',
    teleprompter: 'In Python heißt das Rezept Funktion und wird mit def geschrieben. tier und futter sind Parameter, die Lücken. Beim Aufruf wandern die Werte in die Funktion – die Bälle. Erst der Aufruf führt den Code aus, def allein tut nichts.',
  },
  {
    id: 'PRE-0099',
    title: 'Wie Funktionen arbeiten',
    subtitle: 'Aufruf, Parameter, return',
    duration: 12,
    teleprompter: 'Was passiert bei einem Aufruf genau? Der rote Punkt zeigt, wo Python gerade ist: Zeile 1, dann der Aufruf, rüber in die Funktion, zurück, weiter mit Zeile 4. Frag vorher: In welcher Reihenfolge erscheinen die Ausgaben?',
  },
  {
    id: 'PRE-0100',
    title: 'Wie Funktionen arbeiten – Parameter',
    parent: 'PRE-0099',
    transition: 'none',
    teleprompter: 'Die Funktion als Maschine. Oben kommen Werte rein. x ist die Lücke und bekommt bei jedem Aufruf den Wert, der mitgegeben wird. Zweimal aufrufen, zweimal andere Ergebnisse.',
  },
  {
    id: 'PRE-0101',
    title: 'Wie Funktionen arbeiten – return',
    parent: 'PRE-0099',
    transition: 'none',
    teleprompter: 'Bisher hat die Funktion nur angezeigt. Mit return kommt das Ergebnis unten wieder heraus und kann in einer Variablen landen. Damit kann man weiterrechnen – so funktionieren auch len oder max.',
  },
  {
    id: 'PRE-0102',
    title: 'Wie Funktionen arbeiten – print vs return',
    parent: 'PRE-0099',
    transition: 'none',
    teleprompter: 'Der häufigste Anfängerfehler: print statt return. Beide Maschinen zeigen scheinbar dasselbe, aber nur geben liefert etwas zurück. zeigen gibt None zurück – Python für: nichts.',
  },
  {
    id: 'PRE-0103',
    title: 'Wie Funktionen arbeiten – Standardwert',
    parent: 'PRE-0099',
    transition: 'none',
    teleprompter: 'Mehrere Parameter werden der Reihe nach gefüllt. Ein Standardwert springt ein, wenn beim Aufruf nichts mitgegeben wird. Frag: Was gibt fuettern("Hoppel", "Möhre") aus?',
  },
  {
    id: 'PRE-0153',
    title: 'Dein Temperatur-Check',
    teleprompter: 'Tag 4: Erst Auftrag und zwei Beispiele klären, dann einen Plan schreiben. Werte ab der frei gewählten Grenze zählen; die Grenze selbst zählt mit. Grundlagen nutzt das Gerüst von Tag 3, Aufbau schreibt ein kurzes Programm, Funktionen sind optional. Vertiefung prüft zusätzlich die längste warme Folge. Lösungen erst nach eigener Arbeitszeit zeigen. Nach dem Projekt den Kurs abschließen; die folgenden Folien sind Reserve.',
  },
  {
    id: 'PRE-0104',
    title: 'Funktionen für Mathe und Physik',
    subtitle: 'Formeln als Funktionen',
    duration: 10,
    teleprompter: 'Funktionen sind wie Formeln aus der Schule: einmal aufschreiben, oft benutzen. Die Kreisfläche für drei Radien – der Kreis wächst, die Formel bleibt. Frag: Wie groß ist die Fläche bei r = 10?',
  },
  {
    id: 'PRE-0105',
    title: 'Funktionen für Mathe und Physik – Temperatur',
    parent: 'PRE-0104',
    transition: 'none',
    teleprompter: 'Umrechnen ist ein typischer Fall: Die Formel steckt in der Funktion, der Name sagt, was sie tut. 37 Grad Celsius sind 98,6 Fahrenheit – Körpertemperatur.',
  },
  {
    id: 'PRE-0106',
    title: 'Funktionen für Mathe und Physik – Geschwindigkeit',
    parent: 'PRE-0104',
    transition: 'none',
    teleprompter: 'Zwei Parameter: Strecke und Zeit. Beide laufen 100 Meter, Bello ist doppelt so schnell. Die Reihenfolge der Argumente zählt: geschwindigkeit(20, 100) wäre falsch.',
  },
  {
    id: 'PRE-0107',
    title: 'Funktionen für Mathe und Physik – Aufrufstapel',
    parent: 'PRE-0104',
    transition: 'none',
    teleprompter: 'Funktionen dürfen andere Funktionen benutzen. kinetische_energie ruft quadrat, wartet auf die 9 und rechnet dann weiter. Der Stapel zeigt, dass Python sich merkt, wo es weitermachen muss. So baut man große Programme aus kleinen Teilen.',
  },
  {
    id: 'PRE-0144',
    title: 'Rätsel: Bellos Sprints',
    subtitle: 'Geschwindigkeit ausrechnen, 30 Läufe',
    duration: 15,
    problem: 'physics-race',
    teleprompter: 'Rätsel zu Mathe und Physik. Zwei Listen: Strecke und Zeit für 30 Läufe. Teil 1 zählt die Läufe über 5 m/s, Teil 2 addiert deren Strecken. Geht ohne Funktion, mit range(len(strecken)) – aber wer sich tempo(strecke, zeit) schreibt, liest die Schleife wie einen Satz. Genau das ist der Punkt: Funktionen machen die eigene Lösung lesbar.',
  },
  {
    id: 'PRE-0108',
    title: 'Tiere, die miteinander reden',
    subtitle: 'Funktionen mit Daten',
    duration: 10,
    teleprompter: 'Jetzt arbeiten Funktionen mit Tieren. Ein Tier ist eine Liste: Name an Stelle 0, Hunger an Stelle 1. Frag: Wie komme ich an Bellos Hunger? bello[1].',
  },
  {
    id: 'PRE-0109',
    title: 'Tiere, die miteinander reden – treffen',
    parent: 'PRE-0108',
    transition: 'none',
    teleprompter: 'treffen bekommt zwei Tiere. a ist das erste Argument, b das zweite. Beim zweiten Aufruf ist Bello a. Die Etiketten zeigen, wer gerade a und wer b ist.',
  },
  {
    id: 'PRE-0110',
    title: 'Tiere, die miteinander reden – fressen',
    parent: 'PRE-0108',
    transition: 'none',
    teleprompter: 'fressen ändert die Liste des Tieres direkt. Das ist anders als bei Zahlen: Die Funktion bekommt dieselbe Liste, keine Kopie. Deshalb ist Momo danach auch draußen satter.',
  },
  {
    id: 'PRE-0111',
    title: 'Tiere, die miteinander reden – spielen',
    parent: 'PRE-0108',
    transition: 'none',
    teleprompter: 'Aus kleinen Funktionen werden größere: spielen ruft treffen. Die Schleife spielt drei Tage. Überleitung: momo[1] ist unpraktisch, man muss sich merken, was Stelle 1 bedeutet – das lösen Dictionaries.',
  },
  {
    id: 'PRE-0112',
    title: 'Jetzt du: Funktionen',
    subtitle: 'Erste Code-Aufgabe: eine Funktion schreiben',
    problem: 'functions-greet',
    duration: 20,
    teleprompter: 'Erste Code-Aufgabe: keine Zahl abschicken, sondern eine Funktion schreiben. Auf dem eigenen Gerät steht ein Editor, Python läuft direkt im Browser. Ausführen prüft die sichtbaren Tests, Abschicken zusätzlich einen versteckten. Achtung auf return statt print – genau daran scheitern die ersten Versuche. Danach die Rechteck-Funktion, dann die Rangliste.',
  },
  {
    id: 'PRE-0143',
    title: 'Code-Aufgabe: Rechteck',
    subtitle: 'Funktion schreiben, testen, abschicken',
    duration: 12,
    problem: 'functions-area',
    teleprompter: 'Erste Code-Aufgabe: Hier gibt es keine Zahl zum Abschicken, sondern eine Funktion. Auf dem eigenen Gerät steht ein Editor; Ausführen prüft die sichtbaren Tests, Abschicken zusätzlich zwei versteckte. Python läuft im Browser, ohne Internet. Wer lieber in PyCharm schreibt: Code hinüberkopieren und dann hier einfügen.',
  },
  {
    id: 'PRE-0145',
    title: 'Rätsel: Rangliste Funktionen',
    subtitle: 'Zwei Funktionen, zwei Sterne',
    duration: 2,
    teleprompter: 'Rangliste der Funktionen-Runde: ein Stern pro bestandener Aufgabe. Auf den Handys steht der eigene Platz. Wer noch mitten drin ist, findet beide Aufgaben unten rechts weiter offen.',
  },
  {
    id: 'PRE-0113',
    title: 'Eingebaute Funktionen',
    subtitle: 'max, min, sum, len und mehr',
    duration: 10,
    teleprompter: 'Rückblick: Den längsten Fisch haben wir mühsam mit einer Schleife gesucht. Das war nicht umsonst – so arbeitet max im Inneren. Aber Python bringt diese Funktionen schon mit.',
  },
  {
    id: 'PRE-0114',
    title: 'Eingebaute Funktionen – sortieren und runden',
    parent: 'PRE-0113',
    transition: 'none',
    teleprompter: 'sorted gibt eine neue Liste zurück, die alte bleibt, wie sie war. round mit zwei Stellen ist praktisch bei Geld und Messwerten, abs für Abstände.',
  },
  {
    id: 'PRE-0115',
    title: 'Eingebaute Funktionen – umwandeln',
    parent: 'PRE-0113',
    transition: 'none',
    teleprompter: 'Das kennen wir von input: Text zu Zahl mit int, Zahl zu Text mit str. type ist gut zum Nachschauen, wenn etwas nicht klappt – ist das jetzt Text oder Zahl?',
  },
  {
    id: 'PRE-0116',
    title: 'Eingebaute Funktionen – enumerate und zip',
    parent: 'PRE-0113',
    transition: 'none',
    teleprompter: 'enumerate, wenn man in der Schleife auch die Nummer braucht. zip, wenn zwei Listen zusammengehören, wie Namen und Futter. Beides spart Index-Rechnerei.',
  },
  {
    id: 'PRE-0117',
    title: 'Eingebaute Funktionen – Text',
    parent: 'PRE-0113',
    transition: 'none',
    teleprompter: 'Texte haben Funktionen, die man mit Punkt aufruft: Methoden. split ist besonders wichtig, wenn man Daten aus Dateien liest. Es gibt viele mehr – help(str) zeigt alle.',
  },
  {
    id: 'PRE-0118',
    title: 'Jetzt du: Eingebautes',
    subtitle: 'Wer gewinnt, und die drei Besten',
    problem: 'builtins-scores',
    duration: 15,
    teleprompter: 'Rätsel zu den eingebauten Funktionen. Zwei Listen, die zusammengehören: Namen und Punkte. Teil 1 will den Namen mit den meisten Punkten – zip oder eine Schleife über die Stellen. Teil 2 die drei besten Punktzahlen zusammen, dafür ist sorted da. Die Antwort auf Teil 1 ist ein Name, Groß- und Kleinschreibung egal.',
  },
  {
    id: 'PRE-0119',
    title: 'Dictionaries',
    subtitle: 'Tiere mit Eigenschaften',
    duration: 10,
    teleprompter: 'Rückblick auf die Tier-Listen: momo[1] war das Alter, momo[3] ob sie hungrig ist. Frag: Wer weiß das noch, ohne nachzuschauen? Genau das ist das Problem.',
  },
  {
    id: 'PRE-0120',
    title: 'Dictionaries – Namen',
    parent: 'PRE-0119',
    transition: 'none',
    teleprompter: 'Die Idee: Die Fächer bekommen Schilder mit Namen statt Nummern. Die Werte bleiben gleich, nur wie wir sie finden, ändert sich.',
  },
  {
    id: 'PRE-0121',
    title: 'Dictionaries – Python',
    parent: 'PRE-0119',
    transition: 'none',
    teleprompter: 'Geschweifte Klammern statt eckige. Links der Schlüssel, meistens ein Text, rechts der Wert. Lesen und ändern mit eckigen Klammern und dem Schlüssel. Das ist genau das Format, in dem später Daten aus dem Internet kommen.',
  },
  {
    id: 'PRE-0122',
    title: 'Dictionaries – Liste von Dictionaries',
    parent: 'PRE-0119',
    transition: 'none',
    teleprompter: 'Das häufigste Muster überhaupt: eine Liste, in der jedes Element ein Dictionary ist. Wie eine Tabelle: jede Zeile ein Tier, jede Spalte ein Schlüssel. Die Schleife liest ein Tier nach dem anderen.',
  },
  {
    id: 'PRE-0123',
    title: 'Jetzt du: Dictionaries',
    subtitle: 'Alter zusammenzählen, ältestes Tier finden',
    problem: 'dicts-shelter',
    duration: 12,
    teleprompter: 'Rätsel zu Dictionaries. Die Eingabe ist ein Dictionary: Name als Schlüssel, Alter als Wert. Teil 1 zählt alle Alter zusammen, Teil 2 sucht das älteste Tier – der Wert entscheidet, die Antwort ist der Schlüssel. Das älteste Tier ist immer eindeutig.',
  },
  {
    id: 'PRE-0124',
    title: 'Module',
    subtitle: 'import',
    duration: 8,
    teleprompter: 'Neues Kapitel: Bibliotheken. Python bringt ein ganzes Regal an Modulen mit. Mit import holt man eins heraus und benutzt seine Funktionen mit Punkt: math.sqrt.',
  },
  {
    id: 'PRE-0125',
    title: 'Module – random',
    parent: 'PRE-0124',
    transition: 'none',
    teleprompter: 'random kennen wir schon vom Würfeln. choice zieht aus einer Liste. Einmal ausführen lassen und vergleichen: Bei jedem kommt etwas anderes heraus.',
  },
  {
    id: 'PRE-0126',
    title: 'Module – from und as',
    parent: 'PRE-0124',
    transition: 'none',
    teleprompter: 'Zwei Varianten: from math import sqrt holt nur eine Funktion. import statistics as st gibt einen Spitznamen – das sehen wir gleich bei numpy als np und pandas als pd, so schreibt das die ganze Welt.',
  },
  {
    id: 'PRE-0127',
    title: 'Bibliotheken für KI und ML',
    subtitle: 'pip, NumPy, pandas, matplotlib, scikit-learn',
    duration: 15,
    teleprompter: 'Die großen Werkzeuge für KI und Daten sind nicht eingebaut, sondern Pakete. Installiert wird mit pip im Terminal von PyCharm: erst numpy allein, dann pandas und matplotlib in einem Befehl – mehrere Namen hintereinander gehen. Alles landet in der .venv des Projekts. Gemeinsam einmal ausführen.',
  },
  {
    id: 'PRE-0151',
    title: 'Bibliotheken – import, from, as',
    parent: 'PRE-0127',
    transition: 'none',
    teleprompter: 'Was macht import eigentlich? Ein Modul ist eine Kiste mit Werkzeug. import random holt die Kiste, benutzt wird sie mit dem Punkt. from random import randint legt ein einzelnes Werkzeug auf den Tisch – dann ohne Punkt. as np gibt der Kiste einen kurzen Namen, deshalb heißt es überall np und pd. Und der Hinweis unten: DataFrame(...) ist ein Bauplan, so etwas heißt Klasse – das kommt später.',
  },
  {
    id: 'PRE-0146',
    title: 'Bibliotheken – Importieren und benutzen',
    parent: 'PRE-0127',
    transition: 'none',
    teleprompter: 'Installiert ist installiert – benutzt wird ein Paket mit import. Hier random, das schon dabei war: würfeln, bis eine Sechs kommt. Genauso importierst du numpy, pandas und matplotlib, nur dass die vorher pip brauchten.',
  },
  {
    id: 'PRE-0128',
    title: 'Bibliotheken – NumPy',
    parent: 'PRE-0127',
    transition: 'none',
    teleprompter: 'NumPy ist die Grundlage fast aller KI-Bibliotheken. Oben die Liste: Schleife, ein Wert nach dem anderen. Unten das Array: alles auf einmal. Bei Bildern mit Millionen Pixeln ist das der Unterschied zwischen Sekunden und Stunden.',
  },
  {
    id: 'PRE-0129',
    title: 'Bibliotheken – pandas',
    parent: 'PRE-0127',
    transition: 'none',
    teleprompter: 'pandas ist Excel in Python. Eine Tabelle aus einem Dictionary, und mit einer Bedingung filtern. Echte Daten kommen meist aus CSV-Dateien, das geht mit pd.read_csv.',
  },
  {
    id: 'PRE-0130',
    title: 'Bibliotheken – matplotlib',
    parent: 'PRE-0127',
    transition: 'none',
    teleprompter: 'Daten anschauen, bevor man damit rechnet. Drei Zeilen für ein Balkendiagramm, plt.show öffnet das Fenster. In PyCharm erscheint es als eigenes Fenster oder im SciView.',
  },
  {
    id: 'PRE-0131',
    title: 'Bibliotheken – Ausblick ML',
    parent: 'PRE-0127',
    transition: 'none',
    teleprompter: 'Zum Schluss ein Blick nach vorn. Bisher haben wir Funktionen selbst geschrieben. Hier geben wir nur Beispiele, und das Modell findet die Funktion y = 2x selbst. Genau das macht maschinelles Lernen, nur mit viel mehr Daten und Parametern.',
  },
  {
    id: 'PRE-0147',
    title: 'Rätsel: Wetterdaten',
    subtitle: 'Durchschnitt und größter Sprung, 30 Tage',
    duration: 15,
    problem: 'data-temps',
    teleprompter: 'Letztes Rätsel: Schulmathe, aber programmiert. Teil 1 braucht den Durchschnitt – sum durch len – und dann eine zweite Runde durch die Liste. Teil 2 ist der größte Sprung von Tag zu Tag, mit abs, damit die Richtung egal ist. Wer mag, macht beides mit numpy in je einer Zeile; genau dafür sind die Bibliotheken da.',
  },
  {
    id: 'PRE-0148',
    title: 'Nachschlagen: eingebaute Funktionen',
    subtitle: 'Suchen, offizielle Doku, Beispiel lesen',
    duration: 4,
    teleprompter: 'Niemand kennt alle Funktionen auswendig – nachschlagen gehört zum Handwerk. Eintippen, was man will, und das Ergebnis von docs.python.org nehmen, nicht das erste Blog. Dort stehen alle eingebauten Funktionen mit Beispiel. Enter zeigt die Vorführung nochmal.',
  },
  {
    id: 'PRE-0149',
    title: 'Nachschlagen: fremde Bibliothek',
    subtitle: 'Paketname plus Vorhaben, dann die Projektseite',
    duration: 4,
    teleprompter: 'Dasselbe für Pakete, die nicht von Python kommen: Name des Pakets, dann was man vorhat. Die offizielle Doku steht fast immer oben, und unten auf der Seite steht ein Beispiel zum Kopieren. Genau so arbeitet man sich in pandas, NumPy oder jede andere Bibliothek ein.',
  },
  {
    id: 'PRE-0132',
    title: 'APIs',
    subtitle: 'Daten aus dem Internet',
    duration: 10,
    teleprompter: 'Letztes Kapitel: Programme, die mit anderen Programmen reden. Eine API ist wie ein Kellner: Wir bestellen, er bringt die Bestellung in die Küche und kommt mit der Antwort zurück. Wie die Küche arbeitet, ist uns egal.',
  },
  {
    id: 'PRE-0150',
    title: 'Nachschlagen: die Katzen-API',
    subtitle: 'Doku finden, bevor der Code kommt',
    duration: 4,
    teleprompter: 'Bevor wir Code schreiben: Woher weiß man die Adresse? Nach der API suchen, die Doku öffnen. Dort steht die Adresse, welche Optionen es gibt – und ganz wichtig, wie die Antwort aussieht. Genau dieses Format lesen wir gleich in Python aus: eine Liste mit einem Dictionary darin.',
  },
  {
    id: 'PRE-0133',
    title: 'APIs – requests',
    parent: 'PRE-0132',
    transition: 'none',
    teleprompter: 'In Python übernimmt das Paket requests die Rolle des Kellners, vorher pip install requests. get schickt die Anfrage an die Adresse. Der Status 200 heißt OK, 404 hieße: gibt es nicht.',
  },
  {
    id: 'PRE-0134',
    title: 'APIs – JSON',
    parent: 'PRE-0132',
    transition: 'none',
    teleprompter: 'Die Antwort ist Text im JSON-Format. Sieht aus wie ein Dictionary, und json() macht genau das daraus. Ab hier ist alles bekannt: Schlüssel lesen, Werte benutzen.',
  },
  {
    id: 'PRE-0135',
    title: 'APIs – Live',
    parent: 'PRE-0132',
    transition: 'none',
    presenterAction: { label: 'New cat', command: 'cat' },
    teleprompter: 'Die Folie fragt The Cat API wirklich. Neu ist: Die Studierenden holen die Katze selbst – auf dem eigenen Gerät steht ein Knopf, und alle Bildschirme zeigen dieselbe Katze und dieselbe Ausgabe. Ohne Handy geht es über den Knopf hier im Presenter oder auf der Fernbedienung. Braucht Internet am Laptop; ohne Netz bleibt die letzte Katze stehen.',
  },
  {
    id: 'PRE-0010',
    title: 'Design System',
    subtitle: 'Python for Beginners — Style Guide',
    layout: 'slide-bare',
    teleprompter: 'This is our design system and style guide. Every visual decision for the Python pre-courses deck is documented here.',
  },
  {
    id: 'PRE-0011',
    title: 'Primary Colors',
    parent: 'PRE-0010',
    teleprompter: 'Three primary colors: Coral for action and emphasis, Mint for success and code, Sky for information and links.',
  },
  {
    id: 'PRE-0012',
    title: 'Secondary & Accent Colors',
    parent: 'PRE-0010',
    teleprompter: 'Five supporting colors for personality and decoration. Rose is our warm pink highlight, Sun for warnings, Lavender for special content.',
  },
  {
    id: 'PRE-0013',
    title: 'Backgrounds & Surfaces',
    teleprompter: 'Three surface tiers: pure white for content, off-white for cards, warm tint for title slides. Code blocks are the only dark surface.',
  },
  {
    id: 'PRE-0014',
    title: 'Typography',
    teleprompter: 'One font everywhere: JetBrains Mono. Variable weight. We primarily use bold and black. The type scale goes from display down to chrome.',
  },
  {
    id: 'PRE-0015',
    title: 'Buttons & Interactions',
    parent: 'PRE-0014',
    teleprompter: 'Three button tiers: filled primary, outlined secondary, ghost. All are flat, no shadows, 2px borders, rounded-lg.',
  },
  {
    id: 'PRE-0016',
    title: 'Tags, Pills & Labels',
    parent: 'PRE-0014',
    teleprompter: 'Small uppercase pills for categorizing content. Filled for strong presence, outlined for metadata. Each color has a semantic meaning.',
  },
  {
    id: 'PRE-0136',
    title: 'Notifications',
    parent: 'PRE-0014',
    teleprompter: 'One notification for the whole deck: a card in the top-right corner, newest on top, at most four. It holds four seconds and the thin bar shows how long. Mint means solved, sun means first place, sky is room news, coral is a problem.',
  },
  {
    id: 'PRE-0017',
    title: 'Code Blocks',
    teleprompter: 'The only dark element in the system. Catppuccin-inspired dark surface with pastel window dots matching our palette.',
  },
  {
    id: 'PRE-0018',
    title: 'Page Chrome & Navigation',
    parent: 'PRE-0017',
    teleprompter: 'Persistent chrome: deck title top-left, progress bar bottom, page number bottom-right. All in text-muted so they never compete with content.',
  },
  {
    id: 'PRE-0019',
    title: 'Title Cards & Layouts',
    teleprompter: 'Three layout types: slide-bare for titles and drama, slide for all teaching content, slide-section for chapter breaks.',
  },
  {
    id: 'PRE-0020',
    title: 'Spacing & Layout',
    parent: 'PRE-0019',
    teleprompter: 'Generous margins. Desktop has 96px horizontal padding. Spacing scale from 4px to 96px. Five border-radius tiers.',
  },
  {
    id: 'PRE-0021',
    title: 'Animation & Motion',
    teleprompter: 'Fast, subtle, purposeful animations. 80ms stagger between elements. All motion respects prefers-reduced-motion.',
  },
  {
    id: 'PRE-0028',
    title: 'Code & Keyword Links',
    parent: 'PRE-0021',
    teleprompter: 'Two tools for teaching code: hovering a word links every token that means the same thing across both panels, and line focus dims everything but the live line. Click a word to pin the link while you talk.',
  },
  {
    id: 'PRE-0029',
    title: 'Pseudo → Python',
    parent: 'PRE-0021',
    teleprompter: 'One program in three stages. Shared tokens move to their new place, only new syntax fades in. Step it with the stage pills or the arrows.',
  },
  {
    id: 'PRE-0030',
    title: 'Cast: Critters',
    teleprompter: 'Six animals carry every example in this course. Flat SVG, two-pixel outlines, tinted from the palette, so colour itself becomes data: three coral cats and one mint cat is a list with one odd element.',
  },
  {
    id: 'PRE-0031',
    title: 'Props & Places',
    parent: 'PRE-0030',
    teleprompter: 'The things the cast acts on. A box is a variable, a basket is a list, a lever is a boolean, a door is a branch, a road is a sequence, a fence is a range.',
  },
  {
    id: 'PRE-0032',
    title: 'Cast in Practice',
    parent: 'PRE-0030',
    teleprompter: 'Three worked scenes: a lever next to a boolean, a basket of fish next to a list, a street of houses next to a for loop. Picture on the left, code on the right, same words highlighted in both.',
  },
  // <slides:end>
]

/** Deck-wide values that the layouts render on top of every slide. */
export const deckConfig = {
  // Empty: no label in the top-left corner of the slides.
  title: '',
  author: '',
  showSlideId: false,
  showPageNumber: true,
  showProgressBar: true,
}
