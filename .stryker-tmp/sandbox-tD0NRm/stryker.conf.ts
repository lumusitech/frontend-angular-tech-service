// @ts-nocheck
import { defineConfig } from '@stryker-mutator/core';

export default defineConfig({
  testRunner: 'vitest',
  checkers: [],
  vitest: {
    projectType: 'custom',
    configFile: 'vitest.stryker.config.ts',
  },
  coverageAnalysis: 'perTest',
  mutate: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/directives/**/*.ts',
    '!src/**/e2e/**',
  ],
  thresholds: {
    high: 80,
    low: 60,
  },
  timeouts: {
    concurrent: 10000,
    perTest: 5000,
  },
  reporters: ['html', 'clear-text', 'progress'],
  htmlReporter: {
    fileName: 'reports/mutation.html',
  },
  logLevel: 'info',
  concurrency: 2,
});
