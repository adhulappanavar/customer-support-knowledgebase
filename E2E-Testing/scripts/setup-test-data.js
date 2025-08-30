#!/usr/bin/env node

const axios = require('axios');

const FEEDBACK_AGENTS_URL = 'http://localhost:8002';

async function setupTestData() {
  console.log('🔧 Setting up test data for E2E testing...');
  
  try {
    // Wait for service to be ready
    await waitForService();
    
    // Clean up any existing test data
    await cleanupExistingTestData();
    
    // Create test feedback entries
    await createTestFeedbackEntries();
    
    console.log('✅ Test data setup completed successfully');
  } catch (error) {
    console.error('❌ Error setting up test data:', error.message);
    process.exit(1);
  }
}

async function waitForService() {
  console.log('⏳ Waiting for feedback agents service...');
  
  const maxRetries = 30;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const response = await axios.get(`${FEEDBACK_AGENTS_URL}/health`);
      if (response.status === 200) {
        console.log('✅ Service is ready');
        return;
      }
    } catch (error) {
      // Service not ready yet
    }
    
    retries++;
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  throw new Error('Service failed to start within timeout');
}

async function cleanupExistingTestData() {
  console.log('🧹 Cleaning up existing test data...');
  
  try {
    // Get all feedback entries
    const response = await axios.get(`${FEEDBACK_AGENTS_URL}/feedback?limit=1000`);
    
    // Delete test feedback entries
    for (const feedback of response.data) {
      if (feedback.ticket_id.startsWith('E2E-TEST-') || 
          feedback.ticket_id.startsWith('API-TEST-') ||
          feedback.ticket_id.startsWith('UI-TEST-')) {
        try {
          await axios.delete(`${FEEDBACK_AGENTS_URL}/feedback/${feedback.id}`);
          console.log(`🗑️  Deleted test feedback: ${feedback.ticket_id}`);
        } catch (error) {
          console.log(`⚠️  Could not delete feedback ${feedback.id}: ${error.message}`);
        }
      }
    }
    
    console.log('✅ Cleanup completed');
  } catch (error) {
    console.log('⚠️  Could not cleanup existing data:', error.message);
  }
}

async function createTestFeedbackEntries() {
  console.log('📝 Creating test feedback entries...');
  
  const testEntries = [
    {
      ticket_id: 'E2E-TEST-001',
      ai_solution: 'To reset your password, go to the login page and click "Forgot Password". Follow the email instructions.',
      human_solution: 'To reset your password: 1) Go to login page 2) Click "Forgot Password" 3) Enter your email 4) Check email for reset link 5) Click link and set new password',
      feedback_type: 'NEW_SOLUTION',
      user_role: 'support_engineer',
      comments: 'AI solution was too vague, needed step-by-step instructions',
      context: { source: 'e2e-testing', priority: 'high' }
    },
    {
      ticket_id: 'E2E-TEST-002',
      ai_solution: 'Contact support to unlock your account.',
      human_solution: 'Contact support to unlock your account. You can also try the self-service unlock option in your account settings.',
      feedback_type: 'MINOR_CHANGES',
      user_role: 'support_engineer',
      comments: 'AI solution was incomplete, missed self-service option',
      context: { source: 'e2e-testing', priority: 'medium' }
    },
    {
      ticket_id: 'E2E-TEST-003',
      ai_solution: 'Go to your account settings to update billing information.',
      human_solution: 'Go to your account settings to update billing information.',
      feedback_type: 'PERFECT',
      user_role: 'support_engineer',
      comments: 'Perfect AI solution, no changes needed',
      context: { source: 'e2e-testing', priority: 'low' }
    },
    {
      ticket_id: 'E2E-TEST-004',
      ai_solution: 'Check your internet connection and restart the application.',
      human_solution: 'Check your internet connection, restart the application, and if the issue persists, clear your browser cache.',
      feedback_type: 'MINOR_CHANGES',
      user_role: 'support_engineer',
      comments: 'AI solution was good but missed cache clearing step',
      context: { source: 'e2e-testing', priority: 'medium' }
    },
    {
      ticket_id: 'E2E-TEST-005',
      ai_solution: 'The feature is not available in your current plan.',
      human_solution: 'The feature is not available in your current plan. You can upgrade to Premium plan to access this feature.',
      feedback_type: 'MINOR_CHANGES',
      user_role: 'support_engineer',
      comments: 'AI solution was correct but should mention upgrade option',
      context: { source: 'e2e-testing', priority: 'medium' }
    }
  ];
  
  for (const entry of testEntries) {
    try {
      const response = await axios.post(`${FEEDBACK_AGENTS_URL}/feedback`, entry);
      console.log(`✅ Created test feedback: ${entry.ticket_id} (ID: ${response.data.feedback_id})`);
    } catch (error) {
      console.error(`❌ Failed to create feedback ${entry.ticket_id}:`, error.message);
    }
  }
  
  console.log('✅ Test feedback entries created');
}

// Run setup if called directly
if (require.main === module) {
  setupTestData()
    .then(() => {
      console.log('🚀 Test data setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Test data setup failed:', error.message);
      process.exit(1);
    });
}

module.exports = { setupTestData };
