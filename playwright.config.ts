import { defineConfig } from '@playwright/test';
import { baseConfig } from './realworld/specs/e2e/playwright.base';

export default defineConfig({
  ...baseConfig,
  testDir: './realworld/specs/e2e',
  use: {
    ...baseConfig.use,
    baseURL: 'http://localhost:8080',
  },
  webServer: {
    command: 'bun run serve',
    url: 'http://127.0.0.1:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
