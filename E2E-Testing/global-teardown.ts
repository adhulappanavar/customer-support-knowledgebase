import { FullConfig } from '@playwright/test';
import { cleanupTestData } from './utils/test-data-setup';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown...');
  
  try {
    // Clean up all test data
    await cleanupTestData();
    console.log('✅ Test data cleanup completed');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
  
  console.log('🏁 Global teardown completed');
}

export default globalTeardown;
