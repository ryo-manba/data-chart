/**
 * All available chart types in data-chart.
 */
export const CHART_TYPES = ['bar', 'line', 'area', 'pie', 'donut'] as const;
export type DataChartType = (typeof CHART_TYPES)[number];

/**
 * Grid line options.
 */
export const GRID_OPTIONS = ['y', 'x', 'both', 'none'] as const;
export type DataChartGrid = (typeof GRID_OPTIONS)[number];

/**
 * Legend position options.
 */
export const LEGEND_POSITIONS = ['top', 'bottom', 'none'] as const;
export type DataChartLegend = (typeof LEGEND_POSITIONS)[number];

/**
 * data-chart HTML attributes for chart rendering.
 */
export interface DataChartAttributes {
  /** Chart type to render */
  'data-chart'?: DataChartType | (string & {});
  /** Chart height in px (default: 220) */
  'data-chart-height'?: string;
  /** Custom colors as comma-separated hex values */
  'data-chart-colors'?: string;
  /** Grid line direction (default: "y") */
  'data-chart-grid'?: DataChartGrid;
  /** Legend position (default: auto) */
  'data-chart-legend'?: DataChartLegend;
  /** Bar corner radius in px (default: 3) */
  'data-chart-radius'?: string;
  /** Render as horizontal bar chart */
  'data-chart-horizontal'?: string | boolean;
  /** Render as stacked bar chart */
  'data-chart-stacked'?: string | boolean;

  /** Enable entrance animations */
  'data-chart-animate'?: string | boolean;
  /** Animation duration per element in ms (default: 600) */
  'data-chart-animate-duration'?: string;
  /** Stagger delay between elements in ms (default: 60) */
  'data-chart-animate-stagger'?: string;
}

// React JSX support
declare global {
  namespace React {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface HTMLAttributes<T> extends DataChartAttributes {}
  }
}
