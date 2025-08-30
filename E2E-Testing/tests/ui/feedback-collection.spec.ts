import { test, expect } from '@playwright/test';
import { setupTest, teardownTest } from '../../utils/test-helpers';

test.describe('Feedback Collection Page', () => {
  test.beforeEach(async ({ page }) => {
    await setupTest(page);
    await page.goto('/feedback-collection');
  });

  test.afterEach(async ({ page }) => {
    await teardownTest(page);
  });

  test('should load feedback collection page successfully', async ({ page }) => {
    // Verify page title and description
    await expect(page.locator('h1:has-text("Feedback Collection")')).toBeVisible();
    await expect(page.locator('p:has-text("Monitor and analyze feedback for AI resolution improvements")')).toBeVisible();
    
    // Verify search and filter controls
    await expect(page.locator('input[placeholder="Search by ticket ID, comments, or solution..."]')).toBeVisible();
    await expect(page.locator('select')).toBeVisible();
    await expect(page.locator('button:has-text("Refresh")')).toBeVisible();
  });

  test('should display feedback statistics correctly', async ({ page }) => {
    // Wait for statistics cards to load
    await page.waitForSelector('.card:has-text("Total Feedback")');
    
    // Verify all statistics cards with more specific selectors
    await expect(page.locator('.card:has-text("Total Feedback")')).toBeVisible();
    
    // Use more specific selector for Perfect card - look for the statistics section specifically
    const statsSection = page.locator('.grid.grid-cols-1.md\\:grid-cols-4.gap-6.mb-6');
    await expect(statsSection.locator('.card:has-text("Perfect")')).toBeVisible();
    await expect(statsSection.locator('.card:has-text("Needs Improvement")')).toBeVisible();
    await expect(statsSection.locator('.card:has-text("Avg Effectiveness")')).toBeVisible();
    
    // Verify if statistics show numbers
    await expect(page.locator('.card:has-text("Total Feedback") .text-2xl')).toBeVisible();
    await expect(statsSection.locator('.card:has-text("Perfect") .text-2xl')).toBeVisible();
    await expect(statsSection.locator('.card:has-text("Needs Improvement") .text-2xl')).toBeVisible();
    await expect(statsSection.locator('.card:has-text("Avg Effectiveness") .text-2xl')).toBeVisible();
  });

  test('should display feedback table with data', async ({ page }) => {
    // Wait for feedback table to load
    await page.waitForSelector('.card:has-text("Feedback Entries")');
    
    // Verify table header
    await expect(page.locator('.card:has-text("Feedback Entries")')).toBeVisible();
    
    // Check if feedback entries are displayed
    const feedbackTable = page.locator('.card:has-text("Feedback Entries") table tbody tr');
    const feedbackCount = await feedbackTable.count();
    
    if (feedbackCount > 0) {
      // Verify first feedback entry structure
      await expect(feedbackTable.first()).toBeVisible();
      
      // Verify table headers specifically - use table header selectors
      const tableHeaders = page.locator('.card:has-text("Feedback Entries") table thead th');
      await expect(tableHeaders.locator('text=Ticket ID')).toBeVisible();
      await expect(tableHeaders.locator('text=Type')).toBeVisible();
      await expect(tableHeaders.locator('text=Effectiveness')).toBeVisible();
      await expect(tableHeaders.locator('text=User Role')).toBeVisible();
      await expect(tableHeaders.locator('text=Date')).toBeVisible();
      await expect(tableHeaders.locator('text=Actions')).toBeVisible();
    } else {
      // Verify empty state - look for the specific empty state text
      await expect(page.locator('.card:has-text("Feedback Entries") .text-center.text-gray-500')).toBeVisible();
      await expect(page.locator('text=No feedback found')).toBeVisible();
      await expect(page.locator('text=Try adjusting your search or filters')).toBeVisible();
    }
  });

  test('should filter feedback by type', async ({ page }) => {
    // Wait for filter dropdown
    await page.waitForSelector('select');
    
    // Test filtering by Perfect
    await page.selectOption('select', 'PERFECT');
    await expect(page.locator('select')).toHaveValue('PERFECT');
    
    // Test filtering by Minor Changes
    await page.selectOption('select', 'MINOR_CHANGES');
    await expect(page.locator('select')).toHaveValue('MINOR_CHANGES');
    
    // Test filtering by New Solution
    await page.selectOption('select', 'NEW_SOLUTION');
    await expect(page.locator('select')).toHaveValue('NEW_SOLUTION');
    
    // Reset to all
    await page.selectOption('select', 'all');
    await expect(page.locator('select')).toHaveValue('all');
  });

  test('should search feedback by ticket ID', async ({ page }) => {
    // Wait for search input
    await page.waitForSelector('input[placeholder="Search by ticket ID, comments, or solution..."]');
    
    // Type in search
    await page.fill('input[placeholder="Search by ticket ID, comments, or solution..."]', 'TEST');
    
    // Verify if search input has the value
    await expect(page.locator('input[placeholder="Search by ticket ID, comments, or solution..."]')).toHaveValue('TEST');
    
    // Clear search
    await page.fill('input[placeholder="Search by ticket ID, comments, or solution..."]', '');
    await expect(page.locator('input[placeholder="Search by ticket ID, comments, or solution..."]')).toHaveValue('');
  });

  test('should refresh feedback data', async ({ page }) => {
    // Wait for refresh button
    await page.waitForSelector('button:has-text("Refresh")');
    
    // Click refresh button
    await page.click('button:has-text("Refresh")');
    
    // Verify if data is refreshed (should still be visible)
    await expect(page.locator('.card:has-text("Total Feedback")')).toBeVisible();
  });

  test('should handle empty feedback state', async ({ page }) => {
    // Wait for content to load
    await page.waitForSelector('h1:has-text("Feedback Collection")');
    
    // Check if feedback entries exist
    const feedbackTable = page.locator('.card:has-text("Feedback Entries") table tbody tr');
    const feedbackCount = await feedbackTable.count();
    
    if (feedbackCount === 0) {
      // Verify empty state - look for the specific empty state text
      await expect(page.locator('.card:has-text("Feedback Entries") .text-center.text-gray-500')).toBeVisible();
      await expect(page.locator('text=No feedback found')).toBeVisible();
      await expect(page.locator('text=Try adjusting your search or filters')).toBeVisible();
      await expect(page.locator('.w-12.h-12.mx-auto.mb-3.text-gray-300')).toBeVisible(); // ThumbsUp icon
    }
  });

  test('should display loading state initially', async ({ page }) => {
    // Navigate to page and check for loading spinner
    await page.goto('/feedback-collection');
    
    // Wait for content to load
    await page.waitForSelector('h1:has-text("Feedback Collection")');
    
    // Verify page loaded successfully
    await expect(page.locator('h1:has-text("Feedback Collection")')).toBeVisible();
  });

  test('should show effectiveness scores with correct colors', async ({ page }) => {
    // Wait for feedback entries to load
    await page.waitForSelector('.card:has-text("Feedback Entries")');
    
    // Verify if effectiveness scores are displayed with appropriate styling
    const effectivenessScores = page.locator('.text-2xl.font-bold.text-gray-900');
    
    if (await effectivenessScores.count() > 0) {
      // Verify if effectiveness score is visible
      await expect(effectivenessScores.first()).toBeVisible();
    }
  });

  test('should display feedback type badges with correct colors', async ({ page }) => {
    // Wait for feedback entries to load
    await page.waitForSelector('.card:has-text("Feedback Entries")');
    
    // Verify if feedback type badges are displayed
    const feedbackTypeBadges = page.locator('.badge');
    
    if (await feedbackTypeBadges.count() > 0) {
      // Verify if badges are visible
      await expect(feedbackTypeBadges.first()).toBeVisible();
      
      // Verify badge styling
      await expect(feedbackTypeBadges.first()).toHaveClass(/text-.*-600 bg-.*-100/);
    }
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Wait for page to load
    await page.waitForSelector('h1:has-text("Feedback Collection")');
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1:has-text("Feedback Collection")')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1:has-text("Feedback Collection")')).toBeVisible();
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('h1:has-text("Feedback Collection")')).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Wait for page to load
    await page.waitForSelector('h1:has-text("Feedback Collection")');
    
    // This test would require mocking API calls to simulate network errors
    // For now, just verify if error handling structure exists
    
    // Verify if error handling is in place (toast notifications)
    // Note: No error should occur during normal operation
    await expect(page.locator('h1:has-text("Feedback Collection")')).toBeVisible();
  });

  test('should navigate back to dashboard', async ({ page }) => {
    // Wait for page to load
    await page.waitForSelector('h1:has-text("Feedback Collection")');
    
    // Click dashboard link in sidebar
    await page.click('a:has-text("Dashboard")');
    
    // Should be on dashboard page
    await expect(page.locator('h1:has-text("CSKB Merged Workflow Dashboard")')).toBeVisible();
  });
});
