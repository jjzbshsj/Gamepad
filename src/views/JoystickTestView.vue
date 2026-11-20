<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { CircleStop, Crosshair, Play, RotateCcw, ZoomIn, ZoomOut } from 'lucide-vue-next'
import { useGamepadHub } from '@/composables/useGamepadHub'
import { AXIS_INDEX, axisValue } from '@/utils/buttonMap'
import { circleErrorRate, clamp } from '@/utils/stats'
import { testCopy } from '@/data/testCopy'
import GamepadModelPanel from '@/components/common/GamepadModelPanel.vue'
import StatCard from '@/components/common/StatCard.vue'

interface Point {
  x: number
  y: number
}

const { activeGamepad } = useGamepadHub()

const left = ref<Point>({ x: 0, y: 0 })
const right = ref<Point>({ x: 0, y: 0 })
const zoom = ref([1, 1])
const centerRange = ref([0, 0])
const customLeft = ref(0)
const customRight = ref(0)
const circleActive = ref(false)
const trajectory = ref<Point[]>([])

watch(
  activeGamepad,
  (pad) => {
    left.value = { x: axisValue(pad, AXIS_INDEX.leftX), y: axisValue(pad, AXIS_INDEX.leftY) }
    right.value = { x: axisValue(pad, AXIS_INDEX.rightX), y: axisValue(pad, AXIS_INDEX.rightY) }
    if (circleActive.value && Math.hypot(left.value.x, left.value.y) > 0.08) {
      trajectory.value = [...trajectory.value, { ...left.value }].slice(-600)
    }
  },
  { flush: 'sync' },
)

const errorRate = computed(() => circleErrorRate(trajectory.value))
const pointText = (point: Point) => `(${point.x.toFixed(5)} , ${point.y.toFixed(5)})`
const rawAxes = computed(() =>
  (activeGamepad.value?.axes ?? []).map((value) => value.toFixed(2)).join(' / ') || '无数据',
)

function changeZoom(index: number, delta: number) {
  zoom.value[index] = clamp(zoom.value[index] + delta, 0.5, 3)
}

function applyCenterRange() {
  centerRange.value = [clamp(customLeft.value, 0, 100), clamp(customRight.value, 0, 100)]
}

function toggleCircle() {
  circleActive.value = !circleActive.value
  if (!circleActive.value) return
  trajectory.value = []
}

function reset() {
  trajectory.value = []
  circleActive.value = false
  centerRange.value = [0, 0]
  customLeft.value = 0
  customRight.value = 0
  zoom.value = [1, 1]
}
</script>

