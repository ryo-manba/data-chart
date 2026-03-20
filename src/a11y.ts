import type { ChartType, ParsedData } from './types';

export function generateAriaLabel(type: ChartType, data: ParsedData): string {
  if (data.caption) {
    return data.caption;
  }

  const seriesNames = data.headers.join(', ');
  return `${type} chart: ${seriesNames}`;
}

export function applyA11y(
  svg: SVGSVGElement,
  table: HTMLTableElement,
  type: ChartType,
  data: ParsedData,
): void {
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', generateAriaLabel(type, data));

  table.setAttribute('aria-hidden', 'true');
}
