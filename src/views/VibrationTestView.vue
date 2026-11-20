<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { CircleStop, Waves, Zap } from 'lucide-vue-next'
import { useGamepadHub } from '@/composables/useGamepadHub'
import { AXIS_INDEX, axisValue, buttonValue, triggerPercent } from '@/utils/buttonMap'
import { testCopy } from '@/data/testCopy'
import GamepadModelPanel from '@/components/common/GamepadModelPanel.vue'
import StatCard from '@/components/common/StatCard.vue'

const { activeGamepad } = useGamepadHub()

const strong = ref(0.6)
const weak = ref(0.35)
const autoFollow = ref(true)
const lt = ref(0)
const rt = ref(0)
const lastPlayed = ref(0)
const playCount = ref(0)

type VibrationActuator = {
  playEffect?: (type: string, params: Record<string, number>) => Promise<string>
  reset?: () => void
}

function actuatorOf(pad: Gamepad | null): VibrationActuator | null {
  return (pad as unknown as { vibrationActuator?: VibrationActuator } | null)?.vibrationActuator ?? null
}

const supported = computed(() => Boolean(actuatorOf(activeGamepad.value)?.playEffect))

function play(strongMagnitude: number, weakMagnitude: number, duration = 220) {
  const actuator = actuatorOf(activeGamepad.value)
  if (!actuator?.playEffect) return
  playCount.value += 1
  actuator
    .playEffect('dual-rumble', {
      duration,
      startDelay: 0,
      strongMagnitude: Math.min(1, Math.max(0, strongMagnitude)),
      weakMagnitude: Math.min(1, Math.max(0, weakMagnitude)),
    })
    .catch((error: unknown) => console.error('[vibration] playEffect failed', error))
}

function stop() {
  actuatorOf(activeGamepad.value)?.reset?.()
}

watch(
  activeGamepad,
  (pad) => {
    lt.value = triggerPercent(pad, 6)
    rt.value = triggerPercent(pad, 7)
    if (!autoFollow.value || !supported.value) return
    const force = Math.max(buttonValue(pad, 6), buttonValue(pad, 7))
    if (force < 0.04) return
    const now = performance.now()
    if (now - lastPlayed.value < 120) return
    lastPlayed.value = now
    play(force * strong.value, force * weak.value, 140)
  },
  { flush: 'sync' },
)

const pressed = computed<Record<string, boolean>>(() => ({ LT: lt.value > 2, RT: rt.value > 2 }))
const leftStick = computed(() => ({
  x: axisValue(activeGamepad.value, AXIS_INDEX.leftX),
  y: axisValue(activeGamepad.value, AXIS_INDEX.leftY),
}))
const rightStick = computed(() => ({
  x: axisValue(activeGamepad.value, AXIS_INDEX.rightX),
  y: axisValue(activeGamepad.value, AXIS_INDEX.rightY),
}))
</script>

<template>
  <section class="animate-slide-up">
    <div class="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="label-caps">MODULE 05 / HAPTIC FEEDBACK</p>
        <h1 class="mt-1 text-[30px] font-bold text-ink-50">{{ testCopy.vibration.title }}</h1>
        <p class="mt-2 max-w-2xl text-sm leading-7 text-ink-400">{{ testCopy.vibration.description }}</p>
      </div>
    </div>

    <div class="mb-5 grid gap-3 sm:grid-cols-3">
      <StatCard label="震动支持" :value="supported ? '已就绪' : '当前浏览器不支持'" :tone="supported ? 'ok' : 'warn'" />
      <StatCard label="LT 力度" :value="lt" unit="%" tone="ok" />
      <StatCard label="RT 力度" :value="rt" unit="%" tone="ok" :hint="`已触发 ${playCount} 次`" />
    </div>

    <div class="grid gap-6 lg:grid-cols-12">
      <div class="flex flex-col gap-5 lg:col-span-7">
        <div class="glass-panel p-5">
          <div class="mb-4 flex items-center gap-2">
            <Waves class="h-4 w-4 text-neon" :stroke-width="1.75" />
            <h2 class="text-[18px] font-semibold text-ink-50">震动强度</h2>
          </div>
          <label class="mb-4 block">
            <span class="mb-1 flex justify-between font-mono text-[11px] text-ink-400"><span>强马达 / 左</span><span>{{ Math.round(strong * 100) }}%</span></span>
            <input v-model.number="strong" type="range" min="0" max="1" step="0.05" class="w-full accent-[#00E5FF]" />
          </label>
          <label class="block">
            <span class="mb-1 flex justify-between font-mono text-[11px] text-ink-400"><span>弱马达 / 右</span><span>{{ Math.round(weak * 100) }}%</span></span>
            <input v-model.number="weak" type="range" min="0" max="1" step="0.05" class="w-full accent-[#00E5FF]" />
          </label>
          <label class="mt-4 flex cursor-pointer items-center gap-2 text-xs text-ink-400">
            <input v-model="autoFollow" type="checkbox" class="h-4 w-4 accent-[#00E5FF]" />
            按压扳机时自动联动震动强度
          </label>
        </div>

        <div class="glass-panel p-5">
          <p class="label-caps">MANUAL TRIGGER</p>
          <h2 class="mb-4 mt-1 text-[18px] font-semibold text-ink-50">手动测试</h2>
          <div class="grid grid-cols-2 gap-2">
            <button type="button" class="neon-button !py-2 !text-xs" @click="play(strong, 0)"><Zap class="h-3.5 w-3.5" :stroke-width="1.75" />左马达</button>
            <button type="button" class="neon-button !py-2 !text-xs" @click="play(0, weak)"><Zap class="h-3.5 w-3.5" :stroke-width="1.75" />右马达</button>
            <button type="button" class="neon-button !py-2 !text-xs" @click="play(strong, weak, 600)"><Waves class="h-3.5 w-3.5" :stroke-width="1.75" />双马达长震</button>
            <button type="button" class="ghost-button !py-2 !text-xs" @click="stop"><CircleStop class="h-3.5 w-3.5" :stroke-width="1.75" />停止</button>
          </div>
          <p v-if="!supported" class="mt-4 rounded-lg border border-signal-warn/30 bg-signal-warn/5 px-3 py-2 text-xs leading-6 text-signal-warn">
            当前手柄或浏览器未提供 vibrationActuator。可继续使用虚拟模式查看界面流程，或使用参考站桌面工具进行精确震动测试。
          </p>
        </div>
        <p class="px-1 text-xs leading-6 text-ink-400">{{ testCopy.vibration.instruction }}</p>
      </div>

      <GamepadModelPanel
        class="lg:col-span-5"
        title="震动联动模型"
        :status="supported ? 'RUMBLE READY' : 'RUMBLE UNAVAILABLE'"
        :pressed="pressed"
        :lt="lt"
        :rt="rt"
        :left-stick="leftStick"
        :right-stick="rightStick"
      />
    </div>
  </section>
</template>
