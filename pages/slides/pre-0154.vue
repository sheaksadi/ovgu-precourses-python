<script setup lang="ts">
const { t, tm } = useI18n()
</script>

<template>
  <SlidesContentSlide :title="t('precourse.monday.title')">
    <p class="mb-5 font-bold">{{ t('precourse.monday.lead') }}</p>
    <ul>
      <li v-for="item in tm<string[]>('precourse.monday.items')" :key="item">{{ item }}</li>
    </ul>
    <p class="font-bold" style="color: var(--text);">{{ t('precourse.monday.footer') }}</p>
  </SlidesContentSlide>
</template>
