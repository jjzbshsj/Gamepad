<script setup lang="ts">
import { Gamepad2 } from 'lucide-vue-next'
import GamepadSvg from './GamepadSvg.vue'

withDefaults(
  defineProps<{
    title?: string
    pressed?: Record<string, boolean>
    lt?: number
    rt?: number
    leftStick?: { x: number; y: number }
    rightStick?: { x: number; y: number }
    status?: string
  }>(),
  { title: '手柄模型', pressed: () => ({}), lt: 0, rt: 0, status: '' },
)
</script>

<template>
  <div class="glass-panel scan-overlay p-5">
    <div class="relative z-10 mb-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Gamepad2 class="h-4 w-4 text-neon" :stroke-width="1.75" />
        <div>
          <p class="label-caps">CONTROLLER MODEL</p>
          <h2 class="mt-0.5 text-[18px] font-semibold text-ink-50">{{ title }}</h2>
        </div>
      </div>
      <span v-if="status" class="font-mono text-[10px] text-ink-400">{{ status }}</span>
    </div>
    <div class="relative z-10 mx-auto aspect-[8/5] w-full max-w-[520px]">
      <GamepadSvg
        :pressed="pressed"
        :lt="lt"
        :rt="rt"
        :left-stick="leftStick"
        :right-stick="rightStick"
      />
    </div>
    <div class="relative z-10 mt-3 grid grid-cols-2 gap-3 border-t border-white/10 pt-3 font-mono text-[10px] text-ink-400">
      <span>左摇杆 {{ leftStick ? `${leftStick.x.toFixed(2)}, ${leftStick.y.toFixed(2)}` : '—' }}</span>
      <span class="text-right">右摇杆 {{ rightStick ? `${rightStick.x.toFixed(2)}, ${rightStick.y.toFixed(2)}` : '—' }}</span>
    </div>
  </div>
</template>
