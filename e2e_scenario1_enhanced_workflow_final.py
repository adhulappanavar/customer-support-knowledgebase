#!/usr/bin/env python3
"""
E2E Scenario 1: Enhanced Knowledge Base Workflow with Complete Feedback Loop
Python implementation for testing the complete AI-powered ticket resolution workflow
including human feedback integration and enhanced knowledge base creation in LanceDB
"""

import requests
import json
import time
import os
from typing import Dict, List, Optional
import logging
from datetime import datetime
import random

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class E2EScenario1EnhancedWorkflowFinal:
    """Complete Enhanced E2E scenario implementation with full feedback loop and enhanced KB"""
    
    def __init__(self):
        self.base_url = "http://localhost:8000"
        self.feedback_url = "http://localhost:8002"
        self.session = requests.Session()
        self.test_data = {}
        self.step_results = []
        self.test_start_time = None
        self.test_end_time = None
        
        # Test data for the enhanced workflow
        self.initial_ticket_id = None
        self.initial_ai_response = None
        self.human_feedback_data = None
        
    def start_test_timer(self):
        """Start the test timer"""
        self.test_start_time = datetime.now()
        logger.info(f"⏱️ Test started at: {self.test_start_time}")
        
    def end_test_timer(self):
        """End the test timer"""
        self.test_end_time = datetime.now()
        if self.test_start_time:
            duration = self.test_end_time - self.test_start_time
            logger.info(f"⏱️ Test completed in: {duration}")
            return duration
        return None
        
    def record_step_result(self, step_name: str, status: str, details: Dict, duration: float = None):
        """Record the result of a test step"""
        step_result = {
            'step_name': step_name,
            'status': status,
            'details': details,
            'timestamp': datetime.now().isoformat(),
            'duration': duration
        }
        self.step_results.append(step_result)
        logger.info(f"📝 Step recorded: {step_name} - {status}")
        
    def check_api_health(self) -> bool:
        """Check if both APIs are running and healthy"""
        step_start = time.time()
        logger.info("🏥 Checking API health for both services...")
        
        try:
            # Check CSKB API
            cskb_response = self.session.get(f"{self.base_url}/health")
            feedback_response = self.session.get(f"{self.feedback_url}/health")
            duration = time.time() - step_start
            
            cskb_healthy = cskb_response.status_code == 200
            feedback_healthy = feedback_response.status_code == 200
            
            if cskb_healthy and feedback_healthy:
                logger.info("✅ Both APIs are healthy")
                
                self.record_step_result(
                    "API Health Check",
                    "PASSED",
                    {
                        'cskb_api': {
                            'endpoint': f"{self.base_url}/health",
                            'status_code': cskb_response.status_code,
                            'response': cskb_response.json() if cskb_healthy else None
                        },
                        'feedback_api': {
                            'endpoint': f"{self.feedback_url}/health",
                            'status_code': feedback_response.status_code,
                            'response': feedback_response.json() if feedback_healthy else None
                        },
                        'response_time_ms': round(duration * 1000, 2)
                    },
                    duration
                )
                return True
            else:
                logger.error(f"❌ API health check failed - CSKB: {cskb_healthy}, Feedback: {feedback_healthy}")
                
                self.record_step_result(
                    "API Health Check",
                    "FAILED",
                    {
                        'cskb_api': {
                            'endpoint': f"{self.base_url}/health",
                            'status_code': cskb_response.status_code,
                            'response': cskb_response.text if not cskb_healthy else cskb_response.json()
                        },
                        'feedback_api': {
                            'endpoint': f"{self.feedback_url}/health",
                            'status_code': feedback_response.status_code,
                            'response': feedback_response.text if not feedback_healthy else feedback_response.json()
                        },
                        'response_time_ms': round(duration * 1000, 2)
                    },
                    duration
                )
                return False
                
        except Exception as e:
            duration = time.time() - step_start
            logger.error(f"❌ API health check error: {e}")
            
            self.record_step_result(
                "API Health Check",
                "ERROR",
                {
                    'error': str(e),
                    'response_time_ms': round(duration * 1000, 2)
                },
                duration
            )
            return False
    
    def ingest_pdf(self, pdf_path: str) -> Optional[str]:
        """Ingest a PDF into the knowledge base"""
        step_start = time.time()
        logger.info(f"📄 Step 1: Ingesting PDF: {pdf_path}")
        
        try:
            if not os.path.exists(pdf_path):
                duration = time.time() - step_start
                logger.error(f"PDF file not found: {pdf_path}")
                
                self.record_step_result(
                    "PDF Ingestion",
                    "FAILED",
                    {
                        'pdf_path': pdf_path,
                        'error': 'File not found',
                        'file_exists': False
                    },
                    duration
                )
                return None
            
            file_size = os.path.getsize(pdf_path)
            
            with open(pdf_path, 'rb') as pdf_file:
                files = {'file': ('document.pdf', pdf_file, 'application/pdf')}
                data = {
                    'document_name': 'technical_troubleshooting_guide',
                    'category': 'Technical Support'
                }
                response = self.session.post(f"{self.base_url}/ingest/pdf", files=files, data=data)
            
            duration = time.time() - step_start
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✅ PDF ingested successfully: {result}")
                self.test_data['document_id'] = result.get('document_id')
                
                self.record_step_result(
                    "PDF Ingestion",
                    "PASSED",
                    {
                        'endpoint': f"{self.base_url}/ingest/pdf",
                        'pdf_path': pdf_path,
                        'file_size_bytes': file_size,
                        'file_size_mb': round(file_size / (1024 * 1024), 2),
                        'document_name': data['document_name'],
                        'category': data['category'],
                        'status_code': response.status_code,
                        'response': result,
                        'response_time_ms': round(duration * 1000, 2),
                        'document_id': result.get('document_id')
                    },
                    duration
                )
                return result.get('document_id')
            else:
                logger.error(f"❌ PDF ingestion failed: {response.status_code} - {response.text}")
                
                self.record_step_result(
                    "PDF Ingestion",
                    "FAILED",
                    {
                        'pdf_path': pdf_path,
                        'file_size_bytes': file_size,
                        'file_size_mb': round(file_size / (1024 * 1024), 2),
                        'document_name': data['document_name'],
                        'category': data['category'],
                        'status_code': response.status_code,
                        'error': response.text,
                        'response_time_ms': round(duration * 1000, 2)
                    },
                    duration
                )
                return None
                
        except Exception as e:
            duration = time.time() - step_start
            logger.error(f"❌ PDF ingestion error: {e}")
            
            self.record_step_result(
                "PDF Ingestion",
                "ERROR",
                {
                    'pdf_path': pdf_path,
                    'error': str(e),
                    'response_time_ms': round(duration * 1000, 2)
                },
                duration
            )
            return None
    
    def create_support_ticket(self, issue_description: str) -> Optional[str]:
        """Create a support ticket for testing the workflow"""
        step_start = time.time()
        logger.info(f"🎫 Step 2: Creating support ticket with issue: {issue_description}")
        
        try:
            # Generate a unique ticket ID
            ticket_id = f"E2E-TEST-{int(time.time())}"
            
            # Create ticket data
            ticket_data = {
                "ticket_id": ticket_id,
                "customer_query": issue_description,
                "priority": "Medium",
                "category": "Technical Support",
                "status": "Open",
                "created_at": datetime.now().isoformat()
            }
            
            # Store ticket data for later use
            self.test_data['ticket'] = ticket_data
            self.initial_ticket_id = ticket_id
            
            logger.info(f"✅ Support ticket created: {ticket_id}")
            
            self.record_step_result(
                "Support Ticket Creation",
                "PASSED",
                {
                    'ticket_id': ticket_id,
                    'ticket_data': ticket_data,
                    'response_time_ms': round((time.time() - step_start) * 1000, 2)
                },
                time.time() - step_start
            )
            
            return ticket_id
            
        except Exception as e:
            duration = time.time() - step_start
            logger.error(f"❌ Support ticket creation error: {e}")
            
            self.record_step_result(
                "Support Ticket Creation",
                "ERROR",
                {
                    'error': str(e),
                    'response_time_ms': round(duration * 1000, 2)
                },
                duration
            )
            return None
    
    def get_initial_ai_response(self, ticket_id: str, query: str) -> Optional[Dict]:
        """Get initial AI response from the knowledge base"""
        step_start = time.time()
        logger.info(f"🤖 Step 3: Getting initial AI response for ticket: {ticket_id}")
        
        try:
            query_data = {
                "query": query,
                "user_id": f"ticket_{ticket_id}",
                "max_results": 5
            }
            
            response = self.session.post(f"{self.base_url}/query", json=query_data)
            duration = time.time() - step_start
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✅ Initial AI response generated successfully")
                self.test_data['initial_ai_response'] = result
                self.initial_ai_response = result
                
                self.record_step_result(
                    "Initial AI Response",
                    "PASSED",
                    {
                        'endpoint': f"{self.base_url}/query",
                        'ticket_id': ticket_id,
                        'query': query,
                        'query_data': query_data,
                        'status_code': response.status_code,
                        'response': result,
                        'response_time_ms': round(duration * 1000, 2),
                        'rag_used': result.get('rag_used', False),
                        'documents_retrieved': result.get('documents_retrieved', 0),
                        'sources_count': len(result.get('sources', [])),
                        'response_length': len(result.get('response', ''))
                    },
                    duration
                )
                return result
            else:
                logger.error(f"❌ Initial AI response failed: {response.status_code} - {response.text}")
                
                self.record_step_result(
                    "Initial AI Response",
                    "FAILED",
                    {
                        'endpoint': f"{self.base_url}/query",
                        'ticket_id': ticket_id,
                        'query': query,
                        'status_code': response.status_code,
                        'error': response.text,
                        'response_time_ms': round(duration * 1000, 2)
                    },
                    duration
                )
                return None
                
        except Exception as e:
            duration = time.time() - step_start
            logger.error(f"❌ Initial AI response error: {e}")
            
            self.record_step_result(
                "Initial AI Response",
                "ERROR",
                {
                    'ticket_id': ticket_id,
                    'query': query,
                    'error': str(e),
                    'response_time_ms': round(duration * 1000, 2)
                },
                duration
            )
            return None
    
    def simulate_human_agent_review(self, ticket_id: str, ai_response: Dict) -> Dict:
        """Simulate human agent reviewing the AI response and providing feedback"""
        step_start = time.time()
        logger.info(f"👤 Step 4: Simulating human agent review for ticket: {ticket_id}")
        
        try:
            # Simulate human agent analysis
            ai_response_text = ai_response.get('response', '')
            
            # Analyze the response quality and generate feedback
            feedback_analysis = self._analyze_ai_response(ai_response_text)
            
            # Create comprehensive feedback data
            feedback_data = {
                "ticket_id": ticket_id,
                "rating": feedback_analysis['rating'],
                "feedback_text": feedback_analysis['feedback_text'],
                "human_solution": feedback_analysis['human_solution'],
                "context": feedback_analysis['context'],
                "improvement_suggestions": feedback_analysis['improvements'],
                "confidence_score": feedback_analysis['confidence'],
                "reviewed_by": "human_agent_e2e_test",
                "review_timestamp": datetime.now().isoformat()
            }
            
            # Store feedback data
            self.test_data['human_feedback'] = feedback_data
            self.human_feedback_data = feedback_data
            
            logger.info(f"✅ Human agent review completed with rating: {feedback_analysis['rating']}/5")
            
            self.record_step_result(
                "Human Agent Review",
                "PASSED",
                {
                    'ticket_id': ticket_id,
                    'feedback_data': feedback_data,
                    'ai_response_analysis': feedback_analysis,
                    'response_time_ms': round((time.time() - step_start) * 1000, 2)
                },
                time.time() - step_start
            )
            
            return feedback_data
            
        except Exception as e:
            duration = time.time() - step_start
            logger.error(f"❌ Human agent review error: {e}")
            
            self.record_step_result(
                "Human Agent Review",
                "ERROR",
                {
                    'ticket_id': ticket_id,
                    'error': str(e),
                    'response_time_ms': round(duration * 1000, 2)
                },
                duration
            )
            return {}
    
    def _analyze_ai_response(self, ai_response: str) -> Dict:
        """Analyze AI response quality and generate realistic feedback"""
        
        # Analyze response length and content
        response_length = len(ai_response)
        has_steps = 'step' in ai_response.lower() or '1.' in ai_response
        has_tools = 'tool' in ai_response.lower() or 'ping' in ai_response.lower()
        has_resolution = 'resolution' in ai_response.lower() or 'solution' in ai_response.lower()
        
        # Calculate quality score
        quality_score = 0
        if response_length > 200: quality_score += 1
        if has_steps: quality_score += 1
        if has_tools: quality_score += 1
        if has_resolution: quality_score += 1
        
        # Generate rating (1-5)
        rating = max(1, min(5, quality_score + random.randint(0, 1)))
        
        # Generate feedback based on quality
        if rating >= 4:
            feedback_text = "Good response with comprehensive steps and tools. Could be more specific about network configuration details."
            human_solution = "The AI response covers the basics well. I would add specific network configuration commands and troubleshooting sequences."
            improvements = ["Add specific command examples", "Include network configuration steps", "Provide escalation procedures"]
        elif rating >= 3:
            feedback_text = "Decent response but missing some key troubleshooting steps. Needs more technical depth."
            human_solution = "While the response identifies the main issues, it lacks specific technical commands and detailed diagnostic procedures."
            improvements = ["Include specific commands", "Add diagnostic procedures", "Provide more technical details"]
        else:
            feedback_text = "Response is too generic and lacks technical depth. Needs significant improvement."
            human_solution = "The AI response is too basic and doesn't provide actionable technical steps for network engineers."
            improvements = ["Add technical commands", "Include diagnostic tools", "Provide step-by-step procedures"]
        
        context = "Network connectivity issues after system updates require specific technical knowledge and command-line expertise."
        confidence = min(0.95, max(0.6, rating * 0.15 + 0.1))
        
        return {
            'rating': rating,
            'feedback_text': feedback_text,
            'human_solution': human_solution,
            'context': context,
            'improvements': improvements,
            'confidence': confidence,
            'analysis': {
                'response_length': response_length,
                'has_steps': has_steps,
                'has_tools': has_tools,
                'has_resolution': has_resolution,
                'quality_score': quality_score
            }
        }
    
    def submit_human_feedback(self, ticket_id: str, feedback_data: Dict) -> bool:
        """Submit human feedback to the feedback database"""
        step_start = time.time()
        logger.info(f"💾 Step 5: Submitting human feedback to database for ticket: {ticket_id}")
        
        try:
            # Prepare feedback payload according to the API specification
            feedback_payload = {
                "ticket_id": ticket_id,
                "ai_solution": self.initial_ai_response.get("response", "") if self.initial_ai_response else "AI response not available",
                "human_solution": feedback_data["human_solution"],
                "feedback_type": "NEW_SOLUTION",
                "user_role": "human_agent",
                "comments": feedback_data["feedback_text"],
                "context": {"improvements": feedback_data.get("improvement_suggestions", [])}
            }
            
            # Submit to feedback API
            response = self.session.post(f"{self.feedback_url}/feedback", json=feedback_payload)
            duration = time.time() - step_start
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✅ Human feedback submitted successfully")
                
                self.record_step_result(
                    "Feedback Submission",
                    "PASSED",
                    {
                        'endpoint': f"{self.feedback_url}/feedback",
                        'ticket_id': ticket_id,
                        'feedback_payload': feedback_payload,
                        'status_code': response.status_code,
                        'response': result,
                        'response_time_ms': round(duration * 1000, 2)
                    },
                    duration
                )
                return True
            else:
                logger.error(f"❌ Feedback submission failed: {response.status_code} - {response.text}")
                
                self.record_step_result(
                    "Feedback Submission",
                    "FAILED",
                    {
                        'endpoint': f"{self.feedback_url}/feedback",
                        'ticket_id': ticket_id,
                        'feedback_payload': feedback_payload,
                        'status_code': response.status_code,
                        'error': response.text,
                        'response_time_ms': round(duration * 1000, 2)
                    },
                    duration
                )
                return False
                
        except Exception as e:
            duration = time.time() - step_start
            logger.error(f"❌ Feedback submission error: {e}")
            
            self.record_step_result(
                "Feedback Submission",
                "ERROR",
                {
                    'ticket_id': ticket_id,
                    'error': str(e),
                    'response_time_ms': round(duration * 1000, 2)
                },
                duration
            )
            return False
    
    def ingest_feedback_to_enhanced_kb(self, ticket_id: str, feedback_data: Dict) -> bool:
        """Ingest human feedback into the enhanced knowledge base (LanceDB)"""
        step_start = time.time()
        logger.info(f"🔧 Step 6: Ingesting feedback into enhanced knowledge base for ticket: {ticket_id}")
        
        try:
            # Prepare enhanced KB payload
            enhanced_kb_payload = {
                "ticket_id": ticket_id,
                "ai_solution": self.initial_ai_response.get("response", "") if self.initial_ai_response else "",
                "human_solution": feedback_data["human_solution"],
                "feedback_context": feedback_data.get("context", ""),
                "improvements": feedback_data.get("improvement_suggestions", []),
                "rating": feedback_data.get("rating", 0),
                "confidence_score": feedback_data.get("confidence_score", 0.0),
                "source_documents": self.initial_ai_response.get("sources", []) if self.initial_ai_response else [],
                "ingestion_timestamp": datetime.now().isoformat()
            }
            
            # Submit to enhanced KB API
            response = self.session.post(f"{self.feedback_url}/enhanced-kb/populate", json=enhanced_kb_payload)
            duration = time.time() - step_start
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✅ Feedback successfully ingested into enhanced knowledge base")
                
                self.record_step_result(
                    "Enhanced KB Population",
                    "PASSED",
                    {
                        'endpoint': f"{self.feedback_url}/enhanced-kb/populate",
                        'ticket_id': ticket_id,
                        'enhanced_kb_payload': enhanced_kb_payload,
                        'status_code': response.status_code,
                        'response': result,
                        'response_time_ms': round(duration * 1000, 2)
                    },
                    duration
                )
                return True
            else:
                logger.error(f"❌ Enhanced KB population failed: {response.status_code} - {response.text}")
                
                self.record_step_result(
                    "Enhanced KB Population",
                    "FAILED",
                    {
                        'endpoint': f"{self.feedback_url}/enhanced-kb/populate",
                        'ticket_id': ticket_id,
                        'enhanced_kb_payload': enhanced_kb_payload,
                        'status_code': response.status_code,
                        'error': response.text,
                        'response_time_ms': round(duration * 1000, 2)
                    },
                    duration
                )
                return False
                
        except Exception as e:
            duration = time.time() - step_start
            logger.error(f"❌ Enhanced KB population error: {e}")
            
            self.record_step_result(
                "Enhanced KB Population",
                "ERROR",
                {
                    'ticket_id': ticket_id,
                    'error': str(e),
                    'response_time_ms': round(duration * 1000, 2)
                },
                duration
            )
            return False
    
    def run_enhanced_workflow(self, pdf_path: str, issue_description: str) -> bool:
        """Run the complete enhanced E2E workflow with enhanced KB population"""
        self.start_test_timer()
        logger.info("🚀 Starting Enhanced E2E Scenario 1 with Complete Feedback Loop and Enhanced KB...")
        
        try:
            # Step 1: Check API health
            if not self.check_api_health():
                logger.error("❌ API health check failed")
                return False
            
            # Step 2: Ingest PDF
            document_id = self.ingest_pdf(pdf_path)
            if not document_id:
                logger.error("❌ PDF ingestion failed")
                return False
            
            # Wait for processing
            logger.info("⏳ Waiting for PDF processing...")
            time.sleep(3)
            
            # Step 3: Create support ticket
            ticket_id = self.create_support_ticket(issue_description)
            if not ticket_id:
                logger.error("❌ Support ticket creation failed")
                return False
            
            # Step 4: Get initial AI response
            initial_response = self.get_initial_ai_response(ticket_id, issue_description)
            if not initial_response:
                logger.error("❌ Initial AI response failed")
                return False
            
            # Step 5: Simulate human agent review
            feedback_data = self.simulate_human_agent_review(ticket_id, initial_response)
            if not feedback_data:
                logger.error("❌ Human agent review failed")
                return False
            
            # Step 6: Submit feedback to database
            if not self.submit_human_feedback(ticket_id, feedback_data):
                logger.error("❌ Feedback submission failed")
                return False
            
            # Step 7: Ingest feedback into enhanced knowledge base
            if not self.ingest_feedback_to_enhanced_kb(ticket_id, feedback_data):
                logger.error("❌ Enhanced KB population failed")
                return False
            
            # Final validation
            success = (
                document_id is not None and
                ticket_id is not None and
                initial_response is not None and
                feedback_data is not None
            )
            
            if success:
                logger.info("🎉 Enhanced E2E Scenario 1 completed successfully!")
                logger.info(f"📊 Final Results: {self.test_data}")
                
                # Summary of what was tested
                logger.info("📋 Enhanced Workflow Summary:")
                logger.info(f"   ✅ PDF ingested with ID: {document_id}")
                logger.info(f"   ✅ Support ticket created: {ticket_id}")
                logger.info(f"   ✅ Initial AI response generated")
                logger.info(f"   ✅ Human feedback provided and stored")
                logger.info(f"   ✅ Feedback ingested into enhanced knowledge base (LanceDB)")
                logger.info("🚀 Complete knowledge base enhancement workflow completed!")
            else:
                logger.warning("⚠️ Enhanced E2E Scenario 1 completed with issues")
            
            return success
            
        except Exception as e:
            logger.error(f"❌ Enhanced E2E Scenario 1 failed: {e}")
            return False
        finally:
            self.end_test_timer()

