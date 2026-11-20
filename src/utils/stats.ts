export function mean(values: ArrayLike<number>): number {
  if (values.length === 0) return 0
  let sum = 0
  for (let i = 0; i < values.length; i += 1) sum += values[i]
  return sum / values.length
}

export function percentile(sorted: Float64Array, ratio: number): number {
  if (sorted.length === 0) return 0
  const p = Math.min(1, Math.max(0, ratio))
  const position = (sorted.length - 1) * p
  const lower = Math.floor(position)
  const upper = Math.ceil(position)
  if (lower === upper) return sorted[lower]
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower)
}

export function summarizeIntervals(intervalsMs: Float64Array) {
  if (intervalsMs.length === 0) {
    return { count: 0, avgHz: 0, minMs: 0, maxMs: 0, p50Ms: 0, p95Ms: 0 }
  }
  const sorted = Float64Array.from(intervalsMs).sort()
  const avgMs = mean(intervalsMs)
  return {
    count: intervalsMs.length,
    avgHz: avgMs > 0 ? 1000 / avgMs : 0,
    minMs: sorted[0],
    maxMs: sorted[sorted.length - 1],
    p50Ms: percentile(sorted, 0.5),
    p95Ms: percentile(sorted, 0.95),
  }
}

export function circleErrorRate(points: ReadonlyArray<{ x: number; y: number }>): number {
  if (points.length < 8) return 0
  const radius = mean(Array.from(points, (p) => Math.hypot(p.x, p.y)))
  if (radius <= 0) return 0
  let error = 0
  for (const point of points) error += Math.abs(Math.hypot(point.x, point.y) - radius)
  return Math.min(100, (error / points.length / radius) * 100)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
