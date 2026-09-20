<script setup lang="ts">
/**
 * From an empty PyCharm to a running program, in one take.
 * Auto-imported as `<PycharmProjectDemo />`, used by PRE-0053.
 *
 * One PyCharm window, six steps, no slide change in between:
 *
 *   1. welcome screen: New Project
 *   2. name the project, keep Project venv, pick the Python version
 *   3. Create: the project opens with its .venv and interpreter
 *   4. right-click the project → New → Python File, name it
 *   5. type the one-line program
 *   6. press Run: the output appears in the Run panel
 *
 * It used to be four slides, and the seam between them was the part people
 * asked about — so it is one animation now, and it waits behind its own start
 * button instead of playing while the room is still arriving.
 *
 * The QR code beside it is for anyone whose Python list stays empty.
 *
 * Text lives in `pycharm.project.*` in `locales/`; PyCharm's own labels stay in
 * English, as students see them.
 */
import { computed, ref } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useDemoPlayer } from '~/composables/useDemoPlayer'
import { PYTHON } from '~/utils/pycharm'

type Scene = 'welcome' | 'dialog' | 'creating' | 'ide'

const { t, tm } = useI18n()

const PROJECT_TYPES = ['Pure Python', 'Django', 'FastAPI', 'Flask', 'Jupyter']
const WELCOME_MENU = ['Projects', 'Remote Development', 'Customize', 'Plugins', 'Learn']
/** What PyCharm suggests before anyone types. */
const DEFAULT_NAME = 'pythonProject'
const PYTHON_VERSION = 'Python 3.13'

/** The step the demo is showing, 1 to 6. */
const step = ref(1)
const steps = computed(() => tm<string[]>('pycharm.project.steps'))
const tip = computed(() => tm<string[]>('pycharm.project.tips')[step.value - 1])
const projectName = computed(() => t('pycharm.project.name'))
const fileName = computed(() => `${t('pycharm.project.file')}.py`)

const frame = ref<HTMLElement | null>(null)
const scene = ref<Scene>('welcome')

// The New Project dialog.
const name = ref(DEFAULT_NAME)
const nameFocused = ref(false)
const nameSelected = ref(false)
const versionMenu = ref(false)
const venvMarked = ref(false)
const versionMarked = ref(false)

// The editor.
const files = ref<string[]>([])
const open = ref<string | null>(null)
const code = ref('')
const menu = ref<'none' | 'context' | 'new'>('none')
const newFile = ref<string | null>(null)
const run = ref<'none' | 'started' | 'done'>('none')

const marks = ref<string[]>([])
const pressed = ref<string | null>(null)

const windowTitle = computed(() => {
  if (scene.value === 'welcome') return 'Welcome to PyCharm'
  return scene.value === 'ide' ? name.value : 'New Project'
})

/** The first frame: PyCharm as it opens, before anybody has clicked. */
const reset = () => {
  step.value = 1
  scene.value = 'welcome'
  name.value = DEFAULT_NAME
  nameFocused.value = false
  nameSelected.value = false
  versionMenu.value = false
  venvMarked.value = false
  versionMarked.value = false
  files.value = []
  open.value = null
  code.value = ''
  menu.value = 'none'
  newFile.value = null
  run.value = 'none'
  marks.value = []
  pressed.value = null
}

/** The last frame: the program written and run. Reduced motion lands here. */
const land = () => {
  step.value = steps.value.length
  scene.value = 'ide'
  name.value = projectName.value
  nameFocused.value = false
  nameSelected.value = false
  versionMenu.value = false
  venvMarked.value = true
  versionMarked.value = true
  files.value = [fileName.value]
  open.value = fileName.value
  code.value = t('pycharm.project.code')
  menu.value = 'none'
  newFile.value = null
  run.value = 'done'
  marks.value = []
  pressed.value = null
}

