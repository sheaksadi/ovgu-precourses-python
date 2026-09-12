/**
 * German course text, and the shape every other locale must match: `Messages`
 * is derived from this object, so `en.ts` fails to type-check when a key is
 * missing. Code samples live here too, because their words are translated.
 *
 * Only `if`, `else` and Python itself stay English in every language.
 */
const de = {
  common: {
    language: 'Sprache',
    switchLanguage: 'Sprache wechseln',
  },

  title: {
    university: 'OVGU Magdeburg',
    semester: 'Wintersemester 2026/27',
    line1: 'Python',
    line2: 'Vorkurs',
    subtitleBefore: 'für',
    subtitleMark: 'AI & Machine Learning',
    subtitleAfter: 'Engineering',
    instructor: 'Dozent',
    tutor: 'Tutor',
    scan: 'Scannen und mitlesen',
    momoHi: 'Hi, ich bin Momo!',
  },

  follow: {
    eyebrow: 'Python-Vorkurs',
    title: 'Mitlesen',
    body: 'Die Folien auf deinem eigenen Bildschirm. Sie folgen dem Vortrag, du kannst zurückblättern, und der Sync-Knopf bringt dich wieder mit.',
    pick: 'Sprache wählen und Folien öffnen',
    waiting: 'Warte auf den Start …',
    startsAt: 'Start bei {label} · {title}',
    interactive: 'Interaktiver Teil',
    joinIn: 'Mitmachen',
  },

  intro: {
    eyebrow: 'Vorstellungsrunde',
    title: 'Wer bist du?',
    steps: [
      { title: 'Sag deinen Namen' },
      { title: 'Stell dich kurz vor', hint: 'Hobbys, etwas Schräges, etwas Besonderes – oder etwas Nettes über dich.' },
      { title: 'Dreh eine Frage' },
    ],
    spin: 'Drehen',
    spinAgain: 'Nochmal drehen',
    hint: 'oder Enter drücken',
    ready: 'Bereit, wenn du es bist.',
    soundOn: 'Ton an',
    soundOff: 'Ton aus',
    momo: {
      idle: 'Dreh mich!',
      spinning: 'Wuiii …',
      landed: 'Na?',
    },
    questions: [
      'Katze oder Hund – und warum ist die richtige Antwort Katze?',
      'Welches Tier wärst du, und warum?',
      'Du darfst eine Katze taufen. Wie heißt sie?',
      'Was würdest du einem Roboter als Erstes beibringen?',
      'Welche KI aus Film oder Serie hättest du gern als Mitbewohner?',
      'Früher Vogel oder Nachteule?',
      'Pizza mit Ananas: genial oder Verbrechen?',
      'Welche Superkraft hilft am meisten im Studium?',
      'Was ist das Nerdigste, das du besitzt?',
      'Welches Emoji benutzt du viel zu oft?',
      'Dein Code läuft nicht. Panik, Kaffee oder Katze streicheln?',
      'Welche App öffnest du morgens als Erstes?',
      'Wenn deine Katze programmieren könnte – was würde sie bauen?',
      'Welches Spiel hast du am längsten gespielt?',
      'Was hast du zuletzt gegoogelt, das du zugeben kannst?',
      'Eine Sache sofort perfekt können – welche?',
      'Bestes Mensa-Essen bisher – oder das, auf das du hoffst?',
      'Welchen Ort in Magdeburg sollte jede:r kennen?',
      'Welcher Song läuft bei dir gerade in Dauerschleife?',
      'Eine KI übernimmt deinen Tag. Was darf sie auf keinen Fall?',
    ],
  },

  tryit: {
    eyebrow: 'Selbst ausprobieren',
    title: 'Probier’s selbst!',
    steps: ['Suche nach „python online ausführen“', 'Öffne einen Online-Compiler', 'Code einfügen und Run drücken'],
    scan: 'Oder direkt scannen',
    query: 'python online ausführen',
    search: 'Suchen',
    snippet: 'Python-Code direkt im Browser schreiben und ausführen – ohne Installation.',
    code: 'print("Hallo Welt!")',
    output: 'Hallo Welt!',
    done: '✓ fertig',
    replay: 'Nochmal zeigen',
    hint: 'oder Enter drücken',
    demoLabel: 'Vorführung: Python online suchen, einen Compiler öffnen und den Code ausführen',
    momo: {
      idle: 'Schau mal!',
      done: 'Jetzt du!',
    },
  },

  vars: {
    title: 'Variablen',
    file: 'variablen.py',
    output: 'Ausgabe',
    noOutput: 'noch keine Ausgabe',
    types: {
      str: 'Text',
      int: 'ganze Zahl',
      float: 'Kommazahl',
      bool: 'wahr / falsch',
    },
    /** Variable names used in the pictures, matching the code. */
    names: {
      greeting: 'gruss',
      name: 'name',
      age: 'alter',
      weight: 'gewicht',
      hungry: 'hat_hunger',
      input: 'eingabe',
    },
    values: {
      hello: '"Hallo Welt!"',
      momo: '"Hallo Momo!"',
    },
    sentence: {
      middle: ' ist ',
      after: ' Jahre alt',
    },
    convert: {
      wrong: '"5" + 1',
      wrongResult: 'Fehler',
      right: 'int("5") + 1',
      rightResult: '6',
    },
    rules: [
      { name: 'katzen_name', ok: true as boolean | null, why: 'klein, Wörter mit _' },
      { name: 'katze2', ok: true as boolean | null, why: 'Zahl hinten ist okay' },
      { name: '2katzen', ok: false as boolean | null, why: 'Zahl vorne' },
      { name: 'katzen name', ok: false as boolean | null, why: 'Leerzeichen' },
      { name: 'class', ok: false as boolean | null, why: 'Python-Wort' },
      { name: 'Alter ≠ alter', ok: null as boolean | null, why: 'Groß und klein zählt' },
    ],
    stages: [
      {
        headline: 'Eine Variable ist eine Box mit Namen',
        note: 'Vorhin stand der Text direkt in `print()`. Jetzt liegt er in einer Box namens `gruss`: links der Name, rechts der Wert, dazwischen `=`.',
        code: 'gruss = "Hallo Welt!"',
        focus: [1],
        output: [] as string[],
        outputFrom: 0,
      },
      {
        headline: 'Den Namen benutzen, den Wert bekommen',
        note: 'Python schaut in die Box und benutzt, was drin ist. Um den Namen kommen keine Anführungszeichen.',
        code: 'gruss = "Hallo Welt!"\nprint(gruss)',
        focus: [2],
        output: ['Hallo Welt!'],
        outputFrom: 0,
      },
      {
        headline: 'Neuer Wert, gleiche Box',
        note: 'Ein neues `=` ersetzt den alten Wert. Die Box merkt sich immer nur den letzten.',
        code: 'gruss = "Hallo Welt!"\nprint(gruss)\ngruss = "Hallo Momo!"\nprint(gruss)',
        focus: [3, 4],
        output: ['Hallo Welt!', 'Hallo Momo!'],
        outputFrom: 1,
      },
      {
        headline: 'Jeder Wert hat einen Typ',
        note: 'Text steht in Anführungszeichen, Zahlen nicht. `True` und `False` heißen wahr und falsch. `type()` verrät den Typ.',
        code: 'name = "Momo"  # str\nalter = 3  # int\ngewicht = 4.5  # float\nhat_hunger = True  # bool\nprint(type(gewicht))',
        focus: [] as number[],
        output: ["<class 'float'>"],
        outputFrom: 0,
      },
      {
        headline: 'Mit Variablen rechnen',
        note: 'Erst wird rechts gerechnet, dann kommt das Ergebnis zurück in die Box. `alter += 1` ist die Kurzform von `alter = alter + 1`.',
        code: 'alter = 3\nalter = alter + 1\nalter += 1\nprint(alter)',
        focus: [2, 3],
        output: ['5'],
        outputFrom: 0,
      },
      {
        headline: 'Variablen in Text einsetzen',
        note: 'Ein `f` vor dem Text macht aus `{name}` und `{alter}` ihre Werte.',
        code: 'name = "Momo"\nalter = 5\nprint(f"{name} ist {alter} Jahre alt")',
        focus: [3],
        output: ['Momo ist 5 Jahre alt'],
        outputFrom: 0,
      },
      {
        headline: '`input()` liefert immer Text',
        note: 'Aus Text wird mit `int()` eine ganze Zahl und mit `float()` eine Kommazahl. `str()` macht wieder Text daraus.',
        code: 'eingabe = input("Wie alt ist Momo? ")\nprint(type(eingabe))\nalter = int(eingabe)\nprint(alter + 1)',
        focus: [1, 3],
        output: ['Wie alt ist Momo? 5', "<class 'str'>", '6'],
        outputFrom: 0,
      },
      {
        headline: 'Gute Namen',
        note: 'Kleinbuchstaben und `_`, keine Zahl am Anfang, keine Leerzeichen, keine Python-Wörter. Groß und klein zählt: `Alter` ist eine andere Box als `alter`.',
        code: 'katzen_name = "Momo"\nalter = 3\nAlter = 4\nprint(alter)',
        focus: [3, 4],
        output: ['3'],
        outputFrom: 0,
      },
    ],
  },

  door: {
    steps: ['Problem', 'Lösen', 'Aufschreiben', 'Python'],
    title: 'Kommt Momo ins Haus?',
    question: 'Frage',
    case1: 'Fall 1',
    case2: 'Fall 2',
    hasKey: 'Schlüssel dabei?',
    withKey: 'mit Schlüssel',
    withoutKey: 'ohne Schlüssel',
    goesIn: '✓ geht ins Haus',
    sleeps: '✗ schläft vor der Tür',
    prompt: 'Momo steht vor ihrer Haustür. Manchmal hat sie den Schlüssel dabei, manchmal nicht.',
    ask: 'Was passiert in beiden Fällen?',
    toPython: 'in Python',
    pseudo: `if Momo hat den Schlüssel:
    Momo geht ins Haus
else:
    Momo schläft vor der Tür`,
    python: `hat_schluessel = True
if hat_schluessel:
    print("Momo geht ins Haus")
else:
    print("Momo schläft vor der Tür")`,
    /** Words in the pseudo-code that light up their part of the picture. */
    words: {
      momo: 'momo',
      key: 'schlüssel',
      house: 'haus',
      door: 'tür',
    },
  },
}

export type Messages = typeof de

export default de
