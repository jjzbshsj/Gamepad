<script setup lang="ts">
import { Gamepad2 } from 'lucide-vue-next'
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 h-[var(--header-h)] border-b border-white/10 bg-void-950/85 backdrop-blur-xl">
    <div class="mx-auto flex h-full max-w-[1440px] items-center gap-6 px-6">
      <RouterLink to="/experiment/key" class="group flex shrink-0 items-center gap-3 focus-ring">
        <span class="relative grid h-10 w-10 place-items-center rounded-xl border border-neon/40 bg-gradient-to-br from-neon/25 to-electric/10 shadow-glow">
          <Gamepad2 class="h-5 w-5 text-neon" :stroke-width="1.75" />
          <span class="absolute -right-1 -top-1 h-2 w-2 animate-pulse-glow rounded-full bg-neon" />
        </span>
        <span class="leading-none">
          <span class="block text-[15px] font-bold tracking-[0.08em] text-ink-50">GAMEPAD</span>
          <span class="label-caps !text-[9px]">DIAGNOSTICS LAB</span>
        </span>
      </RouterLink>

    </div>
  </header>
</template>
