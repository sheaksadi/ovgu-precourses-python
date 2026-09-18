<script setup lang="ts">
const { t, tm } = useI18n()
</script>

<template>
  <SlidesContentSlide :title="t('precourse.project.title')">
    <p class="mb-5 font-bold">{{ t('precourse.project.lead') }}</p>
    <ul>
      <li v-for="item in tm<string[]>('precourse.project.items')" :key="item">{{ item }}</li>
    </ul>
    <p class="mb-5">{{ t('precourse.project.routes') }}</p>
    <p class="font-bold" style="color: var(--text);">{{ t('precourse.project.footer') }}</p>
  </SlidesContentSlide>
</template>
