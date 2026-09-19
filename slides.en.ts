/**
 * The English half of the slide list.
 *
 * `slides.config.ts` is the source of truth: it owns the order, the ids and the
 * German wording the room sees. This file carries the same entries in English,
 * keyed by id — titles, subtitles and the teleprompter notes — for anyone who
 * would rather present in English.
 *
 * A missing entry, or a missing field inside one, falls back to the German, so
 * this file may lag behind `slides.config.ts` without breaking anything.
 * `useSlideData` picks between them by the current locale.
 */

export interface SlideText {
  title?: string
  subtitle?: string
  teleprompter?: string
}

export const slidesEn: Record<string, SlideText> = {
  // <slides-en:start>
  'PRE-0185': {
    title: 'A quick hello',
    subtitle: 'Who is standing here, and how it started',
    teleprompter: 'A short introduction before the round starts: name, degree, and how the programming began. The path on the right is the actual point - started with Minecraft mods in lockdown, no prior knowledge, and the rest came bit by bit. That takes away the fear that you have to be a genius for this. Keep it short: a minute, two at most, then it is their turn.',
  },
  'PRE-0038': {
    title: 'Introductions',
    subtitle: 'Say your name, introduce yourself, spin a question',
    teleprompter: 'Round the room: say your name, introduce yourself briefly - hobbies, something odd or special, or something nice about yourself. Then that person spins the question on their own phone; the projector shows who spun and which question came up. Without a phone: spin from the presenter view or the remote. No question repeats until everyone has had a turn. Open the projector through the projector button on the start page, otherwise it shows a spin button of its own. Going first yourself helps.',
  },
  'PRE-0034': {
    title: 'Does Momo get inside?',
    subtitle: 'Problem',
    teleprompter: 'Momo is standing at her front door. Sometimes she has the key with her, sometimes she does not. Ask the group: what happens in either case? Collect answers first, then move on.',
  },
  'PRE-0035': {
    title: 'Does Momo get inside? - Solving it',
    teleprompter: 'Same situation, one difference. Both cats set off. With the key the door opens and Momo is inside. Without the key the door stays shut and Momo sleeps in front of it. One question, two ways.',
  },
  'PRE-0036': {
    title: 'Does Momo get inside? - Writing it down',
    teleprompter: 'Now we write down exactly that. if goes in front of the question, else in front of the other way. Everything else is plain English. Move the mouse over a word in the code and it lights up in the picture.',
  },
  'PRE-0037': {
    title: 'Does Momo get inside? - Python',
    teleprompter: 'And now as real Python. Our plan on top, the same plan below in a form the computer can run. if and else stay the same, the question becomes a variable hat_schluessel, and what Momo does becomes print. Change True to False and ask: what does it say now?',
  },
  'PRE-0039': {
    title: 'Try it yourself',
    subtitle: 'Open an online compiler and run the code',
    teleprompter: 'Time to try it. The demo shows the way: search, open an online compiler, paste the code, Run. Scan the code if you like. Task: change the text in the print, to your own name for example, and press Run again. Enter plays the demo once more.',
  },
  'PRE-0040': {
    title: 'Variables',
    teleprompter: 'A reminder of print("Hallo Welt!"). Now the text goes into a box. Name on the left, value on the right; the = means: put this in here.',
  },
  'PRE-0041': {
    title: 'Variables - using the value',
    teleprompter: 'print(gruss) without quotes: Python looks inside the box. Ask: what would it print with quotes? Right, the word gruss.',
  },
  'PRE-0042': {
    title: 'Variables - a new value',
    teleprompter: 'Same box, new contents. The old value is gone. Two prints, two outputs, each with whatever is in the box at the time.',
  },
  'PRE-0043': {
    title: 'Variables - types',
    teleprompter: 'Four types to start with: str, int, float, bool. Quotes make the difference between "3" and 3. type() tells you which one it is.',
  },
  'PRE-0044': {
    title: 'Variables - doing maths',
    teleprompter: 'Right side first: alter + 1 comes to 4, and that goes back into alter. += is the short form. At the end the box holds 5.',
  },
  'PRE-0045': {
    title: 'Variables - f-strings',
    teleprompter: 'f-strings: an f in front of the quotes, variables in curly braces. Python fills the values in.',
  },
  'PRE-0046': {
    title: 'Variables - input()',
    teleprompter: 'input() always hands back text, even when somebody types a number. Convert it with int(), otherwise "5" + 1 is an error.',
  },
  'PRE-0047': {
    title: 'Variables - names',
    teleprompter: 'Naming rules. Case matters: alter and Alter are two different boxes, which is why print(alter) gives 3.',
  },
  'PRE-0048': {
    title: 'Installing PyCharm',
    subtitle: 'Search, open, scroll down, Community Edition',
    teleprompter: 'For this course we need PyCharm on your own machine. Open a browser, type pycharm download - exactly what anyone would type - and press search. Then click the result from jetbrains.com, no ads and no download portals. The page opens on PyCharm Professional, which is not the one we want. Do not press that first download button. Keep scrolling until PyCharm Community Edition appears. It is free and enough for the whole course. Press Download under Community Edition and open the file. Windows gets an .exe, macOS a .dmg, Linux a .tar.gz. Click through the installer with the default settings. Enter plays the demo again.',
  },
  'PRE-0052': {
    title: 'Now you: install PyCharm',
    teleprompter: 'Everyone works on their own now. Scan the QR code or search pycharm download, scroll to the Community Edition, download and install. Walk around and help with operating system warnings. The goal: PyCharm opens. Whoever is done helps the person next to them.',
  },
  'PRE-0053': {
    title: 'A new project',
    subtitle: 'New Project, Project venv, Python version',
    teleprompter: 'Open PyCharm. On the first start the welcome window appears; choose New Project there. If a project is already open: File → New Project. Enter plays the demo again.',
  },
  'PRE-0054': {
    title: 'A new project - settings',
    teleprompter: 'Type a name, vorkurs for example. Interpreter type stays Project venv: every project gets its own Python environment. Python version must not be empty. If the list is empty, Python is not installed yet: scan the QR code on the left, install Python, tick "Add python.exe to PATH" on Windows, and restart PyCharm.',
  },
  'PRE-0055': {
    title: 'A new project - Create',
    teleprompter: 'Press Create. PyCharm makes the folder and the virtual environment .venv, which takes a moment. Afterwards the bottom right shows the Python version with the project name. Walk around briefly: does everyone see that?',
  },
  'PRE-0056': {
    title: 'Running code',
    subtitle: 'Make a file, write code, Run',
    teleprompter: 'Now the first file of your own. Right click the project folder, New, Python File, type a name, Enter. PyCharm adds the .py ending itself. Type print("Hallo Welt!") into the file. No need to save, PyCharm saves on its own. Watch the quotes and the brackets. Press the green arrow at the top, or right click in the code and choose Run. The run window opens at the bottom with Hallo Welt! and exit code 0. Task: change the text and run it again. Enter plays the demo again.',
  },
  'PRE-0059': {
    title: 'Lists',
    subtitle: 'Momo\'s fish',
    teleprompter: 'Momo caught five fish, each with its length. With what we know so far that is five variables. Ask: what do we do with 100 fish? 100 lines, 100 names - nobody wants that.',
  },
  'PRE-0060': {
    title: 'Lists - one basket',
    teleprompter: 'The five boxes move together and become a basket with compartments. One name for all of them, and the order is kept. No Python yet, the idea first.',
  },
  'PRE-0061': {
    title: 'Lists - Python',
    teleprompter: 'In Python the basket is a list: square brackets around it, commas between the values. print(fische) shows the whole list, brackets and all.',
  },
  'PRE-0062': {
    title: 'Lists - index',
    teleprompter: 'Every compartment has a number, the index, and Python starts at 0. Ask first: what does fische[3] print? Many say 8 - it is 21, the fourth fish.',
  },
  'PRE-0063': {
    title: 'Lists - changing a value',
    teleprompter: 'fische[2] = 25 works like it does for a variable, only for one compartment: the old value goes, the new one arrives. len counts the compartments, it does not add the values up.',
  },
  'PRE-0064': {
    title: 'Lists - append',
    teleprompter: 'append puts a value on the end and the list grows. The new fish gets index 5, len is 6 now. Ask: which index is the last one? Always len minus 1.',
  },
  'PRE-0070': {
    title: 'Now you: lists',
    subtitle: 'First puzzle: counting positions',
    teleprompter: 'First puzzle, and straight away in the Advent of Code style: every device gets its own price list. Copy it, add the first three prices in PyCharm, submit the number here. Part 2 is the last three, which is where preise[-1] earns its keep. Who is done appears in the top right; anyone who moves on finds the puzzle again in the bottom right.',
  },
  'PRE-0065': {
    title: 'Lists and if',
    subtitle: 'Which fish is the longest?',
    teleprompter: 'Three fish, which is the longest? We see it immediately from the bars. Ask: how would you explain that to the computer with if? Collect ideas first.',
  },
  'PRE-0066': {
    title: 'Lists and if - elif',
    teleprompter: 'if and elif can do it: for each fish, check whether it is longer than all the others. The comparisons appear on the right, the first one fails, the second fits. With three fish this is still fine.',
  },
  'PRE-0067': {
    title: 'Lists and if - 6 fish',
    teleprompter: 'Now six fish. Every condition has to compare against all the others: the grid shows every pair, 30 comparisons. The code already has three blocks and three are still missing.',
  },
  'PRE-0068': {
    title: 'Lists and if - 100 fish',
    teleprompter: 'A hundred fish: 9,900 comparisons. And every new fish means rewriting the code. Not like this. Let it sink in for a moment.',
  },
  'PRE-0069': {
    title: 'Lists and if - the idea',
    teleprompter: 'How do we do it in our heads? Go through once and remember the longest so far. Momo walks along the basket once, swaps at the 30, and otherwise does not. Six fish, six looks. That is a loop - the next topic.',
  },
  'PRE-0071': {
    title: 'Loops: for',
    subtitle: 'Looking at every fish',
    teleprompter: 'We want to print every fish. With what we know: five print lines that look almost the same. Ask: what changes from line to line? Only the number.',
  },
  'PRE-0072': {
    title: 'Loops: for - Momo walks',
    teleprompter: 'The idea from the last chapter: Momo walks along the basket once. At every fish the value lands in the box fisch, the pass counter runs along the top, the output appears on the right.',
  },
  'PRE-0073': {
    title: 'Loops: for - Python',
    teleprompter: 'Exactly that in Python: for fisch in fische, a colon, and indented underneath what happens per fish. We are free to choose the name fisch. Move the mouse over fisch in the code and the box lights up.',
  },
  'PRE-0074': {
    title: 'Loops: for - indentation',
    teleprompter: 'The biggest stumbling block: indentation. Indented belongs to the loop and runs five times. print("fertig") is not indented and runs once afterwards. Ask: what happens if we indent fertig?',
  },
  'PRE-0075': {
    title: 'Loops: for - the total',
    teleprompter: 'Collecting something on the way. gesamt starts at 0 before the loop, and every pass adds one fish. print is outside again, otherwise every running total would be printed.',
  },
  'PRE-0076': {
    title: 'Loops solve problems',
    subtitle: 'Longest, counting, filtering',
    teleprompter: 'Back to the problem with the six fish. Now with a loop: laengster starts as the first fish. Momo walks through, and at every fish the question: longer than laengster? Only at the 30 is the answer yes, and then they swap.',
  },
  'PRE-0077': {
    title: 'Loops solve problems - counting',
    teleprompter: 'Same pattern, different question: how many are longer than 14? A counter starts at 0 and every yes adds 1. The small fish step back. Ask first: what comes out? Four.',
  },
  'PRE-0078': {
    title: 'Loops solve problems - filtering',
    teleprompter: 'Collect instead of count: an empty list, and append inside the if. The big fish end up in the new basket. That is the filtering pattern, which we need constantly, later with data too.',
  },
  'PRE-0079': {
    title: 'Loops solve problems - side by side',
    teleprompter: 'The if chain from before on the left, the loop on the right. The chain grows with every fish; the loop stays five lines no matter how long the list is. That is exactly why loops matter.',
  },
  'PRE-0080': {
    title: 'Loops: range',
    subtitle: 'Counting without a list',
    teleprompter: 'Momo should jump five times. There is no list, so we type one: 0, 1, 2, 3, 4. Ask: and if she should jump 100 times?',
  },
  'PRE-0081': {
    title: 'Loops: range - range(5)',
    teleprompter: 'range(5) makes the run of numbers for us. Important: it starts at 0 and stops before the 5. Five numbers, but the 5 is not one of them - the dashed post.',
  },
  'PRE-0082': {
    title: 'Loops: range - start, stop, step',
    teleprompter: 'Three numbers in range: where it starts, which number it stops before, and how big the step is. The posts stay, only the numbers change. Ask: how do we get 10, 20, 30?',
  },
  'PRE-0083': {
    title: 'Loops: range - times table',
    teleprompter: 'Doing maths with i: every round is i times 7, and the bars grow with it. Two lines of code for a whole times table. Something to think about: what do we change for the nine times table up to 10?',
  },
  'PRE-0084': {
    title: 'Loops: while',
    subtitle: 'As long as ...',
    teleprompter: 'New situation: Momo eats until she is full. Ask: how many bites? It depends. With for we know beforehand how often. With while there is only a question, asked before every bite.',
  },
  'PRE-0085': {
    title: 'Loops: while - the condition',
    teleprompter: 'The lever is the condition bauch < 12. It is checked before every pass: 0, 4, 8 are smaller than 12, so Momo eats. At 12 it is false, the lever flips, and print("Satt!") runs.',
  },
  'PRE-0086': {
    title: 'Loops: while - the endless loop',
    teleprompter: 'The most common while mistake: the variable in the condition never changes. Then the condition is true forever, like Bello chasing his tail. Stop it in PyCharm with the red square. It happens to everyone.',
  },
  'PRE-0087': {
    title: 'Loops: while - break',
    teleprompter: 'while True runs forever on purpose, and break is the emergency exit. The guessing game: 3 wrong, 9 wrong, 7 right, break. Good when you do not know how many tries somebody needs.',
  },
  'PRE-0088': {
    title: 'Loops: while - continue',
    teleprompter: 'continue is the counterpart: do not stop, just end this pass and go on with the next one. The rotten fish is skipped, the others Momo eats. Works in for and in while.',
  },
  'PRE-0090': {
    title: 'Loops everywhere',
    subtitle: 'Text, nested, patterns, simulation',
    teleprompter: 'Loops do not only walk over lists. A text is made of letters, so for walks through that too. Ask: what does for buchstabe in "Hallo" print?',
  },
  'PRE-0091': {
    title: 'Loops everywhere - nested',
    teleprompter: 'A loop inside a loop: the outer one counts the rows, the inner one the columns. The inner one runs all the way through for every row. That is how tables, images and game boards work.',
  },
  'PRE-0092': {
    title: 'Loops everywhere - patterns',
    teleprompter: 'Text times a number repeats the text. With i as the count every line gets longer. Ask: how do we get the triangle the other way round?',
  },
  'PRE-0093': {
    title: 'Loops everywhere - simulation',
    teleprompter: 'Simulation means working out step by step how something develops. Here money with 10 percent interest. The same pattern sits in weather models, in physics, and in training AI models - round after round.',
  },
  'PRE-0089': {
    title: 'Now you: loops',
    subtitle: 'Counting, and the longest run in a row',
    teleprompter: 'Puzzle round on loops, two tasks. This one: Bello step counter, 40 days. Part 1 counts the days over 10000 - loop, if, counter. Part 2 wants the longest run in a row: the counter has to go back to 0 on a weak day. After this comes Momo catch, then the leaderboard and the solution.',
  },
  'PRE-0137': {
    title: 'Puzzle: Momo\'s catch',
    subtitle: 'Counting with a loop and an if, then a total with break',
    teleprompter: 'First puzzle in the Advent of Code style. Every device gets its own list of fish: copy it, solve it in PyCharm, submit only the number. Part 1 counts fish from 20 cm, part 2 opens once part 1 is solved: Momo eats in order until 300 cm no longer fits - break. Who has solved it appears in the top right. Anyone who moves on finds the puzzle again in the bottom right.',
  },
  'PRE-0138': {
    title: 'Puzzle: loops leaderboard',
    subtitle: 'Who has the most stars?',
    teleprompter: 'The leaderboard of the loops round: one star per solved part, and on a tie whoever was faster. Everyone sees their own place on their phone. Celebrate briefly, then show the solutions.',
  },
  'PRE-0139': {
    title: 'Solution: Momo\'s catch',
    subtitle: 'The solution line by line',
    teleprompter: 'The whole solution: part 1 on top, part 2 underneath. We play it through with the example list. Enter replays a stage.',
  },
  'PRE-0140': {
    title: 'Solution: Momo\'s catch - part 1',
    teleprompter: 'The camera moves onto part 1. Read along: line 5 takes the next fish, line 6 checks, line 7 only counts on True. At the end the output says 3.',
  },
  'PRE-0141': {
    title: 'Solution: Momo\'s catch - part 2',
    teleprompter: 'Part 2 with a small belly of 50 cm, so it goes quickly. Line 14 is the important one: check whether the fish still fits, then add. At 37 + 20 it is over, break jumps out, output 2.',
  },
  'PRE-0142': {
    title: 'Solution: Momo\'s catch - your list',
    teleprompter: 'Back to the whole thing. With your own list and 300 instead of 50 your own answers come out. If you are not finished: the puzzle is still open in the bottom right.',
  },
  'PRE-0095': {
    title: 'Functions',
    subtitle: 'Too much code',
    teleprompter: 'New chapter. Three animals, each greeted and each eating something. For that we copy two lines three times and change the name and the food. Ask: what is awkward about that?',
  },
  'PRE-0096': {
    title: 'Functions - one change',
    teleprompter: 'Now a small change: frisst gern. We manage two copies and forget the third. That is exactly how real bugs appear when code is copied.',
  },
  'PRE-0097': {
    title: 'Functions - a recipe',
    teleprompter: 'The idea: write the two lines down once as a recipe, with gaps for the animal and the food. Then all we do is call the recipe and fill the gaps. And we only have to change it in one place.',
  },
  'PRE-0098': {
    title: 'Functions - def',
    teleprompter: 'In Python the recipe is called a function and is written with def. tier and futter are parameters, the gaps. On a call the values travel into the function - the balls. Only the call runs the code; def on its own does nothing.',
  },
  'PRE-0099': {
    title: 'How functions work',
    subtitle: 'Call, parameters, return',
    teleprompter: 'What exactly happens on a call? The red dot shows where Python is: line 1, then the call, over into the function, back, on with line 4. Ask first: in which order do the outputs appear?',
  },
  'PRE-0100': {
    title: 'How functions work - parameters',
    teleprompter: 'The function as a machine. Values go in at the top. x is the gap and gets whatever value is passed on each call. Call it twice, get two different results.',
  },
  'PRE-0101': {
    title: 'How functions work - return',
    teleprompter: 'So far the function has only shown things. With return the result comes back out at the bottom and can land in a variable. That lets you carry on calculating - which is how len and max work too.',
  },
  'PRE-0102': {
    title: 'How functions work - print vs return',
    teleprompter: 'The most common beginner mistake: print instead of return. Both machines appear to show the same thing, but only the giving one hands something back. zeigen returns None - Python for: nothing.',
  },
  'PRE-0103': {
    title: 'How functions work - default values',
    teleprompter: 'Several parameters are filled in order. A default value steps in when nothing is passed on the call. Ask: what does fuettern("Hoppel", "Möhre") print?',
  },
  'PRE-0104': {
    title: 'Functions for maths and physics',
    subtitle: 'Formulas as functions',
    teleprompter: 'Functions are like formulas from school: write them down once, use them often. The area of a circle for three radii - the circle grows, the formula stays. Ask: how big is the area at r = 10?',
  },
  'PRE-0198': {
    title: 'Functions for maths and physics - readable',
    teleprompter: 'The same function, written twice. 3.14159 * r * r is correct and says nothing. With PI and square the formula from the board is back inside the function. Ask: which of the two lines would you still understand in six months?',
  },
  'PRE-0105': {
    title: 'Functions for maths and physics - temperature',
    teleprompter: 'Converting is a typical case: the formula sits inside the function, and the name says what it does. 37 degrees Celsius is 98.6 Fahrenheit - body temperature.',
  },
  'PRE-0199': {
    title: 'Functions for maths and physics - comments',
    teleprompter: 'Where does the 9 / 5 + 32 come from? A hash mark starts a note for humans. Python does not read the line at all - it is only for whoever reads the code later. A comment may also sit behind code.',
  },
  'PRE-0106': {
    title: 'Functions built on functions',
    subtitle: 'Calls inside calls',
    teleprompter: 'Two parameters: distance and time. Both run 100 metres, Bello is twice as fast. The order of the arguments matters: speed(20, 100) would be wrong.',
  },
  'PRE-0107': {
    title: 'Functions built on functions - inside out',
    teleprompter: 'A call may sit inside a call. Python works from the inside out: first the two accelerations, then the average. Ask first: what does Python compute here to begin with?',
  },
  'PRE-0200': {
    title: 'Functions built on functions - stopping distance',
    teleprompter: 'The rule of thumb from driving school. Reaction distance and braking distance are one small function each, stopping_distance only adds them up. The bars show it: twice the speed, more than three times the distance. That is the blueprint for everything bigger - small functions that use other functions.',
  },
  'PRE-0144': {
    title: 'Puzzle: Bello\'s sprints',
    subtitle: 'Work out the speed, 30 runs',
    teleprompter: 'Puzzle on maths and physics. Two lists: distance and time for 30 runs. Part 1 counts the runs over 5 m/s, part 2 adds up their distances. It works without a function, using range(len(strecken)) - but anyone who writes tempo(strecke, zeit) reads the loop like a sentence. That is exactly the point: functions make your own solution readable.',
  },
  'PRE-0108': {
    title: 'Functions and lists',
    subtitle: 'A list that changes',
    teleprompter: 'So far numbers went in and out. Here a list goes in: animal is not a copy, it is the same list as momo. That is why Momo is less hungry outside the call too. And position 1 is the hunger only because we said so - which is exactly what dictionaries fix later.',
  },
  'PRE-0112': {
    title: 'Now you: functions',
    subtitle: 'First code task: write a function',
    teleprompter: 'First code task: nothing to submit as a number, a function to write instead. There is an editor on your own device and Python runs right in the browser. Run checks the visible tests, Submit adds a hidden one. Watch out for return instead of print - that is exactly what the first attempts trip over. After this the rectangle function, then the leaderboard.',
  },
  'PRE-0143': {
    title: 'Code task: rectangle',
    subtitle: 'Write a function, test it, submit it',
    teleprompter: 'First code task: there is no number to submit here, there is a function. The device has an editor; Run checks the visible tests, Submit adds two hidden ones. Python runs in the browser, no internet needed. If you would rather write in PyCharm: copy the code across and paste it here.',
  },
  'PRE-0145': {
    title: 'Puzzle: functions leaderboard',
    subtitle: 'Two functions, two stars',
    teleprompter: 'Leaderboard of the functions round: one star per passing task. Everyone sees their own place on their phone. Anyone still in the middle of it finds both tasks open in the bottom right.',
  },
  'PRE-0113': {
    title: 'Built-in functions',
    subtitle: 'max, min, sum, len and more',
    teleprompter: 'Looking back: we hunted for the longest fish the hard way, with a loop. That was not wasted - it is how max works inside. But Python brings these functions along already.',
  },
  'PRE-0114': {
    title: 'Built-in functions - sorting and rounding',
    teleprompter: 'sorted returns a new list and leaves the old one as it was. round with two places is handy for money and measurements, abs for distances.',
  },
  'PRE-0115': {
    title: 'Built-in functions - converting',
    teleprompter: 'We know this from input: text to number with int, number to text with str. type is good for checking when something does not work - is this text or a number right now?',
  },
  'PRE-0116': {
    title: 'Built-in functions - enumerate and zip',
    teleprompter: 'enumerate when you also need the number inside the loop. zip when two lists belong together, like names and food. Both save you index arithmetic.',
  },
  'PRE-0117': {
    title: 'Built-in functions - text',
    teleprompter: 'Texts have functions you call with a dot: methods. split matters especially when reading data from files. There are many more - help(str) shows them all.',
  },
  'PRE-0201': {
    title: 'Built-in functions - chained',
    teleprompter: 'Every function returns something, and that may go straight into the next one. split makes words, sorted orders them, join glues them together. Read it from the inside out - the same as the nested calls earlier. Ask: what happens first?',
  },
  'PRE-0118': {
    title: 'Now you: built-ins',
    subtitle: 'Who wins, and the best three',
    teleprompter: 'Puzzle on the built-in functions. Two lists that belong together: names and points. Part 1 wants the name with the most points - zip, or a loop over the positions. Part 2 wants the best three scores added up, which is what sorted is for. The answer to part 1 is a name; capitals do not matter.',
  },
  'PRE-0148': {
    title: 'Looking things up: built-in functions',
    subtitle: 'Search, official docs, read an example',
    teleprompter: 'Nobody knows every function by heart - looking things up is part of the craft. Type what you want and take the result from docs.python.org, not the first blog. Every built-in function is there with an example. Enter plays the demo again.',
  },
  'PRE-0202': {
    title: 'Three cats, nothing but numbers',
    subtitle: 'The problem before the solution',
    teleprompter: 'The problem first. Three cats, four facts each, all of it lists. Ask the room: how old is Luna? They have to count. Then: what is at position 3? Nobody is sure any more. That is exactly where dictionaries come in.',
  },
  'PRE-0119': {
    title: 'Dictionaries',
    subtitle: 'Animals with properties',
    teleprompter: 'Looking back at the animal lists: momo[1] was the age, momo[3] whether she is hungry. Ask: who still knows that without checking? That is exactly the problem.',
  },
  'PRE-0120': {
    title: 'Dictionaries - names',
    teleprompter: 'The idea: the compartments get labels with names instead of numbers. The values stay the same, only how we find them changes.',
  },
  'PRE-0121': {
    title: 'Dictionaries - Python',
    teleprompter: 'Curly braces instead of square ones. The key on the left, usually a text, the value on the right. Read and change with square brackets and the key. This is exactly the format data from the internet arrives in later.',
  },
  'PRE-0122': {
    title: 'Dictionaries - a list of dictionaries',
    teleprompter: 'The most common pattern there is: a list where every element is a dictionary. Like a table: every row an animal, every column a key. The loop reads one animal after another.',
  },
  'PRE-0123': {
    title: 'Now you: dictionaries',
    subtitle: 'Add the ages up, find the oldest animal',
    teleprompter: 'Puzzle on dictionaries. The input is a dictionary: name as the key, age as the value. Part 1 adds all the ages up, part 2 looks for the oldest animal - the value decides, the answer is the key. The oldest animal is always unambiguous.',
  },
  'PRE-0124': {
    title: 'Modules',
    subtitle: 'import',
    teleprompter: 'New chapter: libraries. Python brings a whole shelf of modules along. import takes one off the shelf and you use its functions with a dot: math.sqrt.',
  },
  'PRE-0125': {
    title: 'Modules - random',
    teleprompter: 'We know random from rolling dice. choice picks from a list. Let everyone run it once and compare: everybody gets something different.',
  },
  'PRE-0126': {
    title: 'Modules - from and as',
    teleprompter: 'Two variants: from math import sqrt takes only one function. import statistics as st gives it a nickname - which we see in a moment with numpy as np and pandas as pd, the way the whole world writes it.',
  },
  'PRE-0203': {
    title: 'Modules - reading a file',
    teleprompter: 'Data often comes from a file. open opens it, read fetches the whole text. The with closes it again afterwards - without with people forget the close. The file sits next to the py file in the project.',
  },
  'PRE-0204': {
    title: 'Modules - line by line',
    teleprompter: 'An open file can be walked like a list: every pass is one line. strip cuts off the line break you cannot see. Ask: what happens without strip? Then there is a blank line between the names.',
  },
  'PRE-0127': {
    title: 'Libraries for AI and ML',
    subtitle: 'pip, NumPy, pandas, matplotlib, scikit-learn',
    teleprompter: 'The big tools for AI and data are not built in, they are packages. You install them with pip in the PyCharm terminal: numpy on its own first, then pandas and matplotlib in one command - several names in a row work. Everything lands in the project .venv. Run it together once.',
  },
  'PRE-0151': {
    title: 'Libraries - import, from, as',
    teleprompter: 'What does import actually do? A module is a box of tools. import random fetches the box, and you use it with the dot. from random import randint puts a single tool on the table - then without the dot. as np gives the box a short name, which is why it is np and pd everywhere. And the note at the bottom: DataFrame(...) is a blueprint, and such a thing is called a class - that comes later.',
  },
  'PRE-0146': {
    title: 'Libraries - import it and use it',
    teleprompter: 'Installed is installed - a package is used with import. Here random, which came along anyway: roll until a six turns up. You import numpy, pandas and matplotlib the same way, they just needed pip first.',
  },
  'PRE-0128': {
    title: 'Libraries - NumPy',
    teleprompter: 'NumPy is the foundation of almost every AI library. The list on top: a loop, one value after another. The array below: everything at once. With images of millions of pixels that is the difference between seconds and hours.',
  },
  'PRE-0129': {
    title: 'Libraries - pandas',
    teleprompter: 'pandas is Excel in Python. A table out of a dictionary, and filtering with a condition. Real data usually comes from CSV files, which is what pd.read_csv is for.',
  },
  'PRE-0130': {
    title: 'Libraries - matplotlib',
    teleprompter: 'Look at data before you calculate with it. Three lines for a bar chart, and plt.show opens the window. In PyCharm it appears as its own window or in SciView.',
  },
  'PRE-0131': {
    title: 'Libraries - a look at ML',
    teleprompter: 'A look ahead to finish. So far we wrote the functions ourselves. Here we only give examples, and the model finds the function y = 2x by itself. That is exactly what machine learning does, only with far more data and parameters.',
  },
  'PRE-0149': {
    title: 'Looking things up: somebody else library',
    subtitle: 'Package name plus what you want, then the project page',
    teleprompter: 'The same for packages that do not come from Python: the name of the package, then what you are trying to do. The official documentation is almost always at the top, and further down the page there is an example to copy. That is exactly how you find your way into pandas, NumPy or any other library.',
  },
  'PRE-0147': {
    title: 'Puzzle: weather data',
    subtitle: 'Average and biggest jump, 30 days',
    teleprompter: 'Last puzzle: school maths, but programmed. Part 1 needs the average - sum divided by len - and then a second pass through the list. Part 2 is the biggest jump from day to day, with abs so the direction does not matter. Do both with numpy in one line each if you like; that is what the libraries are for.',
  },
  'PRE-0132': {
    title: 'APIs',
    subtitle: 'Data from the internet',
    teleprompter: 'Last chapter: programs that talk to other programs. An API is like a waiter: we order, he takes the order to the kitchen and comes back with the answer. How the kitchen works is none of our business.',
  },
  'PRE-0150': {
    title: 'Looking things up: the Cat API',
    subtitle: 'Find the docs when you carry on alone',
    teleprompter: 'Where did that address come from? Search for the API, open the documentation. It has the address, which options exist - and most importantly what the answer looks like. That is exactly the format we just read out in Python: a list with a dictionary inside it. Every other API works the same way.',
  },
  'PRE-0133': {
    title: 'APIs - requests',
    teleprompter: 'In Python the package requests plays the waiter, after pip install requests. get sends the request to the address. Status 200 means OK; 404 would mean: does not exist.',
  },
  'PRE-0134': {
    title: 'APIs - JSON',
    teleprompter: 'The answer is text in JSON format. It looks like a dictionary, and json() turns it into exactly that. From here on everything is familiar: read keys, use values.',
  },
  'PRE-0135': {
    title: 'APIs - live',
    teleprompter: 'This slide really asks The Cat API. What is new: the students fetch the cat themselves - there is a button on their own device, and every screen shows the same cat and the same output. Without a phone it works through the button here in the presenter view or on the remote. Needs internet on the laptop; with no connection the last cat stays.',
  },
  'PRE-0166': {
    title: 'Objects',
    subtitle: 'Many cats, one blueprint',
    teleprompter: 'Three cats, three lists: names, hunger, mood. As long as everything lines up it works. Ask the group: what happens when a cat is deleted from one list and not from the others? Then everything slips, and Bello suddenly has Kiki mood. That is the problem objects exist for.',
  },
  'PRE-0167': {
    title: 'Objects - everything in one place',
    teleprompter: 'First step: everything belonging to one cat into one box. We know that already - a dictionary. Nothing can slip out of step now. But what the cat can do still lives somewhere else, in some function. That is where classes begin.',
  },
  'PRE-0168': {
    title: 'Objects - blueprint and instance',
    teleprompter: 'A class is the blueprint, an object is a thing made from it. Like a cookie cutter: one shape, as many cookies as you want. The blueprint says what every cat has and what every cat can do. Each individual cat then has its own values.',
  },
  'PRE-0169': {
    title: 'Objects - class in Python',
    teleprompter: 'The blueprint as code. class with a capital letter, which is convention. __init__ runs while the object is built and puts the values away. self is the cat being worked on - Python passes it in automatically, which is why it is in the brackets but not in the call. Katze("Momo", 8) builds an instance.',
  },
  'PRE-0170': {
    title: 'Objects - attributes',
    teleprompter: 'You get at the values with the dot: momo.name, momo.hunger. Reading works, changing too. It is the same dot as in random.randint - the thing on the left, what you want from it on the right.',
  },
  'PRE-0171': {
    title: 'Objects - methods',
    teleprompter: 'Now the behaviour. A function inside the class is called a method, and its first parameter is self again. To Python, momo.fuettern(5) means fuettern(momo, 5). That is why the method may change self.hunger - it knows which cat this is about.',
  },
  'PRE-0172': {
    title: 'Objects - many instances',
    teleprompter: 'One blueprint, three cats, three separate states. Feeding Momo changes Momo only. That is exactly what three lists could not give you. Ask: what changes in the code with 100 cats? Nothing - just one more loop.',
  },
  'PRE-0173': {
    title: 'Objects - you know these already',
    teleprompter: 'The punchline at the end: you have been using objects since day one. "Momo".upper() calls a method on a text, fische.append(20) one on a list. And pd.DataFrame(...) from the libraries slide was a class - exactly the word we put off back then.',
  },
  'PRE-0174': {
    title: 'Now you: classes',
    subtitle: 'Write a class, test it, submit it',
    teleprompter: 'Last code task: a class of your own. The device has the skeleton, Run checks the visible tests, Submit adds the hidden ones. Watch out for self in every method. If you get stuck, look back at the slide with the cat - everything you need is there.',
  },
  'PRE-0175': {
    title: 'Finale: Momo\'s log book',
    subtitle: 'Two parts, one log book',
    teleprompter: 'The finale, and this time without training wheels: the input is no longer ready-made Python but text - one line per catch, day, name, number. Read it in and split it first, then count. Part 1 is a dictionary, part 2 the longest run of consecutive days for the same cat. A tip for the group: play it through on paper with three lines first. Take your time, this one is allowed to take a while.',
  },
  'PRE-0176': {
    title: 'Finale: the shelter',
    subtitle: 'Rules, round after round',
    teleprompter: 'Second finale: a simulation. The rules are on the slide and the code only has to follow them - every round everyone gets hungrier, then the hungriest cat is fed, never below zero. Part 1 is the total hunger at the end, part 2 the cat that was fed most often. Anyone who uses a class has an easier time; it is not required. That is exactly the point of the objects slides.',
  },
  'PRE-0177': {
    title: 'Finale: leaderboard',
    subtitle: 'Four stars to collect',
    teleprompter: 'Final standings of the last round. Both puzzles stay open, nobody has to stop. Give credit briefly to whoever got far - and say that part 2 of both was honestly hard.',
  },
  'PRE-0156': {
    title: 'Sorting',
    subtitle: 'Order, and what it makes easier',
    teleprompter: 'A bonus at the end if there is time: no task, no leaderboard. Momo catch is lying in a jumble. Ask first: which fish is the longest? With five fish you can see it, with a thousand you cannot. Sorted, three questions are suddenly easy: the longest at the end, the shortest at the front, the middle in the middle.',
  },
  'PRE-0157': {
    title: 'Sorting - bubble sort',
    teleprompter: 'The simplest idea: only ever look at two neighbours. If the bigger one is on the left, swap them. Then one step further. After one pass the largest value is right at the end - it rose like a bubble, hence the name. That repeats until nothing is swapped any more.',
  },
  'PRE-0158': {
    title: 'Sorting - bubble sort in Python',
    teleprompter: 'The same run as code, and it is only what we know: two for loops and an if. The line with the comma swaps two values in one go - Python can do that without a helper variable. The bars run in the same rhythm as the loop.',
  },
  'PRE-0182': {
    title: 'Bubble sort at full size',
    teleprompter: 'The same rule, now with twenty values across the whole screen. Just let it run and watch: the largest value travels right in every pass, while the left stays chaotic for a long time. Note the number of comparisons at the end - all three algorithms start from the same twenty numbers. Enter plays it again.',
  },
  'PRE-0159': {
    title: 'Sorting - selection sort',
    teleprompter: 'Different idea, same goal: find the smallest value in what is left and bring it to the front. A sorted part grows on the left. People often sort cards exactly like this.',
  },
  'PRE-0183': {
    title: 'Selection sort at full size',
    teleprompter: 'Same twenty numbers, different rule. Notice: the green wall grows from the left and there is hardly any swapping - but there are almost as many comparisons as in bubble sort. That is exactly the difference between swapping and comparing.',
  },
  'PRE-0160': {
    title: 'Sorting - insertion sort',
    teleprompter: 'The card game version: you pick up a card and push it left until it fits. On nearly sorted lists this is really fast - Python uses this idea inside its own sorting too.',
  },
  'PRE-0184': {
    title: 'Insertion sort at full size',
    teleprompter: 'The third rule, and the one with the nicest picture: every value slides left until it fits. Compare the three numbers at the end. Press Enter and watch again if you like - this is the part people get stuck on, in the good way.',
  },
  'PRE-0161': {
    title: 'Sorting - how much work?',
    teleprompter: 'Do not count seconds, count comparisons. With 10 values it is about 100, with 100 about 10,000, with 1000 about a million: twice the data means four times the work. The built-in sort grows far more slowly. Anyone who wants more should search for big O notation - that is first semester material.',
  },
  'PRE-0162': {
    title: 'Sorting - sorted()',
    teleprompter: 'And now the punchline: in real life nobody writes this themselves. sorted() gives a new sorted list, .sort() sorts the one you have. reverse=True flips it, key= sorts by something else, by length for example. Writing it yourself is still worth it: you understand what that one line is doing for you.',
  },
  'PRE-0163': {
    title: 'Sorting for fun',
    subtitle: 'Bogosort and other bad ideas',
    teleprompter: 'The bad ideas to finish. Bogosort: shuffle, check whether it happens to be sorted, otherwise again. With five values it takes 120 tries on average, with ten over three million, with twenty longer than the universe has existed. Funny, but a real argument for why the number of steps matters.',
  },
  'PRE-0164': {
    title: 'Sorting for fun - Stalin sort',
    teleprompter: 'Stalin sort: go through once and throw away everything that does not fit the order. The result is guaranteed sorted - it is just not the same list any more. One pass, so as fast as it gets. A nice test: what is missing at the end, and why is that fatal for real data?',
  },
  'PRE-0165': {
    title: 'Sorting for fun - it gets worse',
    teleprompter: 'Three cards to close: sleep sort sleeps that many seconds per value and then writes - with big numbers you wait a long time. Miracle sort keeps checking and hopes for a miracle. Quantum bogosort shuffles and destroys every universe where it is not sorted. If you enjoy this: that is often what computer science feels like.',
  },
  'PRE-0178': {
    title: 'What you can do now',
    subtitle: 'Four days, in one list',
    teleprompter: 'A short look back. This is not a sales pitch, it is a stock-take: variables, conditions, lists, loops, functions, built-in functions, dictionaries, libraries, APIs, classes. That is enough to keep up in the first semester. What is missing is practice - and that comes by itself.',
  },
  'PRE-0179': {
    title: 'Worth watching',
    subtitle: 'Channels that explain it better than any slide',
    teleprompter: 'Recommendations, not homework. 3Blue1Brown makes maths visible - the series on neural networks is the best free introduction to the topic there is. Sebastian Lague builds things and shows what programming feels like when it is fun. Computerphile for the theory, CS50 for a complete course, Corey Schafer and ArjanCodes for Python itself. Say which of them you watch yourself.',
  },
  'PRE-0180': {
    title: 'Keep going',
    subtitle: 'Where to practise from tomorrow',
    teleprompter: 'Practice beats watching. Advent of Code in December is exactly the format of the last days. Exercism gives you exercises with feedback from people. And the best advice stays: pick something annoying from your own week and automate it - rename files, work out grades, read a timetable. Start small, actually finish.',
  },
  'PRE-0181': {
    title: 'Thank you',
    teleprompter: 'Thanks for taking part. Questions still go by email, and the slides stay reachable at the same address. Finish the puzzles at home if you want to.',
  },
  // <slides-en:end>
}
