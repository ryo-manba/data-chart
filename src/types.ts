export interface ParsedData {
  headers: string[];
  labels: string[];
  datasets: number[][];
  caption?: string;
}

export type ChartType = 'bar' | 'line' | 'area' | 'pie' | 'donut';

export type GridOption = 'y' | 'x' | 'both' | 'none';

export type LegendPosition = 'top' | 'bottom' | 'none';

export interface ChartConfig {
  type: ChartType;
  height: number;
  colors: string[];
  grid: GridOption;
  legend: LegendPosition;
  radius: number;
  horizontal: boolean;
  stacked: boolean;
  source: boolean;
  debug: boolean;
  animate: boolean;
  animDuration: number;
  animStagger: number;
}

export interface ChartLayout {
  width: number;
  height: number;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  chartWidth: number;
  chartHeight: number;
}

export interface DataChartAPI {
  init(): void;
  render(table: HTMLTableElement): SVGSVGElement;
  refresh(table: HTMLTableElement): SVGSVGElement;
  destroy(table?: HTMLTableElement): void;
  version: string;
}

declare global {
  interface Window {
    dataChart: DataChartAPI;
  }
}
