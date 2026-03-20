import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [
    dts({
      rollupTypes: true,
      outDir: 'dist',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'dataChart',
      formats: ['es', 'umd', 'iife'],
      fileName: (format) => {
        if (format === 'es') return 'data-chart.js';
        if (format === 'umd') return 'data-chart.umd.cjs';
        if (format === 'iife') return 'data-chart.iife.js';
        return `data-chart.${format}.js`;
      },
    },
    rollupOptions: {
      output: {
        name: 'dataChart',
        exports: 'named',
      },
    },
    minify: 'esbuild',
    target: 'es2022',
    outDir: 'dist',
    emptyOutDir: true,
  },
});
