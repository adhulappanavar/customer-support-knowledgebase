#!/usr/bin/env python3
"""
E2E Scenario 1: Simplified Version with Markdown Report Generation
Python implementation for testing the actual available API functionality
"""

import requests
import json
import time
import os
from typing import Dict, List, Optional
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class E2EScenario1WithReport:
    """E2E scenario implementation with detailed markdown reporting"""
    
    def __init__(self):
        self.base_url = "http://localhost:8000"
        self.feedback_url = "http://localhost:8002"
        self.session = requests.Session()
        self.test_data = {}
        self.step_results = []
        self.test_start_time = None
        self.test_end_time = None
        
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
        """Check if the API is running and healthy"""
        step_start = time.time()
        logger.info("🏥 Checking API health...")
        
        try:
            response = self.session.get(f"{self.base_url}/health")
            duration = time.time() - step_start
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✅ API health check passed: {result}")
                
                self.record_step_result(
                    "API Health Check",
                    "PASSED",
                    {
                        'endpoint': f"{self.base_url}/health",
                        'status_code': response.status_code,
                        'response': result,
                        'response_time_ms': round(duration * 1000, 2)
                    },
                    duration
                )
                return True
            else:
                logger.error(f"❌ API health check failed: {response.status_code} - {response.text}")
                
                self.record_step_result(
                    "API Health Check",
                    "FAILED",
                    {
                        'endpoint': f"{self.base_url}/health",
                        'status_code': response.status_code,
                        'error': response.text,
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
                    'endpoint': f"{self.base_url}/health",
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
    
    def query_knowledge_base(self, query: str) -> Optional[Dict]:
        """Query the knowledge base"""
        step_start = time.time()
        logger.info(f"🔍 Step 2: Querying knowledge base with: {query}")
        
        try:
            query_data = {
                "query": query,
                "user_id": "e2e_test_user",
                "max_results": 5
            }
            
            response = self.session.post(f"{self.base_url}/query", json=query_data)
            duration = time.time() - step_start
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✅ Knowledge base query successful: {result}")
                self.test_data['query_result'] = result
                
                self.record_step_result(
                    "Knowledge Base Query",
                    "PASSED",
                    {
                        'endpoint': f"{self.base_url}/query",
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
                logger.error(f"❌ Knowledge base query failed: {response.status_code} - {response.text}")
                
                self.record_step_result(
                    "Knowledge Base Query",
                    "FAILED",
                    {
                        'endpoint': f"{self.base_url}/query",
                        'query': query,
                        'query_data': query_data,
                        'status_code': response.status_code,
                        'error': response.text,
                        'response_time_ms': round(duration * 1000, 2)
                    },
                    duration
                )
                return None
                
        except Exception as e:
            duration = time.time() - step_start
            logger.error(f"❌ Knowledge base query error: {e}")
            
            self.record_step_result(
                "Knowledge Base Query",
                "ERROR",
                {
                    'query': query,
                    'error': str(e),
                    'response_time_ms': round(duration * 1000, 2)
                },
                duration
            )
            return None
    
    def list_documents(self) -> Optional[List]:
        """List all documents in the knowledge base"""
        step_start = time.time()
        logger.info("📚 Step 3: Listing all documents...")
        
        try:
            response = self.session.get(f"{self.base_url}/documents")
            duration = time.time() - step_start
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✅ Documents listed successfully: {result}")
                self.test_data['documents'] = result
                
                self.record_step_result(
                    "Document Listing",
                    "PASSED",
                    {
                        'endpoint': f"{self.base_url}/documents",
                        'status_code': response.status_code,
                        'response': result,
                        'response_time_ms': round(duration * 1000, 2),
                        'documents_count': len(result.get('documents', [])),
                        'documents': result.get('documents', [])
                    },
                    duration
                )
                return result
            else:
                logger.error(f"❌ Document listing failed: {response.status_code} - {response.text}")
                
                self.record_step_result(
                    "Document Listing",
                    "FAILED",
                    {
                        'endpoint': f"{self.base_url}/documents",
                        'status_code': response.status_code,
                        'error': response.text,
                        'response_time_ms': round(duration * 1000, 2)
                    },
                    duration
                )
                return None
                
        except Exception as e:
            duration = time.time() - step_start
            logger.error(f"❌ Document listing error: {e}")
            
            self.record_step_result(
                "Document Listing",
                "ERROR",
                {
                    'error': str(e),
                    'response_time_ms': round(duration * 1000, 2)
                },
                duration
            )
            return None
    
    def check_feedback_service(self) -> bool:
        """Check if feedback service is available"""
        step_start = time.time()
        logger.info("👤 Step 4: Checking feedback service availability...")
        
        try:
            response = self.session.get(f"{self.feedback_url}/health")
            duration = time.time() - step_start
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✅ Feedback service available: {result}")
                self.test_data['feedback_service'] = result
                
                self.record_step_result(
                    "Feedback Service Check",
                    "PASSED",
                    {
                        'endpoint': f"{self.feedback_url}/health",
                        'status_code': response.status_code,
                        'response': result,
                        'response_time_ms': round(duration * 1000, 2)
                    },
                    duration
                )
                return True
            else:
                logger.warning(f"⚠️ Feedback service not available: {response.status_code} - {response.text}")
                
                self.record_step_result(
                    "Feedback Service Check",
                    "WARNING",
                    {
                        'endpoint': f"{self.feedback_url}/health",
                        'status_code': response.status_code,
                        'warning': response.text,
                        'response_time_ms': round(duration * 1000, 2)
                    },
                    duration
                )
                return False
        except Exception as e:
            duration = time.time() - step_start
            logger.warning(f"⚠️ Feedback service check failed: {e}")
            
            self.record_step_result(
                "Feedback Service Check",
                "WARNING",
                {
                    'endpoint': f"{self.feedback_url}/health",
                    'warning': str(e),
                    'response_time_ms': round(duration * 1000, 2)
                },
                duration
            )
            return False
    
    def generate_markdown_report(self) -> str:
        """Generate a detailed markdown test report"""
        
        # Calculate test statistics
        total_steps = len(self.step_results)
        passed_steps = len([s for s in self.step_results if s['status'] == 'PASSED'])
        failed_steps = len([s for s in self.step_results if s['status'] == 'FAILED'])
        warning_steps = len([s for s in self.step_results if s['status'] == 'WARNING'])
        error_steps = len([s for s in self.step_results if s['status'] == 'ERROR'])
        
        total_duration = sum([s.get('duration', 0) for s in self.step_results])
        avg_response_time = total_duration / total_steps if total_steps > 0 else 0
        
        # Generate report
        report = f"""# E2E Scenario 1: Simplified Knowledge Base Workflow Test Report

## 📊 Executive Summary

**Test Status**: {'✅ PASSED' if failed_steps == 0 and error_steps == 0 else '❌ FAILED' if failed_steps > 0 else '⚠️ PARTIAL SUCCESS'}
**Test Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Total Duration**: {total_duration:.2f} seconds
**Total Steps**: {total_steps}
**Passed**: {passed_steps} ✅
**Failed**: {failed_steps} ❌
**Warnings**: {warning_steps} ⚠️
**Errors**: {error_steps} 🚨

## 🎯 Test Objective

This E2E scenario validates the core functionality of the Customer Support Knowledge Base system:
- PDF document ingestion and processing
- Knowledge base querying with AI-powered responses
- Document management and listing
- Service health monitoring

## 🏗️ System Under Test

- **CSKB API**: {self.base_url}
- **Feedback Service**: {self.feedback_url}
- **Test Environment**: Local Development
- **Test Data**: Technical Troubleshooting Guide PDF

## 📋 Test Flow and Results

### Step-by-Step Execution

"""
        
        # Add each step result
        for i, step in enumerate(self.step_results, 1):
            status_emoji = {
                'PASSED': '✅',
                'FAILED': '❌',
                'WARNING': '⚠️',
                'ERROR': '🚨'
            }.get(step['status'], '❓')
            
            report += f"""#### Step {i}: {step['step_name']} {status_emoji}

**Status**: {step['status']}
**Duration**: {step.get('duration', 0):.2f}s ({step.get('duration', 0) * 1000:.0f}ms)
**Timestamp**: {step['timestamp']}

**Details**:
```json
{json.dumps(step['details'], indent=2)}
```

"""
        
        # Add test data summary
        report += f"""## 📊 Test Data Summary

### Ingested Document
- **Document ID**: {self.test_data.get('document_id', 'N/A')}
- **File Path**: ../../pdf-files/technical_troubleshooting_guide.pdf
- **Category**: Technical Support

### Knowledge Base Query
- **Query**: How to troubleshoot network connectivity issues after system update
- **RAG Used**: {self.test_data.get('query_result', {}).get('rag_used', 'N/A')}
- **Documents Retrieved**: {self.test_data.get('query_result', {}).get('documents_retrieved', 'N/A')}
- **Sources Count**: {len(self.test_data.get('query_result', {}).get('sources', []))}

### Service Status
- **CSKB API**: {'✅ Healthy' if any(s['step_name'] == 'API Health Check' and s['status'] == 'PASSED' for s in self.step_results) else '❌ Unhealthy'}
- **Feedback Service**: {'✅ Available' if any(s['step_name'] == 'Feedback Service Check' and s['status'] == 'PASSED' for s in self.step_results) else '⚠️ Limited'}

## 📈 Performance Metrics

- **Total Test Time**: {total_duration:.2f} seconds
- **Average Response Time**: {avg_response_time:.2f} seconds
- **Fastest Step**: {min(self.step_results, key=lambda x: x.get('duration', float('inf')))['step_name'] if self.step_results else 'N/A'}
- **Slowest Step**: {max(self.step_results, key=lambda x: x.get('duration', 0))['step_name'] if self.step_results else 'N/A'}

## 🔍 Detailed API Responses

### PDF Ingestion Response
```json
{json.dumps(self.test_data.get('document_id', 'N/A'), indent=2)}
```

### Knowledge Base Query Response
```json
{json.dumps(self.test_data.get('query_result', 'N/A'), indent=2)}
```

### Document Listing Response
```json
{json.dumps(self.test_data.get('documents', 'N/A'), indent=2)}
```

### Feedback Service Response
```json
{json.dumps(self.test_data.get('feedback_service', 'N/A'), indent=2)}
```

## 🎯 Test Conclusions

### ✅ What's Working Well
"""
        
        # Add working features
        working_features = []
        if any(s['step_name'] == 'API Health Check' and s['status'] == 'PASSED' for s in self.step_results):
            working_features.append("API health monitoring and status reporting")
        if any(s['step_name'] == 'PDF Ingestion' and s['status'] == 'PASSED' for s in self.step_results):
            working_features.append("PDF document ingestion and processing")
        if any(s['step_name'] == 'Knowledge Base Query' and s['status'] == 'PASSED' for s in self.step_results):
            working_features.append("AI-powered knowledge base querying with RAG")
        if any(s['step_name'] == 'Document Listing' and s['status'] == 'PASSED' for s in self.step_results):
            working_features.append("Document management and metadata retrieval")
        if any(s['step_name'] == 'Feedback Service Check' and s['status'] == 'PASSED' for s in self.step_results):
            working_features.append("Feedback service integration")
        
        for feature in working_features:
            report += f"- {feature}\n"
        
        # Add areas for improvement
        report += f"""
### 🔧 Areas for Improvement
"""
        
        if failed_steps > 0:
            failed_step_names = [s['step_name'] for s in self.step_results if s['status'] == 'FAILED']
            for step_name in failed_step_names:
                report += f"- {step_name} needs investigation and fixing\n"
        
        if warning_steps > 0:
            warning_step_names = [s['step_name'] for s in self.step_results if s['status'] == 'WARNING']
            for step_name in warning_step_names:
                report += f"- {step_name} has limitations that should be addressed\n"
        
        # Add recommendations
        report += f"""
## 🚀 Recommendations

### Immediate Actions
- Monitor API response times for performance optimization
- Implement error handling for edge cases
- Add retry mechanisms for transient failures

### Future Enhancements
- Implement the full workflow management system
- Add enhanced knowledge base with feedback integration
- Implement comprehensive testing for all API endpoints
- Add performance benchmarking and SLA monitoring

## 📝 Test Environment Details

- **Python Version**: {os.sys.version}
- **Requests Library**: {requests.__version__}
- **Test Framework**: Custom E2E Scenario Implementation
- **Report Generated**: {datetime.now().isoformat()}

---
*This report was automatically generated by the E2E Scenario 1 test suite*
"""
        
        return report
    
    def save_markdown_report(self, filename: str = None) -> str:
        """Save the markdown report to a file"""
        if filename is None:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"e2e_scenario1_report_{timestamp}.md"
        
        report_content = self.generate_markdown_report()
        
        with open(filename, 'w') as f:
            f.write(report_content)
        
        logger.info(f"📄 Test report saved to: {filename}")
        return filename
    
    def run_scenario(self, pdf_path: str, test_query: str) -> bool:
        """Run the complete E2E scenario"""
        self.start_test_timer()
        logger.info("🚀 Starting E2E Scenario 1 with Report Generation...")
        
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
                logger.info("🎉 E2E Scenario 1 completed successfully!")
                logger.info(f"📊 Final Results: {self.test_data}")
                
                # Summary of what was tested
                logger.info("📋 Scenario Summary:")
                logger.info(f"   ✅ PDF ingested with ID: {document_id}")
                logger.info(f"   ✅ Knowledge base query successful")
                logger.info(f"   ✅ Documents listed: {len(documents) if isinstance(documents, list) else 'N/A'}")
                logger.info(f"   {'✅' if feedback_available else '⚠️'} Feedback service: {'Available' if feedback_available else 'Not Available'}")
            else:
                logger.warning("⚠️ E2E Scenario 1 completed with issues")
            
            return success
            
        except Exception as e:
            logger.error(f"❌ E2E Scenario 1 failed: {e}")
            return False
        finally:
            self.end_test_timer()

def main():
    """Main execution function"""
    
    # Initialize the scenario
    scenario = E2EScenario1WithReport()
    
    # Test parameters
    pdf_path = "../../pdf-files/technical_troubleshooting_guide.pdf"
    test_query = "How to troubleshoot network connectivity issues after system update"
    
    # Run the scenario
    success = scenario.run_scenario(pdf_path, test_query)
    
    if success:
        print("\n🎉 E2E Scenario 1 completed successfully!")
        print("📊 Check the logs above for detailed results")
        print("\n📋 What was tested:")
        print("   ✅ PDF ingestion and processing")
        print("   ✅ Knowledge base querying")
        print("   ✅ Document listing")
        print("   ✅ Feedback service availability")
        
        # Generate and save detailed report
        print("\n📄 Generating detailed test report...")
        try:
            report_filename = scenario.save_markdown_report()
            print(f"📄 Detailed report saved to: {report_filename}")
        except Exception as e:
            print(f"❌ Report generation failed: {e}")
        
    else:
        print("\n❌ E2E Scenario 1 failed")
        print("📋 Check the logs above for error details")
        
        # Still generate report for failed tests
        print("\n📄 Generating test report for analysis...")
        try:
            report_filename = scenario.save_markdown_report()
            print(f"📄 Test report saved to: {report_filename}")
        except Exception as e:
            print(f"❌ Report generation failed: {e}")
    
    return success

if __name__ == "__main__":
    main()
