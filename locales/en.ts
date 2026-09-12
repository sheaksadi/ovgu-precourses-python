/**
 * English course text. Typed against the German dictionary, so every key in
 * `de.ts` has to exist here as well.
 */
import type { Messages } from './de'

const en: Messages = {
  common: {
    language: 'Language',
    switchLanguage: 'Switch language',
  },

  title: {
    university: 'OVGU Magdeburg',
    semester: 'Winter Semester 2026/27',
    line1: 'Python',
    line2: 'Pre-Course',
    subtitleBefore: 'for',
    subtitleMark: 'AI & Machine Learning',
    subtitleAfter: 'Engineering',
    instructor: 'Instructor',
    tutor: 'Tutor',
    scan: 'Scan to follow along',
    momoHi: "Hi, I'm Momo!",
  },

  home: {
    lede: 'Pick a view.',
    momo: 'Where to?',
    views: {
      projector: { title: 'Projector', desc: 'The slides, big on the screen. Follows the talk.' },
      presenter: { title: 'Presenter view', desc: 'Current and next slide, notes and timing.' },
      control: { title: 'Control panel', desc: 'Overview, remote control by QR code, and the audience.' },
      follow: { title: 'Follow along', desc: 'The slides on your own device, in German or English.' },
    },
    screens: '{n} screens following',
    print: 'Print handout',
    styleGuide: 'Style guide',
  },

  follow: {
    eyebrow: 'Python Pre-Course',
    title: 'Follow along',
    body: 'The slides on your own screen. They follow the talk, you can flip back, and the sync button brings you back in step.',
    pick: 'Pick a language to open the slides',
    waiting: 'Waiting for the talk to start …',
    startsAt: 'Starting on {label} · {title}',
    interactive: 'Interactive part',
    joinIn: 'Join in',
  },

  intro: {
    eyebrow: 'Introductions',
    title: 'Who are you?',
    steps: [
      { title: 'Say your name' },
      { title: 'Introduce yourself', hint: 'Hobbies, something quirky, something special – or something nice about you.' },
      { title: 'Spin a question' },
    ],
    spin: 'Spin',
    spinAgain: 'Spin again',
    hint: 'or press Enter',
    ready: 'Ready when you are.',
    soundOn: 'Sound on',
    soundOff: 'Sound off',
    momo: {
      idle: 'Spin me!',
      spinning: 'Wheee …',
      landed: 'Well?',
    },
    questions: [
      'Cats or dogs – and why is the right answer cats?',
      'If you were an animal, which one and why?',
      'You get to name a cat. What is it called?',
      'What would you teach a robot first?',
      'Which AI from a film or series would you want as a flatmate?',
      'Early bird or night owl?',
      'Pineapple on pizza: genius or crime?',
      'Which superpower would help most with studying?',
      'What is the nerdiest thing you own?',
      'Which emoji do you use way too often?',
      'Your code does not run. Panic, coffee, or pet a cat?',
      'What is the first app you open in the morning?',
      'If your cat could code, what would it build?',
      'Which game have you played the longest?',
      'What did you last google that you are willing to admit?',
      'One skill you could master instantly – which one?',
      'Best canteen meal so far – or the one you are hoping for?',
      'Which place in Magdeburg should everyone know?',
      'Which song is on repeat for you right now?',
      'An AI runs your day. What is it never allowed to do?',
    ],
  },

  tryit: {
    eyebrow: 'Try it yourself',
    title: 'Your turn!',
    steps: ['Search for “python online compiler”', 'Open an online compiler', 'Paste the code and press Run'],
    scan: 'Or scan to open it',
    query: 'python online compiler',
    search: 'Search',
    snippet: 'Write and run Python code right in your browser – nothing to install.',
    code: 'print("Hello, world!")',
    output: 'Hello, world!',
    done: '✓ done',
    replay: 'Show again',
    hint: 'or press Enter',
    demoLabel: 'Demo: search for Python online, open a compiler and run the code',
    momo: {
      idle: 'Watch this!',
      done: 'Your turn!',
    },
  },

  vars: {
    title: 'Variables',
    file: 'variables.py',
    output: 'Output',
    noOutput: 'no output yet',
    types: {
      str: 'text',
      int: 'whole number',
      float: 'decimal',
      bool: 'true / false',
    },
    names: {
      greeting: 'greeting',
      name: 'name',
      age: 'age',
      weight: 'weight',
      hungry: 'is_hungry',
      input: 'entered',
    },
    values: {
      hello: '"Hello, world!"',
      momo: '"Hello, Momo!"',
    },
    sentence: {
      middle: ' is ',
      after: ' years old',
    },
    convert: {
      wrong: '"5" + 1',
      wrongResult: 'error',
      right: 'int("5") + 1',
      rightResult: '6',
    },
    rules: [
      { name: 'cat_name', ok: true, why: 'lowercase, words joined with _' },
      { name: 'cat2', ok: true, why: 'a digit at the end is fine' },
      { name: '2cats', ok: false, why: 'starts with a digit' },
      { name: 'cat name', ok: false, why: 'contains a space' },
      { name: 'class', ok: false, why: 'Python keyword' },
      { name: 'Age ≠ age', ok: null, why: 'case matters' },
    ],
    stages: [
      {
        headline: 'A variable is a box with a name',
        note: 'Earlier the text sat right inside `print()`. Now it lives in a box called `greeting`: name on the left, value on the right, `=` in between.',
        code: 'greeting = "Hello, world!"',
        focus: [1],
        output: [],
        outputFrom: 0,
      },
      {
        headline: 'Use the name, get the value',
        note: 'Python looks into the box and uses what is inside. No quotes around the name.',
        code: 'greeting = "Hello, world!"\nprint(greeting)',
        focus: [2],
        output: ['Hello, world!'],
        outputFrom: 0,
      },
      {
        headline: 'New value, same box',
        note: 'A new `=` replaces the old value. The box only ever keeps the latest one.',
        code: 'greeting = "Hello, world!"\nprint(greeting)\ngreeting = "Hello, Momo!"\nprint(greeting)',
        focus: [3, 4],
        output: ['Hello, world!', 'Hello, Momo!'],
        outputFrom: 1,
      },
      {
        headline: 'Every value has a type',
        note: 'Text goes in quotes, numbers do not. `True` and `False` mean true and false. `type()` tells you the type.',
        code: 'name = "Momo"  # str\nage = 3  # int\nweight = 4.5  # float\nis_hungry = True  # bool\nprint(type(weight))',
        focus: [],
        output: ["<class 'float'>"],
        outputFrom: 0,
      },
      {
        headline: 'Calculating with variables',
        note: 'The right side is worked out first, then the result goes back into the box. `age += 1` is short for `age = age + 1`.',
        code: 'age = 3\nage = age + 1\nage += 1\nprint(age)',
        focus: [2, 3],
        output: ['5'],
        outputFrom: 0,
      },
      {
        headline: 'Putting variables into text',
        note: 'An `f` in front of the text turns `{name}` and `{age}` into their values.',
        code: 'name = "Momo"\nage = 5\nprint(f"{name} is {age} years old")',
        focus: [3],
        output: ['Momo is 5 years old'],
        outputFrom: 0,
      },
      {
        headline: '`input()` always gives text',
        note: 'Text becomes a whole number with `int()` and a decimal with `float()`. `str()` turns it back into text.',
        code: 'entered = input("How old is Momo? ")\nprint(type(entered))\nage = int(entered)\nprint(age + 1)',
        focus: [1, 3],
        output: ['How old is Momo? 5', "<class 'str'>", '6'],
        outputFrom: 0,
      },
      {
        headline: 'Good names',
        note: 'Lowercase and `_`, no digit at the start, no spaces, no Python keywords. Case matters: `Age` is a different box from `age`.',
        code: 'cat_name = "Momo"\nage = 3\nAge = 4\nprint(age)',
        focus: [3, 4],
        output: ['3'],
        outputFrom: 0,
      },
    ],
  },

  door: {
    steps: ['Problem', 'Solve', 'Write it down', 'Python'],
    title: 'Does Momo get into the house?',
    question: 'Question',
    case1: 'Case 1',
    case2: 'Case 2',
    hasKey: 'Has the key?',
    withKey: 'with the key',
    withoutKey: 'without the key',
    goesIn: '✓ goes into the house',
    sleeps: '✗ sleeps at the door',
    prompt: 'Momo is standing at her front door. Sometimes she has her key with her, sometimes she does not.',
    ask: 'What happens in each case?',
    toPython: 'in Python',
    pseudo: `if Momo has the key:
    Momo goes into the house
else:
    Momo sleeps at the door`,
    python: `has_key = True
if has_key:
    print("Momo goes into the house")
else:
    print("Momo sleeps at the door")`,
    words: {
      momo: 'momo',
      key: 'key',
      house: 'house',
      door: 'door',
    },
  },
}

export default en
