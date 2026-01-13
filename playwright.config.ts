import fs from 'fs';

import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Use .env.playwright.local in local development if it exists
// IMPORTANT: Load env vars BEFORE importing AppConfig
const envFilePath = '.env.playwright.local';
if (!process.env.CI && fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath });
}

import AppConfig from './src/domain/headless-cms/config';
import { getCookieConsentGivenCookies } from './src/utils/getCookieConsentGivenCookies';

// Determine used web server type (i.e. development or production)
const webServerType = process.env.PLAYWRIGHT_WEB_SERVER ?? '';

if (!['', 'development', 'production'].includes(webServerType)) {
  throw new Error(
    `Invalid PLAYWRIGHT_WEB_SERVER: ${webServerType}.` +
      'Default is production. Only other option is development.'
  );
}
const useDevServer = webServerType == 'development';

// See https://playwright.dev/docs/test-configuration.
export default defineConfig({
  testDir: './src/playwright/tests',
  // Run tests in files in parallel
  fullyParallel: true,
  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,
  // Retry on CI only - also retry locally for dev server due to flakiness
  retries: process.env.CI ? 3 : (useDevServer ? 2 : 0),
  // Opt out of parallel tests on CI. Limit workers for dev server to avoid overwhelming it
  workers: process.env.CI ? 1 : (useDevServer ? 3 : undefined),
  // Reporter to use. See https://playwright.dev/docs/test-reporters
  reporter: 'html',
  // Increase timeout for development server (slow page compilation)
  // Production server is much faster  
  // Extra long timeout for dev server due to slow page compilation
  timeout: useDevServer ? 180000 : 30000, // 3 minutes for dev, 30 seconds for prod
  // Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions.
  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: process.env.NEXT_PUBLIC_APP_ORIGIN,

    // Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
    trace: 'on-first-retry',
    
    // Increase navigation timeout for 8evelopment server
    navigationTimeout: useDevServer ? 120000 : 30000,

    storageState: {
      cookies: getCookieConsentGivenCookies({ domain: AppConfig.hostname }),
      origins: [],
    },
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
    url: process.env.NEXT_PUBLIC_APP_ORIGIN,
    reuseExistingServer: !process.env.CI,
    // Increase timeout for development server startup
    timeout: useDevServer ? 180000 : 120000, // 3 minutes for dev, 2 minutes for prod
  },
});
