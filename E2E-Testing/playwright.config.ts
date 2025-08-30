import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['list'] // Added list reporter for console output
  ],
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on', // Changed from 'on-first-retry' to 'on' for comprehensive tracing
    screenshot: 'on', // Changed from 'only-on-failure' to 'on' to capture all screenshots
    video: 'on', // Changed from 'retain-on-failure' to 'on' to capture all videos
    // Enhanced visual capture settings
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
  // Enhanced test results directory
  outputDir: 'test-results',
  // Capture screenshots and videos for all tests
  preserveOutput: 'always',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'cd ../cskb-merged-ui && npm start',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
});
