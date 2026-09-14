<script setup lang="ts">
/**
 * Run-your-code walk-through. Auto-imported as `<PycharmRunDemo :stage="1" />`.
 *
 * The project from `ProjectDemo.vue`, over three slides (PRE-0056 and its two
 * sub-slides):
 *
 *   1. right-click the project → New → Python File, name it
 *   2. type the one-line program
 *   3. press Run: the output appears in the Run panel
 *
 * Stage 1 opens on the project demo's last frame, pointer included.
 * Text and the program live in `pycharm.run.*` in `locales/`.
 */
import { computed, ref } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useDemoPlayer } from '~/composables/useDemoPlayer'

const props = defineProps<{ stage: 1 | 2 | 3 }>()
const { t, tm } = useI18n()

const steps = computed(() => tm<string[]>('pycharm.run.steps'))
const tip = computed(() => tm<string[]>('pycharm.run.tips')[props.stage - 1])
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
  files.value = props.stage === 1 ? [] : [fileName.value]
  open.value = props.stage === 1 ? null : fileName.value
  code.value = props.stage === 3 ? t('pycharm.run.code') : ''
  menu.value = 'none'
  newFile.value = null
  run.value = 'none'
  // The project demo ends with these lit; they fade as this one starts.
  marks.value = props.stage === 1 ? ['venv', 'interpreter'] : []
  pressed.value = null
}

const land = () => {
  files.value = [fileName.value]
  open.value = fileName.value
  code.value = props.stage === 1 ? '' : t('pycharm.run.code')
  menu.value = 'none'
  newFile.value = null
  run.value = props.stage === 3 ? 'done' : 'none'
  marks.value = []
  pressed.value = null
}

const { pointer, instant, finished, later, pointAt, pointAtFraction, play } = useDemoPlayer({
  id: 'pycharm-run',
  stage: props.stage,
  continues: props.stage === 1 ? { id: 'pycharm-project', stage: 3 } : undefined,
  frame,
  reset,
  land,
  script: () => {
    let at = 500

    if (props.stage === 1) {
      const name = t('pycharm.run.file')
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
    }

    if (props.stage === 2) {
      const text = t('pycharm.run.code')
      for (let i = 1; i <= text.length; i++) {
        later(at, () => { code.value = text.slice(0, i) })
        at += text[i - 1] === '(' || text[i - 1] === '"' ? 220 : 85
      }
    }

    if (props.stage === 3) {
      later(at, () => pointAt('[data-point="run"]'))
      later(at += 800, () => { pressed.value = 'run' })
      later(at += 180, () => { pressed.value = null; run.value = 'started' })
      later(at += 700, () => { run.value = 'done' })
    }

    return at
  },
})
</script>

<template>
  <DemoWalkthrough
    :eyebrow="t('pycharm.eyebrow')"
    :title="t('pycharm.run.title')"
    :steps="steps"
    :stage="stage"
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
