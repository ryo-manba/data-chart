import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const BUDGET = 6144; // 6KB

const files = [
  { path: 'dist/data-chart.js', label: 'ESM' },
  { path: 'dist/data-chart.iife.js', label: 'IIFE' },
];

let failed = false;

for (const { path, label } of files) {
  try {
    const raw = readFileSync(path);
    const gzipped = gzipSync(raw, { level: 9 });
    const kb = (gzipped.length / 1024).toFixed(2);
    const status = gzipped.length <= BUDGET ? '✓' : '✗ OVER BUDGET';
    console.log(`${label}: ${kb}KB gzip (${raw.length} bytes raw) ${status}`);
    if (gzipped.length > BUDGET) failed = true;
  } catch {
    console.log(`${label}: file not found`);
    failed = true;
  }
}

if (failed) {
  console.error('\nBundle size budget exceeded! Max: 6KB gzip');
  process.exit(1);
}
