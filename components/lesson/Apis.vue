<script setup lang="ts">
/**
 * APIs: "Daten aus dem Internet". Auto-imported as `<LessonApis :stage="1" />`.
 *
 * Four slides (PRE-0132 and its three sub-slides):
 *
 *   1. what an API is: Momo orders, Bello the waiter carries the order to the
 *      kitchen and brings the answer back
 *   2. `requests.get`: the address travels to the server, 200 comes back
 *   3. `.json()`: the answer is text in JSON, and it becomes a dictionary
 *   4. live: the slide asks the Dog API itself; Enter fetches a new dog
 *
 * Stage 4 is the only slide in the deck that goes online. Without a network it
 * shows Momo and says so. Words come from `apis.*` in `locales/`.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from '~/composables/useI18n'

type StageNumber = 1 | 2 | 3 | 4

interface Stage {
  headline: string
  note: string
  tally: string
  code: string
  variant?: 'python' | 'pseudo'
  focus: number[]
  output: string[]
  outputFrom: number
}

const props = defineProps<{ stage: StageNumber }>()
const { t, tm } = useI18n()

const stages = computed(() => tm<Stage[]>('apis.stages'))
const current = computed(() => stages.value[props.stage - 1]!)
const words = computed(() => tm<Record<'order' | 'kitchen' | 'request' | 'response' | 'next' | 'loading' | 'offline', string>>('apis.words'))

const DOG_API = 'https://dog.ceo/api/breeds/image/random'

/* ─── Stage 4: live ─── */
const image = ref<string | null>(null)
const loading = ref(false)
const failed = ref(false)
const fetchCount = ref(0)

const fetchDog = async () => {
  loading.value = true
  failed.value = false
  try {
    const response = await fetch(DOG_API)
    const data = await response.json() as { message: string, status: string }
    await new Promise<void>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('image'))
      img.src = data.message
    })
    image.value = data.message
    fetchCount.value++
  } catch {
    failed.value = true
  } finally {
    loading.value = false
  }
}

