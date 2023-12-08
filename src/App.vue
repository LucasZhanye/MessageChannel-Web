<script setup lang="ts">
import {onMounted} from 'vue'
import { Theme, ThemeKey } from './utils/api/model';

onMounted(() => {
  const html = document.querySelector('html');
  if (html) {
    const themeMode = localStorage.getItem(ThemeKey)
    if (themeMode === Theme.Dark) {
      html.classList.add(themeMode);
    } else {
      html.classList.add(Theme.Light);
    }
  }
}) 

</script>

<template>
  <router-view/>
</template>

<style scoped>

</style>
