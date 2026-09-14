<script setup lang="ts">
/**
 * The PyCharm editor, drawn from scratch. Auto-imported as `<PycharmIde>`.
 *
 * Toolbar with the Run button, project tree, editor, Run panel and status bar,
 * all driven by props so a demo only changes state. Pointer targets carry
 * `data-point` (`project`, `new`, `python-file`, `run`). Put it inside
 * `<PycharmWindow>`, which supplies the colours.
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  project: string
  /** Shown bottom right, e.g. `Python 3.13 (vorkurs)`. */
  interpreter: string
  /** The project's virtual environment folder in the tree. */
  venv?: boolean
  files?: string[]
  /** The file open in the editor. */
  open?: string | null
  /** The code typed so far. */
  code?: string
  caret?: boolean
  /** Right-click menu on the project folder, with or without its New submenu. */
  menu?: 'none' | 'context' | 'new'
  /** Name typed into the New Python file popup; `null` when it is closed. */
  newFile?: string | null
  run?: 'none' | 'started' | 'done'
  output?: string
  /** Highlighted parts: `venv`, `interpreter`. */
  marks?: string[]
  /** The `data-point` being clicked, or `enter` in the popup. */
  pressed?: string | null
}>(), {
  venv: false,
  files: () => [],
  open: null,
  code: '',
  caret: false,
  menu: 'none',
  newFile: null,
  run: 'none',
  output: '',
  marks: () => [],
  pressed: null,
})

const MENU = [
  { label: 'New', more: true },
  { label: 'Cut', more: false },
  { label: 'Copy', more: false },
  { label: 'Paste', more: false },
  { label: '', more: false },
  { label: 'Find in Files…', more: false },
  { label: 'Open In', more: true },
  { label: 'Refactor', more: true },
]
const SUBMENU = ['File', 'Directory', 'Python File', 'Python Package', 'HTML File']

/** Colour a one-line program by character: strings, names, the rest. */
const tokens = computed(() => {
  const out: Array<{ text: string, kind: 'str' | 'fn' | 'punct' }> = []
  let inString = false
  for (const char of props.code) {
    const kind = char === '"' || inString ? 'str' : /\w/.test(char) ? 'fn' : 'punct'
    if (char === '"') inString = !inString
    const last = out[out.length - 1]
    if (last && last.kind === kind) last.text += char
    else out.push({ text: char, kind })
  }
  return out
})

const runName = computed(() => props.open?.replace(/\.py$/, '') ?? '')
</script>

