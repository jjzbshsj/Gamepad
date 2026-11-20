import { computed, reactive, ref } from 'vue'
import { AXIS_INDEX } from '@/utils/buttonMap'

interface VirtualButton {
  pressed: boolean
  value: number
}

const buttons = reactive<VirtualButton[]>(
  Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })),
)
const axes = reactive<number[]>([0, 0, 0, 0])
const activePreset = ref('空闲')

let circleFrame = 0
let circleStart = 0

function setButton(index: number, value: number) {
  const button = buttons[index]
  if (!button) return
  button.value = Math.min(1, Math.max(0, value))
  button.pressed = button.value > 0.05
}

function press(index: number) {
  setButton(index, index === 6 || index === 7 ? 1 : 1)
}

function release(index: number) {
  setButton(index, 0)
}

function setAxis(index: number, value: number) {
  if (index < 0 || index >= axes.length) return
  axes[index] = Math.min(1, Math.max(-1, value))
}

function setTrigger(index: number, percent: number) {
  setButton(index, percent / 100)
}

function reset() {
  buttons.forEach((button) => {
    button.pressed = false
    button.value = 0
  })
  for (let i = 0; i < axes.length; i += 1) axes[i] = 0
  stopCircleDemo()
  activePreset.value = '空闲'
}

function circleTick(timestamp: number) {
  if (!circleStart) circleStart = timestamp
  const elapsed = (timestamp - circleStart) / 1000
  const phase = elapsed * 2.2
  setAxis(AXIS_INDEX.leftX, Math.cos(phase) * 0.88)
  setAxis(AXIS_INDEX.leftY, Math.sin(phase) * 0.88)
  circleFrame = requestAnimationFrame(circleTick)
}

function startCircleDemo() {
  if (circleFrame) return
  circleStart = 0
  activePreset.value = '左摇杆画圆'
  circleFrame = requestAnimationFrame(circleTick)
}

function stopCircleDemo() {
  if (circleFrame) cancelAnimationFrame(circleFrame)
  circleFrame = 0
  if (activePreset.value === '左摇杆画圆') activePreset.value = '空闲'
}

const gamepad = computed<Gamepad>(() => ({
  id: 'Gamepad Lab · 虚拟演示手柄 (STANDARD)',
  index: 0,
  connected: true,
  timestamp: performance.now(),
  mapping: 'standard',
  axes: [...axes],
  buttons: buttons.map((button) => ({ pressed: button.pressed, value: button.value })),
  hapticActuators: [],
  vibrationActuator: null,
}) as unknown as Gamepad)

export function useVirtualGamepad() {
  return {
    gamepad,
    buttons,
    axes,
    activePreset,
    setButton,
    press,
    release,
    setAxis,
    setTrigger,
    reset,
    startCircleDemo,
    stopCircleDemo,
  }
}