def main():
    """Main execution function"""
    
    # Initialize the enhanced scenario
    scenario = E2EScenario1EnhancedWorkflowFinal()
    
    # Test parameters
    pdf_path = "../../pdf-files/technical_troubleshooting_guide.pdf"
    issue_description = "Customer experiencing network connectivity issues after system update with intermittent packet loss and DNS resolution problems"
    
    # Run the enhanced workflow
    success = scenario.run_enhanced_workflow(pdf_path, issue_description)
    
    if success:
        print("\n🎉 Enhanced E2E Scenario 1 completed successfully!")
        print("📊 Check the logs above for detailed results")
        print("\n📋 Enhanced Workflow Tested:")
        print("   ✅ PDF ingestion and processing")
        print("   ✅ Support ticket creation")
        print("   ✅ Initial AI response generation")
        print("   ✅ Human agent review and feedback")
        print("   ✅ Feedback storage in database")
        print("   ✅ Feedback ingested into enhanced knowledge base (LanceDB)")
        print("\n🚀 Complete knowledge base enhancement workflow completed!")
        
    else:
        print("\n❌ Enhanced E2E Scenario 1 failed")
        print("📋 Check the logs above for error details")
    
    return success

if __name__ == "__main__":
    print("🚀 Starting Enhanced E2E Scenario 1 with Complete Feedback Loop...")
    main()
