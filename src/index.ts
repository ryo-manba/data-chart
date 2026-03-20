import type { ChartConfig, ChartType, DataChartAPI, GridOption, LegendPosition, ParsedData } from './types';
import { parseTable } from './parser';
import { getColors, injectStyles } from './theme';
import { renderBar } from './renderer/bar';
import { renderLine } from './renderer/line';
import { renderArea } from './renderer/area';
import { renderPie } from './renderer/pie';
import { renderDonut } from './renderer/donut';

const R: Record<ChartType, (d: ParsedData, c: ChartConfig, cl: string[]) => SVGSVGElement> = { bar: renderBar, line: renderLine, area: renderArea, pie: renderPie, donut: renderDonut };

function forwardAnim(t: HTMLTableElement, c: HTMLDivElement): void {
  for (const a of Array.from(t.attributes)) if (a.name.startsWith('data-anim')) c.setAttribute(a.name, a.value);
}

function raf2(fn: () => void): void {
  requestAnimationFrame(() => { requestAnimationFrame(fn); });
}

function applyAnimations(svg: SVGSVGElement, cfg: ChartConfig): void {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  svg.classList.add('dc-anim');

  const d = cfg.animDuration; // duration per element (ms)
  const sg = cfg.animStagger; // stagger between elements (ms)
  const bars = svg.querySelectorAll('.data-chart-bar');
  const lines = svg.querySelectorAll('.data-chart-line');
  const dots = svg.querySelectorAll('.data-chart-dot');
  const slices = svg.querySelectorAll('.data-chart-slice');

  if (cfg.horizontal) {
    bars.forEach((el, i) => {
      const rect = el as SVGRectElement;
      const finalW = rect.getAttribute('width') ?? '0';
      rect.setAttribute('width', '0');
      rect.style.transition = `width ${d}ms ease-out ${i * sg}ms`;
      raf2(() => { rect.setAttribute('width', finalW); });
    });
  } else if (bars.length > 0) {
    const barData: Array<{ rect: SVGRectElement; finalH: number; finalY: number; x: string }> = [];
    bars.forEach((el) => {
      const rect = el as SVGRectElement;
      barData.push({
        rect,
        finalH: parseFloat(rect.getAttribute('height') ?? '0'),
        finalY: parseFloat(rect.getAttribute('y') ?? '0'),
        x: parseFloat(rect.getAttribute('x') ?? '0').toFixed(1),
      });
    });

    if (cfg.stacked) {
      const colMap = new Map<string, typeof barData>();
      for (const b of barData) {
        const list = colMap.get(b.x) ?? [];
        list.push(b);
        colMap.set(b.x, list);
      }
      const segDur = Math.round(d / 2); // duration per stacked segment
      let colIdx = 0;
      for (const [, segs] of colMap) {
        segs.sort((a, b) => b.finalY - a.finalY);
        segs.forEach((b, segIdx) => {
          const delay = colIdx * (sg * 2) + segIdx * segDur;
          b.rect.setAttribute('height', '0');
          b.rect.setAttribute('y', String(b.finalY + b.finalH));
          b.rect.style.transition = `height ${segDur}ms ease-out ${delay}ms, y ${segDur}ms ease-out ${delay}ms`;
          raf2(() => {
            b.rect.setAttribute('height', String(b.finalH));
            b.rect.setAttribute('y', String(b.finalY));
          });
        });
        colIdx++;
      }
    } else {
      barData.forEach((b, i) => {
        b.rect.setAttribute('height', '0');
        b.rect.setAttribute('y', String(b.finalY + b.finalH));
        b.rect.style.transition = `height ${d}ms ease-out ${i * sg}ms, y ${d}ms ease-out ${i * sg}ms`;
        raf2(() => {
          b.rect.setAttribute('height', String(b.finalH));
          b.rect.setAttribute('y', String(b.finalY));
        });
      });
    }
  }

  // Lines
  const lineDur = Math.round(d * 1.6);
  lines.forEach((el) => {
    const path = el as SVGPathElement;
    path.setAttribute('pathLength', '1');
    path.style.strokeDasharray = '1';
    path.style.strokeDashoffset = '1';
    path.style.transition = `stroke-dashoffset ${lineDur}ms ease-out`;
    raf2(() => { path.style.strokeDashoffset = '0'; });
  });

  // Dots: fade in after line draws
  dots.forEach((el, i) => {
    (el as SVGElement).style.animationDelay = `${lineDur + i * sg}ms`;
  });

  // Pie/Donut slices
  if (slices.length > 0) {
    const cx = cfg.type === 'pie' || cfg.type === 'donut' ? '150px' : '50%';
    const cy = cfg.type === 'pie' || cfg.type === 'donut' ? '120px' : '50%';
    slices.forEach((el, i) => {
      const s = el as SVGElement;
      s.style.transformOrigin = `${cx} ${cy}`;
      s.style.transform = 'scale(0.3)';
      s.style.opacity = '0';
      s.style.transition = `transform ${d}ms cubic-bezier(0.25,0.46,0.45,0.94) ${i * sg}ms, opacity ${Math.round(d / 2)}ms ease-out ${i * sg}ms`;
      raf2(() => {
        s.style.transform = 'scale(1)';
        s.style.opacity = '0.85';
      });
    });
  }
}

