#!/usr/bin/env python3
"""
Simple test script for the CSKB Feedback Agents System
Run this to verify the system is working correctly
"""

import asyncio
import json
import requests
import time
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8002"
TEST_TICKET_ID = "TKT-TEST-001"

def test_health_check():
    """Test the health check endpoint."""
    print("🔍 Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {str(e)}")
        return False

def test_agent_status():
    """Test the agent status endpoint."""
    print("\n🤖 Testing agent status...")
    try:
        response = requests.get(f"{BASE_URL}/agents/status")
        if response.status_code == 200:
            print("✅ Agent status check passed")
            agents = response.json()
            for agent_name, agent_info in agents.items():
                print(f"   {agent_name}: {agent_info['status']}")
            return True
        else:
            print(f"❌ Agent status check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Agent status check error: {str(e)}")
        return False

def test_system_health():
    """Test the system health endpoint."""
    print("\n🏥 Testing system health...")
    try:
        response = requests.get(f"{BASE_URL}/system/health")
        if response.status_code == 200:
            print("✅ System health check passed")
            health = response.json()
            print(f"   Overall Status: {health['overall_status']}")
            print(f"   Databases: {health['databases']}")
            return True
        else:
            print(f"❌ System health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ System health check error: {str(e)}")
        return False

def test_feedback_collection():
    """Test feedback collection."""
    print("\n📝 Testing feedback collection...")
    
    # Test data
    feedback_data = {
        "ticket_id": TEST_TICKET_ID,
        "ai_solution": "Restart the service to resolve the connection issue",
        "feedback_type": "MINOR_CHANGES",
        "human_solution": "Restart the service and clear the connection cache",
        "user_role": "support_agent",
        "comments": "The AI solution was close but needed cache clearing",
        "context": {
            "category": "Technical Issue",
            "priority": "Medium",
            "tags": ["connection", "service", "cache"]
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/feedback",
            json=feedback_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("✅ Feedback collection passed")
            result = response.json()
            print(f"   Feedback ID: {result['feedback_id']}")
            print(f"   Effectiveness Score: {result['effectiveness_score']}")
            print(f"   Learning Priority: {result['learning_priority']}")
            return True
        else:
            print(f"❌ Feedback collection failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Feedback collection error: {str(e)}")
        return False

def test_feedback_retrieval():
    """Test feedback retrieval."""
    print("\n📖 Testing feedback retrieval...")
    try:
        response = requests.get(f"{BASE_URL}/feedback/{TEST_TICKET_ID}")
        if response.status_code == 200:
            print("✅ Feedback retrieval passed")
            feedback_list = response.json()
            print(f"   Found {len(feedback_list)} feedback entries")
            for feedback in feedback_list:
                print(f"   - Type: {feedback['feedback_type']}, Score: {feedback['effectiveness_score']}")
            return True
        else:
            print(f"❌ Feedback retrieval failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Feedback retrieval error: {str(e)}")
        return False

def test_feedback_statistics():
    """Test feedback statistics."""
    print("\n📊 Testing feedback statistics...")
    try:
        response = requests.get(f"{BASE_URL}/feedback/stats")
        if response.status_code == 200:
            print("✅ Feedback statistics passed")
            stats = response.json()
            print(f"   Total Feedback: {stats.get('total_feedback', 0)}")
            print(f"   Average Effectiveness: {stats.get('avg_effectiveness', 0):.2f}")
            return True
        else:
            print(f"❌ Feedback statistics failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Feedback statistics error: {str(e)}")
        return False

def test_enhanced_kb_stats():
    """Test enhanced knowledge base statistics."""
    print("\n🧠 Testing enhanced KB statistics...")
    try:
        response = requests.get(f"{BASE_URL}/enhanced-kb/stats")
        if response.status_code == 200:
            print("✅ Enhanced KB statistics passed")
            stats = response.json()
            print(f"   Total Solutions: {stats.get('total_solutions', 0)}")
            print(f"   Average Confidence: {stats.get('avg_confidence_score', 0):.2f}")
            return True
        else:
            print(f"❌ Enhanced KB statistics failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Enhanced KB statistics error: {str(e)}")
        return False

def run_all_tests():
    """Run all tests and provide summary."""
    print("🚀 Starting CSKB Feedback Agents System Tests")
    print("=" * 50)
    
    tests = [
        ("Health Check", test_health_check),
        ("Agent Status", test_agent_status),
        ("System Health", test_system_health),
        ("Feedback Collection", test_feedback_collection),
        ("Feedback Retrieval", test_feedback_retrieval),
        ("Feedback Statistics", test_feedback_statistics),
        ("Enhanced KB Statistics", test_enhanced_kb_stats),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            success = test_func()
            results.append((test_name, success))
        except Exception as e:
            print(f"❌ {test_name} crashed: {str(e)}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 50)
    print("📋 TEST SUMMARY")
    print("=" * 50)
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
    
    print(f"\n🎯 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! System is working correctly.")
        return True
    else:
        print("⚠️  Some tests failed. Check the system configuration.")
        return False

def main():
    """Main function."""
    print("CSKB Feedback Agents System - Test Suite")
    print("Make sure the system is running on http://localhost:8002")
    print("Run './start.sh' in another terminal if needed.")
    print()
    
    # Wait a moment for user to read
    input("Press Enter to start testing...")
    
    try:
        success = run_all_tests()
        if success:
            print("\n🎊 System test completed successfully!")
        else:
            print("\n🔧 System test completed with issues.")
            print("Check the logs and configuration.")
        
    except KeyboardInterrupt:
        print("\n⏹️  Testing interrupted by user")
    except Exception as e:
        print(f"\n💥 Unexpected error during testing: {str(e)}")

if __name__ == "__main__":
    main()
