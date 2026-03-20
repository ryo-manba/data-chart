import { describe, it, expect } from 'vitest';
import { getColors } from '../src/theme';

describe('getColors', () => {
  it('returns default palette when no user colors', () => {
    const colors = getColors(null, 3);
    expect(colors).toHaveLength(3);
    expect(colors[0]).toBe('#2d5be3');
  });

  it('parses user-specified colors', () => {
    const colors = getColors('#ff0000,#00ff00,#0000ff', 3);
    expect(colors).toEqual(['#ff0000', '#00ff00', '#0000ff']);
  });

  it('pads user colors with default palette when insufficient', () => {
    const colors = getColors('#ff0000', 3);
    expect(colors).toHaveLength(3);
    expect(colors[0]).toBe('#ff0000');
  });

  it('truncates user colors when more than needed', () => {
    const colors = getColors('#ff0000,#00ff00,#0000ff', 2);
    expect(colors).toHaveLength(2);
  });
});
