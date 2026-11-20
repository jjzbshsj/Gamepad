<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Activity, Gauge, Info } from 'lucide-vue-next'
import { useGamepadHub } from '@/composables/useGamepadHub'
import { AXIS_INDEX, axisValue, buttonValue, triggerPercent } from '@/utils/buttonMap'
import { testCopy } from '@/data/testCopy'
import GamepadModelPanel from '@/components/common/GamepadModelPanel.vue'
import StatCard from '@/components/common/StatCard.vue'

const { activeGamepad } = useGamepadHub()

const lt = ref(0)
const rt = ref(0)
const historyLt = ref<number[]>([])
const historyRt = ref<number[]>([])
const triggerType = ref('等待按压')
const deadzone = ref(0)
const intermediates = new Set<number>()
let minNonZero = 100
let wasPressed = false

watch(activeGamepad, (pad) => {
  const rawLt = buttonValue(pad, 6)
  const rawRt = buttonValue(pad, 7)
  lt.value = triggerPercent(pad, 6)
  rt.value = triggerPercent(pad, 7)

  historyLt.value = [...historyLt.value, lt.value].slice(-48)
  historyRt.value = [...historyRt.value, rt.value].slice(-48)

  const active = Math.max(rawLt, rawRt)
  if (active > 0.02 && rawLt * rawRt < 0.98) {
    const percent = Math.round(active * 100)
    if (percent > 0) minNonZero = Math.min(minNonZero, percent)
    if (percent > 4 && percent < 96) intermediates.add(Math.round(percent / 5))
    wasPressed = true
  } else if (wasPressed && active < 0.02) {
    triggerType.value = intermediates.size >= 3 ? '线性扳机' : '非线性扳机'
    deadzone.value = minNonZero === 100 ? 0 : minNonZero
    intermediates.clear()
    minNonZero = 100
    wasPressed = false
  }
}, { flush: 'sync' })

const typeTone = computed(() => (triggerType.value === '线性扳机' ? 'ok' : triggerType.value === '非线性扳机' ? 'warn' : 'default') as 'ok' | 'warn' | 'default')

const leftStick = computed(() => ({
  x: axisValue(activeGamepad.value, AXIS_INDEX.leftX),
  y: axisValue(activeGamepad.value, AXIS_INDEX.leftY),
}))
const rightStick = computed(() => ({
  x: axisValue(activeGamepad.value, AXIS_INDEX.rightX),
  y: axisValue(activeGamepad.value, AXIS_INDEX.rightY),
}))
const pressed = computed<Record<string, boolean>>(() => ({ LT: lt.value > 2, RT: rt.value > 2 }))
</script>

<template>
  <section class="animate-slide-up">
    <div class="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="label-caps">MODULE 03 / ANALOG TRIGGER</p>
        <h1 class="mt-1 text-[30px] font-bold text-ink-50">{{ testCopy.trigger.title }}</h1>
        <p class="mt-2 max-w-2xl text-sm leading-7 text-ink-400">{{ testCopy.trigger.description }}</p>
      </div>
    </div>

    <div class="mb-5 grid gap-3 sm:grid-cols-3">
      <StatCard label="LT 当前值" :value="lt" unit="%" tone="ok" />
      <StatCard label="RT 当前值" :value="rt" unit="%" tone="ok" />
      <StatCard label="扳机类型" :value="triggerType" :tone="typeTone" :hint="`估算死区 ${deadzone}%`" />
    </div>

    <div class="grid gap-6 lg:grid-cols-12">
      <div class="flex flex-col gap-5 lg:col-span-7">
        <div class="glass-panel p-5">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <p class="label-caps">TRAVEL CURVE</p>
              <h2 class="mt-1 text-[18px] font-semibold text-ink-50">扳机行程</h2>
            </div>
            <Activity class="h-5 w-5 text-neon" :stroke-width="1.75" />
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div v-for="trigger in [{ name: 'LT', value: lt, history: historyLt }, { name: 'RT', value: rt, history: historyRt }]" :key="trigger.name" class="text-center">
              <div class="relative mx-auto flex h-56 w-24 items-end overflow-hidden rounded-xl border border-white/10 bg-void-950/60">
                <div class="absolute inset-0 flex flex-col justify-between py-2">
                  <span v-for="line in 5" :key="line" class="h-px bg-white/5" />
                </div>
                <div
                  class="relative w-full rounded-t-lg bg-gradient-to-t from-electric/40 via-electric/70 to-neon shadow-glow transition-[height] duration-75"
                  :style="{ height: `${trigger.value}%` }"
                />
                <span class="stat-num absolute inset-0 grid place-items-center text-2xl text-ink-50">{{ trigger.value }}</span>
              </div>
              <p class="mt-3 font-mono text-xs tracking-widest text-ink-400">{{ trigger.name }}</p>
              <svg viewBox="0 0 100 28" class="mt-2 h-8 w-full" preserveAspectRatio="none">
                <polyline
                  :points="trigger.history.map((value, index) => `${(index / 47) * 100},${28 - value * 0.28}`).join(' ')"
                  fill="none"
                  stroke="#00E5FF"
                  stroke-width="1.2"
                  vector-effect="non-scaling-stroke"
                />
              </svg>
            </div>
          </div>
          <p class="mt-4 text-center text-xs text-ink-400">缓慢按下扳机，观察柱状图是否经过中间数值。</p>
        </div>

        <div class="glass-panel p-5">
          <div class="mb-3 flex items-center gap-2">
            <Gauge class="h-4 w-4 text-neon" :stroke-width="1.75" />
            <h2 class="text-[18px] font-semibold text-ink-50">线性 / 非线性扳机</h2>
          </div>
          <p class="text-sm leading-7 text-ink-400">{{ testCopy.trigger.linearNote }}</p>
        </div>
        <div class="glass-panel p-5">
          <div class="mb-3 flex items-center gap-2">
            <Info class="h-4 w-4 text-signal-warn" :stroke-width="1.75" />
            <h2 class="text-[18px] font-semibold text-ink-50">扳机死区</h2>
          </div>
          <p class="text-sm leading-7 text-ink-400">{{ testCopy.trigger.deadzoneNote }}</p>
        </div>
      </div>

      <GamepadModelPanel
        class="lg:col-span-5"
        title="扳机联动模型"
        :pressed="pressed"
        :lt="lt"
        :rt="rt"
        :left-stick="leftStick"
        :right-stick="rightStick"
      />
    </div>
  </section>
</template>
