# E2E Scenario 1: Complete Knowledge Base Enhancement Workflow

## Overview
This scenario demonstrates the complete workflow from initial knowledge base setup through AI resolution generation and human feedback integration, showcasing the enhanced knowledge base capabilities.

## Gherkin Feature Specification

```gherkin
Feature: Complete Knowledge Base Enhancement Workflow
  As a customer support engineer
  I want to test the complete AI-powered ticket resolution workflow
  So that I can validate the enhanced knowledge base integration

  Background:
    Given the customer support system is running
    And all backend services are operational
    And the test environment is clean

  Scenario: End-to-End Knowledge Base Enhancement Workflow
    Given I have a clean system with no existing data
    When I ingest a new PDF document into the knowledge base
    Then the document should be processed and indexed
    And the knowledge base should contain the new information

    When I create a relevant support ticket
    And the ticket is stored in the ticketing database
    Then the ticket should be available for processing
    And the ticket should be linked to the knowledge base

    When I request an AI resolution for the ticket
    Then the AI should generate a resolution based on the original knowledge base
    And the resolution should include confidence scores and sources

    When I provide human feedback on the AI resolution
    Then the feedback should be stored in the feedback database
    And the enhanced knowledge base should be updated with the feedback

    When I query the same ticket again for AI resolution
    Then the AI should generate a new resolution
    And the resolution should incorporate both original KB and enhanced KB data
    And the enhanced resolution should show improved confidence scores

    Then the complete workflow should demonstrate knowledge base enhancement
    And the system should maintain data consistency across all databases
```

## Detailed Step Definitions

### 1. Clean All Data - All KB's and Databases

```gherkin
  Scenario: Clean System Data
    Given I have access to all system databases
    When I clean the knowledge base database
    And I clean the ticketing database
    And I clean the feedback database
    And I clean the enhanced knowledge base
    Then all databases should be empty
    And the system should be in a clean state
```

### 2. Ingest a PDF

```gherkin
  Scenario: PDF Document Ingestion
    Given I have a PDF document to ingest
    When I upload the PDF to the knowledge base service
    And the PDF is processed for text extraction
    And the extracted text is indexed
    Then the document should be stored in the knowledge base
    And the content should be searchable
    And the document metadata should be preserved
```

### 3. Create Relevant Tickets and Ingest in Ticketing DB

```gherkin
  Scenario: Ticket Creation and Storage
    Given I have a customer issue description
    When I create a new support ticket
    And I assign a priority level to the ticket
    And I link the ticket to relevant knowledge base articles
    Then the ticket should be stored in the ticketing database
    And the ticket should have a unique identifier
    And the ticket should be in "Open" status
```

### 4. Pickup a Ticket and Ask for AI Resolution

```gherkin
  Scenario: AI Resolution Generation
    Given I have an open support ticket
    When I request an AI resolution for the ticket
    And the AI processes the ticket content
    And the AI searches the knowledge base
    Then the AI should generate a resolution
    And the resolution should include:
      | Field | Description |
      | answer | Detailed solution to the customer issue |
      | confidence | Confidence score between 0 and 1 |
      | sources | List of knowledge base sources used |
    And the resolution should be stored with the ticket
```

### 5. Provide Human Feedback on the Ticket

```gherkin
  Scenario: Human Feedback Integration
    Given I have an AI-generated resolution
    When I review the AI resolution
    And I provide human feedback including:
      | Field | Description |
      | rating | Effectiveness rating (1-5) |
      | feedback_text | Detailed feedback on the resolution |
      | human_solution | Alternative human-provided solution |
      | context | Additional context or corrections |
    Then the feedback should be stored in the feedback database
    And the feedback should be linked to the ticket
    And the enhanced knowledge base should be updated
```

### 6. Query the Ticket Again for AI Resolution and Get Both Original KB and Enhanced KB

```gherkin
  Scenario: Enhanced AI Resolution with Both KB Sources
    Given I have provided human feedback on a ticket
    And the enhanced knowledge base has been updated
    When I request a new AI resolution for the same ticket
    And the AI processes both original and enhanced knowledge bases
    Then the AI should generate an improved resolution
    And the resolution should show:
      | Field | Description |
      | answer | Enhanced solution incorporating feedback |
      | confidence | Higher confidence score than before |
      | sources | Both original KB and enhanced KB sources |
      | enhancement_notes | Notes about what was improved |
    And the resolution should demonstrate knowledge base enhancement
```

## Python Implementation

### Complete E2E Scenario Implementation

