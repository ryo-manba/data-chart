import { describe, it, expect } from 'vitest';
import { forwardAnimAttributes } from '../src/forward';

describe('forwardAnimAttributes', () => {
  it('copies data-anim-* attributes from table to container', () => {
    const table = document.createElement('table');
    table.setAttribute('data-anim', 'fade-up');
    table.setAttribute('data-anim-trigger', 'scroll');
    table.setAttribute('data-anim-duration', '800');

    const container = document.createElement('div');
    const forwarded = forwardAnimAttributes(table, container);

    expect(container.getAttribute('data-anim')).toBe('fade-up');
    expect(container.getAttribute('data-anim-trigger')).toBe('scroll');
    expect(container.getAttribute('data-anim-duration')).toBe('800');
    expect(forwarded).toEqual(['data-anim', 'data-anim-trigger', 'data-anim-duration']);
  });

  it('does not copy non-data-anim attributes', () => {
    const table = document.createElement('table');
    table.setAttribute('data-chart', 'bar');
    table.setAttribute('data-chart-height', '300');
    table.setAttribute('data-anim', 'slide-right');
    table.setAttribute('class', 'my-table');
    table.setAttribute('id', 'test');

    const container = document.createElement('div');
    const forwarded = forwardAnimAttributes(table, container);

    expect(container.hasAttribute('data-chart')).toBe(false);
    expect(container.hasAttribute('data-chart-height')).toBe(false);
    expect(container.hasAttribute('class')).toBe(false);
    expect(container.hasAttribute('id')).toBe(false);
    expect(container.getAttribute('data-anim')).toBe('slide-right');
    expect(forwarded).toEqual(['data-anim']);
  });

  it('returns empty array when no data-anim-* attributes exist', () => {
    const table = document.createElement('table');
    table.setAttribute('data-chart', 'bar');

    const container = document.createElement('div');
    const forwarded = forwardAnimAttributes(table, container);

    expect(forwarded).toEqual([]);
    expect(container.attributes.length).toBe(0);
  });
});