const { pointer, instant, finished, started, later, pointAt, pointAtFraction, play } = useDemoPlayer({
  id: 'pycharm-project',
  stage: 1,
  frame,
  reset,
  land,
  // Long enough that catching the middle of it helps nobody: the room starts it.
  autoplay: false,
  script: () => {
    let at = 400

    // 1. New Project.
    later(at, () => pointAt('[data-point="new-project"]'))
    later(at += 800, () => { pressed.value = 'new-project' })
    later(at += 180, () => { pressed.value = null; scene.value = 'dialog' })

    // 2. Name it, keep the venv, pick the Python.
    const title = projectName.value
    later(at += 500, () => { step.value = 2 })
    later(at += 200, () => pointAt('[data-point="name"]'))
    later(at += 700, () => { pressed.value = 'name'; nameFocused.value = true; nameSelected.value = true })
    later(at += 180, () => { pressed.value = null })
    later(at += 450, () => { nameSelected.value = false; name.value = '' })
    for (let i = 1; i <= title.length; i++) {
      later(at += 85, () => { name.value = title.slice(0, i) })
    }
    later(at += 450, () => { nameFocused.value = false; pointAt('[data-point="venv"]') })
    later(at += 700, () => { pressed.value = 'venv' })
    later(at += 180, () => { pressed.value = null; venvMarked.value = true })
    later(at += 500, () => pointAt('[data-point="version"]'))
    later(at += 700, () => { pressed.value = 'version' })
    later(at += 180, () => { pressed.value = null; versionMenu.value = true })
    later(at += 400, () => pointAt('[data-point="version-option"]'))
    later(at += 700, () => { pressed.value = 'version-option' })
    later(at += 180, () => { pressed.value = null; versionMenu.value = false; versionMarked.value = true })

    // 3. Create: the folder and the .venv.
    later(at += 600, () => { step.value = 3 })
    later(at += 200, () => pointAt('[data-point="create"]'))
    later(at += 700, () => { pressed.value = 'create' })
    later(at += 180, () => { pressed.value = null; scene.value = 'creating' })
    later(at += 1500, () => { scene.value = 'ide' })
    later(at += 500, () => { marks.value = ['venv'] })
    later(at += 600, () => { marks.value = ['venv', 'interpreter'] })

    // 4. A file to write in.
    const file = t('pycharm.project.file')
    later(at += 700, () => { step.value = 4; marks.value = [] })
    later(at += 200, () => pointAt('[data-point="project"]'))
    later(at += 700, () => { pressed.value = 'project'; menu.value = 'context' })
    later(at += 180, () => { pressed.value = null })
    later(at += 400, () => pointAt('[data-point="new"]'))
    later(at += 600, () => { menu.value = 'new' })
    later(at += 300, () => pointAt('[data-point="python-file"]'))
    later(at += 700, () => { pressed.value = 'python-file' })
    later(at += 180, () => { pressed.value = null; menu.value = 'none'; newFile.value = '' })
    at += 400
    for (let i = 1; i <= file.length; i++) {
      later(at += 95, () => { newFile.value = file.slice(0, i) })
    }
    later(at += 400, () => { pressed.value = 'enter' })
    later(at += 220, () => {
      pressed.value = null
      newFile.value = null
      files.value = [fileName.value]
      open.value = fileName.value
    })
    later(at += 300, () => pointAtFraction(0.8, 0.45))

    // 5. Write the program. Brackets and quotes get a beat of their own.
    later(at += 600, () => { step.value = 5 })
    at += 400
    const text = t('pycharm.project.code')
    for (let i = 1; i <= text.length; i++) {
      later(at, () => { code.value = text.slice(0, i) })
      at += text[i - 1] === '(' || text[i - 1] === '"' ? 200 : 75
    }

    // 6. Run it.
    later(at += 800, () => { step.value = 6 })
    later(at += 250, () => pointAt('[data-point="run"]'))
    later(at += 700, () => { pressed.value = 'run' })
    later(at += 180, () => { pressed.value = null; run.value = 'started' })
    later(at += 700, () => { run.value = 'done' })

    return at
  },
})
</script>

