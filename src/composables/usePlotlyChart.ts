import { onBeforeUnmount, onMounted, ref } from 'vue'
import Plotly from 'plotly.js-dist-min'

const LAYOUT = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  font: { color: '#94A3B8', family: 'JetBrains Mono', size: 10 },
  margin: { l: 36, r: 12, t: 12, b: 30 },
  xaxis: { gridcolor: 'rgba(255,255,255,0.06)', zeroline: false },
  yaxis: { gridcolor: 'rgba(255,255,255,0.06)', zeroline: false },
  showlegend: false,
  hovermode: 'closest',
}

export function usePlotlyChart() {
  const container = ref<HTMLElement | null>(null)
  let ready = false
  let lastRender = 0

  onMounted(() => {
    if (!container.value) return
    Plotly.newPlot(
      container.value,
      [{ x: [], y: [], type: 'bar', marker: { color: 'rgba(0,229,255,0.65)' } }],
      LAYOUT,
      { responsive: true, displayModeBar: false },
    ).then(() => {
      ready = true
    })
  })

  function render(x: unknown[], y: unknown[], meanMs?: number) {
    if (!ready || !container.value) return
    const now = performance.now()
    if (now - lastRender < 100) return
    lastRender = now
    const layout: Record<string, unknown> = {
      ...LAYOUT,
      xaxis: { ...LAYOUT.xaxis, title: { text: '相邻回报间隔 (ms)', standoff: 8 } },
      yaxis: { ...LAYOUT.yaxis, title: { text: '频次' } },
      shapes:
        meanMs && Number.isFinite(meanMs)
          ? [{ type: 'line', x0: meanMs, x1: meanMs, y0: 0, y1: 1, yref: 'paper', line: { color: '#F59E0B', width: 1.5, dash: 'dash' } }]
          : [],
    }
    Plotly.react(container.value, [{ x, y, type: 'bar', marker: { color: 'rgba(0,229,255,0.65)' } }], layout, {
      responsive: true,
      displayModeBar: false,
    }).catch((error: unknown) => console.error('[plotly] render failed', error))
  }

  onBeforeUnmount(() => {
    if (container.value && ready) Plotly.purge(container.value)
  })

  return { container, render }
}