const onKey = (event: KeyboardEvent) => {
  if (event.key !== 'Enter' || props.stage !== 4) return
  if (['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) return
  event.preventDefault()
  fetchDog()
}

onMounted(() => {
  if (props.stage !== 4) return
  fetchDog()
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

/** Long image addresses keep their start and end. */
const shorten = (url: string) => (url.length > 44 ? `${url.slice(0, 26)}…${url.slice(-15)}` : url)

const output = computed(() => {
  if (props.stage !== 4) return current.value.output
  if (failed.value) return [words.value.offline]
  return image.value ? ['success', shorten(image.value)] : ['…']
})

const outputDelays = computed(() => {
  switch (props.stage) {
    case 2: return [2.4]
    case 3: return [2.6, 3.0]
    case 4: return [0.1, 0.2]
    default: return undefined
  }
})
</script>

<template>
  <LessonShell
    :eyebrow="t('apis.title')"
    :stage="stage"
    :stages="stages.length"
    :headline="current.headline"
    :note="current.note"
    :code="current.code"
    :variant="current.variant ?? 'python'"
    :file="t('apis.file')"
    :focus="current.focus"
    :output="output"
    :output-from="current.outputFrom"
    :output-delays="outputDelays"
    dense
    :output-label="t('apis.output')"
    :no-output="t('apis.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`">
      <span :key="stage" class="tally"><span class="text-trim">{{ current.tally }}</span></span>

      <!-- ═══ 1: the restaurant ═══ -->
      <div v-if="stage <= 2" class="part restaurant" :class="{ 'is-leaving': stage === 2 }">
        <div class="guest">
          <ArtSprite name="cat" color="coral" accent="rose" :size="96" class="fill" />
          <span class="bubble"><span class="text-trim">{{ words.order }}</span></span>
        </div>
        <div class="waiter">
          <ArtSprite name="dog" color="sun" accent="text" :size="96" class="fill" />
          <span class="note-card"><span class="text-trim">GET</span></span>
          <span class="plate"><ArtSprite name="dog" color="lavender" accent="text" :size="48" class="fill" /></span>
        </div>
        <div class="kitchen">
          <ArtSprite name="house" color="sky" accent="coral" :size="96" class="fill" />
          <code class="kitchen-label">{{ words.kitchen }}</code>
        </div>
        <code class="lane lane-request">{{ words.request }} →</code>
        <code class="lane lane-response">← {{ words.response }}</code>
      </div>

      <!-- ═══ 2–3: a real request ═══ -->
      <div v-if="stage === 2 || stage === 3" class="part wire" :class="{ 'is-leaving': stage === 3 }">
        <div class="laptop">
          <span class="screen"><code>python</code></span>
          <span class="base"></span>
        </div>
        <div class="cloud"><code>dog.ceo</code></div>
        <code class="packet packet-url">GET /api/breeds/image/random</code>
        <code class="packet packet-ok">200 OK</code>
      </div>

      <!-- ═══ 3: JSON becomes a dictionary ═══ -->
      <div v-if="stage === 3 || stage === 4" class="part json" :class="{ 'is-leaving': stage === 4 }">
        <code class="raw">{"message": "https://images.dog.ceo/…", "status": "success"}</code>
        <div class="dict">
          <span class="dict-row row-message"><code class="key">"message"</code><code class="val">"https://images.dog.ceo/…"</code></span>
          <span class="dict-row row-status"><code class="key">"status"</code><code class="val">"success"</code></span>
        </div>
      </div>

      <!-- ═══ 4: live ═══ -->
      <div v-if="stage === 4" class="part live">
        <div class="frame">
          <Transition name="photo">
            <img v-if="image && !failed" :key="image" :src="image" alt="" class="photo" />
          </Transition>
          <div v-if="failed" class="offline">
            <ArtSprite name="cat-sleep" color="coral" accent="rose" :size="96" class="offline-art" />
            <span>{{ words.offline }}</span>
          </div>
          <span v-if="loading" class="spinner"></span>
        </div>
        <span class="next">
          <code>{{ fetchCount }}</code>
          <span>{{ words.next }}</span>
        </span>
      </div>
    </div>
  </LessonShell>
</template>

<style scoped>
.scene,
.part {
  position: absolute;
  inset: 0;
}
code {
  font-family: var(--font-code);
}
.fill {
  width: 100%;
  height: 100%;
}

.tally {
  position: absolute;
  top: 1.6vh;
  left: 50%;
  z-index: 3;
  translate: -50% 0;
  padding: calc(0.4vh + 0.3em) 1.3vh;
  border-radius: 999px;
  background: var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.6rem, 1.5vh, 1rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--bg);
  animation: pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
}

.is-leaving {
  animation: vanish 0.3s ease both;
}

/* ═══ 1: restaurant ════════════════════════════════════════════════════ */
.guest {
  position: absolute;
  left: 6%;
  top: 22vh;
  width: 12vh;
  height: 12vh;
}
.bubble {
  position: absolute;
  bottom: calc(100% + 0.6vh);
  left: 20%;
  padding: 0.9vh 1.3vh;
  border-radius: 1.4vh;
  background: var(--bg);
  border: 2px solid var(--text);
  font-size: clamp(0.55rem, 1.55vh, 1rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
  transform-origin: 20% 100%;
  /* The order is answered once Bello heads back with the plate. */
  animation:
    pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both,
    vanish 0.3s ease 3.6s forwards;
}
.stage-2 .bubble {
  animation: none;
  opacity: 0;
}
.waiter {
  position: absolute;
  left: 32%;
  top: 22vh;
  width: 11vh;
  height: 11vh;
}
.note-card {
  position: absolute;
  top: -2.6vh;
  right: -1vh;
  padding: calc(0.2vh + 0.3em) 0.7vh;
  border-radius: 0.6vh;
  background: var(--bg);
  border: 2px solid var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.5rem, 1.3vh, 0.85rem);
  font-weight: 900;
  color: var(--text);
  opacity: 0;
}
.plate {
  position: absolute;
  top: -3.6vh;
  right: -1.4vh;
  width: 5vh;
  height: 5vh;
  padding: 0.5vh;
  border-radius: 999px;
  background: var(--bg);
  border: 2px solid var(--text);
  opacity: 0;
}
.kitchen {
  position: absolute;
  right: 6%;
  top: 17vh;
  width: 17vh;
  height: 17vh;
}
.kitchen-label {
  position: absolute;
  top: calc(100% + 0.4vh);
  left: 50%;
  translate: -50% 0;
  padding: calc(0.25vh + 0.3em) 0.9vh;
  border-radius: 999px;
  background: var(--text);
  font-size: clamp(0.5rem, 1.35vh, 0.9rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--bg);
}
.lane {
  position: absolute;
  left: 50%;
  translate: -50% 0;
  padding: calc(0.25vh + 0.3em) 1vh;
  border-radius: 999px;
  font-size: clamp(0.55rem, 1.5vh, 1rem);
  font-weight: 800;
  white-space: nowrap;
  color: #FFFFFF;
  opacity: 0;
}
.lane-request {
  top: 13vh;
  background: var(--sky);
}
.lane-response {
  top: 40vh;
  background: var(--mint);
}
.stage-1 .waiter {
  animation: serve 4s cubic-bezier(0.45, 0, 0.55, 1) 1s both;
}
.stage-1 .note-card {
  animation: carry-note 4s linear 1s both;
}
.stage-1 .plate {
  animation: carry-plate 4s linear 1s both;
}
.stage-1 .lane-request {
  animation: appear 0.3s ease 1.3s both;
}
.stage-1 .lane-response {
  animation: appear 0.3s ease 3.3s both;
}
/* Stage 2 fades out stage 1's last frame: Bello back with the plate. */
.stage-2 .waiter {
  left: 22%;
}
.stage-2 .plate,
.stage-2 .lane {
  opacity: 1;
}

/* ═══ 2: wire ══════════════════════════════════════════════════════════ */
.laptop {
  position: absolute;
  left: 8%;
  top: 18vh;
  width: 18vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: appear 0.35s ease 0.3s both;
}
.screen {
  display: grid;
  place-items: center;
  width: 100%;
  height: 11vh;
  border-radius: 1vh 1vh 0 0;
  background: var(--code-bg);
  border: 3px solid var(--text);
}
.screen code {
  font-size: clamp(0.55rem, 1.5vh, 1rem);
  font-weight: 800;
  color: var(--mint);
}
.base {
  width: 120%;
  height: 1.6vh;
  border-radius: 0 0 1vh 1vh;
  background: var(--text);
}
.cloud {
  position: absolute;
  right: 8%;
  top: 17vh;
  display: grid;
  place-items: center;
  width: 20vh;
  height: 12vh;
  border-radius: 999px;
  background: color-mix(in srgb, var(--sky) 40%, var(--bg));
  border: 3px solid var(--text);
  box-shadow: -5vh 2vh 0 -2vh color-mix(in srgb, var(--sky) 40%, var(--bg)), -5vh 2vh 0 -1.7vh var(--text);
  animation: appear 0.35s ease 0.5s both;
}
.cloud code {
  font-size: clamp(0.6rem, 1.8vh, 1.2rem);
  font-weight: 900;
  color: var(--text);
}
.packet {
  position: absolute;
  padding: calc(0.3vh + 0.3em) 1vh;
  border-radius: 999px;
  font-size: clamp(0.5rem, 1.35vh, 0.9rem);
  font-weight: 800;
  white-space: nowrap;
  color: #FFFFFF;
  opacity: 0;
}
.packet-url {
  top: 13vh;
  left: 20%;
  background: var(--sky);
}
.packet-ok {
  top: 34vh;
  right: 22%;
  background: var(--mint);
}
.stage-2 .packet-url {
  animation: to-server 1.1s cubic-bezier(0.45, 0, 0.55, 1) 0.9s both;
}
.stage-2 .packet-ok {
  animation: to-client 0.9s cubic-bezier(0.45, 0, 0.55, 1) 2s both;
}
.stage-3 .packet-ok {
  opacity: 1;
  right: auto;
  left: 10%;
}

/* ═══ 3: JSON → dict ═══════════════════════════════════════════════════ */
.raw {
  position: absolute;
  top: 9vh;
  left: 6%;
  right: 6%;
  padding: 1.4vh;
  border-radius: 1.2vh;
  background: var(--code-bg);
  font-size: clamp(0.5rem, 1.45vh, 0.95rem);
  font-weight: 700;
  overflow-wrap: anywhere;
  color: var(--code-text);
  opacity: 0;
  animation: appear 0.35s ease 0.5s both;
}
.dict {
  position: absolute;
  top: 24vh;
  left: 10%;
  right: 10%;
  display: flex;
  flex-direction: column;
  gap: 1.2vh;
  padding: 1.6vh;
  border-radius: 1.6vh;
  background: color-mix(in srgb, var(--sun) 40%, var(--bg));
  border: 3px solid var(--text);
  opacity: 0;
  animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) 1.5s both;
}
.dict-row {
  display: flex;
  align-items: center;
  gap: 1.2vh;
  min-width: 0;
}
.key {
  flex: none;
  padding: calc(0.25vh + 0.3em) 0.9vh;
  border-radius: 999px;
  background: var(--text);
  font-size: clamp(0.5rem, 1.4vh, 0.9rem);
  font-weight: 800;
  color: var(--bg);
}
.val {
  min-width: 0;
  overflow: hidden;
  padding: 0.7vh 1vh;
  border-radius: 0.8vh;
  background: var(--bg);
  border: 2px solid var(--text);
  font-size: clamp(0.5rem, 1.4vh, 0.9rem);
  font-weight: 700;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--text);
}
.stage-3 .row-status .val,
.stage-3 .row-message .val {
  animation: lit 0.8s ease both;
}
.stage-3 .row-status .val { animation-delay: 2.5s; }
.stage-3 .row-message .val { animation-delay: 2.9s; }
.stage-4 .raw,
.stage-4 .dict {
  opacity: 1;
  animation: none;
}

/* ═══ 4: live ══════════════════════════════════════════════════════════ */
.frame {
  position: absolute;
  top: 6.5vh;
  left: 12%;
  right: 12%;
  bottom: 8vh;
  overflow: hidden;
  border-radius: 2vh;
  background: var(--bg);
  border: 3px solid var(--text);
  animation: pop 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.35s both;
}
.photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.photo-enter-active {
  animation: photo-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.photo-leave-active {
  animation: vanish 0.3s ease both;
}
.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5vh;
  height: 5vh;
  translate: -50% -50%;
  border-radius: 999px;
  border: 0.6vh solid var(--border);
  border-top-color: var(--coral);
  animation: spin 0.8s linear infinite;
}
.offline {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1vh;
  font-size: clamp(0.6rem, 1.7vh, 1.1rem);
  font-weight: 800;
  color: var(--text-dim);
}
.offline-art {
  width: 12vh;
  height: 12vh;
}
.next {
  position: absolute;
  left: 50%;
  bottom: 2.4vh;
  display: flex;
  align-items: center;
  gap: 1vh;
  padding: 0.5vh 1.2vh 0.5vh 0.5vh;
  border-radius: 999px;
  background: var(--text);
  font-size: clamp(0.55rem, 1.5vh, 1rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--bg);
  translate: -50% 0;
}
.next code {
  min-width: 3vh;
  padding: 0.2vh 0.8vh;
  border-radius: 999px;
  background: var(--sun);
  text-align: center;
  color: var(--text);
}

/* ─── Keyframes ──────────────────────────────────────────────────────── */
@keyframes appear {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes vanish {
  from { opacity: 1; }
  to { opacity: 0; }
}
@keyframes pop {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes rise {
  from { opacity: 0; transform: translateY(1.6vh); }
  to { opacity: 1; transform: none; }
}
/* To the kitchen, wait, and back to Momo. */
@keyframes serve {
  0% { left: 32%; }
  35%, 50% { left: 60%; }
  85%, 100% { left: 22%; }
}
@keyframes carry-note {
  0%, 35% { opacity: 1; }
  40%, 100% { opacity: 0; }
}
@keyframes carry-plate {
  0%, 45% { opacity: 0; }
  50%, 100% { opacity: 1; }
}
@keyframes to-server {
  0% { opacity: 0; transform: none; }
  15% { opacity: 1; }
  85% { opacity: 1; transform: translateX(26vh); }
  100% { opacity: 0; transform: translateX(28vh); }
}
@keyframes to-client {
  0% { opacity: 0; transform: none; }
  15% { opacity: 1; }
  100% { opacity: 1; transform: translateX(-24vh); }
}
@keyframes lit {
  0% { box-shadow: 0 0 0 0 transparent; }
  35% { box-shadow: 0 0 0 0.6vh color-mix(in srgb, var(--lavender) 50%, transparent); }
  100% { box-shadow: 0 0 0 0 transparent; }
}
@keyframes photo-in {
  from { opacity: 0; transform: scale(1.06); }
  to { opacity: 1; transform: none; }
}
@keyframes spin {
  to { rotate: 360deg; }
}
</style>
