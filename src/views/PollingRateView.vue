<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Gauge, Play, RotateCcw, Square } from 'lucide-vue-next'
import { useGamepadHub } from '@/composables/useGamepadHub'
import { usePollingRate } from '@/composables/usePollingRate'
import { usePlotlyChart } from '@/composables/usePlotlyChart'
import { AXIS_INDEX, axisValue } from '@/utils/buttonMap'
import { testCopy } from '@/data/testCopy'
import GamepadModelPanel from '@/components/common/GamepadModelPanel.vue'
import StatCard from '@/components/common/StatCard.vue'

const { activeGamepad } = useGamepadHub()
const { target, count, collecting, progress, summary, histogram, setTarget, start, reset, push, targets } = usePollingRate()
const { container, render } = usePlotlyChart()

type StickMode = 'left' | 'right' | 'both'
const stickMode = ref<StickMode>('left')
const stickOptions: { value: StickMode; label: string }[] = [
  { value: 'left', label: '左摇杆' },
  { value: 'right', label: '右摇杆' },
  { value: 'both', label: '双摇杆' },
]

function sampledAxes(pad: Gamepad | null): number[] {
  const axes = [AXIS_INDEX.leftX, AXIS_INDEX.leftY, AXIS_INDEX.rightX, AXIS_INDEX.rightY]
  if (stickMode.value === 'left') return axes.slice(0, 2).map((index) => axisValue(pad, index))
  if (stickMode.value === 'right') return axes.slice(2, 4).map((index) => axisValue(pad, index))
  return axes.map((index) => axisValue(pad, index))
}

function selectStick(mode: StickMode) {
  stickMode.value = mode
  reset()
}

watch(
  activeGamepad,
  (pad) => push(performance.now(), sampledAxes(pad)),
  { flush: 'sync' },
)

watch([histogram, summary], ([data, stats]) =>
  render(data.labels, data.values, stats.avgHz > 0 ? 1000 / stats.avgHz : undefined),
)

const stickOffset = computed(() => ({
  x: axisValue(activeGamepad.value, AXIS_INDEX.leftX),
  y: axisValue(activeGamepad.value, AXIS_INDEX.leftY),
}))
const rightStick = computed(() => ({
  x: axisValue(activeGamepad.value, AXIS_INDEX.rightX),
  y: axisValue(activeGamepad.value, AXIS_INDEX.rightY),
}))

const rateTone = computed<'default' | 'ok' | 'warn'>(() => {
  if (!summary.value.count) return 'default'
  return summary.value.avgHz >= 90 ? 'ok' : 'warn'
})
</script>

<template>
  <section class="animate-slide-up">
    <div class="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="label-caps">MODULE 06 / POLLING RATE</p>
        <h1 class="mt-1 text-[30px] font-bold text-ink-50">{{ testCopy.diagnostics.title }}</h1>
        <p class="mt-2 max-w-2xl text-sm leading-7 text-ink-400">{{ testCopy.diagnostics.description }}</p>
      </div>
    </div>

    <div class="mb-5 grid gap-3 sm:grid-cols-4">
      <StatCard label="平均回报率" :value="summary.avgHz.toFixed(1)" unit="Hz" :tone="rateTone" hint="浏览器采样为近似值" />
      <StatCard label="中位间隔" :value="summary.p50Ms.toFixed(2)" unit="ms" />
      <StatCard label="P95 间隔" :value="summary.p95Ms.toFixed(2)" unit="ms" />
      <StatCard label="有效样本" :value="count" unit="/ " + String(target) :hint="`间隔范围 ${summary.minMs.toFixed(1)} ~ ${summary.maxMs.toFixed(1)} ms`" />
    </div>

    <div class="grid gap-6 lg:grid-cols-12">
      <div class="flex flex-col gap-5 lg:col-span-6">
        <div class="glass-panel p-5">
          <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="label-caps">SAMPLE CONFIG</p>
              <h2 class="mt-1 text-[18px] font-semibold text-ink-50">统计次数</h2>
            </div>
            <div class="flex gap-2">
              <button
                v-for="option in targets"
                :key="option"
                type="button"
                class="focus-ring rounded-lg border px-3 py-1.5 font-mono text-xs transition-all"
                :class="target === option
                  ? 'border-neon/60 bg-neon/15 text-neon shadow-glow'
                  : 'border-white/10 bg-white/5 text-ink-400 hover:text-ink-50'"
                @click="setTarget(option)"
              >
                {{ option }}
              </button>
            </div>
          </div>

          <div class="mb-4 flex flex-wrap items-center gap-2">
            <span class="label-caps mr-1">采样摇杆</span>
            <button
              v-for="option in stickOptions"
              :key="option.value"
              type="button"
              class="focus-ring rounded-lg border px-3 py-1.5 text-xs transition-all"
              :class="stickMode === option.value
                ? 'border-neon/60 bg-neon/15 text-neon shadow-glow'
                : 'border-white/10 bg-white/5 text-ink-400 hover:text-ink-50'"
              @click="selectStick(option.value)"
            >
              {{ option.label }}
            </button>
          </div>

          <div class="mb-2 flex justify-between font-mono text-[11px] text-ink-400">
            <span>采样进度</span><span>{{ progress }}%</span>
          </div>
          <div class="h-2 overflow-hidden rounded-full bg-void-800">
            <div class="h-full rounded-full bg-gradient-to-r from-neon to-electric transition-all duration-150" :style="{ width: `${progress}%` }" />
          </div>

          <div class="mt-5 flex flex-wrap gap-2">
            <button type="button" class="neon-button !py-2 !text-xs" :disabled="collecting" @click="start">
              <Play class="h-3.5 w-3.5" :stroke-width="1.75" />
              开始统计
            </button>
            <button type="button" class="ghost-button !py-2 !text-xs" :disabled="!collecting" @click="collecting = false">
              <Square class="h-3.5 w-3.5" :stroke-width="1.75" />
              停止
            </button>
            <button type="button" class="ghost-button !py-2 !text-xs" @click="reset">
              <RotateCcw class="h-3.5 w-3.5" :stroke-width="1.75" />
              重置
            </button>
          </div>
        </div>

        <div class="glass-panel p-5">
          <div class="mb-2 flex items-center gap-2">
            <Gauge class="h-4 w-4 text-neon" :stroke-width="1.75" />
            <h2 class="text-[18px] font-semibold text-ink-50">回报间隔分布</h2>
          </div>
          <div
            ref="container"
            class="h-52 w-full"
            role="img"
            :aria-label="`回报间隔分布直方图，平均回报率 ${summary.avgHz.toFixed(1)} Hz，共 ${count} 个样本`"
          />
          <p class="mt-2 text-[11px] leading-6 text-ink-400">
            横轴为相邻有效回报的间隔（ms），柱形越高代表该间隔出现越频繁；间隔越小，回报率越高。浏览器 rAF 受显示器刷新率影响，精确结果请使用桌面校准工具。
          </p>
        </div>
      </div>

      <GamepadModelPanel
        class="lg:col-span-6"
        title="回报率联动模型"
        :status="collecting ? 'SAMPLING' : 'IDLE'"
        :left-stick="stickOffset"
        :right-stick="rightStick"
      />
    </div>
  </section>
</template>