<template>
  <div class="ide">
    <!-- Toolbar -->
    <header class="ide-toolbar">
      <span class="ide-project">
        <span class="ide-badge"><span class="text-trim">{{ project.slice(0, 2).toUpperCase() }}</span></span>
        {{ project }}
        <Icon name="lucide:chevron-down" class="ide-dim" />
      </span>
      <span class="ide-actions">
        <span class="ide-config">Current File <Icon name="lucide:chevron-down" class="ide-dim" /></span>
        <span class="ide-run" data-point="run" :class="{ 'is-pressed': pressed === 'run' }">
          <Icon name="lucide:play" />
        </span>
        <Icon name="lucide:bug" class="ide-dim" />
        <Icon name="lucide:search" class="ide-dim" />
      </span>
    </header>

    <div class="ide-body">
      <nav class="ide-strip" aria-hidden="true">
        <Icon name="lucide:folder" class="is-active" />
        <Icon name="lucide:git-branch" />
        <Icon name="lucide:puzzle" />
      </nav>

      <!-- Project tree -->
      <aside class="ide-tree">
        <span class="tree-head">Project <Icon name="lucide:chevron-down" class="ide-dim" /></span>
        <span class="tree-row" :class="{ 'is-selected': pressed === 'project' || menu !== 'none' }">
          <Icon name="lucide:chevron-down" class="tree-arrow" />
          <Icon name="lucide:folder" class="tree-folder" />
          <span class="tree-name" data-point="project">{{ project }}</span>
          <span class="tree-path">~/PycharmProjects/{{ project }}</span>
        </span>
        <span v-if="venv" class="tree-row tree-child" :class="{ 'is-marked': marks.includes('venv') }">
          <Icon name="lucide:chevron-right" class="tree-arrow" />
          <Icon name="lucide:folder" class="tree-venv" />
          <span class="tree-name">.venv</span>
          <span class="tree-path">library root</span>
        </span>
        <span v-for="file in files" :key="file" class="tree-row tree-child" :class="{ 'is-selected': file === open }">
          <span class="tree-arrow"></span>
          <Icon name="lucide:file-code" class="tree-file" />
          <span class="tree-name">{{ file }}</span>
        </span>
        <span class="tree-row">
          <Icon name="lucide:chevron-right" class="tree-arrow" />
          <Icon name="lucide:library" class="ide-dim" />
          <span class="tree-name">External Libraries</span>
        </span>
        <span class="tree-row">
          <Icon name="lucide:chevron-right" class="tree-arrow" />
          <Icon name="lucide:file-pen" class="ide-dim" />
          <span class="tree-name">Scratches and Consoles</span>
        </span>
      </aside>

      <!-- Editor -->
      <section class="ide-editor">
        <template v-if="open">
          <div class="editor-tabs">
            <span class="editor-tab">
              <Icon name="lucide:file-code" class="tree-file" />
              {{ open }}
              <Icon name="lucide:x" class="ide-dim" />
            </span>
          </div>
          <div class="editor-code">
            <span class="editor-gutter">1</span>
            <code class="editor-line"><span
              v-for="(token, index) in tokens"
              :key="index"
              :class="`tok-${token.kind}`"
            >{{ token.text }}</span><span v-if="caret" class="caret"></span></code>
          </div>
        </template>
        <div v-else class="editor-empty">
          <span>Search Everywhere <kbd>Double Shift</kbd></span>
          <span>Go to File <kbd>Ctrl+Shift+N</kbd></span>
          <span>Drop files here to open them</span>
        </div>

        <Transition name="panel">
          <div v-if="run !== 'none'" class="run-panel">
            <div class="run-head">
              <span class="run-label">Run</span>
              <span class="run-tab">
                <Icon name="lucide:file-code" class="tree-file" />
                {{ runName }}
                <Icon name="lucide:x" class="ide-dim" />
              </span>
            </div>
            <div class="run-lines">
              <span class="run-command">~/PycharmProjects/{{ project }}/.venv/bin/python ~/PycharmProjects/{{ project }}/{{ open }}</span>
              <template v-if="run === 'done'">
                <span class="run-output">{{ output }}</span>
                <span class="run-exit">Process finished with exit code 0</span>
              </template>
            </div>
          </div>
        </Transition>
      </section>
    </div>

    <!-- Status bar -->
    <footer class="ide-status">
      <span class="status-crumbs">{{ project }}<template v-if="open"> › {{ open }}</template></span>
      <span class="status-interpreter" :class="{ 'is-marked': marks.includes('interpreter') }">{{ interpreter }}</span>
    </footer>

    <!-- Right-click menu -->
    <div v-if="menu !== 'none'" class="menu">
      <template v-for="(item, index) in MENU" :key="index">
        <span v-if="!item.label" class="menu-sep"></span>
        <span
          v-else
          class="menu-item"
          :class="{ 'is-active': item.label === 'New' && menu === 'new' }"
          :data-point="item.label === 'New' ? 'new' : undefined"
        >
          <span>{{ item.label }}</span>
          <Icon v-if="item.more" name="lucide:chevron-right" class="ide-dim" />
        </span>
      </template>

      <div v-if="menu === 'new'" class="menu submenu">
        <span
          v-for="item in SUBMENU"
          :key="item"
          class="menu-item"
          :class="{ 'is-active': item === 'Python File' && pressed === 'python-file' }"
          :data-point="item === 'Python File' ? 'python-file' : undefined"
        >
          <span class="menu-label">
            <Icon :name="item === 'Directory' ? 'lucide:folder' : item === 'File' || item === 'HTML File' ? 'lucide:file' : 'lucide:file-code'" class="tree-file" />
            {{ item }}
          </span>
        </span>
      </div>
    </div>

    <!-- New Python file -->
    <div v-if="newFile !== null" class="popup">
      <span class="popup-title">New Python file</span>
      <span class="popup-input">
        <span class="popup-text">{{ newFile }}</span><span class="caret"></span>
        <kbd class="popup-enter" :class="{ 'is-pressed': pressed === 'enter' }">↵</kbd>
      </span>
      <span class="popup-option is-active"><Icon name="lucide:file-code" class="tree-file" />Python file</span>
      <span class="popup-option"><Icon name="lucide:flask-conical" class="ide-dim" />Python unit test</span>
      <span class="popup-option"><Icon name="lucide:file" class="ide-dim" />Python stub</span>
    </div>
  </div>
