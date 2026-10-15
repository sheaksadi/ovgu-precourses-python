#!/usr/bin/env node
/**
 * Renders every GIF in `video/gifs.mjs`, one after another, into `video/out/gifs/`.
 * Extra arguments (`--preview`) are passed on to `scripts/render-video.mjs`; a
 * name narrows it down: `npm run render:gifs -- cat door`.
 */
import { spawnSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { default: config } = await import(join(ROOT, 'video/gifs.mjs'))
const args = process.argv.slice(2)
const names = args.filter(a => !a.startsWith('--'))
const flags = args.filter(a => a.startsWith('--'))

for (const name of Object.keys(config.gifs)) {
  if (names.length && !names.includes(name)) continue
  console.log(`render-gifs — ${name}`)
  const run = spawnSync(process.execPath, [join(ROOT, 'scripts/render-video.mjs'), '--config', 'video/gifs.mjs', '--gif', name, ...flags], { stdio: 'inherit' })
  if (run.status !== 0) process.exit(run.status ?? 1)
}
