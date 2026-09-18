<script setup lang="ts">
const { t, tm } = useI18n()
</script>

<template>
  <SlidesContentSlide :title="t('precourse.tuesday.title')">
    <p class="mb-5 font-bold">{{ t('precourse.tuesday.lead') }}</p>
    <ul>
      <li v-for="item in tm<string[]>('precourse.tuesday.items')" :key="item">{{ item }}</li>
    </ul>
    <p class="font-bold" style="color: var(--text);">{{ t('precourse.tuesday.footer') }}</p>
  </SlidesContentSlide>
</template>
