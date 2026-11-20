import type { ComputedRef, Ref } from 'vue'

export interface GamepadHub {
  gamepads: Readonly<Ref<Gamepad[]>>
  selectedIndex: Ref<number>
  activeGamepad: ComputedRef<Gamepad | null>
  isSupported: Ref<boolean>
  demoMode: Ref<boolean>
  select(index: number): void
  reset(): void
}

export interface PollingSample {
  timestamp: number
  intervalMs: number
  axisValue: number
}

export interface ButtonState {
  id: string
  label: string
  pressed: boolean
  value: number
}

export interface JoystickState {
  x: number
  y: number
  magnitude: number
}

export interface TestModuleContext {
  hub: GamepadHub
  dispose(): void
}
