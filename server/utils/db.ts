import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

/**
 * The room's memory, on disk.
 *
 * Everything a device sends lands here: who joined, every answer they typed —
 * right or wrong — and every part they solved. The in-memory rooms stay the
 * fast path; this is what survives a restart, and what there is to look at
 * after the course.
 *
 * `node:sqlite` ships with Node, so there is no dependency and no server to
 * run. One file, `.data/deck.sqlite`, ignored by git because it holds the
 * names of real people.
 *
 * Nothing here throws into a request. A course must not stop because a disk is
 * full or read-only, so a failed write is logged and the room carries on with
 * what it has in memory.
 */
const FILE = process.env.DECK_DB || resolve(process.cwd(), '.data/deck.sqlite')

let db: DatabaseSync | null = null
let broken = false

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS devices (
    audience_id TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    first_seen  INTEGER NOT NULL,
    last_seen   INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS rounds (
    problem_id TEXT PRIMARY KEY,
    opened_at  INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS solves (
    problem_id  TEXT NOT NULL,
    audience_id TEXT NOT NULL,
    part        INTEGER NOT NULL,
    name        TEXT NOT NULL,
    at          INTEGER NOT NULL,
    rank        INTEGER NOT NULL,
    elapsed_ms  INTEGER NOT NULL,
    PRIMARY KEY (problem_id, audience_id, part)
  );

  CREATE TABLE IF NOT EXISTS attempts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    problem_id  TEXT NOT NULL,
    audience_id TEXT NOT NULL,
    name        TEXT NOT NULL,
    part        INTEGER NOT NULL,
    given       TEXT NOT NULL,
    verdict     TEXT NOT NULL,
    at          INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS attempts_by_problem ON attempts (problem_id, at);
`

function open(): DatabaseSync | null {
  if (db || broken) return db
  try {
    mkdirSync(dirname(FILE), { recursive: true })
    db = new DatabaseSync(FILE)
    db.exec('PRAGMA journal_mode = WAL')
    db.exec(SCHEMA)
  }
  catch (error) {
    broken = true
    console.error('[db] no database, the room runs from memory only:', error)
  }
  return db
}

/** Run one statement. Never throws: a lost row is better than a lost course. */
function write(sql: string, params: Array<string | number>) {
  const handle = open()
  if (!handle) return
  try {
    handle.prepare(sql).run(...params)
  }
  catch (error) {
    console.error('[db] write failed:', error)
  }
}

function read<T>(sql: string): T[] {
  const handle = open()
  if (!handle) return []
  try {
    return handle.prepare(sql).all() as T[]
  }
  catch (error) {
    console.error('[db] read failed:', error)
    return []
  }
}

export interface StoredSolve {
  problem_id: string
  audience_id: string
  part: number
  name: string
  at: number
  rank: number
  elapsed_ms: number
}

export const deckDb = {
  /** Where the file lives, for the presenter view to name it. */
  file: FILE,

  seeDevice: (audienceId: string, name: string) => {
    const now = Date.now()
    write(
      `INSERT INTO devices (audience_id, name, first_seen, last_seen) VALUES (?, ?, ?, ?)
       ON CONFLICT (audience_id) DO UPDATE SET name = excluded.name, last_seen = excluded.last_seen`,
      [audienceId, name, now, now],
    )
  },

  openRound: (problemId: string, at: number) => {
    write('INSERT OR IGNORE INTO rounds (problem_id, opened_at) VALUES (?, ?)', [problemId, at])
  },

  /** Every answer that was typed, whatever the verdict said. */
  recordAttempt: (row: { problemId: string, audienceId: string, name: string, part: number, given: string, verdict: string }) => {
    write(
      'INSERT INTO attempts (problem_id, audience_id, name, part, given, verdict, at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [row.problemId, row.audienceId, row.name, row.part, row.given, row.verdict, Date.now()],
    )
  },

  recordSolve: (row: { problemId: string, audienceId: string, part: number, name: string, at: number, rank: number, elapsedMs: number }) => {
    write(
      `INSERT INTO solves (problem_id, audience_id, part, name, at, rank, elapsed_ms) VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (problem_id, audience_id, part) DO NOTHING`,
      [row.problemId, row.audienceId, row.part, row.name, row.at, row.rank, row.elapsedMs],
    )
  },

  rounds: () => read<{ problem_id: string, opened_at: number }>('SELECT problem_id, opened_at FROM rounds'),

  solves: () => read<StoredSolve>('SELECT * FROM solves ORDER BY at ASC'),

  counts: () => ({
    devices: read<{ n: number }>('SELECT COUNT(*) AS n FROM devices')[0]?.n ?? 0,
    solves: read<{ n: number }>('SELECT COUNT(*) AS n FROM solves')[0]?.n ?? 0,
    attempts: read<{ n: number }>('SELECT COUNT(*) AS n FROM attempts')[0]?.n ?? 0,
  }),

  /** Empty every table, for a dry run before the real room arrives. */
  clear: () => {
    const handle = open()
    if (!handle) return
    try {
      handle.exec('DELETE FROM attempts; DELETE FROM solves; DELETE FROM rounds; DELETE FROM devices;')
    }
    catch (error) {
      console.error('[db] clear failed:', error)
    }
  },
}