</template>

<style scoped>
.ide {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.ide-dim {
  flex: none;
  color: var(--ide-muted);
}

/* ─── Toolbar ────────────────────────────────────────────────────────── */
.ide-toolbar {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 5vh;
  padding: 0 1.4vh;
  background: var(--ide-panel);
  border-bottom: 1px solid var(--ide-line);
}

.ide-project {
  display: flex;
  align-items: center;
  gap: 0.8vh;
  font-weight: 700;
}

.ide-badge {
  display: grid;
  place-items: center;
  width: 2.6vh;
  height: 2.6vh;
  border-radius: 0.6vh;
  background: var(--mint);
  font-size: clamp(0.5rem, 1.1vh, 0.75rem);
  font-weight: 900;
  color: var(--ide-bg);
}

.ide-actions {
  display: flex;
  align-items: center;
  gap: 1.4vh;
}

.ide-config {
  display: flex;
  align-items: center;
  gap: 0.5vh;
  padding: 0.6vh 1vh;
  border-radius: 0.8vh;
  background: var(--ide-raised);
}

.ide-run {
  display: grid;
  place-items: center;
  width: 3.4vh;
  height: 3.4vh;
  border-radius: 0.8vh;
  font-size: 1.9vh;
  color: var(--ide-green);
  transition: transform 0.12s ease, background 0.12s ease;
}
.ide-run.is-pressed {
  transform: scale(0.85);
  background: var(--ide-select);
}

/* ─── Body ───────────────────────────────────────────────────────────── */
.ide-body {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 4.4vh 34% minmax(0, 1fr);
}

.ide-strip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.8vh;
  padding-top: 1.4vh;
  background: var(--ide-panel);
  border-right: 1px solid var(--ide-line);
  font-size: 1.9vh;
  color: var(--ide-muted);
}
.ide-strip .is-active {
  color: var(--ide-text);
}

/* ─── Tree ───────────────────────────────────────────────────────────── */
.ide-tree {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3vh;
  padding: 1vh 0.8vh;
  overflow: hidden;
  border-right: 1px solid var(--ide-line);
}

.tree-head {
  display: flex;
  align-items: center;
  gap: 0.5vh;
  padding: 0.6vh 0.8vh 1vh;
  font-weight: 700;
}

.tree-row {
  display: flex;
  align-items: center;
  gap: 0.6vh;
  min-width: 0;
  padding: 0.55vh 0.8vh;
  border-radius: 0.6vh;
  white-space: nowrap;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}
.tree-row.is-selected {
  background: var(--ide-select);
}
.tree-child {
  padding-left: 2.6vh;
}

.tree-arrow {
  flex: none;
  width: 1em;
  color: var(--ide-muted);
}
.tree-folder {
  flex: none;
  color: var(--ide-accent);
}
.tree-venv {
  flex: none;
  color: var(--ide-yellow);
}
.tree-file {
  flex: none;
  color: var(--ide-accent);
}
.tree-name {
  flex: none;
}
.tree-path {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--ide-muted);
}

.is-marked {
  background: color-mix(in srgb, var(--mint) 22%, transparent);
  box-shadow: inset 0 0 0 2px var(--mint);
}

/* ─── Editor ─────────────────────────────────────────────────────────── */
.ide-editor {
  position: relative;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-tabs {
  flex: none;
  display: flex;
  height: 4vh;
  border-bottom: 1px solid var(--ide-line);
}
.editor-tab {
  display: flex;
  align-items: center;
  gap: 0.7vh;
  padding: 0 1.4vh;
  border-bottom: 2px solid var(--ide-accent);
}

.editor-code {
  display: flex;
  gap: 2vh;
  padding: 1.6vh 1.4vh;
  font-size: clamp(0.75rem, 2.1vh, 1.35rem);
}
.editor-gutter {
  color: var(--ide-muted);
}
.editor-line {
  white-space: pre;
}
.tok-fn {
  color: var(--ide-accent);
}
.tok-str {
  color: var(--ide-green);
}

.caret {
  display: inline-block;
  width: 2px;
  height: 1.15em;
  margin-left: 1px;
  vertical-align: text-bottom;
  background: var(--ide-text);
  animation: blink 1s steps(1) infinite;
}

.editor-empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.4vh;
  color: var(--ide-muted);
}
.editor-empty kbd,
.popup-enter {
  padding: 0.2vh 0.7vh;
  border-radius: 0.5vh;
  background: var(--ide-raised);
  font-family: inherit;
  color: var(--ide-text);
}

