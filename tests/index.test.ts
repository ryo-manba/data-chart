import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { DataChartAPI } from '../src/types';

function createTable(type = 'bar', attrs: Record<string, string> = {}): HTMLTableElement {
  const table = document.createElement('table');
  table.setAttribute('data-chart', type);
  table.innerHTML = `
    <caption>Test Chart</caption>
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
  table.innerHTML = `
    <caption>Pie Chart</caption>
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

beforeEach(async () => {
  document.body.innerHTML = '';
  document.getElementById('dc-s')?.remove();
  vi.resetModules();
  const mod = await import('../src/index');
  api = mod.default;
});

describe('render', () => {
  it('creates container and SVG', () => {
    const table = createTable();
    const svg = api.render(table);
    expect(svg.tagName).toBe('svg');
    const container = table.closest('.data-chart-container');
    expect(container).not.toBeNull();
    expect(container!.querySelector('svg')).toBe(svg);
  });

  it('adds rendered class and aria-hidden to table', () => {
    const table = createTable();
    api.render(table);
    expect(table.classList.contains('data-chart-rendered')).toBe(true);
    expect(table.getAttribute('aria-hidden')).toBe('true');
  });

  it('sets role=img and aria-label on SVG', () => {
    const table = createTable();
    const svg = api.render(table);
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBeTruthy();
  });

  it('uses caption for aria-label when available', () => {
    const table = createTable();
    const svg = api.render(table);
    expect(svg.getAttribute('aria-label')).toContain('Test Chart');
  });

  it('renders each chart type', () => {
    for (const type of ['bar', 'line', 'area', 'pie', 'donut']) {
      document.body.innerHTML = '';
      const table = type === 'pie' || type === 'donut' ? createPieTable(type) : createTable(type);
      const svg = api.render(table);
      expect(svg.tagName).toBe('svg');
    }
  });

  it('throws on invalid chart type', () => {
    const table = createTable('invalid');
    expect(() => api.render(table)).toThrow('INVALID_TYPE');
  });
});

describe('destroy', () => {
  it('removes container and restores table', () => {
    const table = createTable();
    api.render(table);
    api.destroy(table);
    expect(table.closest('.data-chart-container')).toBeNull();
    expect(document.body.contains(table)).toBe(true);
  });

  it('removes rendered class and aria-hidden', () => {
    const table = createTable();
    api.render(table);
    api.destroy(table);
    expect(table.classList.contains('data-chart-rendered')).toBe(false);
    expect(table.hasAttribute('aria-hidden')).toBe(false);
  });

  it('destroys all charts when called without arguments', () => {
    const t1 = createTable();
    const t2 = createTable();
    api.render(t1);
    api.render(t2);
    api.destroy();
    expect(document.querySelectorAll('.data-chart-container').length).toBe(0);
  });
});

describe('refresh', () => {
  it('produces a new SVG', () => {
    const table = createTable();
    const svg1 = api.render(table);
    const svg2 = api.refresh(table);
    expect(svg2.tagName).toBe('svg');
    expect(svg2).not.toBe(svg1);
  });

  it('reflects data changes', () => {
    const table = createTable();
    api.render(table);
    // Change data
    const cells = table.querySelectorAll('td');
    cells[0]!.textContent = '999';
    const svg = api.refresh(table);
    expect(svg.tagName).toBe('svg');
  });
});

describe('events', () => {
  it('dispatches datachart:rendered with detail', () => {
    const table = createTable();
    let detail: { svg: SVGSVGElement; data: unknown } | null = null;
    table.addEventListener('datachart:rendered', ((e: CustomEvent) => {
      detail = e.detail;
    }) as EventListener);
    api.render(table);
    expect(detail).not.toBeNull();
    expect(detail!.svg).toBeInstanceOf(SVGSVGElement);
    expect(detail!.data).toBeDefined();
  });

  it('dispatches datachart:error on parse failure', () => {
    const table = document.createElement('table');
    table.setAttribute('data-chart', 'bar');
    // Empty table — no valid data
    document.body.appendChild(table);
    let errorDetail: { message: string } | null = null;
    table.addEventListener('datachart:error', ((e: CustomEvent) => {
      errorDetail = e.detail;
    }) as EventListener);
    expect(() => api.render(table)).toThrow();
    expect(errorDetail).not.toBeNull();
    expect(errorDetail!.message).toBeTruthy();
  });

  it('dispatches datachart:destroyed', () => {
    const table = createTable();
    api.render(table);
    let destroyed = false;
    table.addEventListener('datachart:destroyed', () => { destroyed = true; });
    api.destroy(table);
    expect(destroyed).toBe(true);
  });
});


describe('injectStyles', () => {
  it('inserts style element', () => {
    createTable();
    api.init();
    expect(document.getElementById('dc-s')).not.toBeNull();
  });

  it('does not duplicate style element', () => {
    createTable();
    api.init();
    api.init();
    expect(document.querySelectorAll('#dc-s').length).toBe(1);
  });
});
