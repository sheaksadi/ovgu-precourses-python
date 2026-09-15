#!/usr/bin/env node
/**
 * Checks the problem engine over HTTP and the WebSocket, against a running app.
 *
 *   npm run dev
 *   npm run check:problems
 *
 * Two made-up devices fetch their input for `loops-fish`, answer wrong, hit the
 * cooldown, then answer right with an independent JavaScript solution, and the
 * script checks ranks, Part 2 locking and the `solve` broadcast. The solves stay
 * in the room until every client has left, under the names "Check A" and "Check B".
 *
 * Environment: DECK_URL (default http://localhost:3000).
 */
const BASE = process.env.DECK_URL || 'http://localhost:3000'
const wait = ms => new Promise(r => setTimeout(r, ms))
const results = []
const check = (name, pass, detail = '') => results.push(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)

const run = Date.now().toString(36)
const device = (letter) => ({ id: `check-${letter}-${run}`, name: `Check ${letter.toUpperCase()}` })
const A = device('a')
const B = device('b')

const cookie = (who, lang = 'de') => `deck-audience=${who.id}; deck-lang=${lang}`
const getInput = async (who, lang) => {
  const res = await fetch(`${BASE}/api/problems/loops-fish/input`, { headers: { cookie: cookie(who, lang) } })
  return { status: res.status, body: res.ok ? await res.json() : null }
}
const answer = async (who, part, value) => {
  const res = await fetch(`${BASE}/api/problems/loops-fish/answer`, {
    method: 'POST',
    headers: { cookie: cookie(who), 'content-type': 'application/json' },
    body: JSON.stringify({ part, answer: String(value), name: who.name }),
  })
  return res.ok ? res.json() : { status: res.status }
}

/** Written without the server's code, so the two can disagree. */
const numbers = input => input.slice(input.indexOf('[') + 1, input.indexOf(']')).split(',').map(Number)
const part1 = fish => fish.reduce((count, size) => count + (size >= 20 ? 1 : 0), 0)
const part2 = (fish) => {
  let total = 0
  let i = 0
  while (i < fish.length && total + fish[i] <= 300) total += fish[i++]
  return i
}

// Watch the room for solves.
const solves = []
const socket = new WebSocket(`${BASE.replace(/^http/, 'ws')}/_ws`)
socket.addEventListener('message', (event) => {
  if (typeof event.data !== 'string' || event.data === 'pong') return
  const data = JSON.parse(event.data)
  if (data.type === 'solve' && data.audienceId.endsWith(run)) solves.push(data)
})
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve)
  socket.addEventListener('error', () => reject(new Error(`no WebSocket at ${BASE}`)))
})

// Inputs.
const a1 = await getInput(A, 'de')
const a2 = await getInput(A, 'de')
const aEn = await getInput(A, 'en')
const b1 = await getInput(B, 'de')
check('input served', a1.status === 200 && a1.body.input.startsWith('fische = ['), a1.body?.input.slice(0, 40))
check('same device, same input', a1.body.input === a2.body.input)
check('English names the variable, same numbers', aEn.body.input.startsWith('fish = [') && numbers(aEn.body.input).join() === numbers(a1.body.input).join())
check('other device, other input', numbers(b1.body.input).join() !== numbers(a1.body.input).join())
check('unknown problem is 404', (await fetch(`${BASE}/api/problems/nope/input`, { headers: { cookie: cookie(A) } })).status === 404)
check('no device cookie is 400', (await fetch(`${BASE}/api/problems/loops-fish/input`)).status === 400)

const fishA = numbers(a1.body.input)
const fishB = numbers(b1.body.input)

// Part 2 before Part 1, wrong answers, cooldown.
check('Part 2 locked before Part 1', (await answer(A, 2, part2(fishA))).result === 'locked')
const tooHigh = await answer(A, 1, part1(fishA) + 5)
check('too high says high', tooHigh.result === 'high' && tooHigh.cooldownMs === 5000, JSON.stringify(tooHigh))
check('retry during cooldown is refused', (await answer(A, 1, part1(fishA))).result === 'cooldown')
const tooLow = await answer(B, 1, part1(fishB) - 3)
check('too low says low', tooLow.result === 'low', JSON.stringify(tooLow))
check('any answer during cooldown is refused', (await answer(A, 1, 'viele')).result === 'cooldown')

await wait(5200)

// Correct answers and ranks.
const aRight = await answer(A, 1, part1(fishA))
check('A solves Part 1 first', aRight.result === 'correct' && aRight.rank === 1 && aRight.first === true, JSON.stringify(aRight))
check('solving again says already', (await answer(A, 1, part1(fishA))).result === 'already')
const bRight = await answer(B, 1, `${part1(fishB)}.0`)
check('B solves Part 1 second, 12.0 counts as 12', bRight.result === 'correct' && bRight.rank === 2 && !bRight.first, JSON.stringify(bRight))
const aPart2 = await answer(A, 2, part2(fishA))
check('A solves Part 2', aPart2.result === 'correct' && aPart2.rank === 1, JSON.stringify(aPart2))

await wait(500)
check('room heard three solves', solves.length === 3, solves.map(s => `${s.name} P${s.part} #${s.rank}`).join(', '))
const last = solves.at(-1)
const top = last?.standings.filter(s => s.audienceId.endsWith(run))
check('standings put A (2 parts) above B (1 part)', top?.[0]?.name === 'Check A' && top[0].points === 2 && top?.[1]?.name === 'Check B', JSON.stringify(top?.map(s => [s.name, s.points])))

socket.close()
console.log(results.join('\n'))
process.exit(results.some(line => line.startsWith('FAIL')) ? 1 : 0)