/* ─── Run panel ──────────────────────────────────────────────────────── */
.run-panel {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 46%;
  display: flex;
  flex-direction: column;
  background: var(--ide-panel);
  border-top: 1px solid var(--ide-line);
}
.panel-enter-active {
  animation: slide-up 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.run-head {
  display: flex;
  align-items: center;
  gap: 1.4vh;
  padding: 0.8vh 1.4vh;
  border-bottom: 1px solid var(--ide-line);
}
.run-label {
  font-weight: 800;
}
.run-tab {
  display: flex;
  align-items: center;
  gap: 0.6vh;
  padding: 0.3vh 0.8vh;
  border-radius: 0.6vh;
  background: var(--ide-raised);
}

.run-lines {
  display: flex;
  flex-direction: column;
  gap: 1vh;
  min-width: 0;
  padding: 1.2vh 1.4vh;
  font-size: clamp(0.65rem, 1.8vh, 1.15rem);
}
.run-command {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--ide-muted);
}
.run-output {
  font-weight: 700;
  animation: appear 0.25s ease both;
}
.run-exit {
  color: var(--ide-muted);
  animation: appear 0.25s ease 0.2s both;
}

/* ─── Status bar ─────────────────────────────────────────────────────── */
.ide-status {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3.8vh;
  padding: 0 1vh 0 1.4vh;
  background: var(--ide-panel);
  border-top: 1px solid var(--ide-line);
  color: var(--ide-muted);
}
.status-interpreter {
  padding: 0.4vh 0.9vh;
  border-radius: 0.6vh;
  transition: background 0.3s ease, box-shadow 0.3s ease, color 0.3s ease;
}
.status-interpreter.is-marked {
  color: var(--ide-text);
}

/* ─── Menus ──────────────────────────────────────────────────────────── */
.menu {
  position: absolute;
  top: 12.4vh;
  left: 9vh;
  z-index: 3;
  display: flex;
  flex-direction: column;
  min-width: 20vh;
  padding: 0.6vh;
  border-radius: 1vh;
  background: var(--ide-raised);
  border: 1px solid var(--ide-edge);
  box-shadow: 0 1vh 2.4vh rgba(0, 0, 0, 0.35);
  white-space: nowrap;
}
.submenu {
  top: -1px;
  left: calc(100% - 0.4vh);
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2.4vh;
  padding: 0.65vh 1vh;
  border-radius: 0.6vh;
  transition: background 0.12s ease;
}
.menu-item.is-active {
  background: var(--ide-select);
}
.menu-label {
  display: flex;
  align-items: center;
  gap: 0.8vh;
}
.menu-sep {
  height: 1px;
  margin: 0.4vh 0;
  background: var(--ide-edge);
}

.popup {
  position: absolute;
  top: 26%;
  left: 50%;
  z-index: 4;
  display: flex;
  flex-direction: column;
  gap: 0.4vh;
  width: 46%;
  padding: 1.2vh;
  border-radius: 1.2vh;
  background: var(--ide-raised);
  border: 1px solid var(--ide-edge);
  box-shadow: 0 1vh 2.4vh rgba(0, 0, 0, 0.35);
  translate: -50% 0;
  animation: pop 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.popup-title {
  padding-bottom: 0.8vh;
  text-align: center;
  font-weight: 700;
}
.popup-input {
  display: flex;
  align-items: center;
  margin-bottom: 0.6vh;
  padding: 0.8vh 1vh;
  border-radius: 0.8vh;
  background: var(--ide-bg);
  border: 2px solid var(--ide-accent);
}
.popup-text {
  white-space: pre;
}
.popup-enter {
  margin-left: auto;
  transition: background 0.12s ease, transform 0.12s ease;
}
.popup-enter.is-pressed {
  transform: scale(0.9);
  background: var(--ide-accent);
  color: var(--ide-bg);
}
.popup-option {
  display: flex;
  align-items: center;
  gap: 0.8vh;
  padding: 0.6vh 1vh;
  border-radius: 0.6vh;
}
.popup-option.is-active {
  background: var(--ide-select);
}

@keyframes appear {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes blink {
  50% { opacity: 0; }
}
@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
@keyframes pop {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