<template>
  <DemoWalkthrough
    :eyebrow="t('pycharm.eyebrow')"
    :title="t('pycharm.project.title')"
    :steps="steps"
    :stage="step"
    :finished="finished"
    :started="started"
    :tip="tip"
    :start="t('pycharm.start')"
    :replay="t('pycharm.replay')"
    :hint="t('pycharm.hint')"
    @replay="play"
  >
    <div ref="frame" class="frame" role="img" :aria-label="t('pycharm.project.demoLabel')">
      <PycharmWindow :title="windowTitle">
        <Transition name="scene">
          <!-- 1. Welcome -->
          <div v-if="scene === 'welcome'" key="welcome" class="view welcome">
            <aside class="welcome-side">
              <span class="welcome-brand">
                <span class="welcome-mark"><span class="text-trim">PC</span></span>
                PyCharm
              </span>
              <span v-for="(item, index) in WELCOME_MENU" :key="item" class="side-item" :class="{ 'is-active': index === 0 }">
                {{ item }}
              </span>
            </aside>
            <div class="welcome-main">
              <strong class="welcome-title">Welcome to PyCharm</strong>
              <span class="welcome-text">Create a new project to start from scratch.<br>Open existing project from disk or version control.</span>
              <span class="welcome-actions">
                <span class="welcome-action" data-point="new-project" :class="{ 'is-pressed': pressed === 'new-project' }">
                  <span class="action-icon is-primary"><Icon name="lucide:plus" /></span>
                  New Project
                </span>
                <span class="welcome-action">
                  <span class="action-icon"><Icon name="lucide:folder-open" /></span>
                  Open
                </span>
                <span class="welcome-action">
                  <span class="action-icon"><Icon name="lucide:git-branch" /></span>
                  Clone Repository
                </span>
              </span>
            </div>
          </div>

          <!-- 2. New Project -->
          <div v-else-if="scene !== 'ide'" key="dialog" class="view dialog">
            <aside class="dialog-types">
              <span v-for="(type, index) in PROJECT_TYPES" :key="type" class="side-item" :class="{ 'is-active': index === 0 }">
                {{ type }}
              </span>
            </aside>

            <div class="dialog-form">
              <span class="field-label">Name:</span>
              <span class="field-input" data-point="name" :class="{ 'is-focused': nameFocused }">
                <span class="field-text" :class="{ 'is-selected': nameSelected }">{{ name }}</span><span v-if="nameFocused && !nameSelected" class="field-caret"></span>
              </span>

              <span class="field-label">Location:</span>
              <span class="field-input">
                <span class="field-text">~/PycharmProjects/{{ name }}</span>
                <Icon name="lucide:folder" class="field-icon" />
              </span>

              <span class="field-checks">
                <span class="check"><i></i>Create Git repository</span>
                <span class="check"><i></i>Create a welcome script</span>
              </span>

              <span class="field-label">Interpreter type:</span>
              <span class="segments">
                <span class="segment is-active" data-point="venv" :class="{ 'is-marked': venvMarked, 'is-pressed': pressed === 'venv' }">Project venv</span>
                <span class="segment">Base conda</span>
                <span class="segment">Custom environment</span>
              </span>

              <span class="field-label">Python version:</span>
              <span class="select-wrap">
                <span class="field-input select" data-point="version" :class="{ 'is-marked': versionMarked, 'is-pressed': pressed === 'version' }">
                  <span class="py-dot"></span>
                  <span class="field-text">{{ PYTHON_VERSION }}</span>
                  <Icon name="lucide:chevron-down" class="field-icon" />
                </span>
                <span v-if="versionMenu" class="select-menu">
                  <span class="select-option is-active" data-point="version-option">
                    <span class="py-dot"></span>
                    {{ PYTHON_VERSION }}
                    <span class="option-path">/usr/bin/python3</span>
                  </span>
                </span>
              </span>

              <span class="field-note">.venv → ~/PycharmProjects/{{ name }}/.venv</span>
            </div>

            <span class="dialog-buttons">
              <span class="dialog-button">Cancel</span>
              <span class="dialog-button is-primary" data-point="create" :class="{ 'is-pressed': pressed === 'create' }">Create</span>
            </span>

            <div v-if="scene === 'creating'" class="creating">
              <span class="creating-box">
                <span>Creating virtual environment…</span>
                <span class="creating-bar"><i></i></span>
              </span>
            </div>
          </div>

          <!-- 3. The project, and everything written in it -->
          <div v-else key="ide" class="view">
            <PycharmIde
              :project="name"
              :interpreter="`${PYTHON_VERSION} (${name})`"
              venv
              :files="files"
              :open="open"
              :code="code"
              :caret="open !== null && run === 'none'"
              :menu="menu"
              :new-file="newFile"
              :run="run"
              :output="t('pycharm.project.output')"
              :marks="marks"
              :pressed="pressed"
            />
          </div>
        </Transition>
      </PycharmWindow>

      <DemoPointer v-bind="pointer" :clicking="pressed !== null && pressed !== 'enter'" :instant="instant" />
    </div>

    <template #aside>
      <div class="python-card" :class="{ 'is-hint': step === 2 }">
        <div class="python-qr">
          <ArtQrCode :href="PYTHON.href" :badge="false" />
        </div>
        <div class="python-text">
          <strong>{{ t('pycharm.project.python.title') }}</strong>
          <span>{{ t('pycharm.project.python.text') }}</span>
          <span class="python-url">{{ PYTHON.display }}</span>
        </div>
      </div>
    </template>
  </DemoWalkthrough>
