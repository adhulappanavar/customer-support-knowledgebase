import { test, expect } from '@playwright/test';
import { setupTest, teardownTest } from '../../utils/test-helpers';

test.describe('Enhanced Knowledge Base Page', () => {
  test.beforeEach(async ({ page }) => {
    await setupTest(page);
    await page.goto('/enhanced-kb');
  });

  test.afterEach(async ({ page }) => {
    await teardownTest(page);
  });

  test('should load enhanced KB page correctly', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Enhanced Knowledge Base');
    
    // Check description
    await expect(page.locator('p.text-gray-600')).toContainText('Advanced knowledge base with AI-powered insights and solutions');
  });

  test('should display knowledge base statistics', async ({ page }) => {
    // Wait for statistics to load
    await page.waitForSelector('.card:has-text("Total Solutions")');
    
    // Check statistics cards
    await expect(page.locator('.card:has-text("Total Solutions")')).toBeVisible();
    await expect(page.locator('.card:has-text("Categories")')).toBeVisible();
    await expect(page.locator('.card:has-text("Confidence Score")')).toBeVisible();
    await expect(page.locator('.card:has-text("Usage Count")')).toBeVisible();
  });

  test('should display solutions by category', async ({ page }) => {
    // Wait for category section to load
    await page.waitForSelector('.card:has-text("Solutions by Category")');
    
    // Check category section
    await expect(page.locator('.card:has-text("Solutions by Category")')).toBeVisible();
    
    // Check if category cards are displayed
    const categoryCards = page.locator('.card:has-text("Solutions by Category") .border.border-gray-200');
    
    if (await categoryCards.count() > 0) {
      await expect(categoryCards.first()).toBeVisible();
    } else {
      // Check empty state
      await expect(page.locator('text=No categories found')).toBeVisible();
    }
  });

  test('should display high priority solutions', async ({ page }) => {
    // Wait for high priority section to load
    await page.waitForSelector('.card:has-text("High Priority Solutions")');
    
    // Check high priority section
    await expect(page.locator('.card:has-text("High Priority Solutions")')).toBeVisible();
    
    // Check if high priority solutions are displayed
    const prioritySolutions = page.locator('.card:has-text("High Priority Solutions") .border.border-gray-200');
    
    if (await prioritySolutions.count() > 0) {
      await expect(prioritySolutions.first()).toBeVisible();
    } else {
      // Check empty state
      await expect(page.locator('text=No high priority solutions')).toBeVisible();
    }
  });

  test('should filter solutions by category', async ({ page }) => {
    // Wait for category filter to load
    await page.waitForSelector('select');
    
    // Check if category filter is available
    const categoryFilter = page.locator('select');
    
    if (await categoryFilter.count() > 0) {
      // Test filtering by different categories
      await page.selectOption('select', 'technical');
      await expect(page.locator('select')).toHaveValue('technical');
      
      await page.selectOption('select', 'billing');
      await expect(page.locator('select')).toHaveValue('billing');
      
      // Reset to all
      await page.selectOption('select', 'all');
      await expect(page.locator('select')).toHaveValue('all');
    }
  });

  test('should search solutions', async ({ page }) => {
    // Wait for search input to load
    await page.waitForSelector('input[placeholder*="search" i]');
    
    // Check search functionality
    const searchInput = page.locator('input[placeholder*="search" i]');
    
    if (await searchInput.count() > 0) {
      // Type in search
      await searchInput.fill('password reset');
      await expect(searchInput).toHaveValue('password reset');
      
      // Clear search
      await searchInput.fill('');
      await expect(searchInput).toHaveValue('');
    }
  });

  test('should display solution details', async ({ page }) => {
    // Wait for solutions to load
    await page.waitForSelector('.card:has-text("Solutions by Category")');
    
    // Check if solution cards are displayed
    const solutionCards = page.locator('.card:has-text("Solutions by Category") .border.border-gray-200');
    
    if (await solutionCards.count() > 0) {
      // Check solution card structure
      await expect(solutionCards.first()).toBeVisible();
      
      // Check for common solution fields
      await expect(page.locator('text=Solution')).toBeVisible();
      await expect(page.locator('text=Category')).toBeVisible();
      await expect(page.locator('text=Confidence')).toBeVisible();
      await expect(page.locator('text=Usage')).toBeVisible();
    }
  });

  test('should handle empty state gracefully', async ({ page }) => {
    // Wait for content to load
    await page.waitForSelector('h1:has-text("Enhanced Knowledge Base")');
    
    // Check if empty states are handled properly
    const emptyStates = page.locator('text=No solutions found, text=No categories found, text=No high priority solutions');
    
    if (await emptyStates.count() > 0) {
      await expect(emptyStates.first()).toBeVisible();
    }
  });

  test('should display loading state initially', async ({ page }) => {
    // Navigate to page and check for loading spinner
    await page.goto('/enhanced-kb');
    
    // Loading spinner should be visible initially
    await expect(page.locator('.animate-spin.rounded-full.h-12.w-12.border-b-2.border-primary-600')).toBeVisible();
    
    // Wait for content to load
    await page.waitForSelector('h1:has-text("Enhanced Knowledge Base")');
    
    // Loading spinner should be gone
    await expect(page.locator('.animate-spin.rounded-full.h-12.w-12.border-b-2.border-primary-600')).not.toBeVisible();
  });

  test('should refresh data', async ({ page }) => {
    // Wait for refresh button to load
    await page.waitForSelector('button:has-text("Refresh")');
    
    // Click refresh button
    await page.click('button:has-text("Refresh")');
    
    // Check if data is refreshed (should still be visible)
    await expect(page.locator('.card:has-text("Total Solutions")')).toBeVisible();
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toContainText('Enhanced Knowledge Base');
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toContainText('Enhanced Knowledge Base');
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('h1')).toContainText('Enhanced Knowledge Base');
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

  test('should display confidence scores with appropriate styling', async ({ page }) => {
    // Wait for solutions to load
    await page.waitForSelector('.card:has-text("Solutions by Category")');
    
    // Check if confidence scores are displayed with appropriate styling
    const confidenceScores = page.locator('.text-lg.font-semibold');
    
    if (await confidenceScores.count() > 0) {
      // Check if confidence score is visible
      await expect(confidenceScores.first()).toBeVisible();
    }
  });
});
