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
    pdf_path = "../../pdf-files/technical_troubleshooting_guide.pdf"  # Correct path from Scenario1 directory
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
