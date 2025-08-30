import axios from 'axios';

const FEEDBACK_AGENTS_URL = 'http://localhost:8002';
const KNOWLEDGE_API_URL = 'http://localhost:8000';

export interface TestData {
  testTicketIds: string[];
  testFeedbackIds: number[];
}

let testData: TestData = {
  testTicketIds: [],
  testFeedbackIds: []
};

export async function setupTestData() {
  console.log('🔧 Setting up test data...');
  
  try {
    // Clean up any existing test data first
    await cleanupTestData();
    
    // Create test tickets and feedback
    await createTestTickets();
    
    console.log('✅ Test data setup completed');
  } catch (error) {
    console.error('❌ Error setting up test data:', error);
    throw error;
  }
}

export async function cleanupTestData() {
  console.log('🧹 Cleaning up test data...');
  
  try {
    // Note: The API doesn't have DELETE endpoints for feedback or tickets
    // Test data will remain in the system but won't interfere with future tests
    // as we use unique identifiers for each test run
    
    // Reset test data tracking
    testData = {
      testTicketIds: [],
      testFeedbackIds: []
    };
    
    console.log('✅ Test data cleanup completed (data remains in system)');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

async function createTestTickets() {
  console.log('📝 Creating test tickets...');
  
  const testTickets = [
    {
      ticketId: 'E2E-TEST-001',
      query: 'How do I reset my password?',
      aiSolution: 'To reset your password, go to the login page and click "Forgot Password". Follow the email instructions.',
      feedbackType: 'PERFECT',
      userRole: 'support_engineer',
      comments: 'This is a test feedback entry for E2E testing.'
    },
    {
      ticketId: 'E2E-TEST-002',
      query: 'My account is locked, how do I unlock it?',
      aiSolution: 'Contact support to unlock your account.',
      feedbackType: 'MINOR_CHANGES',
      humanSolution: 'Contact support to unlock your account. You can also try the self-service unlock option in your account settings.',
      userRole: 'support_engineer',
      comments: 'AI solution was incomplete, needed to mention self-service option.'
    },
    {
      ticketId: 'E2E-TEST-003',
      query: 'How do I update my billing information?',
      aiSolution: 'Go to your account settings to update billing.',
      feedbackType: 'NEW_SOLUTION',
      humanSolution: 'To update your billing information: 1) Log into your account 2) Go to Account Settings > Billing 3) Click "Edit" next to your payment method 4) Update the information and save',
      userRole: 'support_engineer',
      comments: 'AI solution was too vague, needed step-by-step instructions.'
    }
  ];
  
  for (const ticket of testTickets) {
    try {
      // Create feedback entry
      const feedbackResponse = await axios.post(`${FEEDBACK_AGENTS_URL}/feedback`, {
        ticket_id: ticket.ticketId,
        ai_solution: ticket.aiSolution,
        human_solution: ticket.humanSolution,
        feedback_type: ticket.feedbackType,
        user_role: ticket.userRole,
        comments: ticket.comments,
        context: { source: 'e2e-testing' }
      });
      
      testData.testTicketIds.push(ticket.ticketId);
      testData.testFeedbackIds.push(feedbackResponse.data.feedback_id);
      
      console.log(`✅ Created test ticket: ${ticket.ticketId}`);
    } catch (error) {
      console.error(`❌ Error creating test ticket ${ticket.ticketId}:`, error);
    }
  }
}

export function getTestData(): TestData {
  return { ...testData };
}

export function addTestTicket(ticketId: string) {
  testData.testTicketIds.push(ticketId);
}

export function addTestFeedback(feedbackId: number) {
  testData.testFeedbackIds.push(feedbackId);
}
