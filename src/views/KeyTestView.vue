<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { Check, RotateCcw, ShieldCheck } from 'lucide-vue-next'
import { useGamepadHub } from '@/composables/useGamepadHub'
import {
  AXIS_INDEX,
  STANDARD_BUTTONS,
  ID_TO_LABEL,
  axisValue,
  buttonIdForLabel,
  dpadStates,
  isPressed,
  isSelectPressed,
  isStartPressed,
  triggerPercent,
} from '@/utils/buttonMap'
import { buttonLabels, testCopy } from '@/data/testCopy'
import GamepadModelPanel from '@/components/common/GamepadModelPanel.vue'
import StatCard from '@/components/common/StatCard.vue'

const { activeGamepad } = useGamepadHub()

const pressed = computed<Record<string, boolean>>(() => {
  const pad = activeGamepad.value
  const result: Record<string, boolean> = {}
  for (const button of STANDARD_BUTTONS) result[button.id] = isPressed(pad, button.index)
  result.SELECT = isSelectPressed(pad)
  result.START = isStartPressed(pad)
  const [up, down, left, right] = dpadStates(pad)
  result.UP = up
  result.DOWN = down
  result.LEFT = left
  result.RIGHT = right
  return result
})

const lt = computed(() => triggerPercent(activeGamepad.value, 6))
const rt = computed(() => triggerPercent(activeGamepad.value, 7))
const leftStick = computed(() => ({
  x: axisValue(activeGamepad.value, AXIS_INDEX.leftX),
  y: axisValue(activeGamepad.value, AXIS_INDEX.leftY),
}))
const rightStick = computed(() => ({
  x: axisValue(activeGamepad.value, AXIS_INDEX.rightX),
  y: axisValue(activeGamepad.value, AXIS_INDEX.rightY),
}))
const everTested = reactive<Record<string, boolean>>({})

watch(
  pressed,
  (map) => {
    for (const [id, value] of Object.entries(map)) if (value) everTested[ID_TO_LABEL[id] ?? id] = true
  },
  { deep: true, flush: 'sync' },
)

const testedCount = computed(() => buttonLabels.filter((label) => everTested[label]).length)
const progress = computed(() => Math.round((testedCount.value / buttonLabels.length) * 100))

function reset() {
  for (const label of buttonLabels) delete everTested[label]
}
</script>

<template>
  <section class="animate-slide-up">
    <div class="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="label-caps">MODULE 01 / BUTTON MATRIX</p>
        <h1 class="mt-1 text-[30px] font-bold text-ink-50">{{ testCopy.key.title }}</h1>
        <p class="mt-2 max-w-2xl text-sm leading-7 text-ink-400">{{ testCopy.key.description }}</p>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-12">
      <div class="flex flex-col gap-5 lg:col-span-7">
        <GamepadModelPanel
          title="按键实时状态"
          status="REALTIME"
          :pressed="pressed"
          :lt="lt"
          :rt="rt"
          :left-stick="leftStick"
          :right-stick="rightStick"
        />
        <div class="glass-panel p-5">
          <p class="label-caps mb-3">TRIGGER VALUE</p>
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div class="mb-2 flex justify-between font-mono text-[10px] text-ink-400">
                <span>LT</span><span class="stat-num text-neon">{{ lt }}%</span>
              </div>
              <div class="h-1.5 overflow-hidden rounded-full bg-void-800"><div class="h-full rounded-full bg-neon transition-all duration-75" :style="{ width: `${lt}%` }" /></div>
            </div>
            <div class="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div class="mb-2 flex justify-between font-mono text-[10px] text-ink-400">
                <span>RT</span><span class="stat-num text-neon">{{ rt }}%</span>
              </div>
              <div class="h-1.5 overflow-hidden rounded-full bg-void-800"><div class="h-full rounded-full bg-neon transition-all duration-75" :style="{ width: `${rt}%` }" /></div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-5 lg:col-span-5">
        <div class="grid grid-cols-3 gap-3">
          <StatCard label="已检测" :value="testedCount" unit="/ 16" tone="ok" />
          <StatCard label="完成度" :value="progress" unit="%" />
          <StatCard label="当前触发" :value="Object.values(pressed).filter(Boolean).length" unit="键" />
        </div>

        <div class="glass-panel p-5">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <p class="label-caps">RESULT MATRIX</p>
              <h2 class="mt-1 text-[18px] font-semibold text-ink-50">测试结果</h2>
            </div>
            <button type="button" class="ghost-button !px-3 !py-1.5 !text-xs" @click="reset">
              <RotateCcw class="h-3.5 w-3.5" :stroke-width="1.75" />
              重置
            </button>
          </div>
          <div class="grid grid-cols-4 gap-2">
            <div
              v-for="label in buttonLabels"
              :key="label"
              class="rounded-lg border px-2 py-3 text-center font-mono text-xs font-semibold transition-all duration-150"
              :class="pressed[buttonIdForLabel(label)]
                ? 'border-neon/70 bg-neon/20 text-neon shadow-glow'
                : everTested[label]
                  ? 'border-signal-ok/60 bg-signal-ok/15 text-signal-ok'
                  : 'border-white/10 bg-white/[0.03] text-ink-400'"
            >
              <Check v-if="everTested[label] && !pressed[buttonIdForLabel(label)]" class="mx-auto mb-0.5 h-3.5 w-3.5" :stroke-width="2" />
              {{ label }}
            </div>
          </div>
          <p class="mt-4 flex items-start gap-2 text-xs leading-6 text-ink-400">
            <ShieldCheck class="mt-1 h-3.5 w-3.5 shrink-0 text-signal-info" :stroke-width="1.75" />
            {{ testCopy.key.instruction }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
