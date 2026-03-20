import { describe, it, expect } from 'vitest';
import { generateAriaLabel } from '../src/a11y';

describe('generateAriaLabel', () => {
  it('uses caption when available', () => {
    const label = generateAriaLabel('bar', {
      headers: ['Sales'],
      labels: ['Jan'],
      datasets: [[100]],
      caption: 'Monthly Sales',
    });
    expect(label).toBe('Monthly Sales');
  });

  it('generates label from type and series names', () => {
    const label = generateAriaLabel('line', {
      headers: ['Revenue', 'Profit'],
      labels: ['Jan'],
      datasets: [[100], [50]],
    });
    expect(label).toBe('line chart: Revenue, Profit');
  });
});