</template>

<style scoped>
.frame {
  position: relative;
  height: 68vh;
}

.view {
  position: absolute;
  inset: 0;
}

/* A new view fades in; the old one is gone at once, like a real window. */
.scene-enter-active {
  animation: appear 0.3s ease both;
}

.side-item {
  padding: 0.75vh 1vh;
  border-radius: 0.6vh;
  white-space: nowrap;
  color: var(--ide-muted);
}
.side-item.is-active {
  background: var(--ide-select);
  color: var(--ide-text);
}

/* ─── 1. Welcome ─────────────────────────────────────────────────────── */
.welcome {
  display: grid;
  grid-template-columns: 30% 1fr;
}

.welcome-side {
  display: flex;
  flex-direction: column;
  gap: 0.4vh;
  padding: 2vh 1.4vh;
  overflow: hidden;
  background: var(--ide-panel);
  border-right: 1px solid var(--ide-line);
}

.welcome-brand {
  display: flex;
  align-items: center;
  gap: 1vh;
  margin-bottom: 2vh;
  font-weight: 800;
}

.welcome-mark {
  display: grid;
  place-items: center;
  width: 3.6vh;
  height: 3.6vh;
  border-radius: 0.8vh;
  background: var(--lavender);
  font-size: clamp(0.5rem, 1.2vh, 0.8rem);
  font-weight: 900;
  color: #FFFFFF;
}

.welcome-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.6vh;
  padding: 0 3vh;
  text-align: center;
}

.welcome-title {
  font-size: clamp(0.9rem, 2.7vh, 1.8rem);
  font-weight: 800;
}

.welcome-text {
  line-height: 1.6;
  color: var(--ide-muted);
}

.welcome-actions {
  display: flex;
  gap: 2.6vh;
  margin-top: 2.4vh;
}

.welcome-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1vh;
  transition: transform 0.12s ease;
}
.welcome-action.is-pressed {
  transform: scale(0.92);
}

.action-icon {
  display: grid;
  place-items: center;
  width: 6.4vh;
  height: 6.4vh;
  border-radius: 1.4vh;
  background: var(--ide-raised);
  font-size: 2.6vh;
}
.action-icon.is-primary {
  background: var(--ide-accent);
  color: var(--ide-bg);
}

/* ─── 2. New Project ─────────────────────────────────────────────────── */
.dialog {
  display: grid;
  grid-template-columns: 24% 1fr;
}

.dialog-types {
  display: flex;
  flex-direction: column;
  gap: 0.3vh;
  padding: 1.6vh 1vh;
  overflow: hidden;
  background: var(--ide-panel);
  border-right: 1px solid var(--ide-line);
}

.dialog-form {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  align-content: start;
  gap: 1.5vh 1.6vh;
  min-width: 0;
  padding: 2.6vh 2.4vh;
}

.field-label {
  white-space: nowrap;
  color: var(--ide-muted);
}

.field-input {
  display: flex;
  align-items: center;
  gap: 0.7vh;
  min-width: 0;
  min-height: 3.9vh;
  padding: 0 1vh;
  border-radius: 0.7vh;
  background: var(--ide-bg);
  border: 1px solid var(--ide-edge);
  transition: border-color 0.2s ease, box-shadow 0.3s ease;
}
.field-input.is-focused {
  border-color: var(--ide-accent);
  box-shadow: 0 0 0 1px var(--ide-accent);
}
.field-text {
  overflow: hidden;
  white-space: pre;
  text-overflow: ellipsis;
}
.field-text.is-selected {
  background: var(--ide-select);
}
.field-caret {
  flex: none;
  width: 2px;
  height: 1.9vh;
  margin-left: -0.5vh;
  background: var(--ide-text);
  animation: blink 1s steps(1) infinite;
}
.field-icon {
  flex: none;
  margin-left: auto;
  color: var(--ide-muted);
}

.field-checks {
  grid-column: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 0.8vh 2.4vh;
}
.check {
  display: flex;
  align-items: center;
  gap: 0.8vh;
  white-space: nowrap;
}
.check i {
  width: 1.8vh;
  height: 1.8vh;
  border-radius: 0.4vh;
  border: 1px solid var(--ide-muted);
}

