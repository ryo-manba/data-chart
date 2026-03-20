import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import type { DataChartAPI } from '../src/types';

function createTable(type = 'bar', attrs: Record<string, string> = {}): HTMLTableElement {
  const table = document.createElement('table');
  table.setAttribute('data-chart', type);
  table.setAttribute('data-chart-animate', '');
  table.innerHTML = `
    <caption>Test</caption>
    <thead><tr><th></th><th>Jan</th><th>Feb</th><th>Mar</th></tr></thead>
    <tbody><tr><th>Sales</th><td>100</td><td>200</td><td>150</td></tr></tbody>
  `;
  for (const [k, v] of Object.entries(attrs)) table.setAttribute(k, v);
  document.body.appendChild(table);
  return table;
}

function createPieTable(type = 'pie'): HTMLTableElement {
  const table = document.createElement('table');
  table.setAttribute('data-chart', type);
  table.setAttribute('data-chart-animate', '');
  table.innerHTML = `
    <thead><tr><th></th><th>Revenue</th></tr></thead>
    <tbody>
      <tr><th>A</th><td>30</td></tr>
      <tr><th>B</th><td>50</td></tr>
      <tr><th>C</th><td>20</td></tr>
    </tbody>
  `;
  document.body.appendChild(table);
  return table;
}

let api: DataChartAPI;
const rafCallbacks: Array<(time: number) => void> = [];

