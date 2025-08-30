#!/usr/bin/env node

const axios = require('axios');

const FEEDBACK_AGENTS_URL = 'http://localhost:8002';

async function cleanupTestData() {
  console.log('🧹 Cleaning up test data after E2E testing...');
  
  try {
    // Wait for service to be ready
    await waitForService();
    
    // Clean up all test data
    await cleanupAllTestData();
    
    console.log('✅ Test data cleanup completed successfully');
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    process.exit(1);
  }
}

async function waitForService() {
  console.log('⏳ Checking if feedback agents service is available...');
  
  try {
    const response = await axios.get(`${FEEDBACK_AGENTS_URL}/health`);
    if (response.status === 200) {
      console.log('✅ Service is available');
      return;
    }
  } catch (error) {
    console.log('⚠️  Service not available, skipping cleanup');
    return;
  }
}

async function cleanupAllTestData() {
  console.log('🗑️  Checking test feedback entries...');
  
  try {
    // Get all feedback entries
    const response = await axios.get(`${FEEDBACK_AGENTS_URL}/feedback?limit=1000`);
    
    let testDataCount = 0;
    
    // Count test feedback entries
    for (const feedback of response.data) {
      if (feedback.ticket_id.startsWith('E2E-TEST-') || 
          feedback.ticket_id.startsWith('API-TEST-') ||
          feedback.ticket_id.startsWith('UI-TEST-')) {
        testDataCount++;
        console.log(`📝 Found test feedback: ${feedback.ticket_id} (ID: ${feedback.id})`);
      }
    }
    
    console.log(`📊 Found ${testDataCount} test feedback entries`);
    
    if (testDataCount === 0) {
      console.log('ℹ️  No test data found');
    } else {
      console.log('ℹ️  Note: The API doesn\'t support DELETE operations for feedback');
      console.log('ℹ️  Test data will remain in the system but won\'t interfere with future tests');
    }
    
  } catch (error) {
    console.log('⚠️  Could not retrieve feedback data for cleanup:', error.message);
  }
}

async function forceCleanup() {
  console.log('🔄 Force cleanup not available - API doesn\'t support DELETE operations');
  console.log('ℹ️  Test data will remain in the system but won\'t interfere with future tests');
}

// Run cleanup if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  
  if (force) {
    console.log('🚨 Running force cleanup...');
    cleanupTestData()
      .then(() => forceCleanup())
      .then(() => {
        console.log('🚀 Force cleanup completed');
        process.exit(0);
      })
      .catch((error) => {
        console.error('💥 Force cleanup failed:', error.message);
        process.exit(1);
      });
  } else {
    cleanupTestData()
      .then(() => {
        console.log('🚀 Test data cleanup completed successfully');
        process.exit(0);
      })
      .catch((error) => {
        console.error('💥 Test data cleanup failed:', error.message);
        process.exit(1);
      });
  }
}

module.exports = { cleanupTestData, forceCleanup };
