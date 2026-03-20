import type { ChartConfig, ParsedData } from '../types';
import { createSvg, getStackedMaxValue, setupChart, seriesGroup, renderLegend, svgEl, addBar } from './common';
import { getThemeColor } from '../theme';

export function renderBar(data: ParsedData, config: ChartConfig, colors: string[]): SVGSVGElement {
  if (config.horizontal) return renderH(data, config, colors);

  const mv = config.stacked ? getStackedMaxValue(data.datasets) : undefined;
  const { svg, layout, maxValue } = setupChart(config, data, mv);

  const ng = data.labels.length, ns = data.headers.length;
  const gw = layout.chartWidth / ng;
  const bw = config.stacked ? Math.min(48, gw * 0.7) : Math.min(32, (gw * 0.7) / ns);

  for (let s = 0; s < ns; s++) {
    const sr = data.datasets[s];
    if (!sr) continue;
    const c = colors[s] ?? colors[0] ?? '#2d5be3';
    const g = seriesGroup(data, s);

    for (let i = 0; i < ng; i++) {
      const gc = layout.paddingLeft + gw * i + gw / 2;
      if (config.stacked) {
        const v = Math.max(0, sr[i] ?? 0);
        let cum = 0;
        for (let p = 0; p < s; p++) cum += Math.max(0, data.datasets[p]?.[i] ?? 0);
        const sh = (v / maxValue) * layout.chartHeight;
        addBar(g, gc - bw / 2, layout.paddingTop + layout.chartHeight - (cum / maxValue) * layout.chartHeight - sh, bw, sh, s === ns - 1 ? config.radius : 0, c);
      } else {
        const v = sr[i] ?? 0;
        const bh = (Math.abs(v) / maxValue) * layout.chartHeight;
        addBar(g, gc - (ns * (bw + 2)) / 2 + s * (bw + 2), v >= 0 ? layout.paddingTop + layout.chartHeight - bh : layout.paddingTop + layout.chartHeight, bw, bh, config.radius, c);
      }
    }
    svg.appendChild(g);
  }

  renderLegend(svg, layout, data, colors, config);
  return svg;
}

function renderH(data: ParsedData, config: ChartConfig, colors: string[]): SVGSVGElement {
  const bh = 26, rg = 10, lm = 90, nr = data.labels.length;
  const svg = createSvg(500, 40 + nr * (bh + rg));
  const cw = 390, sr = data.datasets[0];
  if (!sr) return svg;

  const mx = Math.max(...sr.map(Math.abs)) || 1;
  const c = colors[0] ?? '#2d5be3';
  const gc = getThemeColor('grid'), tc = getThemeColor('textMuted');
  const g = seriesGroup(data, 0);
  const ff = 'var(--dc-font-family)';

  for (let i = 0; i < nr; i++) {
    const y = 20 + i * (bh + rg), v = sr[i] ?? 0, w = (Math.abs(v) / mx) * cw;
    g.appendChild(svgEl('rect', { x: lm, y, width: cw, height: bh, rx: config.radius, fill: gc, opacity: 0.4 }));
    addBar(g, lm, y, w, bh, config.radius, c);
    const lb = svgEl('text', { x: lm - 8, y: y + bh / 2 + 4, 'text-anchor': 'end', 'font-size': 11, 'font-family': ff, fill: tc });
    lb.textContent = data.labels[i] ?? '';
    g.appendChild(lb);
    const vl = svgEl('text', { x: lm + w + 8, y: y + bh / 2 + 4, 'font-size': 10, 'font-family': ff, fill: tc });
    vl.textContent = String(v);
    g.appendChild(vl);
  }
  svg.appendChild(g);
  return svg;
}