<template>
  <section class="animate-slide-up">
    <div class="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="label-caps">MODULE 04 / ANALOG STICK DEADZONE</p>
        <h1 class="mt-1 text-[30px] font-bold text-ink-50">{{ testCopy.joystick.title }}</h1>
        <p class="mt-2 max-w-2xl text-sm leading-7 text-ink-400">{{ testCopy.joystick.description }}</p>
      </div>
    </div>

    <div class="mb-5 grid gap-3 sm:grid-cols-3">
      <StatCard label="左摇杆坐标" :value="left.x.toFixed(3)" :hint="`Y ${left.y.toFixed(3)}`" />
      <StatCard label="右摇杆坐标" :value="right.x.toFixed(3)" :hint="`Y ${right.y.toFixed(3)}`" />
      <StatCard label="画圆错误率" :value="errorRate.toFixed(2)" unit="%" :tone="trajectory.length > 0 ? (errorRate < 12 ? 'ok' : 'warn') : 'default'" :hint="`轨迹采样 ${trajectory.length} 点`" />
    </div>

    <div class="grid gap-6 lg:grid-cols-12">
      <div class="flex flex-col gap-5 lg:col-span-7">
        <div class="glass-panel scan-overlay p-5">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <p class="label-caps">STICK POSITION</p>
              <h2 class="mt-1 text-[18px] font-semibold text-ink-50">摇杆实时坐标</h2>
            </div>
            <Crosshair class="h-5 w-5 text-neon" :stroke-width="1.75" />
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <div v-for="(stick, index) in [left, right]" :key="index">
              <p class="mb-2 text-center font-mono text-xs text-neon">{{ pointText(stick) }}</p>
              <div class="relative mx-auto aspect-square w-full max-w-[260px]">
                <svg viewBox="-110 -110 220 220" class="h-full w-full">
                  <circle r="100" fill="#0C1526" stroke="#2B4268" stroke-width="1.5" />
                  <circle r="66" fill="none" stroke="#1E3050" stroke-dasharray="3 5" />
                  <circle r="33" fill="none" stroke="#1E3050" stroke-dasharray="3 5" />
                  <line x1="-100" x2="100" stroke="#243A5C" stroke-width="1" />
                  <line y1="-100" y2="100" stroke="#243A5C" stroke-width="1" />
                  <circle v-if="centerRange[index] > 0" :r="centerRange[index]" fill="rgba(139,92,246,0.08)" stroke="#8B5CF6" stroke-width="1" stroke-dasharray="4 3" />
                  <polyline
                    v-if="index === 0 && trajectory.length > 1"
                    :points="trajectory.map((point) => `${point.x * 100 * zoom[index]},${point.y * 100 * zoom[index]}`).join(' ')"
                    fill="none"
                    stroke="#00E5FF"
                    stroke-opacity="0.5"
                    stroke-width="1.2"
                    vector-effect="non-scaling-stroke"
                  />
                  <circle :cx="stick.x * 100 * zoom[index]" :cy="stick.y * 100 * zoom[index]" r="6" fill="#00E5FF" filter="drop-shadow(0 0 8px #00E5FF)" />
                </svg>
              </div>
              <div class="mt-2 flex items-center justify-center gap-2">
                <span class="label-caps mr-1">{{ index === 0 ? 'L' : 'R' }} 缩放</span>
                <button type="button" class="ghost-button !px-2 !py-1" @click="changeZoom(index, -0.25)"><ZoomOut class="h-3.5 w-3.5" /></button>
                <span class="w-10 text-center font-mono text-xs text-ink-400">{{ zoom[index].toFixed(2) }}x</span>
                <button type="button" class="ghost-button !px-2 !py-1" @click="changeZoom(index, 0.25)"><ZoomIn class="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
          <p class="mt-4 text-center font-mono text-[10px] text-ink-400">原始轴值 [LX / LY / RX / RY]：{{ rawAxes }}</p>
        </div>

        <div class="glass-panel p-5">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <p class="label-caps">CENTER RANGE 1~100</p>
              <h2 class="mt-1 text-[18px] font-semibold text-ink-50">中心点范围</h2>
            </div>
            <button type="button" class="ghost-button !px-3 !py-1.5 !text-xs" @click="reset">
              <RotateCcw class="h-3.5 w-3.5" :stroke-width="1.75" />
              重置
            </button>
          </div>
          <div v-for="(label, index) in ['L', 'R']" :key="label" class="mb-4">
            <div class="mb-1 flex justify-between font-mono text-[11px] text-ink-400">
              <span>{{ label }} 死区范围</span><span>{{ centerRange[index] }}%</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-mono text-sm text-ink-400">−</span>
              <input v-if="index === 0" v-model.number="customLeft" type="range" min="0" max="100" class="w-full accent-[#00E5FF]" />
              <input v-else v-model.number="customRight" type="range" min="0" max="100" class="w-full accent-[#00E5FF]" />
              <span class="font-mono text-sm text-ink-400">+</span>
            </div>
            <label class="mt-2 flex items-center gap-2 text-xs text-ink-400">
              自定义 {{ label }}
              <input v-if="index === 0" v-model.number="customLeft" type="number" min="0" max="100" class="w-16 rounded-lg border border-white/10 bg-white/5 px-2 py-1 font-mono text-xs text-ink-50 outline-none focus:border-neon/50" />
              <input v-else v-model.number="customRight" type="number" min="0" max="100" class="w-16 rounded-lg border border-white/10 bg-white/5 px-2 py-1 font-mono text-xs text-ink-50 outline-none focus:border-neon/50" />
              %
            </label>
          </div>
          <button type="button" class="neon-button w-full !py-2 !text-xs" @click="applyCenterRange">确定</button>
        </div>

        <div class="glass-panel p-5">
          <div class="mb-3 flex items-center justify-between">
            <div>
              <p class="label-caps">CIRCLE ACCURACY</p>
              <h2 class="mt-1 text-[18px] font-semibold text-ink-50">画圆错误率测试</h2>
            </div>
            <button type="button" class="neon-button !px-3 !py-1.5 !text-xs" @click="toggleCircle">
              <Play v-if="!circleActive" class="h-3.5 w-3.5" :stroke-width="1.75" />
              <CircleStop v-else class="h-3.5 w-3.5" :stroke-width="1.75" />
              {{ circleActive ? '停止测试' : '开始测试' }}
            </button>
          </div>
          <p class="text-xs leading-7 text-ink-400">
            {{ circleActive ? '正在采集左摇杆轨迹，请匀速画圆。' : '开始后匀速转动左摇杆，系统将记录轨迹并计算半径偏差。' }}
          </p>
        </div>
      </div>

      <GamepadModelPanel
        class="lg:col-span-5"
        title="摇杆联动模型"
        :left-stick="left"
        :right-stick="right"
      />
    </div>
  </section>
</template>
