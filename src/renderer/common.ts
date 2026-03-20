import type { ChartConfig, ChartLayout, ParsedData } from '../types';
import { getThemeColor } from '../theme';

const NS = 'http://www.w3.org/2000/svg';
const FF = 'var(--dc-font-family)';
const DC = '#2d5be3';
const P = 'data-chart-';

export function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K, a: Record<string, string | number> = {},
): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(a)) e.setAttribute(k, String(v));
  return e;
}

export function createSvg(w: number, h: number): SVGSVGElement {
  return svgEl('svg', { class: P + 'svg', viewBox: `0 0 ${w} ${h}`, xmlns: NS });
}

export function computeLayout(c: ChartConfig, sc: number): ChartLayout {
  const w = 500, h = c.height, pt = 20 + (c.legend === 'top' && sc > 1 ? 28 : 0), pl = 46, pr = 20, pb = 36;
  return { width: w, height: h, paddingTop: pt, paddingRight: pr, paddingBottom: pb, paddingLeft: pl, chartWidth: w - pl - pr, chartHeight: h - pt - pb };
}

export function getMaxValue(ds: number[][]): number {
  let m = 0;
  for (const s of ds) for (const v of s) if (v > m) m = v;
  return m || 1;
}

export function getStackedMaxValue(ds: number[][]): number {
  if (!ds.length || !ds[0]?.length) return 1;
  const n = ds[0]!.length;
  let m = 0;
  for (let i = 0; i < n; i++) { let s = 0; for (const d of ds) s += Math.max(0, d[i] ?? 0); if (s > m) m = s; }
  return m || 1;
}

function renderChrome(svg: SVGSVGElement, l: ChartLayout, max: number, labels: string[], cfg: ChartConfig): void {
  const gc = getThemeColor('grid'), tc = getThemeColor('textMuted');
  // Grid
  if (cfg.grid !== 'none') {
    const g = svgEl('g', { class: P + 'grid' });
    if (cfg.grid === 'y' || cfg.grid === 'both')
      for (let i = 0; i <= 4; i++) { const y = l.paddingTop + l.chartHeight * (1 - i / 4); g.appendChild(svgEl('line', { x1: l.paddingLeft, y1: y, x2: l.width - l.paddingRight, y2: y, stroke: gc, 'stroke-width': 1 })); }
    if (cfg.grid === 'x' || cfg.grid === 'both')
      g.appendChild(svgEl('line', { x1: l.paddingLeft, y1: l.paddingTop, x2: l.paddingLeft, y2: l.paddingTop + l.chartHeight, stroke: gc, 'stroke-width': 1 }));
    svg.appendChild(g);
  }
  // Y-axis
  const yg = svgEl('g', { class: P + 'axis' });
  for (let i = 0; i <= 4; i++) {
    const y = l.paddingTop + l.chartHeight * (1 - i / 4), v = (max * i) / 4;
    const t = svgEl('text', { x: l.paddingLeft - 8, y: y + 3, 'text-anchor': 'end', 'font-size': 12, 'font-family': FF, fill: tc });
    t.textContent = v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(Math.round(v));
    yg.appendChild(t);
  }
  svg.appendChild(yg);
  // X-axis
  const xg = svgEl('g', { class: P + 'axis' }), gw = l.chartWidth / labels.length;
  for (let i = 0; i < labels.length; i++) {
    const t = svgEl('text', { x: l.paddingLeft + gw * i + gw / 2, y: l.paddingTop + l.chartHeight + 20, 'text-anchor': 'middle', 'font-size': 12, 'font-family': FF, fill: tc });
    t.textContent = labels[i] ?? '';
    xg.appendChild(t);
  }
  svg.appendChild(xg);
}

export function setupChart(cfg: ChartConfig, data: ParsedData, mv?: number): { svg: SVGSVGElement; layout: ChartLayout; maxValue: number } {
  const layout = computeLayout(cfg, data.headers.length);
  const maxValue = mv ?? getMaxValue(data.datasets);
  const svg = createSvg(layout.width, layout.height);
  renderChrome(svg, layout, maxValue, data.labels, cfg);
  return { svg, layout, maxValue };
}

export function seriesGroup(data: ParsedData, s: number): SVGGElement {
  return svgEl('g', { class: P + 'series', 'data-series': data.headers[s] ?? '' });
}

function legendItem(g: SVGGElement, x: number, y: number, c: string, label: string, tc: string): void {
  g.appendChild(svgEl('rect', { x, y: y - 6, width: 10, height: 10, rx: 2, fill: c }));
  const t = svgEl('text', { x: x + 14, y: y + 3, 'font-size': 12, 'font-family': FF, fill: tc });
  t.textContent = label;
  g.appendChild(t);
}

export function renderLegend(svg: SVGSVGElement, l: ChartLayout, data: ParsedData, colors: string[], cfg: ChartConfig): void {
  if (cfg.legend === 'none' || (data.headers.length <= 1 && cfg.legend !== 'top' && cfg.legend !== 'bottom')) return;
  const g = svgEl('g', { class: P + 'legend' }), tc = getThemeColor('text');
  const y = cfg.legend === 'bottom' ? l.height - 8 : 16;
  let x = l.paddingLeft;
  for (let i = 0; i < data.headers.length; i++) {
    const h = data.headers[i] ?? '';
    legendItem(g, x, y, colors[i] ?? colors[0] ?? DC, h, tc);
    x += 14 + h.length * 7 + 16;
  }
  svg.appendChild(g);
}

export interface Point { x: number; y: number }

export function computePoints(sr: number[], n: number, l: ChartLayout, max: number): Point[] {
  const p: Point[] = [];
  for (let i = 0; i < n; i++) p.push({ x: n === 1 ? l.paddingLeft + l.chartWidth / 2 : l.paddingLeft + (i / (n - 1)) * l.chartWidth, y: l.paddingTop + l.chartHeight - ((sr[i] ?? 0) / max) * l.chartHeight });
  return p;
}

export function buildPath(p: Point[]): string {
  return p.map((pt, i) => `${i ? 'L' : 'M'}${pt.x},${pt.y}`).join(' ');
}

export function renderDots(g: SVGGElement, p: Point[], c: string, bg: string): void {
  for (const pt of p) g.appendChild(svgEl('circle', { class: P + 'dot', cx: pt.x, cy: pt.y, r: 3.5, fill: bg, stroke: c, 'stroke-width': 2 }));
}

export function renderLinePath(g: SVGGElement, d: string, c: string): void {
  g.appendChild(svgEl('path', { class: P + 'line', d, fill: 'none', stroke: c, 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
}

export function renderCircularLegend(svg: SVGSVGElement, labels: string[], vals: number[], total: number, colors: string[], h: number): void {
  const g = svgEl('g', { class: P + 'legend' }), tc = getThemeColor('text');
  let x = 20; const y = h - 30;
  for (let i = 0; i < labels.length; i++) {
    const lt = `${labels[i] ?? ''} (${Math.round(((vals[i] ?? 0) / total) * 100)}%)`;
    legendItem(g, x, y, colors[i % colors.length] ?? DC, lt, tc);
    x += 14 + lt.length * 6.5 + 12;
  }
  svg.appendChild(g);
}

export function addBar(g: SVGGElement, x: number, y: number, w: number, h: number, rx: number, c: string): void {
  g.appendChild(svgEl('rect', { class: P + 'bar', x, y, width: w, height: h, rx, fill: c, opacity: 0.9 }));
}
