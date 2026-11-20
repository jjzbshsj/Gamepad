export const STANDARD_BUTTONS = [
  { index: 0, id: 'A', label: 'A' },
  { index: 1, id: 'B', label: 'B' },
  { index: 2, id: 'X', label: 'X' },
  { index: 3, id: 'Y', label: 'Y' },
  { index: 4, id: 'LB', label: 'LB' },
  { index: 5, id: 'RB', label: 'RB' },
  { index: 6, id: 'LT', label: 'LT' },
  { index: 7, id: 'RT', label: 'RT' },
  { index: 8, id: 'SELECT', label: 'SELECT' },
  { index: 9, id: 'START', label: 'START' },
  { index: 10, id: 'L3', label: 'L3' },
  { index: 11, id: 'R3', label: 'R3' },
  { index: 12, id: 'UP', label: '上' },
  { index: 13, id: 'DOWN', label: '下' },
  { index: 14, id: 'LEFT', label: '左' },
  { index: 15, id: 'RIGHT', label: '右' },
] as const

export const AXIS_INDEX = {
  leftX: 0,
  leftY: 1,
  rightX: 2,
  rightY: 3,
} as const

export function axisValue(gamepad: Gamepad | null, index: number): number {
  if (!gamepad) return 0
  const value = gamepad.axes[index]
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

export function buttonValue(gamepad: Gamepad | null, index: number): number {
  if (!gamepad) return 0
  const button = gamepad.buttons[index]
  if (!button) return 0
  return typeof button.value === 'number' && Number.isFinite(button.value) ? button.value : 0
}

export function isPressed(gamepad: Gamepad | null, index: number): boolean {
  if (!gamepad) return false
  const button = gamepad.buttons[index]
  if (!button) return false
  return button.pressed === true || (typeof button.value === 'number' && button.value > 0.5)
}

export function triggerPercent(gamepad: Gamepad | null, index: number): number {
  return Math.round(buttonValue(gamepad, index) * 100)
}

export const LABEL_TO_ID: Record<string, string> = {
  A: 'A', B: 'B', X: 'X', Y: 'Y',
  LB: 'LB', RB: 'RB', LT: 'LT', RT: 'RT',
  SELECT: 'SELECT', START: 'START', L3: 'L3', R3: 'R3',
  上: 'UP', 下: 'DOWN', 左: 'LEFT', 右: 'RIGHT',
}

export const ID_TO_LABEL: Record<string, string> = Object.fromEntries(
  Object.entries(LABEL_TO_ID).map(([label, id]) => [id, label]),
)

export function buttonIdForLabel(label: string): string {
  return LABEL_TO_ID[label] ?? label
}

type HatMode = 'auto' | 'radians' | 'indexed'

let hatMode: HatMode = 'auto'

const NO_DIRECTION: [boolean, boolean, boolean, boolean] = [false, false, false, false]

function decodeHat(value: number): [boolean, boolean, boolean, boolean] {
  if (!Number.isFinite(value)) return NO_DIRECTION

  if (hatMode === 'auto') {
    if (value === 0) return NO_DIRECTION
    if (value < 0 || !Number.isInteger(value) || value > 6.5) hatMode = 'radians'
    else hatMode = 'indexed'
  }

  if (hatMode === 'indexed') {
    switch (value) {
      case 1: return [true, false, false, false]
      case 2: return [false, false, false, true]
      case 3: return [false, true, false, false]
      case 4: return [false, false, true, false]
      case 5: return [true, false, false, true]
      case 6: return [false, true, false, true]
      case 7: return [false, true, true, false]
      case 8: return [true, false, true, false]
      default: return NO_DIRECTION
    }
  }

  if (value < 0) return NO_DIRECTION
  const angle = value > 6.5 ? (value * Math.PI) / 180 : value
  return [
    Math.cos(angle) > 0.4,
    Math.cos(angle) < -0.4,
    Math.sin(angle) < -0.4,
    Math.sin(angle) > 0.4,
  ]
}

export function dpadStates(gamepad: Gamepad | null): [boolean, boolean, boolean, boolean] {
  if (!gamepad) return NO_DIRECTION
  const fromButtons = [12, 13, 14, 15].map(
    (index) => gamepad.buttons[index]?.pressed === true,
  ) as [boolean, boolean, boolean, boolean]
  if (fromButtons.some(Boolean)) return fromButtons
  return decodeHat(axisValue(gamepad, 9))
}

export function isSelectPressed(gamepad: Gamepad | null): boolean {
  return isPressed(gamepad, 8) || isPressed(gamepad, 16)
}

export function isStartPressed(gamepad: Gamepad | null): boolean {
  return isPressed(gamepad, 9) || isPressed(gamepad, 17)
}
