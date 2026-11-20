<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    pressed?: Record<string, boolean>
    lt?: number
    rt?: number
    leftStick?: { x: number; y: number }
    rightStick?: { x: number; y: number }
  }>(),
  { pressed: () => ({}), lt: 0, rt: 0 },
)

const bodyFill = 'url(#bodyGradient)'
const activeFill = '#00E5FF'
const idleFill = '#1B2C4A'

function on(id: string) {
  return Boolean(props.pressed?.[id])
}

function fill(id: string) {
  return on(id) ? activeFill : idleFill
}

const leftOffset = computed(() => ({
  x: (props.leftStick?.x ?? 0) * 12,
  y: (props.leftStick?.y ?? 0) * 12,
}))
const rightOffset = computed(() => ({
  x: (props.rightStick?.x ?? 0) * 12,
  y: (props.rightStick?.y ?? 0) * 12,
}))
</script>

<template>
  <svg viewBox="0 0 480 300" class="h-full w-full drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)]" role="img" aria-label="手柄状态示意图">
    <defs>
      <linearGradient id="bodyGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#263A5C" />
        <stop offset="52%" stop-color="#16233C" />
        <stop offset="100%" stop-color="#0E1729" />
      </linearGradient>
      <linearGradient id="rimGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#00E5FF" stop-opacity="0.05" />
        <stop offset="50%" stop-color="#00E5FF" stop-opacity="0.6" />
        <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0.08" />
      </linearGradient>
      <filter id="buttonGlow" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <path
      d="M140 62 H340 C392 62 430 96 442 148 L462 224 C470 260 442 286 410 272 L352 246 C334 238 322 220 316 200 H164 C158 220 146 238 128 246 L70 272 C38 286 10 260 18 224 L38 148 C50 96 88 62 140 62 Z"
      :fill="bodyFill"
      stroke="url(#rimGradient)"
      stroke-width="2"
    />
    <path d="M116 78 C160 66 320 66 364 78" fill="none" stroke="#00E5FF" stroke-opacity="0.18" stroke-width="2" />
    <path d="M164 200 H316" stroke="#00E5FF" stroke-opacity="0.15" stroke-width="1.5" />

    <g class="font-mono text-[10px] font-semibold" text-anchor="middle">
      <rect x="96" y="48" width="76" height="22" rx="7" :fill="fill('LB')" :filter="on('LB') ? 'url(#buttonGlow)' : undefined" />
      <text x="134" y="63" :fill="on('LB') ? '#04121A' : '#94A3B8'">LB</text>
      <rect x="308" y="48" width="76" height="22" rx="7" :fill="fill('RB')" :filter="on('RB') ? 'url(#buttonGlow)' : undefined" />
      <text x="346" y="63" :fill="on('RB') ? '#04121A' : '#94A3B8'">RB</text>
    </g>

    <g class="font-mono text-[9px]">
      <text x="134" y="33" fill="#64748B">LT {{ lt }}%</text>
      <text x="346" y="33" fill="#64748B">RT {{ rt }}%</text>
      <rect x="96" y="34" width="76" height="4" rx="2" fill="#223354" />
      <rect x="96" y="34" :width="76 * lt / 100" height="4" rx="2" fill="#00E5FF" />
      <rect x="308" y="34" width="76" height="4" rx="2" fill="#223354" />
      <rect x="308" y="34" :width="76 * rt / 100" height="4" rx="2" fill="#00E5FF" />
    </g>

    <g :filter="on('UP') || on('DOWN') || on('LEFT') || on('RIGHT') ? 'url(#buttonGlow)' : undefined">
      <path d="M104 132 H124 V112 H144 V132 H164 V152 H144 V172 H124 V152 H104 Z" :fill="fill('UP')" stroke="#00E5FF" stroke-opacity="0.35" />
      <path d="M104 132 H124 V112 H144 V132 H124 Z" :fill="on('UP') ? '#00E5FF' : '#223B5D'" />
      <path d="M124 152 H144 V172 H124 Z" :fill="on('DOWN') ? '#00E5FF' : '#223B5D'" />
      <path d="M104 132 H124 V152 H104 Z" :fill="on('LEFT') ? '#00E5FF' : '#223B5D'" />
      <path d="M144 132 H164 V152 H144 Z" :fill="on('RIGHT') ? '#00E5FF' : '#223B5D'" />
    </g>

    <g class="font-mono text-[11px] font-bold" text-anchor="middle">
      <circle cx="392" cy="112" r="16" :fill="fill('Y')" :filter="on('Y') ? 'url(#buttonGlow)' : undefined" />
      <text x="392" y="116" :fill="on('Y') ? '#04121A' : '#94A3B8'">Y</text>
      <circle cx="416" cy="140" r="16" :fill="fill('B')" :filter="on('B') ? 'url(#buttonGlow)' : undefined" />
      <text x="416" y="144" :fill="on('B') ? '#04121A' : '#94A3B8'">B</text>
      <circle cx="392" cy="168" r="16" :fill="fill('A')" :filter="on('A') ? 'url(#buttonGlow)' : undefined" />
      <text x="392" y="172" :fill="on('A') ? '#04121A' : '#94A3B8'">A</text>
      <circle cx="368" cy="140" r="16" :fill="fill('X')" :filter="on('X') ? 'url(#buttonGlow)' : undefined" />
      <text x="368" y="144" :fill="on('X') ? '#04121A' : '#94A3B8'">X</text>
    </g>

    <g>
      <circle cx="196" cy="144" r="30" fill="#101C31" stroke="#00E5FF" stroke-opacity="0.45" stroke-width="2" />
      <circle :cx="196 + leftOffset.x" :cy="144 + leftOffset.y" r="20" :fill="on('L3') ? '#00E5FF' : '#1D3151'" stroke="#8CC6F0" stroke-opacity="0.5" />
      <circle cx="292" cy="144" r="30" fill="#101C31" stroke="#00E5FF" stroke-opacity="0.45" stroke-width="2" />
      <circle :cx="292 + rightOffset.x" :cy="144 + rightOffset.y" r="20" :fill="on('R3') ? '#00E5FF' : '#1D3151'" stroke="#8CC6F0" stroke-opacity="0.5" />
    </g>

    <g class="font-mono text-[9px]" text-anchor="middle">
      <rect x="222" y="160" width="44" height="15" rx="5" :fill="fill('SELECT')" />
      <text x="244" y="171" :fill="on('SELECT') ? '#04121A' : '#94A3B8'">VIEW</text>
      <rect x="222" y="180" width="44" height="15" rx="5" :fill="fill('START')" />
      <text x="244" y="191" :fill="on('START') ? '#04121A' : '#94A3B8'">MENU</text>
    </g>
  </svg>
</template>
