<script setup lang="ts">
const { t, tm } = useI18n()
</script>

<template>
  <SlidesContentSlide :title="t('precourse.overview.title')">
    <p class="mb-5 font-bold">{{ t('precourse.overview.lead') }}</p>
    <ul>
      <li v-for="item in tm<string[]>('precourse.overview.items')" :key="item">{{ item }}</li>
    </ul>
    <p class="mb-5">{{ t('precourse.overview.routes') }}</p>
    <p class="font-bold" style="color: var(--text);">{{ t('precourse.overview.footer') }}</p>
  </SlidesContentSlide>
</template>
