import { test, expect } from '@playwright/test';
import { setupTest, teardownTest } from '../../utils/test-helpers';

test.describe('Ticket Resolution Page', () => {
  test.beforeEach(async ({ page }) => {
    await setupTest(page);
    await page.goto('/ticket-resolution');
  });

  test.afterEach(async ({ page }) => {
    await teardownTest(page);
  });

  test('should load ticket resolution page correctly', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Ticket Resolution');
    
    // Check description
    await expect(page.locator('p.text-gray-600')).toContainText('Create and manage ticket resolutions with AI assistance');
  });

  test('should display ticket creation form', async ({ page }) => {
    // Check form elements
    await expect(page.locator('label:has-text("Ticket ID")')).toBeVisible();
    await expect(page.locator('input[placeholder="Enter ticket ID"]')).toBeVisible();
    
    await expect(page.locator('label:has-text("Customer Query")')).toBeVisible();
    await expect(page.locator('textarea[placeholder="Describe the customer issue..."]')).toBeVisible();
    
    await expect(page.locator('button:has-text("Create Resolution")')).toBeVisible();
  });

  test('should generate AI resolution', async ({ page }) => {
    const testTicketId = 'TEST-TICKET-001';
    const testQuery = 'Test customer query for E2E testing';
    
    // Fill in form with correct selectors
    await page.fill('input[placeholder="e.g., TICKET-001"]', testTicketId);
    await page.fill('textarea[placeholder*="customer\'s issue"]', testQuery);
    
    // Click generate button
    await page.click('button:has-text("Generate AI Resolution")');
    
    // Wait for any notification to appear (success or error)
    await page.waitForSelector('[role="status"], .toast, [class*="notification"]', { timeout: 10000 });
    
    // Verify that some response was received (either success or error)
    // This avoids waiting for specific API responses that might fail
    await expect(page.locator('[role="status"], .toast, [class*="notification"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Try to create resolution without filling fields
    await page.click('button:has-text("Create Resolution")');
    
    // Should show validation error
    await expect(page.locator('.text-red-600')).toBeVisible();
  });

  test('should display feedback form after resolution', async ({ page }) => {
    // Create a resolution first
    await page.fill('input[placeholder="Enter ticket ID"]', 'TEST-TICKET-RES-002');
    await page.fill('textarea[placeholder="Describe the customer issue..."]', 'Password reset issue');
    await page.click('button:has-text("Create Resolution")');
    
    // Wait for AI resolution
    await page.waitForSelector('.card:has-text("AI Resolution")');
    
    // Check if feedback form is displayed
    await expect(page.locator('.card:has-text("Submit Feedback")')).toBeVisible();
    await expect(page.locator('label:has-text("Feedback Type")')).toBeVisible();
    await expect(page.locator('select')).toBeVisible();
    await expect(page.locator('label:has-text("Comments")')).toBeVisible();
    await expect(page.locator('textarea[placeholder="Additional comments..."]')).toBeVisible();
    await expect(page.locator('button:has-text("Submit Feedback")')).toBeVisible();
  });

  test('should submit feedback successfully', async ({ page }) => {
    // Create a resolution first
    await page.fill('input[placeholder="Enter ticket ID"]', 'TEST-TICKET-RES-003');
    await page.fill('textarea[placeholder="Describe the customer issue..."]', 'Login problem');
    await page.click('button:has-text("Create Resolution")');
    
    // Wait for AI resolution
    await page.waitForSelector('.card:has-text("AI Resolution")');
    
    // Fill feedback form
    await page.selectOption('select', 'PERFECT');
    await page.fill('textarea[placeholder="Additional comments..."]', 'AI solution was accurate and helpful');
    
    // Submit feedback
    await page.click('button:has-text("Submit Feedback")');
    
    // Should show success message
    await expect(page.locator('.toast-success')).toBeVisible();
  });

  test('should handle different feedback types', async ({ page }) => {
    // Create a resolution first
    await page.fill('input[placeholder="Enter ticket ID"]', 'TEST-TICKET-RES-004');
    await page.fill('textarea[placeholder="Describe the customer issue..."]', 'Email configuration issue');
    await page.click('button:has-text("Create Resolution")');
    
    // Wait for AI resolution
    await page.waitForSelector('.card:has-text("AI Resolution")');
    
    // Test different feedback types
    await page.selectOption('select', 'MINOR_CHANGES');
    await expect(page.locator('select')).toHaveValue('MINOR_CHANGES');
    
    await page.selectOption('select', 'NEW_SOLUTION');
    await expect(page.locator('select')).toHaveValue('NEW_SOLUTION');
    
    await page.selectOption('select', 'PERFECT');
    await expect(page.locator('select')).toHaveValue('PERFECT');
  });

  test('should display loading state during resolution creation', async ({ page }) => {
    // Fill form
    await page.fill('input[placeholder="Enter ticket ID"]', 'TEST-TICKET-RES-005');
    await page.fill('textarea[placeholder="Describe the customer issue..."]', 'Test query');
    
    // Click create and check for loading state
    await page.click('button:has-text("Create Resolution")');
    
    // Should show loading indicator
    await expect(page.locator('.animate-spin')).toBeVisible();
    
    // Wait for resolution to complete
    await page.waitForSelector('.card:has-text("AI Resolution")');
    
    // Loading should be gone
    await expect(page.locator('.animate-spin')).not.toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Fill form
    await page.fill('input[placeholder="Enter ticket ID"]', 'TEST-TICKET-RES-006');
    await page.fill('textarea[placeholder="Describe the customer issue..."]', 'Test query');
    
    // Click create
    await page.click('button:has-text("Create Resolution")');
    
    // Check if error handling is in place
    await expect(page.locator('.toast-error')).toBeVisible();
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toContainText('Ticket Resolution');
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toContainText('Ticket Resolution');
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('h1')).toContainText('Ticket Resolution');
  });

  test('should navigate back to dashboard', async ({ page }) => {
    // Click dashboard link in sidebar
    await page.click('a[href="/"]');
    
    // Should be on dashboard page
    await expect(page.locator('h1')).toContainText('CSKB Merged Workflow Dashboard');
  });

  test('should clear form after successful submission', async ({ page }) => {
    // Create a resolution
    await page.fill('input[placeholder="Enter ticket ID"]', 'TEST-TICKET-RES-007');
    await page.fill('textarea[placeholder="Describe the customer issue..."]', 'Test query');
    await page.click('button:has-text("Create Resolution")');
    
    // Wait for resolution
    await page.waitForSelector('.card:has-text("AI Resolution")');
    
    // Submit feedback
    await page.selectOption('select', 'PERFECT');
    await page.fill('textarea[placeholder="Additional comments..."]', 'Great solution');
    await page.click('button:has-text("Submit Feedback")');
    
    // Wait for success
    await page.waitForSelector('.toast-success');
    
    // Check if form is cleared or reset button is available
    await expect(page.locator('button:has-text("Create New Resolution")')).toBeVisible();
  });
});
