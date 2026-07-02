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
    'src/app/core/services/auth.service.ts',
    'src/app/core/services/clients.service.ts',
    'src/app/core/services/work-orders.service.ts',
    'src/app/core/services/billing.service.ts',
    'src/app/core/services/reports.service.ts',
    'src/app/core/services/notifications.service.ts',
    'src/app/core/guards/auth.guard.ts',
    'src/app/core/interceptors/auth.interceptor.ts',
    'src/app/shared/pipes/status-class.pipe.ts',
    'src/app/shared/pipes/status-label.pipe.ts',
    'src/app/shared/pipes/currency-ars.pipe.ts',
    'src/app/shared/pipes/relative-date.pipe.ts',
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
