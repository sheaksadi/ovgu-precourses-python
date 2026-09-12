#!/usr/bin/env node
/**
 * Validates the deck without starting it.
 *
 * Run `npm run slides:check` after editing `slides.config.ts` by hand, or after
 * an agent has. It reports, and exits non-zero on:
 *   - a slide id that is not `AAA-0000`, or a prefix that is not the deck's,
 *   - duplicate ids,
 *   - a config entry with no page, or a page with no config entry,
 *   - a `parent` that does not exist, or a sub-slide of a sub-slide,
 *   - a layout name the app does not have,
 *   - a counter in slides.counter.json that is not ahead of every id.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const configPath = join(root, 'slides.config.ts')
const counterPath = join(root, 'slides.counter.json')
const pagesDir = join(root, 'pages')
const layoutsDir = join(root, 'layouts')

const ID_PATTERN = /^([A-Z]{3})-(\d{4,})$/

const problems = []
const notes = []

const config = readFileSync(configPath, 'utf8')
const counter = JSON.parse(readFileSync(counterPath, 'utf8'))

// Entries, in the order they appear, parsed from the source of truth.
const entries = [...config.matchAll(/\{\s*\n\s*id: '([^']+)',([\s\S]*?)\n {2}\},/g)].map(([, id, body]) => ({
  id,
  title: /title: ['"`]?([^'"`\n]*)/.exec(body)?.[1] ?? '',
  parent: /parent: '([^']+)'/.exec(body)?.[1],
  layout: /layout: '([^']+)'/.exec(body)?.[1],
  route: /route: '([^']+)'/.exec(body)?.[1],
  hidden: /hidden: true/.test(body)
}))

if (!entries.length) problems.push('no slide entries found in slides.config.ts')

const layouts = existsSync(layoutsDir)
  ? readdirSync(layoutsDir).filter(f => f.endsWith('.vue')).map(f => f.replace(/\.vue$/, ''))
  : []

// Every slide page lives in pages/slides/<id lowercased>.vue.
const slidesDir = join(pagesDir, 'slides')
const pageFiles = existsSync(slidesDir)
  ? readdirSync(slidesDir)
    .filter(f => f.endsWith('.vue') && ID_PATTERN.test(f.slice(0, -4).toUpperCase()))
    .map(f => f.slice(0, -4))
  : []

const ids = new Set()
for (const entry of entries) {
  const match = ID_PATTERN.exec(entry.id)
  if (!match) {
    problems.push(`${entry.id}: id must look like ${counter.prefix}-0001`)
    continue
  }
  if (match[1] !== counter.prefix) {
    problems.push(`${entry.id}: prefix is not this deck's (${counter.prefix})`)
  }
  if (ids.has(entry.id)) problems.push(`${entry.id}: duplicate id`)
  ids.add(entry.id)

  const slug = entry.id.toLowerCase()
  const defaultPage = join(slidesDir, `${slug}.vue`)
  const customPage = entry.route
    ? join(pagesDir, `${entry.route.replace(/^\//, '')}.vue`)
    : null
  if (customPage && existsSync(customPage)) {
    // Custom route, e.g. `/handout/cover` → pages/handout/cover.vue
  } else if (!existsSync(defaultPage)) {
    problems.push(
      customPage
        ? `${entry.id}: no page at pages/slides/${slug}.vue or pages${entry.route}.vue`
        : `${entry.id}: no page at pages/slides/${slug}.vue`
    )
  }

  if (entry.layout && !layouts.includes(entry.layout)) {
    problems.push(`${entry.id}: layout "${entry.layout}" has no file in layouts/`)
  }

  if (Number(match[2]) >= counter.next) {
    problems.push(`${entry.id}: number is not below slides.counter.json next (${counter.next})`)
  }
}

for (const entry of entries) {
  if (!entry.parent) continue
  const parent = entries.find(e => e.id === entry.parent)
  if (!parent) {
    problems.push(`${entry.id}: parent ${entry.parent} is not in the deck`)
  } else if (parent.parent) {
    problems.push(`${entry.id}: parent ${entry.parent} is itself a sub-slide, which the deck does not nest`)
  }
}

for (const name of pageFiles) {
  if (!ids.has(name.toUpperCase())) {
    problems.push(`pages/slides/${name}.vue: no entry in slides.config.ts, so the slide never shows`)
  }
}

const hidden = entries.filter(e => e.hidden)
if (hidden.length) notes.push(`${hidden.length} hidden slide(s): ${hidden.map(e => e.id).join(', ')}`)

console.log(`slides:check — ${entries.length} entries, ${pageFiles.length} slide page(s), next id ${counter.prefix}-${String(counter.next).padStart(4, '0')}`)
for (const note of notes) console.log(`  note   ${note}`)
for (const problem of problems) console.error(`  error  ${problem}`)

if (problems.length) {
  console.error(`\n${problems.length} problem(s) found.`)
  process.exit(1)
}
console.log('  ok     the deck is consistent')
