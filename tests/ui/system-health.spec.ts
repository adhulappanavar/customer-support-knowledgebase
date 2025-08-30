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

  test('should load system health page correctly', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('System Health');
    
    // Check description
    await expect(page.locator('p.text-gray-600')).toContainText('Monitor system performance and component health');
  });

  test('should display overall system status', async ({ page }) => {
    // Wait for system status to load
    await page.waitForSelector('.card:has-text("Overall Status")');
    
    // Check overall status card
    await expect(page.locator('.card:has-text("Overall Status")')).toBeVisible();
    
    // Check if status is displayed with appropriate styling
    const statusBadge = page.locator('.card:has-text("Overall Status") .badge');
    if (await statusBadge.count() > 0) {
      await expect(statusBadge.first()).toBeVisible();
    }
  });

  test('should display component health indicators', async ({ page }) => {
    // Wait for component health section to load
    await page.waitForSelector('.card:has-text("Component Health")');
    
    // Check component health section
    await expect(page.locator('.card:has-text("Component Health")')).toBeVisible();
    
    // Check if component cards are displayed
    const componentCards = page.locator('.card:has-text("Component Health") .border.border-gray-200');
    
    if (await componentCards.count() > 0) {
      await expect(componentCards.first()).toBeVisible();
    } else {
      // Check empty state
      await expect(page.locator('text=No components found')).toBeVisible();
    }
  });

  test('should display performance metrics', async ({ page }) => {
    // Wait for performance metrics section to load
    await page.waitForSelector('.card:has-text("Performance Metrics")');
    
    // Check performance metrics section
    await expect(page.locator('.card:has-text("Performance Metrics")')).toBeVisible();
    
    // Check if metrics are displayed
    const metricsCards = page.locator('.card:has-text("Performance Metrics") .border.border-gray-200');
    
    if (await metricsCards.count() > 0) {
      await expect(metricsCards.first()).toBeVisible();
    }
  });

  test('should display system uptime', async ({ page }) => {
    // Wait for uptime section to load
    await page.waitForSelector('.card:has-text("System Uptime")');
    
    // Check uptime section
    await expect(page.locator('.card:has-text("System Uptime")')).toBeVisible();
    
    // Check if uptime is displayed
    const uptimeDisplay = page.locator('.card:has-text("System Uptime") .text-lg');
    if (await uptimeDisplay.count() > 0) {
      await expect(uptimeDisplay.first()).toBeVisible();
    }
  });

  test('should display resource usage', async ({ page }) => {
    // Wait for resource usage section to load
    await page.waitForSelector('.card:has-text("Resource Usage")');
    
    // Check resource usage section
    await expect(page.locator('.card:has-text("Resource Usage")')).toBeVisible();
    
    // Check if resource metrics are displayed
    const resourceMetrics = page.locator('.card:has-text("Resource Usage") .border.border-gray-200');
    
    if (await resourceMetrics.count() > 0) {
      await expect(resourceMetrics.first()).toBeVisible();
    }
  });

  test('should refresh system health data', async ({ page }) => {
    // Wait for refresh button to load
    await page.waitForSelector('button:has-text("Refresh")');
    
    // Click refresh button
    await page.click('button:has-text("Refresh")');
    
    // Check if data is refreshed (should still be visible)
    await expect(page.locator('.card:has-text("Overall Status")')).toBeVisible();
  });

  test('should display loading state initially', async ({ page }) => {
    // Navigate to page and check for loading spinner
    await page.goto('/system-health');
    
    // Loading spinner should be visible initially
    await expect(page.locator('.animate-spin.rounded-full.h-12.w-12.border-b-2.border-primary-600')).toBeVisible();
    
    // Wait for content to load
    await page.waitForSelector('h1:has-text("System Health")');
    
    // Loading spinner should be gone
    await expect(page.locator('.animate-spin.rounded-full.h-12.w-12.border-b-2.border-primary-600')).not.toBeVisible();
  });

  test('should handle empty state gracefully', async ({ page }) => {
    // Wait for content to load
    await page.waitForSelector('h1:has-text("System Health")');
    
    // Check if empty states are handled properly
    const emptyStates = page.locator('text=No components found, text=No metrics available, text=System data unavailable');
    
    if (await emptyStates.count() > 0) {
      await expect(emptyStates.first()).toBeVisible();
    }
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toContainText('System Health');
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toContainText('System Health');
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('h1')).toContainText('System Health');
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // This test would require mocking API calls to simulate network errors
    // For now, just check if error handling structure exists
    
    // Check if error handling is in place (toast notifications)
    await expect(page.locator('.toast-error')).toBeVisible();
  });

  test('should navigate back to dashboard', async ({ page }) => {
    // Click dashboard link in sidebar
    await page.click('a[href="/"]');
    
    // Should be on dashboard page
    await expect(page.locator('h1')).toContainText('CSKB Merged Workflow Dashboard');
  });

  test('should display status indicators with correct colors', async ({ page }) => {
    // Wait for status indicators to load
    await page.waitForSelector('.card:has-text("Overall Status")');
    
    // Check if status indicators are displayed with appropriate styling
    const statusIndicators = page.locator('.badge');
    
    if (await statusIndicators.count() > 0) {
      // Check if status indicator is visible
      await expect(statusIndicators.first()).toBeVisible();
      
      // Check badge styling
      await expect(statusIndicators.first()).toHaveClass(/text-.*-600 bg-.*-100/);
    }
  });

  test('should display timestamp information', async ({ page }) => {
    // Wait for content to load
    await page.waitForSelector('h1:has-text("System Health")');
    
    // Check if timestamp information is displayed
    const timestamps = page.locator('text=Last Updated, text=Timestamp, text=Updated');
    
    if (await timestamps.count() > 0) {
      await expect(timestamps.first()).toBeVisible();
    }
  });
});
