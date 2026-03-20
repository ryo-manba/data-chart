import type { ChartConfig, ParsedData } from "../types";
import {
  setupChart,
  seriesGroup,
  renderLegend,
  computePoints,
  buildPath,
  renderDots,
  renderLinePath,
} from "./common";
import { getThemeColor } from "../theme";

export function renderLine(data: ParsedData, config: ChartConfig, colors: string[]): SVGSVGElement {
  const { svg, layout, maxValue } = setupChart(config, data);
  const n = data.labels.length,
    bg = getThemeColor("bg");

  for (let s = 0; s < data.headers.length; s++) {
    const sr = data.datasets[s];
    if (!sr) continue;
    const c = colors[s] ?? colors[0] ?? "#2d5be3";
    const g = seriesGroup(data, s);
    const pts = computePoints(sr, n, layout, maxValue);
    renderLinePath(g, buildPath(pts), c);
    renderDots(g, pts, c, bg);
    svg.appendChild(g);
  }

  renderLegend(svg, layout, data, colors, config);
  return svg;
}
