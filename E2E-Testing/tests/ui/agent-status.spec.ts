import { test, expect } from '@playwright/test';
import { setupTest, teardownTest } from '../../utils/test-helpers';

test.describe('Agent Status Page', () => {
  test.beforeEach(async ({ page }) => {
    await setupTest(page);
    await page.goto('/agent-status');
  });

  test.afterEach(async ({ page }) => {
    await teardownTest(page);
  });

  test('should load agent status page successfully', async ({ page }) => {
    await expect(page.locator('h1:has-text("Agent Status")')).toBeVisible();
  });

  test('should display agent information', async ({ page }) => {
    await expect(page.locator('.card:has-text("Total Agents")')).toBeVisible();
  });
});
