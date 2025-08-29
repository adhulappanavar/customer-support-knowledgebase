#!/usr/bin/env python3
"""
Test script for Customer Support Knowledge Base API
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Health check: {response.status_code} - {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_list_documents():
    """Test documents listing endpoint"""
    print("\nTesting documents endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/documents")
        print(f"Documents: {response.status_code} - {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Documents endpoint failed: {e}")
        return False

def test_query_knowledge():
    """Test knowledge query endpoint"""
    print("\nTesting query endpoint...")
    try:
        query_data = {
            "query": "What is customer support?",
            "user_id": "test_user",
            "max_results": 3
        }
        response = requests.post(f"{BASE_URL}/query", json=query_data)
        print(f"Query: {response.status_code} - {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Query endpoint failed: {e}")
        return False

def test_pdf_ingestion():
    """Test PDF ingestion endpoint (requires a PDF file)"""
    print("\nTesting PDF ingestion endpoint...")
    print("Note: This test requires a PDF file named 'test.pdf' in the current directory")
    
    try:
        # Check if test.pdf exists
        import os
        if not os.path.exists("test.pdf"):
            print("test.pdf not found. Skipping ingestion test.")
            return True
        
        with open("test.pdf", "rb") as f:
            files = {"file": f}
            data = {"document_name": "Test Document", "category": "Test"}
            response = requests.post(f"{BASE_URL}/ingest/pdf", files=files, data=data)
            print(f"PDF Ingestion: {response.status_code} - {response.json()}")
            return response.status_code == 200
            
    except Exception as e:
        print(f"PDF ingestion failed: {e}")
        return False

def main():
    """Run all tests"""
    print("Starting API tests...")
    print("=" * 50)
    
    tests = [
        ("Health Check", test_health),
        ("List Documents", test_list_documents),
        ("Query Knowledge", test_query_knowledge),
        ("PDF Ingestion", test_pdf_ingestion),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            success = test_func()
            results.append((test_name, success))
        except Exception as e:
            print(f"Test {test_name} crashed: {e}")
            results.append((test_name, False))
    
    print("\n" + "=" * 50)
    print("Test Results:")
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{test_name}: {status}")
    
    all_passed = all(success for _, success in results)
    print(f"\nOverall: {'✅ ALL TESTS PASSED' if all_passed else '❌ SOME TESTS FAILED'}")

if __name__ == "__main__":
    main()