beforeEach(async () => {
  document.body.innerHTML = '';
  document.getElementById('dc-s')?.remove();
  rafCallbacks.length = 0;

  vi.stubGlobal('requestAnimationFrame', (fn: (time: number) => void) => {
    rafCallbacks.push(fn);
    return rafCallbacks.length;
  });

  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  vi.resetModules();
  const mod = await import('../src/index');
  api = mod.default;
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function flushRaf(): void {
  // Flush all queued rAF callbacks (raf2 queues two levels)
  const max = 20;
  let i = 0;
  while (rafCallbacks.length > 0 && i < max) {
    const cbs = [...rafCallbacks];
    rafCallbacks.length = 0;
    for (const cb of cbs) cb(0);
    i++;
  }
}

describe('vertical bar animations', () => {
  it('sets initial height=0 and y=baseline before rAF', () => {
    const table = createTable();
    api.render(table);
    const bars = document.querySelectorAll('.data-chart-bar');
    expect(bars.length).toBeGreaterThan(0);
    for (const bar of bars) {
      expect(bar.getAttribute('height')).toBe('0');
    }
  });

  it('restores bar dimensions after rAF', () => {
    const table = createTable();
    api.render(table);
    flushRaf();
    const bars = document.querySelectorAll('.data-chart-bar');
    for (const bar of bars) {
      expect(parseFloat(bar.getAttribute('height') ?? '0')).toBeGreaterThan(0);
    }
  });

  it('sets transition style on bars', () => {
    const table = createTable();
    api.render(table);
    const bars = document.querySelectorAll('.data-chart-bar');
    for (const bar of bars) {
      const style = (bar as SVGRectElement).style.transition;
      expect(style).toContain('height');
      expect(style).toContain('ease-out');
    }
  });
});

describe('horizontal bar animations', () => {
  it('sets initial width=0 before rAF', () => {
    const table = createTable('bar', { 'data-chart-horizontal': '' });
    api.render(table);
    const bars = document.querySelectorAll('.data-chart-bar');
    expect(bars.length).toBeGreaterThan(0);
    for (const bar of bars) {
      expect(bar.getAttribute('width')).toBe('0');
    }
  });

  it('restores bar width after rAF', () => {
    const table = createTable('bar', { 'data-chart-horizontal': '' });
    api.render(table);
    flushRaf();
    const bars = document.querySelectorAll('.data-chart-bar');
    for (const bar of bars) {
      expect(parseFloat(bar.getAttribute('width') ?? '0')).toBeGreaterThan(0);
    }
  });
});

describe('line animations', () => {
  it('sets pathLength=1 and strokeDasharray/Offset before rAF', () => {
    const table = createTable('line');
    api.render(table);
    const lines = document.querySelectorAll('.data-chart-line');
    expect(lines.length).toBeGreaterThan(0);
    for (const line of lines) {
      expect(line.getAttribute('pathLength')).toBe('1');
      expect((line as SVGPathElement).style.strokeDasharray).toBe('1');
      expect((line as SVGPathElement).style.strokeDashoffset).toBe('1');
    }
  });

  it('resets strokeDashoffset to 0 after rAF', () => {
    const table = createTable('line');
    api.render(table);
    flushRaf();
    const lines = document.querySelectorAll('.data-chart-line');
    for (const line of lines) {
      expect((line as SVGPathElement).style.strokeDashoffset).toBe('0');
    }
  });
});

describe('slice animations', () => {
  it('sets initial scale(0.3) and opacity=0 before rAF', () => {
    const table = createPieTable();
    api.render(table);
    const slices = document.querySelectorAll('.data-chart-slice');
    expect(slices.length).toBeGreaterThan(0);
    for (const slice of slices) {
      expect((slice as SVGElement).style.transform).toBe('scale(0.3)');
      expect((slice as SVGElement).style.opacity).toBe('0');
    }
  });

  it('animates to scale(1) and opacity=0.85 after rAF', () => {
    const table = createPieTable();
    api.render(table);
    flushRaf();
    const slices = document.querySelectorAll('.data-chart-slice');
    for (const slice of slices) {
      expect((slice as SVGElement).style.transform).toBe('scale(1)');
      expect((slice as SVGElement).style.opacity).toBe('0.85');
    }
  });
});

describe('stacked bar animations', () => {
  it('groups bars by x coordinate with staggered delay', () => {
    const table = document.createElement('table');
    table.setAttribute('data-chart', 'bar');
    table.setAttribute('data-chart-stacked', '');
    table.setAttribute('data-chart-animate', '');
    table.innerHTML = `
      <thead><tr><th></th><th>Jan</th><th>Feb</th></tr></thead>
      <tbody>
        <tr><th>A</th><td>100</td><td>200</td></tr>
        <tr><th>B</th><td>50</td><td>80</td></tr>
      </tbody>
    `;
    document.body.appendChild(table);
    api.render(table);
    const bars = document.querySelectorAll('.data-chart-bar');
    // All bars should start at height=0
    for (const bar of bars) {
      expect(bar.getAttribute('height')).toBe('0');
    }
    flushRaf();
    // After rAF, all bars should have positive height
    for (const bar of bars) {
      expect(parseFloat(bar.getAttribute('height') ?? '0')).toBeGreaterThan(0);
    }
  });

  it('applies sequential delay per segment', () => {
    const table = document.createElement('table');
    table.setAttribute('data-chart', 'bar');
    table.setAttribute('data-chart-stacked', '');
    table.setAttribute('data-chart-animate', '');
    table.innerHTML = `
      <thead><tr><th></th><th>Jan</th></tr></thead>
      <tbody>
        <tr><th>A</th><td>100</td></tr>
        <tr><th>B</th><td>50</td></tr>
      </tbody>
    `;
    document.body.appendChild(table);
    api.render(table);
    const bars = document.querySelectorAll('.data-chart-bar');
    const delays = Array.from(bars).map((bar) => {
      const t = (bar as SVGRectElement).style.transition;
      const match = t.match(/(\d+)ms$/);
      return match ? parseInt(match[1]!, 10) : 0;
    });
    // Second segment should have larger delay
    expect(delays[1]! >= delays[0]!).toBe(true);
  });
});

describe('prefers-reduced-motion', () => {
  it('skips animations when reduce motion is preferred', async () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('reduce'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    vi.resetModules();
    const mod = await import('../src/index');
    const reducedApi = mod.default;

    const table = createTable();
    reducedApi.render(table);
    const svg = document.querySelector('svg');
    expect(svg!.classList.contains('dc-anim')).toBe(false);
    // Bars should have their final dimensions (not animated)
    const bars = document.querySelectorAll('.data-chart-bar');
    for (const bar of bars) {
      expect(parseFloat(bar.getAttribute('height') ?? '0')).toBeGreaterThan(0);
    }
  });
});
