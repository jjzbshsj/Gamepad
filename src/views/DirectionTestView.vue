<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { RotateCcw, Waypoints } from 'lucide-vue-next'
import { useGamepadHub } from '@/composables/useGamepadHub'
import { dpadStates } from '@/utils/buttonMap'
import { directionColumns, testCopy } from '@/data/testCopy'
import StatCard from '@/components/common/StatCard.vue'

const { activeGamepad } = useGamepadHub()
const target = ref<50 | 100 | 200>(50)

const counts = reactive<Record<string, number>>(
  Object.fromEntries(directionColumns.map((column) => [column, 0])),
)
let previous = [false, false, false, false]

watch(activeGamepad, (pad) => {
  const states = dpadStates(pad)
  const rising = states.map((state, index) => state && !previous[index])
  previous = states
  if (!rising.some(Boolean)) return

  const [up, down, left, right] = states
  if (up && left) counts['上左'] += 1
  else if (up && right) counts['上右'] += 1
  else if (down && left) counts['下左'] += 1
  else if (down && right) counts['下右'] += 1
  else if (rising[0]) counts['上'] += 1
  else if (rising[1]) counts['下'] += 1
  else if (rising[2]) counts['左'] += 1
  else if (rising[3]) counts['右'] += 1
}, { flush: 'sync' })

const total = computed(() => directionColumns.reduce((sum, column) => sum + counts[column], 0))
const progress = computed(() => Math.min(100, Math.round((total.value / target.value) * 100)))
const ghostCount = computed(() => counts['上左'] + counts['上右'] + counts['下左'] + counts['下右'])

function reset() {
  for (const column of directionColumns) counts[column] = 0
  previous = [false, false, false, false]
}
</script>

<template>
  <section class="animate-slide-up">
    <div class="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="label-caps">MODULE 02 / DPAD CROSSCHECK</p>
        <h1 class="mt-1 text-[30px] font-bold text-ink-50">{{ testCopy.direction.title }}</h1>
        <p class="mt-2 max-w-2xl text-sm leading-7 text-ink-400">{{ testCopy.direction.description }}</p>
      </div>
    </div>

    <div class="mb-5 grid gap-3 sm:grid-cols-3">
      <StatCard label="已按动" :value="total" unit="次" />
      <StatCard label="目标次数" :value="target" unit="次" />
      <StatCard label="斜向触发" :value="ghostCount" unit="次" :tone="ghostCount > 0 ? 'warn' : 'ok'" hint="固定顺序测试中不应出现斜向输入" />
    </div>

    <div class="grid gap-6 lg:grid-cols-12">
      <div class="glass-panel p-5 lg:col-span-8">
        <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="label-caps">PRESS COUNT</p>
            <h2 class="mt-1 text-[18px] font-semibold text-ink-50">统计结果</h2>
          </div>
          <div class="flex items-center gap-2">
            <span class="label-caps mr-1">选择按动次数</span>
            <button
              v-for="option in ([50, 100, 200] as const)"
              :key="option"
              type="button"
              class="focus-ring rounded-lg border px-3 py-1.5 font-mono text-xs transition-all"
              :class="target === option
                ? 'border-neon/60 bg-neon/15 text-neon shadow-glow'
                : 'border-white/10 bg-white/5 text-ink-400 hover:text-ink-50'"
              @click="target = option"
            >
              {{ option }}次
            </button>
            <button type="button" class="ghost-button !px-3 !py-1.5 !text-xs" @click="reset">
              <RotateCcw class="h-3.5 w-3.5" :stroke-width="1.75" />
              重置
            </button>
          </div>
        </div>

        <div class="mb-5 h-1.5 overflow-hidden rounded-full bg-void-800">
          <div class="h-full rounded-full bg-gradient-to-r from-neon to-electric transition-all duration-300" :style="{ width: `${progress}%` }" />
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[560px] border-collapse text-center font-mono text-sm">
            <thead>
              <tr class="border-b border-white/10 text-ink-400">
                <th class="py-3 text-left text-xs font-normal">按键</th>
                <th v-for="column in directionColumns" :key="column" class="py-3 text-xs font-normal">{{ column }}</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-white/5">
                <td class="py-4 text-left text-xs text-ink-400">按动次数</td>
                <td
                  v-for="column in directionColumns"
                  :key="column"
                  class="stat-num py-4 text-lg"
                  :class="counts[column] > 0 ? 'text-neon' : 'text-ink-400/50'"
                >
                  {{ counts[column] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="glass-panel p-5 lg:col-span-4">
        <p class="label-caps">HOW TO TEST</p>
        <h2 class="mt-1 text-[18px] font-semibold text-ink-50">操作指引</h2>
        <div class="mt-4 flex gap-3 rounded-xl border border-neon/20 bg-neon/5 p-4">
          <Waypoints class="mt-0.5 h-5 w-5 shrink-0 text-neon" :stroke-width="1.75" />
          <p class="whitespace-pre-line text-xs leading-7 text-ink-400">{{ testCopy.direction.instruction }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
