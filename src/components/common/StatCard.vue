<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    value: string | number
    unit?: string
    tone?: 'default' | 'ok' | 'warn' | 'bad'
    hint?: string
  }>(),
  { unit: '', tone: 'default', hint: '' },
)

const toneClass: Record<string, string> = {
  default: 'text-ink-50',
  ok: 'text-signal-ok',
  warn: 'text-signal-warn',
  bad: 'text-signal-bad',
}
</script>

<template>
  <div class="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-neon/30">
    <p class="label-caps">{{ label }}</p>
    <p class="mt-2 flex items-baseline gap-1">
      <span class="stat-num text-[26px]" :class="toneClass[tone]">{{ value }}</span>
      <span v-if="unit" class="font-mono text-xs text-ink-400">{{ unit }}</span>
    </p>
    <p v-if="hint" class="mt-1 text-[11px] text-ink-400/80">{{ hint }}</p>
  </div>
</template>
