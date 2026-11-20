<script setup lang="ts">
import { Crosshair, Gauge, Keyboard, Move, SlidersHorizontal, Waves } from 'lucide-vue-next'

const tabs = [
  { path: '/experiment/key', label: '按键可用性测试', short: '按键', icon: Keyboard },
  { path: '/experiment/direction', label: '方向键串键测试', short: '串键', icon: Move },
  { path: '/experiment/tigger', label: '扳机测试', short: '扳机', icon: SlidersHorizontal },
  { path: '/experiment/joystick', label: '摇杆死区测试', short: '摇杆', icon: Crosshair },
  { path: '/experiment/vibrate', label: '震动测试', short: '震动', icon: Waves },
  { path: '/experiment/diagnostics', label: '摇杆回报率测试', short: '回报率', icon: Gauge },
]
</script>

<template>
  <nav class="relative -mx-1 flex flex-wrap gap-2" aria-label="测试项目">
    <RouterLink
      v-for="(tab, index) in tabs"
      :key="tab.path"
      :to="tab.path"
      class="focus-ring group relative flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200"
      :class="[
        $route.path === tab.path
          ? 'border-neon/50 bg-gradient-to-r from-neon/20 to-electric/10 text-neon shadow-glow'
          : 'border-white/10 bg-white/[0.04] text-ink-400 hover:-translate-y-0.5 hover:border-white/25 hover:text-ink-50',
      ]"
      :style="{ animationDelay: `${index * 45}ms` }"
    >
      <component :is="tab.icon" class="h-4 w-4" :stroke-width="1.75" />
      <span class="hidden sm:inline">{{ tab.label }}</span>
      <span class="sm:hidden">{{ tab.short }}</span>
      <span
        v-if="$route.path === tab.path"
        class="absolute -bottom-1 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-neon shadow-glow"
      />
    </RouterLink>
  </nav>
</template>
