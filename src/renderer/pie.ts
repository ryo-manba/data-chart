import type { ChartConfig, ParsedData } from '../types';
import { createSvg, svgEl, renderCircularLegend } from './common';
import { getThemeColor } from '../theme';

export function renderSlices(
  data: ParsedData, colors: string[], inner: number,
): { svg: SVGSVGElement; values: number[]; total: number } {
  const W = 300, H = 280, cx = 150, cy = 120, r = 90;
  const svg = createSvg(W, H);
  const sr = data.datasets[0];
  if (!sr) return { svg, values: [], total: 0 };
  const values = sr.map((v) => Math.abs(v));
  const total = values.reduce((a, b) => a + b, 0) || 1;
  const bg = getThemeColor('bg');
  const g = svgEl('g', { class: 'data-chart-series', 'data-series': data.headers[0] ?? '' });
  let ang = -Math.PI / 2;
  for (let i = 0; i < values.length; i++) {
    const sa = (values[i]! / total) * Math.PI * 2, end = ang + sa, la = sa > Math.PI ? 1 : 0;
    const cs = Math.cos(ang), sn = Math.sin(ang), ce = Math.cos(end), se = Math.sin(end);
    let d: string;
    if (inner > 0) {
      d = `M${cx+r*cs},${cy+r*sn} A${r},${r} 0 ${la} 1 ${cx+r*ce},${cy+r*se} L${cx+inner*ce},${cy+inner*se} A${inner},${inner} 0 ${la} 0 ${cx+inner*cs},${cy+inner*sn} Z`;
    } else {
      d = `M${cx},${cy} L${cx+r*cs},${cy+r*sn} A${r},${r} 0 ${la} 1 ${cx+r*ce},${cy+r*se} Z`;
    }
    g.appendChild(svgEl('path', { class: 'data-chart-slice', d, fill: colors[i % colors.length] ?? '#2d5be3', opacity: 0.85, stroke: bg, 'stroke-width': 2 }));
    ang = end;
  }
  svg.appendChild(g);
  renderCircularLegend(svg, data.labels, values, total, colors, H);
  return { svg, values, total };
}

export function renderPie(data: ParsedData, config: ChartConfig, colors: string[]): SVGSVGElement {
  return renderSlices(data, colors, 0).svg;
}
