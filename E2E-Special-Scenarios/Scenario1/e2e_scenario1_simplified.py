#!/usr/bin/env python3
"""
E2E Scenario 1: Simplified Version - Testing Available API Endpoints
Python implementation for testing the actual available API functionality
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

class E2EScenario1Simplified:
    """Simplified E2E scenario implementation using actual available endpoints"""
    
    def __init__(self):
        self.base_url = "http://localhost:8000"
        self.feedback_url = "http://localhost:8002"
        self.session = requests.Session()
        self.test_data = {}
        
    def check_api_health(self) -> bool:
        """
        Check if the API is running and healthy
        """
        logger.info("🏥 Checking API health...")
        
        try:
            response = self.session.get(f"{self.base_url}/health")
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✅ API health check passed: {result}")
                return True
            else:
                logger.error(f"❌ API health check failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            logger.error(f"❌ API health check error: {e}")
            return False
    
    def ingest_pdf(self, pdf_path: str) -> Optional[str]:
        """
        Step 1: Ingest a PDF into the knowledge base
        """
        logger.info(f"📄 Step 1: Ingesting PDF: {pdf_path}")
        
        try:
            if not os.path.exists(pdf_path):
                logger.error(f"PDF file not found: {pdf_path}")
                return None
            
            with open(pdf_path, 'rb') as pdf_file:
                files = {'file': ('document.pdf', pdf_file, 'application/pdf')}
                data = {
                    'document_name': 'technical_troubleshooting_guide',
                    'category': 'Technical Support'
                }
                response = self.session.post(f"{self.base_url}/ingest/pdf", files=files, data=data)
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✅ PDF ingested successfully: {result}")
                self.test_data['document_id'] = result.get('document_id')
                return result.get('document_id')
            else:
                logger.error(f"❌ PDF ingestion failed: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"❌ PDF ingestion error: {e}")
            return None
    
    def query_knowledge_base(self, query: str) -> Optional[Dict]:
        """
        Step 2: Query the knowledge base
        """
        logger.info(f"🔍 Step 2: Querying knowledge base with: {query}")
        
        try:
            query_data = {
                "query": query,
                "user_id": "e2e_test_user",
                "max_results": 5
            }
            
            response = self.session.post(f"{self.base_url}/query", json=query_data)
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✅ Knowledge base query successful: {result}")
                self.test_data['query_result'] = result
                return result
            else:
                logger.error(f"❌ Knowledge base query failed: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Knowledge base query error: {e}")
            return None
    
    def list_documents(self) -> Optional[List]:
        """
        Step 3: List all documents in the knowledge base
        """
        logger.info("📚 Step 3: Listing all documents...")
        
        try:
            response = self.session.get(f"{self.base_url}/documents")
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✅ Documents listed successfully: {result}")
                self.test_data['documents'] = result
                return result
            else:
                logger.error(f"❌ Document listing failed: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Document listing error: {e}")
            return None
    
    def check_feedback_service(self) -> bool:
        """
        Step 4: Check if feedback service is available
        """
        logger.info("👤 Step 4: Checking feedback service availability...")
        
        try:
            response = self.session.get(f"{self.feedback_url}/health")
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✅ Feedback service available: {result}")
                self.test_data['feedback_service'] = result
                return True
            else:
                logger.warning(f"⚠️ Feedback service not available: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            logger.warning(f"⚠️ Feedback service check failed: {e}")
            return False
    
    def run_simplified_scenario(self, pdf_path: str, test_query: str) -> bool:
        """
        Run the simplified E2E scenario
        """
        logger.info("🚀 Starting Simplified E2E Scenario 1...")
        
        try:
            # Check API health
            if not self.check_api_health():
                logger.error("❌ API health check failed")
                return False
            
            # Step 1: Ingest PDF
            document_id = self.ingest_pdf(pdf_path)
            if not document_id:
                logger.error("❌ PDF ingestion failed")
                return False
            
            # Wait a moment for processing
            logger.info("⏳ Waiting for PDF processing...")
            time.sleep(3)
            
            # Step 2: Query knowledge base
            query_result = self.query_knowledge_base(test_query)
            if not query_result:
                logger.error("❌ Knowledge base query failed")
                return False
            
            # Step 3: List documents
            documents = self.list_documents()
            if not documents:
                logger.error("❌ Document listing failed")
                return False
            
            # Step 4: Check feedback service
            feedback_available = self.check_feedback_service()
            
            # Final validation
            success = (
                document_id is not None and
                query_result is not None and
                documents is not None
            )
            
            if success:
                logger.info("🎉 Simplified E2E Scenario 1 completed successfully!")
                logger.info(f"📊 Final Results: {self.test_data}")
                
                # Summary of what was tested
                logger.info("📋 Scenario Summary:")
                logger.info(f"   ✅ PDF ingested with ID: {document_id}")
                logger.info(f"   ✅ Knowledge base query successful")
                logger.info(f"   ✅ Documents listed: {len(documents) if isinstance(documents, list) else 'N/A'}")
                logger.info(f"   {'✅' if feedback_available else '⚠️'} Feedback service: {'Available' if feedback_available else 'Not Available'}")
            else:
                logger.warning("⚠️ Simplified E2E Scenario 1 completed with issues")
            
            return success
            
        except Exception as e:
            logger.error(f"❌ Simplified E2E Scenario 1 failed: {e}")
            return False

def main():
    """Main execution function"""
    
    # Initialize the scenario
    scenario = E2EScenario1Simplified()
    
    # Test parameters
    pdf_path = "../../pdf-files/technical_troubleshooting_guide.pdf"
    test_query = "How to troubleshoot network connectivity issues after system update"
    
    # Run the simplified scenario
    success = scenario.run_simplified_scenario(pdf_path, test_query)
    
    if success:
        print("\n🎉 Simplified E2E Scenario 1 completed successfully!")
        print("📊 Check the logs above for detailed results")
        print("\n📋 What was tested:")
        print("   ✅ PDF ingestion and processing")
        print("   ✅ Knowledge base querying")
        print("   ✅ Document listing")
        print("   ✅ Feedback service availability")
    else:
        print("\n❌ Simplified E2E Scenario 1 failed")
        print("📋 Check the logs above for error details")
    
    return success

if __name__ == "__main__":
    main()
