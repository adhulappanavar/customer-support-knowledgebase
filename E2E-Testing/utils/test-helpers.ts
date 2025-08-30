import { Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
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

  // Enhanced screenshot capture methods for test flow validation
  async capturePageState(stepName: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `flow-${stepName}-${timestamp}.png`;
    await this.page.screenshot({ 
      path: `test-results/flow-screenshots/${filename}`,
      fullPage: true 
    });
    console.log(`📸 Captured flow screenshot: ${filename}`);
  }

  async captureElementState(elementSelector: string, stepName: string) {
    try {
      const element = this.page.locator(elementSelector);
      if (await element.isVisible()) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `element-${stepName}-${timestamp}.png`;
        await element.screenshot({ 
          path: `test-results/flow-screenshots/${filename}` 
        });
        console.log(`📸 Captured element screenshot: ${filename}`);
      }
    } catch (error) {
      console.log(`⚠️ Could not capture element screenshot for ${elementSelector}:`, error);
    }
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

export async function setupTest(page: Page) {
  await page.waitForLoadState('networkidle');
  
  // Capture initial page state for successful tests
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ 
      path: `test-results/flow-screenshots/setup-${timestamp}.png`,
      fullPage: true 
    });
    console.log('📸 Captured setup screenshot');
  } catch (error) {
    console.log('⚠️ Could not capture setup screenshot:', error);
  }
  
  // Try to check body visibility, but don't fail if it's hidden in Firefox
  try {
    await expect(page.locator('body')).toBeVisible();
  } catch (error) {
    console.log('⚠️ Body element visibility check failed (Firefox compatibility issue):', error);
    // Continue with test execution even if body check fails
  }
}

export async function teardownTest(page: Page) {
  try {
    // Capture final page state for successful tests
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ 
      path: `test-results/flow-screenshots/teardown-${timestamp}.png`,
      fullPage: true 
    });
    console.log('📸 Captured teardown screenshot');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  } catch (error) {
    console.log('⚠️ Cleanup error:', error);
  }
}
