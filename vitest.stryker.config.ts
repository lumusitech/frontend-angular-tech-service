import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/app/core/**/*.spec.ts', 'src/app/shared/pipes/**/*.spec.ts'],
    exclude: [
      '**/e2e/**',
      '**/directives/**/*.spec.ts',
      '**/components/**/*.spec.ts',
      '**/features/**/*.spec.ts',
      '**/app.spec.ts',
    ],
  },
});
