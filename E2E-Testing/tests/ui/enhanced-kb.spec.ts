import { test, expect } from '@playwright/test';
import { setupTest, teardownTest } from '../../utils/test-helpers';

test.describe('Enhanced KB Page', () => {
  test.beforeEach(async ({ page }) => {
    await setupTest(page);
    await page.goto('/enhanced-kb');
  });

  test.afterEach(async ({ page }) => {
    await teardownTest(page);
  });

  test('should load enhanced KB page successfully', async ({ page }) => {
    await expect(page.locator('h1:has-text("Enhanced Knowledge Base")')).toBeVisible();
  });

  test('should display knowledge base statistics', async ({ page }) => {
    await expect(page.locator('.card:has-text("Total Solutions")')).toBeVisible();
  });
});
