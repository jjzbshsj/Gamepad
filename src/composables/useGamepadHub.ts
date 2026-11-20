import { computed, ref, watch } from 'vue'
import { useGamepad } from '@vueuse/core'
import type { GamepadHub } from '@/types/gamepad'
import { useVirtualGamepad } from './useVirtualGamepad'

const { gamepads: rawGamepads, isSupported, onConnected, onDisconnected, pause, resume } = useGamepad()
const virtual = useVirtualGamepad()

function snapshotGamepad(gamepad: Gamepad): Gamepad {
  return {
    id: gamepad.id,
    index: gamepad.index,
    connected: gamepad.connected,
    timestamp: gamepad.timestamp,
    mapping: gamepad.mapping,
    axes: Array.from(gamepad.axes ?? []),
    buttons: Array.from(gamepad.buttons ?? [], (button) => ({ pressed: button.pressed, value: button.value })),
    hapticActuators: Array.from((gamepad as unknown as { hapticActuators?: unknown[] }).hapticActuators ?? []),
    vibrationActuator: gamepad.vibrationActuator ?? null,
  } as unknown as Gamepad
}

const gamepads = computed<Gamepad[]>(() =>
  rawGamepads.value
    .filter((gamepad): gamepad is Gamepad => Boolean(gamepad) && gamepad.connected)
    .map(snapshotGamepad),
)
const selectedIndex = ref(0)
const demoMode = ref(false)

const activeGamepad = computed<Gamepad | null>(() => {
  if (demoMode.value) return virtual.gamepad.value
  return gamepads.value[selectedIndex.value] ?? gamepads.value[0] ?? null
})

function select(index: number) {
  if (index < 0 || index > 3) return
  selectedIndex.value = index
  demoMode.value = false
}

function enableDemoMode() {
  demoMode.value = true
}

function reset() {
  selectedIndex.value = 0
  virtual.reset()
}

function slotGamepad(index: number): Gamepad | null {
  if (demoMode.value) return index === 0 ? virtual.gamepad.value : null
  return gamepads.value[index] ?? null
}

watch(gamepads, (list) => {
  if (list.length === 0) return
  if (!list[selectedIndex.value]) selectedIndex.value = 0
})

onConnected((index) => {
  if (import.meta.env.DEV) console.info('[gamepad] connected', index)
})

onDisconnected((index) => {
  if (import.meta.env.DEV) console.info('[gamepad] disconnected', index)
})

const hub: GamepadHub = {
  gamepads,
  selectedIndex,
  activeGamepad,
  isSupported,
  demoMode,
  select,
  reset,
}

export function useGamepadHub() {
  return {
    ...hub,
    gamepads,
    activeGamepad,
    isSupported,
    demoMode,
    virtual,
    slotGamepad,
    enableDemoMode,
    pause,
    resume,
  }
}