```python
#!/usr/bin/env python3
"""
E2E Scenario 1: Complete Knowledge Base Enhancement Workflow
Python implementation for testing the complete AI-powered ticket resolution workflow
"""

import requests
import json
import time
import os
from typing import Dict, List, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class E2EScenario1:
    """Complete E2E scenario implementation for knowledge base enhancement workflow"""
    
    def __init__(self):
        self.base_url = "http://localhost:8000"
        self.feedback_url = "http://localhost:8002"
        self.session = requests.Session()
        self.test_data = {}
        
    def clean_all_data(self) -> bool:
        """
        Step 1: Clean all data - all KB's and Databases
        """
        logger.info("🧹 Step 1: Cleaning all system data...")
        
        try:
            # Clean knowledge base
            kb_cleanup = self.session.delete(f"{self.base_url}/knowledge/clear")
            logger.info(f"Knowledge base cleanup: {kb_cleanup.status_code}")
            
            # Clean enhanced knowledge base
            enhanced_kb_cleanup = self.session.delete(f"{self.feedback_url}/enhanced-kb/clear")
            logger.info(f"Enhanced KB cleanup: {enhanced_kb_cleanup.status_code}")
            
            # Clean feedback database
            feedback_cleanup = self.session.delete(f"{self.feedback_url}/feedback/clear")
            logger.info(f"Feedback cleanup: {feedback_cleanup.status_code}")
            
            # Clean ticketing database (if endpoint exists)
            try:
                ticket_cleanup = self.session.delete(f"{self.base_url}/tickets/clear")
                logger.info(f"Ticket cleanup: {ticket_cleanup.status_code}")
            except:
                logger.info("Ticket cleanup endpoint not available")
            
            logger.info("✅ All system data cleaned successfully")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to clean system data: {e}")
            return False
    
    def ingest_pdf(self, pdf_path: str) -> Optional[str]:
        """
        Step 2: Ingest a PDF into the knowledge base
        """
        logger.info(f"📄 Step 2: Ingesting PDF: {pdf_path}")
        
        try:
            if not os.path.exists(pdf_path):
                logger.error(f"PDF file not found: {pdf_path}")
                return None
            
            with open(pdf_path, 'rb') as pdf_file:
                files = {'file': ('document.pdf', pdf_file, 'application/pdf')}
                response = self.session.post(f"{self.base_url}/knowledge/upload", files=files)
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✅ PDF ingested successfully: {result}")
                return result.get('document_id')
            else:
                logger.error(f"❌ PDF ingestion failed: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"❌ PDF ingestion error: {e}")
            return None
    
    def create_ticket(self, issue_description: str, priority: str = "Medium") -> Optional[str]:
        """
        Step 3: Create a relevant ticket and ingest in ticketing DB
        """
        logger.info(f"🎫 Step 3: Creating ticket with priority: {priority}")
        
        try:
            ticket_data = {
                "ticket_id": f"E2E-TEST-{int(time.time())}",
                "customer_query": issue_description,
                "priority": priority,
                "category": "Technical Support"
            }
            
            response = self.session.post(f"{self.base_url}/workflow/create", json=ticket_data)
            
            if response.status_code == 200:
                result = response.json()
                ticket_id = result.get('ticket_id')
                logger.info(f"✅ Ticket created successfully: {ticket_id}")
                self.test_data['ticket_id'] = ticket_id
                return ticket_id
            else:
                logger.error(f"❌ Ticket creation failed: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Ticket creation error: {e}")
            return None
    
    def get_ai_resolution(self, ticket_id: str) -> Optional[Dict]:
        """
        Step 4: Pickup a ticket and ask for AI resolution
        """
        logger.info(f"🤖 Step 4: Getting AI resolution for ticket: {ticket_id}")
        
        try:
            response = self.session.post(f"{self.base_url}/workflow/resolve", json={
                "ticket_id": ticket_id
            })
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✅ AI resolution generated: {result}")
                self.test_data['original_resolution'] = result
                return result
            else:
                logger.error(f"❌ AI resolution failed: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"❌ AI resolution error: {e}")
            return None
    
    def provide_human_feedback(self, ticket_id: str, rating: int = 4, 
                              feedback_text: str = "Good resolution, but could be more specific") -> bool:
        """
        Step 5: Provide human feedback on the ticket
        """
        logger.info(f"👤 Step 5: Providing human feedback for ticket: {ticket_id}")
        
        try:
            feedback_data = {
                "ticket_id": ticket_id,
                "rating": rating,
                "feedback_text": feedback_text,
                "human_solution": "Check network settings and restart the service",
                "context": "This issue commonly occurs after system updates"
            }
            
            response = self.session.post(f"{self.feedback_url}/feedback/submit", json=feedback_data)
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✅ Human feedback submitted successfully: {result}")
                self.test_data['human_feedback'] = feedback_data
                return True
            else:
                logger.error(f"❌ Feedback submission failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Feedback submission error: {e}")
            return False
    
    def get_enhanced_ai_resolution(self, ticket_id: str) -> Optional[Dict]:
        """
        Step 6: Query the ticket again for AI resolution and get both Original KB and Enhanced KB
        """
        logger.info(f"🚀 Step 6: Getting enhanced AI resolution for ticket: {ticket_id}")
        
        try:
            response = self.session.post(f"{self.base_url}/workflow/resolve", json={
                "ticket_id": ticket_id
            })
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✅ Enhanced AI resolution generated: {result}")
                self.test_data['enhanced_resolution'] = result
                return result
            else:
                logger.error(f"❌ Enhanced AI resolution failed: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Enhanced AI resolution error: {e}")
            return None
    
    def compare_resolutions(self) -> Dict:
        """
        Compare original and enhanced resolutions
        """
        logger.info("📊 Comparing original vs enhanced resolutions...")
        
        original = self.test_data.get('original_resolution', {})
        enhanced = self.test_data.get('enhanced_resolution', {})
        
        comparison = {
            'original_confidence': original.get('ai_response', {}).get('confidence', 0),
            'enhanced_confidence': enhanced.get('ai_response', {}).get('confidence', 0),
            'confidence_improvement': 0,
            'original_sources': original.get('ai_response', {}).get('sources', []),
            'enhanced_sources': enhanced.get('ai_response', {}).get('sources', []),
            'source_improvement': False
        }
        
        if comparison['enhanced_confidence'] > comparison['original_confidence']:
            comparison['confidence_improvement'] = comparison['enhanced_confidence'] - comparison['original_confidence']
        
        if len(comparison['enhanced_sources']) > len(comparison['original_sources']):
            comparison['source_improvement'] = True
        
        logger.info(f"📈 Resolution comparison: {comparison}")
        return comparison
    
    def run_complete_scenario(self, pdf_path: str, issue_description: str) -> bool:
        """
        Run the complete E2E scenario
        """
        logger.info("🚀 Starting Complete E2E Scenario 1...")
        
        try:
            # Step 1: Clean all data
            if not self.clean_all_data():
                return False
            
            # Step 2: Ingest PDF
            document_id = self.ingest_pdf(pdf_path)
            if not document_id:
                return False
            
            # Step 3: Create ticket
            ticket_id = self.create_ticket(issue_description)
            if not ticket_id:
                return False
            
            # Step 4: Get AI resolution
            original_resolution = self.get_ai_resolution(ticket_id)
            if not original_resolution:
                return False
            
            # Step 5: Provide human feedback
            if not self.provide_human_feedback(ticket_id):
                return False
            
            # Wait for enhanced KB to be updated
            logger.info("⏳ Waiting for enhanced knowledge base to be updated...")
            time.sleep(5)
            
            # Step 6: Get enhanced AI resolution
            enhanced_resolution = self.get_enhanced_ai_resolution(ticket_id)
            if not enhanced_resolution:
                return False
            
            # Compare results
            comparison = self.compare_resolutions()
            
            # Final validation
            success = (
                comparison['confidence_improvement'] > 0 or 
                comparison['source_improvement']
            )
            
            if success:
                logger.info("🎉 E2E Scenario 1 completed successfully!")
                logger.info(f"📊 Final Results: {self.test_data}")
            else:
                logger.warning("⚠️ E2E Scenario 1 completed but no improvement detected")
            
            return success
            
        except Exception as e:
            logger.error(f"❌ E2E Scenario 1 failed: {e}")
            return False

def main():
    """Main execution function"""
    
    # Initialize the scenario
    scenario = E2EScenario1()
    
    # Test parameters
    pdf_path = "../pdf-files/technical_troubleshooting_guide.pdf"  # Adjust path as needed
    issue_description = "Customer experiencing network connectivity issues after system update"
    
    # Run the complete scenario
    success = scenario.run_complete_scenario(pdf_path, issue_description)
    
    if success:
        print("\n🎉 E2E Scenario 1 completed successfully!")
        print("📊 Check the logs above for detailed results")
    else:
        print("\n❌ E2E Scenario 1 failed")
        print("📋 Check the logs above for error details")
    
    return success

if __name__ == "__main__":
    main()
```