.segments {
  display: flex;
  width: fit-content;
  max-width: 100%;
  overflow: hidden;
  border-radius: 0.7vh;
  border: 1px solid var(--ide-edge);
}
.segment {
  padding: 0.85vh 1.2vh;
  white-space: nowrap;
  color: var(--ide-muted);
  transition: background 0.12s ease, box-shadow 0.3s ease;
}
.segment + .segment {
  border-left: 1px solid var(--ide-edge);
}
.segment.is-active {
  background: var(--ide-select);
  color: var(--ide-text);
}

.select-wrap {
  position: relative;
  min-width: 0;
}
.select {
  width: fit-content;
  min-width: 22vh;
}
.py-dot {
  flex: none;
  width: 1.5vh;
  height: 1.5vh;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--ide-accent) 50%, var(--ide-yellow) 50%);
}

.select-menu {
  position: absolute;
  top: calc(100% + 0.4vh);
  left: 0;
  z-index: 2;
  padding: 0.5vh;
  border-radius: 0.7vh;
  background: var(--ide-raised);
  border: 1px solid var(--ide-edge);
  box-shadow: 0 1vh 2.4vh rgba(0, 0, 0, 0.35);
  animation: appear 0.15s ease both;
}
.select-option {
  display: flex;
  align-items: center;
  gap: 0.8vh;
  padding: 0.75vh 1vh;
  border-radius: 0.5vh;
  white-space: nowrap;
}
.select-option.is-active {
  background: var(--ide-select);
}
.option-path {
  margin-left: 1.6vh;
  color: var(--ide-muted);
}

.field-note {
  grid-column: 2;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: clamp(0.55rem, 1.25vh, 0.8rem);
  color: var(--ide-muted);
}

.is-marked {
  box-shadow: inset 0 0 0 2px var(--mint);
}
.field-input.is-marked {
  border-color: var(--mint);
  box-shadow: 0 0 0 1px var(--mint);
}
.is-pressed {
  background: var(--ide-select);
}

.dialog-buttons {
  position: absolute;
  right: 2.4vh;
  bottom: 2.4vh;
  display: flex;
  gap: 1vh;
}
.dialog-button {
  padding: 1vh 2.2vh;
  border-radius: 0.7vh;
  border: 1px solid var(--ide-edge);
  transition: transform 0.12s ease;
}
.dialog-button.is-primary {
  background: var(--ide-accent);
  border-color: var(--ide-accent);
  font-weight: 800;
  color: var(--ide-bg);
}
.dialog-button.is-pressed {
  transform: scale(0.92);
}

.creating {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(17, 17, 27, 0.55);
  animation: appear 0.2s ease both;
}
.creating-box {
  display: flex;
  flex-direction: column;
  gap: 1.4vh;
  min-width: 50%;
  padding: 2.2vh 2.6vh;
  border-radius: 1.2vh;
  background: var(--ide-raised);
  border: 1px solid var(--ide-edge);
}
.creating-bar {
  height: 0.6vh;
  overflow: hidden;
  border-radius: 999px;
  background: var(--ide-edge);
}
.creating-bar i {
  display: block;
  height: 100%;
  background: var(--ide-accent);
  transform-origin: left center;
  animation: load 1.4s ease-out both;
}

/* ─── No Python yet ──────────────────────────────────────────────────── */
.python-card {
  display: flex;
  align-items: center;
  gap: 1.6vh;
  padding: 1.4vh;
  border-radius: 1.8vh;
  background: var(--bg-off);
  border: 2px solid var(--border);
  transition: border-color 0.3s ease, background 0.3s ease;
}
.python-card.is-hint {
  border-color: var(--sun);
  background: color-mix(in srgb, var(--sun) 30%, var(--bg));
}

.python-qr {
  flex: none;
  width: 13vh;
  padding: 0.8vh;
  border-radius: 1.2vh;
  background: var(--bg);
}

.python-text {
  display: flex;
  flex-direction: column;
  gap: 0.6vh;
  min-width: 0;
}
.python-text strong {
  font-size: clamp(0.85rem, 2.1vh, 1.4rem);
  font-weight: 900;
  color: var(--text);
}
.python-text span {
  font-size: clamp(0.65rem, 1.5vh, 1rem);
  line-height: 1.4;
  color: var(--text-dim);
}
.python-text .python-url {
  font-weight: 700;
  color: var(--text-muted);
  overflow-wrap: anywhere;
}

@keyframes appear {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes load {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
@keyframes blink {
  50% { opacity: 0; }
}
</style>
