import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './specs',
  timeout: 30000,
  // El storefront público se vuelve inestable con muchas sesiones concurrentes.
  workers: 2,
  expect: {
    timeout: 10000,
  },
  fullyParallel: true,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  use: {
    baseURL: 'https://comfrt.com/en-ar',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'desktop-chrome',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'desktop-safari',
      use: {
        ...devices['Desktop Safari'],
      },
    },
    {
      name: 'iphone-16',
      use: {
        ...devices['iPhone 16'],
      },
    },
    {
      name: 'samsung-s25-ultra',
      use: {
        browserName: 'chromium',
        viewport: { width: 384, height: 854 },
        userAgent:
          'Mozilla/5.0 (Linux; Android 15; SAMSUNG SM-S938B Build/ABR) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
