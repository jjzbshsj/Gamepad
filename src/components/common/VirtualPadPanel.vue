<script setup lang="ts">
import { computed } from 'vue'
import { CircleStop, Play, RotateCcw } from 'lucide-vue-next'
import { useGamepadHub } from '@/composables/useGamepadHub'
import { STANDARD_BUTTONS } from '@/utils/buttonMap'

const { virtual, demoMode, enableDemoMode } = useGamepadHub()
const circleActive = computed(() => virtual.activePreset.value === '左摇杆画圆')

function toggleCircle() {
  if (circleActive.value) {
    virtual.stopCircleDemo()
    return
  }
  enableDemoMode()
  virtual.startCircleDemo()
}
</script>

<template>
  <section class="glass-panel scan-overlay p-5">
    <div class="mb-4 flex items-center justify-between">
      <div>
        <p class="label-caps">VIRTUAL PAD</p>
        <h2 class="mt-1 text-[18px] font-semibold text-ink-50">虚拟手柄控制台</h2>
      </div>
      <div class="flex items-center gap-2">
        <span class="rounded-lg border border-neon/30 bg-neon/10 px-2 py-1 font-mono text-[10px] text-neon">
          {{ virtual.activePreset.value }}
        </span>
        <button type="button" class="neon-button !px-3 !py-1.5 !text-[11px]" @click="enableDemoMode">
          {{ demoMode ? '虚拟模式已启动' : '启动虚拟模式' }}
        </button>
      </div>
    </div>

    <p v-if="!demoMode" class="mb-4 text-xs leading-6 text-ink-400">
      当前未启用虚拟模式。点击「启动虚拟模式」后，所有测试页将使用虚拟手柄数据流。
    </p>

    <div class="grid grid-cols-4 gap-2 sm:grid-cols-8">
      <button
        v-for="button in STANDARD_BUTTONS"
        :key="button.id"
        type="button"
        class="focus-ring rounded-lg border px-1 py-2 font-mono text-[11px] transition-all active:scale-95"
        :class="virtual.buttons[button.index].pressed
          ? 'border-neon/60 bg-neon/20 text-neon shadow-glow'
          : 'border-white/10 bg-white/5 text-ink-400 hover:border-white/25'"
        @click="enableDemoMode()"
        @pointerdown="enableDemoMode(); virtual.press(button.index)"
        @pointerup="virtual.release(button.index)"
        @pointerleave="virtual.release(button.index)"
      >
        {{ button.label }}
      </button>
    </div>

    <div class="mt-5 grid gap-4 sm:grid-cols-2">
      <label v-for="axis in ['左摇杆 X', '左摇杆 Y', '右摇杆 X', '右摇杆 Y']" :key="axis" class="block">
        <span class="mb-1 flex justify-between font-mono text-[10px] text-ink-400">
          <span>{{ axis }}</span>
          <span>{{ virtual.axes[['左摇杆 X', '左摇杆 Y', '右摇杆 X', '右摇杆 Y'].indexOf(axis)].toFixed(2) }}</span>
        </span>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.01"
          class="w-full accent-[#00E5FF]"
          @input="enableDemoMode(); virtual.setAxis(['左摇杆 X', '左摇杆 Y', '右摇杆 X', '右摇杆 Y'].indexOf(axis), Number(($event.target as HTMLInputElement).value))"
        />
      </label>
    </div>

    <div class="mt-4 grid gap-4 sm:grid-cols-2">
      <label class="block">
        <span class="mb-1 flex justify-between font-mono text-[10px] text-ink-400">
          <span>LT 力度</span><span>{{ Math.round(virtual.buttons[6].value * 100) }}%</span>
        </span>
        <input type="range" min="0" max="100" class="w-full accent-[#00E5FF]" @input="enableDemoMode(); virtual.setTrigger(6, Number(($event.target as HTMLInputElement).value))" />
      </label>
      <label class="block">
        <span class="mb-1 flex justify-between font-mono text-[10px] text-ink-400">
          <span>RT 力度</span><span>{{ Math.round(virtual.buttons[7].value * 100) }}%</span>
        </span>
        <input type="range" min="0" max="100" class="w-full accent-[#00E5FF]" @input="enableDemoMode(); virtual.setTrigger(7, Number(($event.target as HTMLInputElement).value))" />
      </label>
    </div>

    <div class="mt-5 flex flex-wrap gap-2">
      <button type="button" class="neon-button !py-2 !text-xs" @click="toggleCircle">
        <Play v-if="!circleActive" class="h-3.5 w-3.5" />
        <CircleStop v-else class="h-3.5 w-3.5" />
        {{ circleActive ? '停止画圆' : '自动画圆' }}
      </button>
      <button type="button" class="ghost-button !py-2 !text-xs" @click="virtual.reset">
        <RotateCcw class="h-3.5 w-3.5" />
        重置虚拟手柄
      </button>
    </div>
  </section>
</template>
