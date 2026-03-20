import type { ChartConfig, ParsedData } from './types';

export function debugLog(
  table: HTMLTableElement,
  data: ParsedData,
  config: ChartConfig,
  layout: { chartWidth: number; chartHeight: number; maxValue: number },
  forwardedAttrs: string[],
  startTime: number,
): void {
  if (!table.hasAttribute('data-chart-debug')) return;

  console.group(`[data-chart] ${config.type}`);
  console.log('Parsed data:', data);
  console.log('Chart config:', config);
  console.log('Computed layout:', layout);
  console.log('data-anim attrs forwarded:', forwardedAttrs);
  console.log('Render time:', `${performance.now() - startTime}ms`);
  console.groupEnd();
}