## Test Data Setup

### Sample PDF Content for Testing
The scenario expects a PDF document with technical troubleshooting content. You can use any of the existing PDFs in the `pdf-files/` directory or create a new one with relevant content.

### Expected Test Results

| Step | Expected Outcome | Validation Criteria |
|------|------------------|-------------------|
| 1. Clean Data | All databases empty | No existing records |
| 2. Ingest PDF | Document indexed | Searchable content available |
| 3. Create Ticket | Ticket stored | Unique ID generated |
| 4. AI Resolution | Resolution generated | Confidence score > 0.5 |
| 5. Human Feedback | Feedback stored | Enhanced KB updated |
| 6. Enhanced Resolution | Improved resolution | Higher confidence or more sources |

## Running the Scenario

### Prerequisites
1. Ensure all backend services are running:
   - CSKB API (port 8000)
   - Feedback Agents (port 8002)
   - React UI (port 3001)

2. Install Python dependencies:
```bash
pip install requests
```

### Execution
```bash
cd E2E-Special-Scenarios/Scenario1
python3 e2e_scenario1.py
```

### Monitoring
The script provides detailed logging for each step, making it easy to:
- Track progress through the workflow
- Identify where failures occur
- Validate data at each stage
- Compare original vs enhanced resolutions

## Troubleshooting

### Common Issues
1. **Service Unavailable**: Check if backend services are running
2. **PDF Not Found**: Verify the PDF file path
3. **Database Connection**: Ensure database services are accessible
4. **API Endpoints**: Verify API endpoint configurations

### Debug Mode
Enable debug logging by modifying the logging level:
```python
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
```

This E2E scenario provides a comprehensive test of the complete knowledge base enhancement workflow, validating that the system can learn from human feedback and improve AI resolution quality over time.
