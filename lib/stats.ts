/** 95% Wilson score interval for k successes in n trials, as percentages. */
export function wilson(k: number, n: number): [number, number, number] {
  const z = 1.96;
  const p = k / n;
  const d = 1 + (z * z) / n;
  const c = (p + (z * z) / (2 * n)) / d;
  const h = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d;
  const r = (x: number) => Math.round(x * 1000) / 10;
  return [r(p), r(Math.max(0, c - h)), r(Math.min(1, c + h))];
}
