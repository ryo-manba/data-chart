import { describe, it, expect } from 'vitest';
import { renderBar } from '../src/renderer/bar';
import { renderLine } from '../src/renderer/line';
import { renderArea } from '../src/renderer/area';
import { renderPie } from '../src/renderer/pie';
import { renderDonut } from '../src/renderer/donut';
import type { ChartConfig, ParsedData } from '../src/types';

function makeData(overrides?: Partial<ParsedData>): ParsedData {
  return {
    headers: ['Sales', 'Profit'],
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [
      [100, 200, 150],
      [80, 120, 90],
    ],
    ...overrides,
  };
}

function makeConfig(overrides?: Partial<ChartConfig>): ChartConfig {
  return {
    type: 'bar',
    height: 220,
    colors: ['#2d5be3', '#1a8c5a'],
    grid: 'y',
    legend: 'top',
    radius: 3,
    horizontal: false,
    stacked: false,
    source: false,
    animate: false,
    animDuration: 600,
    animStagger: 60,
    ...overrides,
  };
}

function assertNoAnimate(svg: SVGSVGElement): void {
  const animateElements = svg.querySelectorAll('animate, animateTransform, animateMotion, set');
  expect(animateElements.length).toBe(0);
}

describe('bar renderer', () => {
  it('renders vertical bars', () => {
    const svg = renderBar(makeData(), makeConfig(), ['#2d5be3', '#1a8c5a']);
    expect(svg.tagName).toBe('svg');
    expect(svg.querySelectorAll('.data-chart-bar').length).toBe(6); // 3 labels x 2 series
  });

  it('renders horizontal bars', () => {
    const data = makeData({ headers: ['Sales'], datasets: [[100, 200, 150]] });
    const svg = renderBar(data, makeConfig({ horizontal: true }), ['#2d5be3']);
    expect(svg.querySelectorAll('.data-chart-bar').length).toBe(3);
  });

  it('renders stacked bars', () => {
    const svg = renderBar(makeData(), makeConfig({ stacked: true }), ['#2d5be3', '#1a8c5a']);
    expect(svg.querySelectorAll('.data-chart-bar').length).toBe(6); // 3 labels x 2 series
  });

  it('contains no animate elements', () => {
    const svg = renderBar(makeData(), makeConfig(), ['#2d5be3', '#1a8c5a']);
    assertNoAnimate(svg);
  });

  it('bars have opacity 0.9', () => {
    const svg = renderBar(makeData(), makeConfig(), ['#2d5be3', '#1a8c5a']);
    const bars = svg.querySelectorAll('.data-chart-bar');
    for (const bar of bars) {
      expect(bar.getAttribute('opacity')).toBe('0.9');
    }
  });
});

describe('line renderer', () => {
  it('renders line paths and dots', () => {
    const svg = renderLine(makeData(), makeConfig({ type: 'line' }), ['#2d5be3', '#1a8c5a']);
    expect(svg.querySelectorAll('.data-chart-line').length).toBe(2);
    expect(svg.querySelectorAll('.data-chart-dot').length).toBe(6);
  });

  it('contains no animate elements', () => {
    const svg = renderLine(makeData(), makeConfig({ type: 'line' }), ['#2d5be3', '#1a8c5a']);
    assertNoAnimate(svg);
  });
});

describe('area renderer', () => {
  it('renders area paths, line paths, and dots', () => {
    const svg = renderArea(makeData(), makeConfig({ type: 'area' }), ['#2d5be3', '#1a8c5a']);
    expect(svg.querySelectorAll('.data-chart-area').length).toBe(2);
    expect(svg.querySelectorAll('.data-chart-line').length).toBe(2);
    expect(svg.querySelectorAll('.data-chart-dot').length).toBe(6);
  });

  it('area fills have opacity 0.15', () => {
    const svg = renderArea(makeData(), makeConfig({ type: 'area' }), ['#2d5be3', '#1a8c5a']);
    const areas = svg.querySelectorAll('.data-chart-area');
    for (const area of areas) {
      expect(area.getAttribute('opacity')).toBe('0.15');
    }
  });

  it('contains no animate elements', () => {
    const svg = renderArea(makeData(), makeConfig({ type: 'area' }), ['#2d5be3', '#1a8c5a']);
    assertNoAnimate(svg);
  });
});

describe('pie renderer', () => {
  it('renders slices', () => {
    const data = makeData({
      headers: ['Revenue'],
      labels: ['A', 'B', 'C'],
      datasets: [[30, 50, 20]],
    });
    const svg = renderPie(data, makeConfig({ type: 'pie' }), ['#2d5be3', '#1a8c5a', '#d94e3f']);
    expect(svg.querySelectorAll('.data-chart-slice').length).toBe(3);
  });

  it('slices have opacity 0.85', () => {
    const data = makeData({
      headers: ['Revenue'],
      labels: ['A', 'B'],
      datasets: [[60, 40]],
    });
    const svg = renderPie(data, makeConfig({ type: 'pie' }), ['#2d5be3', '#1a8c5a']);
    const slices = svg.querySelectorAll('.data-chart-slice');
    for (const slice of slices) {
      expect(slice.getAttribute('opacity')).toBe('0.85');
    }
  });

  it('contains no animate elements', () => {
    const data = makeData({
      headers: ['Revenue'],
      labels: ['A', 'B'],
      datasets: [[60, 40]],
    });
    const svg = renderPie(data, makeConfig({ type: 'pie' }), ['#2d5be3', '#1a8c5a']);
    assertNoAnimate(svg);
  });

  it('uses absolute values for negative numbers', () => {
    const data = makeData({
      headers: ['Revenue'],
      labels: ['A', 'B'],
      datasets: [[-30, 70]],
    });
    const svg = renderPie(data, makeConfig({ type: 'pie' }), ['#2d5be3', '#1a8c5a']);
    expect(svg.querySelectorAll('.data-chart-slice').length).toBe(2);
  });
});

describe('donut renderer', () => {
  it('renders slices with center text', () => {
    const data = makeData({
      headers: ['Revenue'],
      labels: ['A', 'B', 'C'],
      datasets: [[30, 50, 20]],
    });
    const svg = renderDonut(data, makeConfig({ type: 'donut' }), ['#2d5be3', '#1a8c5a', '#d94e3f']);
    expect(svg.querySelectorAll('.data-chart-slice').length).toBe(3);
    // Center text should show total
    const texts = svg.querySelectorAll('text');
    const totalText = Array.from(texts).find((t) => t.textContent === '100');
    expect(totalText).toBeDefined();
  });

  it('contains no animate elements', () => {
    const data = makeData({
      headers: ['Revenue'],
      labels: ['A', 'B'],
      datasets: [[60, 40]],
    });
    const svg = renderDonut(data, makeConfig({ type: 'donut' }), ['#2d5be3', '#1a8c5a']);
    assertNoAnimate(svg);
  });
});
