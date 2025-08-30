import { test, expect } from '@playwright/test';
import { setupTest, teardownTest } from '../../utils/test-helpers';

test.describe('System Health Page', () => {
  test.beforeEach(async ({ page }) => {
    await setupTest(page);
    await page.goto('/system-health');
  });

  test.afterEach(async ({ page }) => {
    await teardownTest(page);
  });

  test('should load system health page successfully', async ({ page }) => {
    await expect(page.locator('h1:has-text("System Health")')).toBeVisible();
  });

  test('should display system metrics', async ({ page }) => {
    await expect(page.locator('.card:has-text("System Status")')).toBeVisible();
  });
});
