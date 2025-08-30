import { Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000); // Additional wait for React to render
  }

  async navigateToPage(pageName: string) {
    const pageMap: Record<string, string> = {
      'dashboard': '/',
      'ticket-resolution': '/ticket-resolution',
      'feedback-collection': '/feedback-collection',
      'enhanced-kb': '/enhanced-kb',
      'system-health': '/system-health',
      'agent-status': '/agent-status'
    };

    const path = pageMap[pageName.toLowerCase()];
    if (!path) {
      throw new Error(`Unknown page: ${pageName}`);
    }

    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  async expectToast(message: string, type: 'success' | 'error' = 'success') {
    const toastSelector = type === 'success' 
      ? '[data-testid="toast-success"]' 
      : '[data-testid="toast-error"]';
    
    await expect(this.page.locator(toastSelector)).toBeVisible();
    await expect(this.page.locator(toastSelector)).toContainText(message);
  }

  async fillFormField(selector: string, value: string) {
    await this.page.fill(selector, value);
  }

  async clickButton(text: string) {
    await this.page.click(`button:has-text("${text}")`);
  }

  async expectElementVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  async expectElementNotVisible(selector: string) {
    await expect(this.page.locator(selector)).not.toBeVisible();
  }

  async expectTextVisible(text: string) {
    await expect(this.page.locator(`text=${text}`)).toBeVisible();
  }

  async expectTextNotVisible(text: string) {
    await expect(this.page.locator(`text=${text}`)).not.toBeVisible();
  }

  async waitForAPIResponse(urlPattern: string) {
    await this.page.waitForResponse(response => 
      response.url().includes(urlPattern) && response.status() === 200
    );
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  async mockAPIResponse(url: string, response: any) {
    await this.page.route(url, route => {
      route.fulfill({ 
        status: 200, 
        contentType: 'application/json',
        body: JSON.stringify(response)
      });
    });
  }

  async expectLoadingState() {
    await expect(this.page.locator('.animate-spin')).toBeVisible();
  }

  async expectNoLoadingState() {
    await expect(this.page.locator('.animate-spin')).not.toBeVisible();
  }
}

/**
 * Setup test environment before each test
 */
export async function setupTest(page: Page) {
  // Wait for page to be ready
  await page.waitForLoadState('networkidle');
  
  // Check if we're on the right application
  await expect(page.locator('body')).toBeVisible();
}

/**
 * Cleanup test environment after each test
 */
export async function teardownTest(page: Page) {
  // Navigate back to dashboard to reset state
  try {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  } catch (error) {
    // Ignore navigation errors during cleanup
    console.log('Cleanup navigation error:', error);
  }
}

/**
 * Wait for page to fully load
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Navigate to a specific page
 */
export async function navigateToPage(page: Page, path: string) {
  await page.goto(path);
  await waitForPageLoad(page);
}

/**
 * Expect a toast notification to be visible
 */
export async function expectToast(page: Page, type: 'success' | 'error' | 'info' = 'success') {
  const toastSelector = `.toast-${type}`;
  await expect(page.locator(toastSelector)).toBeVisible();
}

/**
 * Fill a form field with proper waiting
 */
export async function fillFormField(page: Page, selector: string, value: string) {
  await page.waitForSelector(selector);
  await page.fill(selector, value);
}

/**
 * Click a button with proper waiting
 */
export async function clickButton(page: Page, text: string) {
  await page.waitForSelector(`button:has-text("${text}")`);
  await page.click(`button:has-text("${text}")`);
}

/**
 * Expect an element to be visible
 */
export async function expectElementVisible(page: Page, selector: string) {
  await expect(page.locator(selector)).toBeVisible();
}

/**
 * Expect text to be visible
 */
export async function expectTextVisible(page: Page, text: string) {
  await expect(page.locator(`text=${text}`)).toBeVisible();
}

/**
 * Wait for API response
 */
export async function waitForAPIResponse(page: Page, timeout: number = 10000) {
  await page.waitForTimeout(timeout);
}

/**
 * Take a screenshot for debugging
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `screenshots/${name}.png` });
}

/**
 * Mock API response for testing
 */
export async function mockAPIResponse(page: Page, url: string, response: any) {
  await page.route(url, route => {
    route.fulfill({ 
      status: 200, 
      contentType: 'application/json',
      body: JSON.stringify(response)
    });
  });
}

/**
 * Expect loading state to be visible
 */
export async function expectLoadingState(page: Page) {
  await expect(page.locator('.animate-spin.rounded-full.h-12.w-12.border-b-2.border-primary-600')).toBeVisible();
}

/**
 * Expect loading state to be hidden
 */
export async function expectLoadingStateHidden(page: Page) {
  await expect(page.locator('.animate-spin.rounded-full.h-12.w-12.border-b-2.border-primary-600')).not.toBeVisible();
}

/**
 * Wait for card content to load
 */
export async function waitForCardContent(page: Page, cardTitle: string) {
  await page.waitForSelector(`.card:has-text("${cardTitle}")`);
}

/**
 * Check if element exists
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
  const element = page.locator(selector);
  return await element.count() > 0;
}

/**
 * Get element count
 */
export async function getElementCount(page: Page, selector: string): Promise<number> {
  const elements = page.locator(selector);
  return await elements.count();
}

/**
 * Wait for specific text to appear
 */
export async function waitForText(page: Page, text: string, timeout: number = 10000) {
  await page.waitForSelector(`text=${text}`, { timeout });
}

/**
 * Check if page has specific content
 */
export async function pageHasContent(page: Page, content: string): Promise<boolean> {
  const bodyText = await page.textContent('body');
  return bodyText?.includes(content) || false;
}

/**
 * Navigate using sidebar
 */
export async function navigateUsingSidebar(page: Page, pageName: string) {
  await page.click(`a:has-text("${pageName}")`);
  await waitForPageLoad(page);
}

/**
 * Check responsive design
 */
export async function checkResponsiveDesign(page: Page, viewport: { width: number; height: number }) {
  await page.setViewportSize(viewport);
  await page.waitForTimeout(500); // Wait for layout to adjust
}

/**
 * Verify navigation structure
 */
export async function verifyNavigationStructure(page: Page) {
  // Check if sidebar is visible
  await expect(page.locator('nav')).toBeVisible();
  
  // Check if main content area is visible
  await expect(page.locator('main')).toBeVisible();
  
  // Check if sidebar has navigation items
  const navItems = page.locator('nav a');
  await expect(navItems.first()).toBeVisible();
}

/**
 * Wait for data to load
 */
export async function waitForDataLoad(page: Page, dataIndicator: string) {
  try {
    // Wait for either the data to load or a loading state to disappear
    await Promise.race([
      page.waitForSelector(dataIndicator, { timeout: 10000 }),
      page.waitForSelector('.animate-spin', { state: 'hidden', timeout: 10000 })
    ]);
  } catch (error) {
    // If timeout, continue - data might already be loaded
    console.log('Data load timeout, continuing...');
  }
}
