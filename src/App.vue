<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'
import AppHeader from '@/components/layout/AppHeader.vue'
import TestTabs from '@/components/layout/TestTabs.vue'
import GamepadSlots from '@/components/layout/GamepadSlots.vue'
import FloatingTools from '@/components/layout/FloatingTools.vue'
import VirtualPadPanel from '@/components/common/VirtualPadPanel.vue'
</script>

<template>
  <div class="min-h-screen pt-[var(--header-h)]">
    <AppHeader />

    <main class="mx-auto max-w-[1440px] px-4 pb-16 pt-8 sm:px-6">
      <TestTabs class="mb-8" />
      <GamepadSlots class="mb-10" />

      <RouterView />

      <details class="group mt-10 rounded-2xl border border-white/10 bg-white/[0.02]">
        <summary
          class="flex cursor-pointer list-none items-center gap-2 px-5 py-4 text-sm text-ink-400 transition-colors hover:text-neon"
        >
          <ChevronRight class="h-4 w-4 transition-transform group-open:rotate-90" :stroke-width="1.75" />
          虚拟手柄控制台（无硬件时展开，可模拟全部测试流程）
        </summary>
        <div class="px-5 pb-5">
          <VirtualPadPanel />
        </div>
      </details>

    </main>

    <FloatingTools />
  </div>
</template>
