// @ts-nocheck
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    exclude: [
      '**/e2e/**',
      '**/directives/**/*.spec.ts',
      '**/app.spec.ts',
    ],
  },
});
