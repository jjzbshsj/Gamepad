<script setup lang="ts">
import { computed } from 'vue'
import { Gamepad2, Unplug } from 'lucide-vue-next'
import { useGamepadHub } from '@/composables/useGamepadHub'
import { globalTip } from '@/data/testCopy'

const { gamepads, selectedIndex, demoMode, select, slotGamepad } = useGamepadHub()

const slots = computed(() =>
  [0, 1, 2, 3].map((index) => ({
    index,
    gamepad: slotGamepad(index),
    active: demoMode.value ? index === 0 : selectedIndex.value === index,
  })),
)

const connectedCount = computed(() => (demoMode.value ? 1 : gamepads.value.length))
</script>

<template>
  <section class="animate-slide-up">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <p class="flex items-center gap-2 text-xs leading-6 text-signal-info">
        <Unplug class="h-4 w-4 shrink-0" :stroke-width="1.75" />
        {{ globalTip }}
      </p>
    </div>

    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <button
        v-for="slot in slots"
        :key="slot.index"
        type="button"
        class="focus-ring group relative overflow-hidden rounded-xl border px-4 py-4 text-left transition-all duration-200"
        :class="
          slot.active
            ? 'border-neon/50 bg-gradient-to-br from-neon/15 to-electric/5 shadow-glow'
            : 'border-white/10 bg-white/[0.03] hover:border-white/25'
        "
        @click="select(slot.index)"
      >
        <span class="flex items-center justify-between">
          <span class="label-caps">SLOT {{ slot.index + 1 }}</span>
          <Gamepad2
            class="h-4 w-4 transition-colors"
            :class="slot.gamepad ? 'text-signal-ok' : 'text-ink-400/50'"
            :stroke-width="1.75"
          />
        </span>
        <span class="mt-2 block text-sm font-semibold text-ink-50">手柄{{ slot.index + 1 }}</span>
        <span class="mt-0.5 block truncate text-xs text-ink-400">
          {{ slot.gamepad ? slot.gamepad.id : '暂无接入...' }}
        </span>
        <span
          v-if="slot.active"
          class="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-neon to-transparent"
        />
      </button>
    </div>
    <p class="mt-2 font-mono text-[11px] text-ink-400/70">CONNECTED {{ connectedCount }}/4</p>
  </section>
</template>
