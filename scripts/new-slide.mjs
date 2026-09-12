#!/usr/bin/env node
/**
 * Allocate a new slide.
 *
 * Usage:
 *   npm run slide:new -- "Slide title" [--layout slide] [--parent PRE-0004]
 *                      [--template title|content|split|code|image] [--subtitle "..."]
 *
 * The script owns the id counter in `slides.counter.json`. It takes the next
 * number, never reuses a number from a deleted slide, creates
 * `pages/slides/<id lowercased>.vue`, and appends the entry to `slides.config.ts`
 * just before the `// <slides:end>` marker. Order is the array order, so move
 * the entry afterwards if the slide does not belong at the end.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const counterPath = join(root, 'slides.counter.json')
const configPath = join(root, 'slides.config.ts')

const ID_PAD = 4
const LAYOUTS = ['slide', 'slide-bare', 'slide-section', 'slide-interactive']
const TEMPLATES = ['title', 'content', 'split', 'code', 'image']

function parseArgs(argv) {
  const args = { positional: [] }
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i]
    if (token.startsWith('--')) {
      args[token.slice(2)] = argv[++i]
    } else {
      args.positional.push(token)
    }
  }
  return args
}

function formatSlideId(prefix, n) {
  return `${prefix}-${String(n).padStart(ID_PAD, '0')}`
}

function fail(message) {
  console.error(`slide:new - ${message}`)
  process.exit(1)
}

const args = parseArgs(process.argv.slice(2))
const title = args.title || args.positional.join(' ').trim()
if (!title) fail('a title is required, e.g. npm run slide:new -- "Roadmap"')

const layout = args.layout || 'slide'
if (!LAYOUTS.includes(layout)) fail(`unknown layout "${layout}". Known layouts: ${LAYOUTS.join(', ')}`)

const template = args.template || 'content'
if (!TEMPLATES.includes(template)) fail(`unknown template "${template}". Known templates: ${TEMPLATES.join(', ')}`)

const counter = JSON.parse(readFileSync(counterPath, 'utf8'))
if (!/^[A-Z]{3}$/.test(counter.prefix)) fail(`prefix in slides.counter.json must be three uppercase letters, got "${counter.prefix}"`)

const id = formatSlideId(counter.prefix, counter.next)
const slug = id.toLowerCase()
// Every slide page lives in one folder, served at /slides/<id>.
const slidesDir = join(root, 'pages', 'slides')
const pageFile = join(slidesDir, `${slug}.vue`)
if (existsSync(pageFile)) fail(`pages/slides/${slug}.vue already exists, so the counter in slides.counter.json is behind`)

let config = readFileSync(configPath, 'utf8')
if (!config.includes('// <slides:end>')) fail('slides.config.ts is missing the // <slides:end> marker')
if (config.includes(`id: '${id}'`)) fail(`${id} is already in slides.config.ts, so the counter is behind`)

const parent = args.parent
if (parent && !config.includes(`id: '${parent}'`)) fail(`parent ${parent} is not in slides.config.ts`)

const componentOf = {
  title: 'TitleSlide',
  content: 'ContentSlide',
  split: 'SplitSlide',
  code: 'CodeSlide',
  image: 'ImageSlide',
}

const bodies = {
  title: `  <TitleSlide title="${title}"${args.subtitle ? ` subtitle="${args.subtitle}"` : ''}>
    <p class="text-xl text-gray-400">Subhead</p>
  </TitleSlide>`,
  content: `  <ContentSlide title="${title}">
    <ul>
      <li>First point</li>
    </ul>
  </ContentSlide>`,
  split: `  <SplitSlide title="${title}">
    <template #left>
      <p>Left column</p>
    </template>
    <template #right>
      <p>Right column</p>
    </template>
  </SplitSlide>`,
  code: `  <CodeSlide title="${title}" :code="code" language="ts" />`,
  image: `  <ImageSlide title="${title}" imageSrc="/favicon.ico" layout="full" />`,
}

const extraSetup = template === 'code' ? "\nconst code = `console.log('hello')`\n" : ''
const component = componentOf[template]

const page = `<script setup lang="ts">
import ${component} from '~/components/slides/${component}.vue'
${extraSetup}<\/script>

<template>
${bodies[template]}
</template>
`

mkdirSync(slidesDir, { recursive: true })
writeFileSync(pageFile, page)

const entryLines = [
  '  {',
  `    id: '${id}',`,
  `    title: ${JSON.stringify(title)},`,
]
if (args.subtitle) entryLines.push(`    subtitle: ${JSON.stringify(args.subtitle)},`)
if (parent) entryLines.push(`    parent: '${parent}',`)
if (layout !== 'slide') entryLines.push(`    layout: '${layout}',`)
entryLines.push("    teleprompter: '',")
entryLines.push('  },')

config = config.replace('  // <slides:end>', `${entryLines.join('\n')}\n  // <slides:end>`)
writeFileSync(configPath, config)

counter.next += 1
writeFileSync(counterPath, `${JSON.stringify(counter, null, 2)}\n`)

console.log(`Created ${id}`)
console.log(`  page   pages/slides/${slug}.vue`)
console.log(`  route  /slides/${slug}`)
console.log(`  config slides.config.ts (appended before // <slides:end>)`)
console.log(`  next   id will be ${formatSlideId(counter.prefix, counter.next)}`)
