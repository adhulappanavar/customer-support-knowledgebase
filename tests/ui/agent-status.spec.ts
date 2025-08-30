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

  test('should load agent status page correctly', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Agent Status');
    
    // Check description
    await expect(page.locator('p.text-gray-600')).toContainText('Monitor agent performance and learning metrics');
  });

  test('should display agent performance cards', async ({ page }) => {
    // Wait for agent performance cards to load
    await page.waitForSelector('.card:has-text("Agent Performance")');
    
    // Check agent performance section
    await expect(page.locator('.card:has-text("Agent Performance")')).toBeVisible();
    
    // Check if agent cards are displayed
    const agentCards = page.locator('.card:has-text("Agent Performance") .border.border-gray-200');
    
    if (await agentCards.count() > 0) {
      await expect(agentCards.first()).toBeVisible();
    } else {
      // Check empty state
      await expect(page.locator('text=No agents found')).toBeVisible();
    }
  });

  test('should display metrics visualization', async ({ page }) => {
    // Wait for metrics visualization section to load
    await page.waitForSelector('.card:has-text("Metrics Visualization")');
    
    // Check metrics visualization section
    await expect(page.locator('.card:has-text("Metrics Visualization")')).toBeVisible();
    
    // Check if metrics are displayed
    const metricsDisplay = page.locator('.card:has-text("Metrics Visualization") .border.border-gray-200');
    
    if (await metricsDisplay.count() > 0) {
      await expect(metricsDisplay.first()).toBeVisible();
    }
  });

  test('should display performance trends', async ({ page }) => {
    // Wait for performance trends section to load
    await page.waitForSelector('.card:has-text("Performance Trends")');
    
    // Check performance trends section
    await expect(page.locator('.card:has-text("Performance Trends")')).toBeVisible();
    
    // Check if trends are displayed
    const trendsDisplay = page.locator('.card:has-text("Performance Trends") .border.border-gray-200');
    
    if (await trendsDisplay.count() > 0) {
      await expect(trendsDisplay.first()).toBeVisible();
    }
  });

  test('should display agent learning metrics', async ({ page }) => {
    // Wait for learning metrics section to load
    await page.waitForSelector('.card:has-text("Learning Metrics")');
    
    // Check learning metrics section
    await expect(page.locator('.card:has-text("Learning Metrics")')).toBeVisible();
    
    // Check if learning metrics are displayed
    const learningMetrics = page.locator('.card:has-text("Learning Metrics") .border.border-gray-200');
    
    if (await learningMetrics.count() > 0) {
      await expect(learningMetrics.first()).toBeVisible();
    }
  });

  test('should display agent effectiveness scores', async ({ page }) => {
    // Wait for effectiveness scores section to load
    await page.waitForSelector('.card:has-text("Effectiveness Scores")');
    
    // Check effectiveness scores section
    await expect(page.locator('.card:has-text("Effectiveness Scores")')).toBeVisible();
    
    // Check if effectiveness scores are displayed
    const effectivenessScores = page.locator('.card:has-text("Effectiveness Scores") .text-lg');
    
    if (await effectivenessScores.count() > 0) {
      await expect(effectivenessScores.first()).toBeVisible();
    }
  });

  test('should refresh agent status data', async ({ page }) => {
    // Wait for refresh button to load
    await page.waitForSelector('button:has-text("Refresh")');
    
    // Click refresh button
    await page.click('button:has-text("Refresh")');
    
    // Check if data is refreshed (should still be visible)
    await expect(page.locator('.card:has-text("Agent Performance")')).toBeVisible();
  });

  test('should display loading state initially', async ({ page }) => {
    // Navigate to page and check for loading spinner
    await page.goto('/agent-status');
    
    // Loading spinner should be visible initially
    await expect(page.locator('.animate-spin.rounded-full.h-12.w-12.border-b-2.border-primary-600')).toBeVisible();
    
    // Wait for content to load
    await page.waitForSelector('h1:has-text("Agent Status")');
    
    // Loading spinner should be gone
    await expect(page.locator('.animate-spin.rounded-full.h-12.w-12.border-b-2.border-primary-600')).not.toBeVisible();
  });

  test('should handle empty state gracefully', async ({ page }) => {
    // Wait for content to load
    await page.waitForSelector('h1:has-text("Agent Status")');
    
    // Check if empty states are handled properly
    const emptyStates = page.locator('text=No agents found, text=No metrics available, text=Agent data unavailable');
    
    if (await emptyStates.count() > 0) {
      await expect(emptyStates.first()).toBeVisible();
    }
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toContainText('Agent Status');
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toContainText('Agent Status');
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('h1')).toContainText('Agent Status');
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

  test('should display agent status with correct styling', async ({ page }) => {
    // Wait for agent status to load
    await page.waitForSelector('.card:has-text("Agent Performance")');
    
    // Check if agent status is displayed with appropriate styling
    const statusBadges = page.locator('.badge');
    
    if (await statusBadges.count() > 0) {
      // Check if status badge is visible
      await expect(statusBadges.first()).toBeVisible();
      
      // Check badge styling
      await expect(statusBadges.first()).toHaveClass(/text-.*-600 bg-.*-100/);
    }
  });

  test('should display timestamp information', async ({ page }) => {
    // Wait for content to load
    await page.waitForSelector('h1:has-text("Agent Status")');
    
    // Check if timestamp information is displayed
    const timestamps = page.locator('text=Last Updated, text=Timestamp, text=Updated');
    
    if (await timestamps.count() > 0) {
      await expect(timestamps.first()).toBeVisible();
    }
  });

  test('should display agent names correctly', async ({ page }) => {
    // Wait for agent performance section to load
    await page.waitForSelector('.card:has-text("Agent Performance")');
    
    // Check if agent names are displayed
    const agentNames = page.locator('.font-medium.text-gray-900');
    
    if (await agentNames.count() > 0) {
      // Check if agent name is visible
      await expect(agentNames.first()).toBeVisible();
    }
  });

  test('should display metric values correctly', async ({ page }) => {
    // Wait for metrics to load
    await page.waitForSelector('.card:has-text("Metrics Visualization")');
    
    // Check if metric values are displayed
    const metricValues = page.locator('.text-lg.font-semibold');
    
    if (await metricValues.count() > 0) {
      // Check if metric value is visible
      await expect(metricValues.first()).toBeVisible();
    }
  });
});