function renderChart(table: HTMLTableElement): SVGSVGElement {
  const type = (table.getAttribute('data-chart') ?? '') as ChartType;
  if (!R[type]) throw new Error('INVALID_TYPE');

  let data: ParsedData;
  try { data = parseTable(table); } catch (e) {
    table.dispatchEvent(new CustomEvent('datachart:error', { detail: { message: String(e) } }));
    throw e;
  }

  const cfg: ChartConfig = {
    type,
    height: parseInt(table.getAttribute('data-chart-height') ?? '220', 10),
    colors: [],
    grid: (table.getAttribute('data-chart-grid') ?? 'y') as GridOption,
    legend: (table.getAttribute('data-chart-legend') as LegendPosition | null) ?? (data.headers.length > 1 ? 'top' : 'none'),
    radius: parseInt(table.getAttribute('data-chart-radius') ?? '3', 10),
    horizontal: table.hasAttribute('data-chart-horizontal'),
    stacked: table.hasAttribute('data-chart-stacked'),
    source: table.hasAttribute('data-chart-source'),
    debug: false,
    animate: table.hasAttribute('data-chart-animate'),
    animDuration: parseInt(table.getAttribute('data-chart-animate-duration') ?? '600', 10),
    animStagger: parseInt(table.getAttribute('data-chart-animate-stagger') ?? '60', 10),
  };

  const colors = getColors(table.getAttribute('data-chart-colors'), Math.max(data.headers.length, data.labels.length));
  cfg.colors = colors;
  const svg = R[type]!(data, cfg, colors);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', data.caption ?? `${type} chart: ${data.headers.join(', ')}`);
  table.setAttribute('aria-hidden', 'true');

  if (cfg.animate) applyAnimations(svg, cfg);

  const ct = document.createElement('div');
  ct.className = 'data-chart-container';
  forwardAnim(table, ct);
  table.classList.add('data-chart-rendered');
  table.parentNode?.insertBefore(ct, table);
  ct.appendChild(table);
  ct.appendChild(svg);

  if (cfg.source) {
    const id = table.id || `dc-${Math.random().toString(36).slice(2, 9)}`;
    if (!table.id) table.id = id;
    const b = document.createElement('button');
    b.className = 'data-chart-source-toggle';
    b.setAttribute('aria-expanded', 'false');
    b.setAttribute('aria-controls', id);
    b.textContent = 'Show table';
    b.addEventListener('click', () => {
      const e = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', String(!e));
      b.textContent = e ? 'Show table' : 'Hide table';
      table.classList.toggle('data-chart-source-visible', !e);
    });
    ct.appendChild(b);
  }

  table.dispatchEvent(new CustomEvent('datachart:rendered', { detail: { svg, data } }));
  return svg;
}

function destroy(t: HTMLTableElement): void {
  const c = t.closest('.data-chart-container');
  if (!c) return;
  t.classList.remove('data-chart-rendered', 'data-chart-source-visible');
  t.removeAttribute('aria-hidden');
  c.parentNode?.insertBefore(t, c);
  c.remove();
  t.dispatchEvent(new CustomEvent('datachart:destroyed'));
}

function safeRender(t: HTMLTableElement): void { try { renderChart(t); } catch { /* dispatched */ } }

function init(): void {
  injectStyles();
  for (const t of document.querySelectorAll<HTMLTableElement>('table[data-chart]'))
    if (!t.classList.contains('data-chart-rendered')) safeRender(t);
  new MutationObserver((ms) => {
    for (const m of ms) for (const n of m.addedNodes)
      if (n instanceof HTMLElement) {
        const ts: HTMLTableElement[] = n.matches?.('table[data-chart]') ? [n as HTMLTableElement] : Array.from(n.querySelectorAll?.('table[data-chart]') ?? []);
        for (const t of ts) if (!t.classList.contains('data-chart-rendered')) safeRender(t);
      }
  }).observe(document.body, { childList: true, subtree: true });
}

const api: DataChartAPI = {
  init, render: renderChart,
  refresh(t) { destroy(t); return renderChart(t); },
  destroy(t?) { if (t) destroy(t); else for (const el of document.querySelectorAll<HTMLTableElement>('table.data-chart-rendered')) destroy(el); },
  version: '0.1.0',
};

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  if (typeof window !== 'undefined') window.dataChart = api;
}

export default api;
export { parseTable } from './parser';
export type { ParsedData, ChartType, ChartConfig, DataChartAPI } from './types';
export type { DataChartType, DataChartGrid, DataChartLegend, DataChartAttributes } from './attributes';
