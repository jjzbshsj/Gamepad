import { computed, ref } from 'vue'
import { summarizeIntervals } from '@/utils/stats'

const TARGETS = [1000, 2000, 3000] as const

export function usePollingRate() {
  const target = ref<number>(1000)
  const count = ref(0)
  const collecting = ref(false)
  let intervals = new Float64Array(target.value)
  let lastTimestamp = 0
  let lastAxisValues: number[] = []

  const progress = computed(() => Math.min(100, Math.round((count.value / target.value) * 100)))
  const summary = computed(() => summarizeIntervals(intervals.subarray(0, count.value)))

  const histogram = computed(() => {
    if (count.value === 0) return { labels: [] as string[], values: [] as number[] }
    const sorted = Float64Array.from(intervals.subarray(0, count.value)).sort()
    const min = sorted[0]
    const max = sorted[sorted.length - 1]
    const bins = 24
    const width = Math.max(0.5, (max - min) / bins)
    const values = new Array<number>(bins).fill(0)
    for (const value of sorted) {
      const index = Math.min(bins - 1, Math.floor((value - min) / width))
      values[index] += 1
    }
    return {
      labels: values.map((_, index) => `${(min + index * width).toFixed(1)}`),
      values,
    }
  })

  function setTarget(value: number) {
    if (!TARGETS.includes(value as (typeof TARGETS)[number])) return
    target.value = value
    reset()
  }

  function start() {
    reset()
    collecting.value = true
  }

  function reset() {
    intervals = new Float64Array(target.value)
    count.value = 0
    collecting.value = false
    lastTimestamp = 0
    lastAxisValues = []
  }

  function push(timestamp: number, values: number[]) {
    if (!collecting.value) return
    const changed = values.some((value, index) => Math.abs(value - (lastAxisValues[index] ?? 0)) >= 0.002)
    if (!changed) return
    if (lastTimestamp > 0) {
      const interval = timestamp - lastTimestamp
      if (interval > 0 && interval < 500) {
        intervals[count.value] = interval
        count.value += 1
      }
    }
    lastTimestamp = timestamp
    lastAxisValues = [...values]
    if (count.value >= target.value) collecting.value = false
  }

  return { target, count, collecting, progress, summary, histogram, setTarget, start, reset, push, targets: TARGETS }
}
