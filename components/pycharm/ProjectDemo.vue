<script setup lang="ts">
/**
 * New PyCharm project walk-through. Auto-imported as `<PycharmProjectDemo :stage="1" />`.
 *
 * One PyCharm window over three slides (PRE-0053 and its two sub-slides):
 *
 *   1. welcome screen: New Project
 *   2. name the project, keep Project venv, pick the Python version
 *   3. Create: the project opens with its .venv and interpreter
 *
 * The QR code beside it is for anyone whose Python list stays empty. The run
 * walk-through (`RunDemo.vue`) opens on this demo's last frame.
 *
 * Text lives in `pycharm.project.*` in `locales/`; PyCharm's own labels stay in
 * English, as students see them.
 */
import { computed, ref } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useDemoPlayer } from '~/composables/useDemoPlayer'
import { PYTHON } from '~/utils/pycharm'

type Scene = 'welcome' | 'dialog' | 'creating' | 'ide'

const props = defineProps<{ stage: 1 | 2 | 3 }>()
const { t, tm } = useI18n()

const PROJECT_TYPES = ['Pure Python', 'Django', 'FastAPI', 'Flask', 'Jupyter']
const WELCOME_MENU = ['Projects', 'Remote Development', 'Customize', 'Plugins', 'Learn']
/** What PyCharm suggests before anyone types. */
const DEFAULT_NAME = 'pythonProject'
const PYTHON_VERSION = 'Python 3.13'

const steps = computed(() => tm<string[]>('pycharm.project.steps'))
const tip = computed(() => tm<string[]>('pycharm.project.tips')[props.stage - 1])
const projectName = computed(() => t('pycharm.project.name'))

const frame = ref<HTMLElement | null>(null)
const scene = ref<Scene>('welcome')
const name = ref(DEFAULT_NAME)
const nameFocused = ref(false)
const nameSelected = ref(false)
const versionMenu = ref(false)
const venvMarked = ref(false)
const versionMarked = ref(false)
const marks = ref<string[]>([])
const pressed = ref<string | null>(null)

const windowTitle = computed(() => {
  if (scene.value === 'welcome') return 'Welcome to PyCharm'
  return scene.value === 'ide' ? name.value : 'New Project'
})

const reset = () => {
  scene.value = props.stage === 1 ? 'welcome' : 'dialog'
  name.value = props.stage === 3 ? projectName.value : DEFAULT_NAME
  nameFocused.value = false
  nameSelected.value = false
  versionMenu.value = false
  venvMarked.value = props.stage === 3
  versionMarked.value = props.stage === 3
  marks.value = []
  pressed.value = null
}

const land = () => {
  scene.value = props.stage === 3 ? 'ide' : 'dialog'
  name.value = props.stage === 1 ? DEFAULT_NAME : projectName.value
  nameFocused.value = false
  nameSelected.value = false
  versionMenu.value = false
  venvMarked.value = props.stage === 2
  versionMarked.value = props.stage === 2
  marks.value = props.stage === 3 ? ['venv', 'interpreter'] : []
  pressed.value = null
}

const { pointer, instant, finished, later, pointAt, play } = useDemoPlayer({
  id: 'pycharm-project',
  stage: props.stage,
  frame,
  reset,
  land,
  script: () => {
    let at = 500

    if (props.stage === 1) {
      later(at, () => pointAt('[data-point="new-project"]'))
      later(at += 800, () => { pressed.value = 'new-project' })
      later(at += 180, () => { pressed.value = null; scene.value = 'dialog' })
    }

    if (props.stage === 2) {
      const text = projectName.value
      later(at, () => pointAt('[data-point="name"]'))
      later(at += 800, () => { pressed.value = 'name'; nameFocused.value = true; nameSelected.value = true })
      later(at += 180, () => { pressed.value = null })
      later(at += 500, () => { nameSelected.value = false; name.value = '' })
      for (let i = 1; i <= text.length; i++) {
        later(at += 95, () => { name.value = text.slice(0, i) })
      }
      later(at += 500, () => { nameFocused.value = false; pointAt('[data-point="venv"]') })
      later(at += 800, () => { pressed.value = 'venv' })
      later(at += 180, () => { pressed.value = null; venvMarked.value = true })
      later(at += 600, () => pointAt('[data-point="version"]'))
      later(at += 800, () => { pressed.value = 'version' })
      later(at += 180, () => { pressed.value = null; versionMenu.value = true })
      later(at += 450, () => pointAt('[data-point="version-option"]'))
      later(at += 800, () => { pressed.value = 'version-option' })
      later(at += 180, () => { pressed.value = null; versionMenu.value = false; versionMarked.value = true })
    }

    if (props.stage === 3) {
      later(at, () => pointAt('[data-point="create"]'))
      later(at += 800, () => { pressed.value = 'create' })
      later(at += 180, () => { pressed.value = null; scene.value = 'creating' })
      later(at += 1700, () => { scene.value = 'ide' })
      later(at += 500, () => { marks.value = ['venv'] })
      later(at += 700, () => { marks.value = ['venv', 'interpreter'] })
    }

    return at
  },
})
</script>

<template>
  <DemoWalkthrough
    :eyebrow="t('pycharm.eyebrow')"
    :title="t('pycharm.project.title')"
    :steps="steps"
    :stage="stage"
    :finished="finished"
    :tip="tip"
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

          <!-- 3. The project -->
          <div v-else key="ide" class="view">
            <PycharmIde :project="name" :interpreter="`${PYTHON_VERSION} (${name})`" venv :marks="marks" />
          </div>
        </Transition>
      </PycharmWindow>

      <DemoPointer v-bind="pointer" :clicking="pressed !== null" :instant="instant" />
    </div>

    <template #aside>
      <div class="python-card" :class="{ 'is-hint': stage === 2 }">
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
  animation: load 1.6s ease-out both;
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
