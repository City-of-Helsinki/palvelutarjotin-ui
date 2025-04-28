import fs from 'fs';

import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

import { COOKIE_CONSENT_GIVEN_COOKIES } from './src/playwright/constants';

if (!process.env.CI) {
  const envFilePath = '.env.test.local';

  if (!fs.existsSync(envFilePath)) {
    throw new Error(
      `Please setup ${envFilePath} for local Playwright testing.`
    );
  }
  dotenv.config({ path: envFilePath });
}

const useDevServer = process.env.PLAYWRIGHT_WEB_SERVER == 'dev';

// See https://playwright.dev/docs/test-configuration.
export default defineConfig({
  testDir: './src/playwright/tests',
  // Run tests in files in parallel
  fullyParallel: true,
  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,
  // Retry on CI only
  retries: process.env.CI ? 3 : 0,
  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,
  // Reporter to use. See https://playwright.dev/docs/test-reporters
  reporter: 'html',
  // Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions.
  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: process.env.NEXT_PUBLIC_APP_ORIGIN,

    // Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
    trace: 'on-first-retry',

    storageState: { cookies: COOKIE_CONSENT_GIVEN_COOKIES, origins: [] },
  },

  // Test with the following browsers:
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: useDevServer ? 'yarn dev' : 'yarn start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
