import type { ChartConfig, ParsedData } from '../types';
import { svgEl } from './common';
import { getThemeColor } from '../theme';
import { renderSlices } from './pie';

export function renderDonut(data: ParsedData, config: ChartConfig, colors: string[]): SVGSVGElement {
  const { svg, total } = renderSlices(data, colors, 54);
  if (!total) return svg;
  const cx = 150, cy = 120;
  const tc = getThemeColor('text'), tm = getThemeColor('textMuted');
  const t1 = svgEl('text', { x: cx, y: cy + 6, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 700, 'font-family': 'var(--dc-font-family)', fill: tc });
  t1.textContent = String(Math.round(total));
  svg.appendChild(t1);
  const t2 = svgEl('text', { x: cx, y: cy + 22, 'text-anchor': 'middle', 'font-size': 12, 'font-family': 'var(--dc-font-family)', fill: tm });
  t2.textContent = 'Total';
  svg.appendChild(t2);
  return svg;
}
