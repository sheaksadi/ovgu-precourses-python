<script setup lang="ts">
/**
 * The door in front of the three views that drive the talk.
 * Auto-imported as `<DeckAdminGate>`; wrap the page in it.
 *
 * Until the word is right the page's own content is not rendered at all, so
 * nothing behind it connects, counts or claims a role. `useAdmin` remembers
 * the answer per device, which is why this is asked once and not on every
 * navigation between the presenter view and the control panel.
 *
 * Text lives in `admin.*` in `locales/`.
 */
import { onMounted, ref } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useAdmin } from '~/composables/useAdmin'

const { t } = useI18n()
const admin = useAdmin()

const value = ref('')
const wrong = ref(false)
const field = ref<HTMLInputElement | null>(null)

onMounted(() => {
  admin.adopt()
  if (!admin.unlocked.value) field.value?.focus()
})

const submit = () => {
  if (admin.unlock(value.value)) {
    value.value = ''
    wrong.value = false
    return
  }
  wrong.value = true
  value.value = ''
  field.value?.focus()
}
</script>

<template>
  <slot v-if="admin.unlocked.value" />

  <main v-else class="gate">
    <form class="gate-card" :class="{ 'is-wrong': wrong }" @submit.prevent="submit">
      <span class="gate-icon"><Icon name="lucide:lock" /></span>
      <h1 class="gate-title">{{ t('admin.title') }}</h1>
      <p class="gate-lead">{{ t('admin.lead') }}</p>

      <label class="gate-label" for="admin-password">{{ t('admin.label') }}</label>
      <input
        id="admin-password"
        ref="field"
        v-model="value"
        class="gate-input"
        type="password"
        inputmode="numeric"
        autocomplete="off"
        :placeholder="t('admin.placeholder')"
        @input="wrong = false"
      >

      <p v-if="wrong" class="gate-wrong">{{ t('admin.wrong') }}</p>

      <button type="submit" class="gate-button">{{ t('admin.enter') }}</button>
      <NuxtLink to="/" class="gate-back">{{ t('admin.back') }}</NuxtLink>
    </form>
  </main>
</template>

<style scoped>
.gate {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 2rem 1.25rem;
  background: var(--bg);
  font-family: var(--font-text);
  color: var(--text);
}

.gate-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.6rem;
  width: 100%;
  max-width: 22rem;
  padding: 1.8rem;
  border-radius: 1.4rem;
  background: var(--bg-off);
  border: 2px solid var(--border);
}
.gate-card.is-wrong {
  border-color: var(--coral);
  animation: shake 0.3s ease;
}

.gate-icon {
  display: grid;
  place-items: center;
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 999px;
  background: var(--text);
  font-size: 1.3rem;
  color: var(--bg);
}

.gate-title {
  margin-top: 0.6rem;
  font-size: 1.5rem;
  font-weight: 900;
}

.gate-lead {
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--text-dim);
}

.gate-label {
  margin-top: 0.8rem;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.gate-input {
  padding: 0.8rem 1rem;
  border-radius: 0.9rem;
  background: var(--bg);
  border: 2px solid var(--border);
  font-family: var(--font-code);
  font-size: 1.1rem;
  letter-spacing: 0.3em;
  color: var(--text);
}
.gate-input:focus {
  outline: none;
  border-color: var(--text);
}

.gate-wrong {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--coral);
}

.gate-button {
  margin-top: 0.4rem;
  padding: 0.8rem 1rem;
  border-radius: 999px;
  background: var(--text);
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--bg);
  cursor: pointer;
}

.gate-back {
  margin-top: 0.3rem;
  font-size: 0.78rem;
  text-align: center;
  color: var(--text-muted);
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

@keyframes shake {
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
</style>
