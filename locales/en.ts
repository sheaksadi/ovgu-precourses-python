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
    output: 'Momo goes into the house',
    done: '✓ done',
    replay: 'Show again',
    hint: 'or press Enter',
    demoLabel: 'Demo: search for Python online, open a compiler and run the code',
    momo: {
      idle: 'Watch this!',
      done: 'Your turn!',
    },
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
