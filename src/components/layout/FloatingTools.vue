<script setup lang="ts">
import { ArrowUp } from 'lucide-vue-next'

function backToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <aside class="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 md:flex">
    <button type="button" class="tool-button" title="返回顶部" @click="backToTop">
      <ArrowUp class="h-4 w-4" :stroke-width="1.75" />
    </button>
  </aside>
</template>

<style scoped>
.tool-button {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 12px;
  border: 1px solid rgb(255 255 255 / 0.12);
  background: rgb(17 26 46 / 0.8);
  color: #94a3b8;
  backdrop-filter: blur(12px);
  transition: all 0.2s ease;
}

.tool-button:hover {
  border-color: rgb(0 229 255 / 0.5);
  color: #00e5ff;
  box-shadow: 0 0 20px rgb(0 229 255 / 0.22);
  transform: translateX(-3px);
}
</style>
