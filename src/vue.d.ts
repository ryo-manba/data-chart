import type { DataChartAttributes } from './attributes';

// Vue template support
declare module 'vue' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface HTMLAttributes extends DataChartAttributes {}
}
