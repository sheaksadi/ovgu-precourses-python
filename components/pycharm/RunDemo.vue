<script setup lang="ts">
/**
 * Run-your-code walk-through. Auto-imported as `<PycharmRunDemo />`.
 *
 * The project from `ProjectDemo.vue`, played in one go on one slide (PRE-0056).
 * The step list ticks along as it plays:
 *
 *   1. right-click the project → New → Python File, name it
 *   2. type the one-line program
 *   3. press Run: the output appears in the Run panel
 *
 * It opens on the project demo's last frame, pointer included.
 * Text and the program live in `pycharm.run.*` in `locales/`.
 */
import { computed, ref } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useDemoPlayer } from '~/composables/useDemoPlayer'

const { t, tm } = useI18n()

/** The step the demo is showing, 1 to 3. */
const step = ref(1)
const steps = computed(() => tm<string[]>('pycharm.run.steps'))
const tip = computed(() => tm<string[]>('pycharm.run.tips')[step.value - 1])
const project = computed(() => t('pycharm.project.name'))
const fileName = computed(() => `${t('pycharm.run.file')}.py`)

const frame = ref<HTMLElement | null>(null)
const files = ref<string[]>([])
const open = ref<string | null>(null)
const code = ref('')
const menu = ref<'none' | 'context' | 'new'>('none')
const newFile = ref<string | null>(null)
const run = ref<'none' | 'started' | 'done'>('none')
const marks = ref<string[]>([])
const pressed = ref<string | null>(null)

const reset = () => {
  step.value = 1
  files.value = []
  open.value = null
  code.value = ''
  menu.value = 'none'
  newFile.value = null
  run.value = 'none'
  // The project demo ends with these lit; they fade as this one starts.
  marks.value = ['venv', 'interpreter']
  pressed.value = null
}

const land = () => {
  step.value = 3
  files.value = [fileName.value]
  open.value = fileName.value
  code.value = t('pycharm.run.code')
  menu.value = 'none'
  newFile.value = null
  run.value = 'done'
  marks.value = []
  pressed.value = null
}

const { pointer, instant, finished, later, pointAt, pointAtFraction, play } = useDemoPlayer({
  id: 'pycharm-run',
  stage: 1,
  continues: { id: 'pycharm-project', stage: 3 },
  frame,
  reset,
  land,
  script: () => {
    // 1. New Python file.
    const name = t('pycharm.run.file')
    let at = 500
    later(300, () => { marks.value = [] })
    later(at, () => pointAt('[data-point="project"]'))
    later(at += 800, () => { pressed.value = 'project'; menu.value = 'context' })
    later(at += 180, () => { pressed.value = null })
    later(at += 450, () => pointAt('[data-point="new"]'))
    later(at += 650, () => { menu.value = 'new' })
    later(at += 350, () => pointAt('[data-point="python-file"]'))
    later(at += 800, () => { pressed.value = 'python-file' })
    later(at += 180, () => { pressed.value = null; menu.value = 'none'; newFile.value = '' })
    at += 450
    for (let i = 1; i <= name.length; i++) {
      later(at += 110, () => { newFile.value = name.slice(0, i) })
    }
    later(at += 450, () => { pressed.value = 'enter' })
    later(at += 220, () => {
      pressed.value = null
      newFile.value = null
      files.value = [fileName.value]
      open.value = fileName.value
    })
    later(at += 300, () => pointAtFraction(0.8, 0.45))

    // 2. Write the program.
    later(at += 700, () => { step.value = 2 })
    at += 500
    const text = t('pycharm.run.code')
    for (let i = 1; i <= text.length; i++) {
      later(at, () => { code.value = text.slice(0, i) })
      at += text[i - 1] === '(' || text[i - 1] === '"' ? 220 : 85
    }

    // 3. Run it.
    later(at += 900, () => { step.value = 3 })
    later(at += 300, () => pointAt('[data-point="run"]'))
    later(at += 800, () => { pressed.value = 'run' })
    later(at += 180, () => { pressed.value = null; run.value = 'started' })
    later(at += 700, () => { run.value = 'done' })

    return at
  },
})
</script>

<template>
  <DemoWalkthrough
    :eyebrow="t('pycharm.eyebrow')"
    :title="t('pycharm.run.title')"
    :steps="steps"
    :stage="step"
    :finished="finished"
    :tip="tip"
    :replay="t('pycharm.replay')"
    :hint="t('pycharm.hint')"
    @replay="play"
  >
    <div ref="frame" class="frame" role="img" :aria-label="t('pycharm.run.demoLabel')">
      <PycharmWindow :title="project">
        <PycharmIde
          :project="project"
          :interpreter="`Python 3.13 (${project})`"
          venv
          :files="files"
          :open="open"
          :code="code"
          :caret="open !== null && run === 'none'"
          :menu="menu"
          :new-file="newFile"
          :run="run"
          :output="t('pycharm.run.output')"
          :marks="marks"
          :pressed="pressed"
        />
      </PycharmWindow>

      <DemoPointer v-bind="pointer" :clicking="pressed !== null && pressed !== 'enter'" :instant="instant" />
    </div>
  </DemoWalkthrough>
</template>

<style scoped>
.frame {
  position: relative;
  height: 68vh;
}
</style>
