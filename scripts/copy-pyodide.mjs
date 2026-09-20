#!/usr/bin/env node
/**
 * Copies the Pyodide runtime into `public/pyodide`, so code tasks run without
 * internet: the room's Wi-Fi often has none, and every phone would otherwise
 * fetch 13 MB from a CDN.
 *
 * Runs before `dev`, `build` and `generate` (see the `pre` scripts in
 * `package.json`), not after `npm install`: an image build installs from
 * `package.json` alone, with no `scripts/` beside it yet, and a postinstall
 * that reaches for this file fails the build. The copy is generated, not
 * committed: `public/pyodide` is in `.gitignore`.
 */
import { cpSync, existsSync, mkdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const from = join(root, 'node_modules', 'pyodide')
const to = join(root, 'public', 'pyodide')

/** What the browser actually needs: the loader, the runtime and the standard library. */
const FILES = [
  // The worker is a module, so it imports pyodide.mjs; pyodide.js is the
  // CommonJS build and cannot be loaded in a browser worker.
  'pyodide.mjs',
  'pyodide.asm.mjs',
  'pyodide.asm.wasm',
  'pyodide-lock.json',
  'python_stdlib.zip',
]

if (!existsSync(from)) {
  console.error('copy-pyodide — pyodide is not installed; run npm install first.')
  process.exit(1)
}

mkdirSync(to, { recursive: true })
let bytes = 0
let copied = 0
for (const file of FILES) {
  const source = join(from, file)
  if (!existsSync(source)) continue
  cpSync(source, join(to, file))
  bytes += statSync(source).size
  copied++
}

console.log(`copy-pyodide — ${copied} file(s), ${(bytes / 1024 / 1024).toFixed(1)} MB into public/pyodide`)
