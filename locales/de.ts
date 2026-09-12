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
