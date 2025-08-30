import { chromium, FullConfig } from '@playwright/test';
import { setupTestData } from './utils/test-data-setup';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...');
  
  // Wait for backend services to be ready
  await waitForServices();
  
  // Setup clean test data
  await setupTestData();
  
  console.log('✅ Global setup completed');
}

async function waitForServices() {
  console.log('⏳ Waiting for backend services...');
  
  const maxRetries = 30;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      // Check feedback agents service
      const feedbackResponse = await fetch('http://localhost:8002/health');
      if (feedbackResponse.ok) {
        console.log('✅ Feedback agents service is ready');
        break;
      }
    } catch (error) {
      // Service not ready yet
    }
    
    retries++;
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  if (retries >= maxRetries) {
    throw new Error('Backend services failed to start within timeout');
  }
  
  // Additional wait to ensure services are fully initialized
  await new Promise(resolve => setTimeout(resolve, 5000));
}

export default globalSetup;
