import type { ChartConfig, ParsedData } from "../types";
import {
  setupChart,
  seriesGroup,
  renderLegend,
  svgEl,
  computePoints,
  buildPath,
  renderDots,
  renderLinePath,
} from "./common";
import { getThemeColor } from "../theme";

export function renderArea(data: ParsedData, config: ChartConfig, colors: string[]): SVGSVGElement {
  const { svg, layout, maxValue } = setupChart(config, data);
  const n = data.labels.length,
    bg = getThemeColor("bg");
  const bottom = layout.paddingTop + layout.chartHeight;

  for (let s = 0; s < data.headers.length; s++) {
    const sr = data.datasets[s];
    if (!sr) continue;
    const c = colors[s] ?? colors[0] ?? "#2d5be3";
    const g = seriesGroup(data, s);
    const pts = computePoints(sr, n, layout, maxValue);
    const lp = buildPath(pts);
    const fx = pts[0]?.x ?? layout.paddingLeft;
    const lx = pts[pts.length - 1]?.x ?? layout.paddingLeft + layout.chartWidth;
    g.appendChild(
      svgEl("path", {
        class: "data-chart-area",
        d: `${lp} L${lx},${bottom} L${fx},${bottom} Z`,
        fill: c,
        opacity: 0.15,
      }),
    );
    renderLinePath(g, lp, c);
    renderDots(g, pts, c, bg);
    svg.appendChild(g);
  }

  renderLegend(svg, layout, data, colors, config);
  return svg;
}
