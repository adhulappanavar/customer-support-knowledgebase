#!/usr/bin/env python3
"""
Simple test script to debug report generation
"""

from e2e_scenario1_simplified import E2EScenario1Simplified
import os

def test_report_generation():
    """Test the report generation functionality"""
    
    print("🧪 Testing report generation...")
    
    # Create scenario instance
    scenario = E2EScenario1Simplified()
    
    # Add some test data
    scenario.test_data = {
        'document_id': 'test-doc-123',
        'query_result': {'query': 'test query', 'response': 'test response'},
        'documents': {'documents': [{'id': 'doc1', 'name': 'test'}]},
        'feedback_service': {'status': 'healthy'}
    }
    
    # Add some step results
    scenario.step_results = [
        {
            'step_name': 'Test Step 1',
            'status': 'PASSED',
            'details': {'test': 'data'},
            'timestamp': '2025-08-30T19:12:00',
            'duration': 1.5
        }
    ]
    
    print("📊 Test data prepared")
    
    # Try to generate report
    try:
        report_content = scenario.generate_markdown_report()
        print("✅ Report generation successful")
        print(f"📄 Report length: {len(report_content)} characters")
        
        # Save report
        filename = scenario.save_markdown_report()
        print(f"💾 Report saved to: {filename}")
        
        # Check if file exists
        if os.path.exists(filename):
            print(f"✅ File exists: {filename}")
            file_size = os.path.getsize(filename)
            print(f"📏 File size: {file_size} bytes")
        else:
            print(f"❌ File not found: {filename}")
            
    except Exception as e:
        print(f"❌ Report generation failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_report_generation()
