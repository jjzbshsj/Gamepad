declare module 'plotly.js-dist-min' {
  interface PlotData {
    x?: unknown[]
    y?: unknown[]
    type?: string
    marker?: Record<string, unknown>
    line?: Record<string, unknown>
    name?: string
  }

  interface PlotLayout {
    [key: string]: unknown
  }

  const Plotly: {
    newPlot(div: HTMLElement, data: PlotData[], layout?: PlotLayout, config?: Record<string, unknown>): Promise<unknown>
    react(div: HTMLElement, data: PlotData[], layout?: PlotLayout, config?: Record<string, unknown>): Promise<unknown>
    purge(div: HTMLElement): void
  }

  export default Plotly
}
