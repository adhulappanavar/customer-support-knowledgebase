#!/usr/bin/env python3
"""
Test script to demonstrate RAG functionality
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_rag_before_ingestion():
    """Test query before any documents are ingested"""
    print("🔍 Testing RAG before document ingestion...")
    
    query_data = {
        "query": "What are the customer support hours?",
        "user_id": "test_user"
    }
    
    response = requests.post(f"{BASE_URL}/query", json=query_data)
    result = response.json()
    
    print(f"Response: {result['response']}")
    print(f"RAG Used: {result['rag_used']}")
    print(f"Sources: {len(result['sources'])} documents")
    print("✅ Expected: No documents, RAG not used\n")

def test_rag_after_ingestion():
    """Test query after documents are ingested (simulated)"""
    print("📚 Testing RAG after document ingestion...")
    
    # Simulate having documents in the knowledge base
    print("Note: This would require actual PDF ingestion to work")
    print("The RAG system will now:")
    print("1. Search the vector database for relevant documents")
    print("2. Retrieve the most relevant content")
    print("3. Use that content as context for the LLM")
    print("4. Generate a response grounded in the retrieved documents")
    print("5. Return both the answer and the source documents")
    
    print("\n🎯 Key RAG Features:")
    print("- responses are grounded in actual documents")
    print("- sources are provided for transparency")
    print("- no hallucination from the LLM")
    print("- knowledge base is searchable and updatable")

def main():
    """Run RAG tests"""
    print("🧠 RAG (Retrieval-Augmented Generation) Test")
    print("=" * 60)
    
    test_rag_before_ingestion()
    test_rag_after_ingestion()
    
    print("\n" + "=" * 60)
    print("📖 To test full RAG functionality:")
    print("1. Upload a PDF using POST /ingest/pdf")
    print("2. Query the knowledge base using POST /query")
    print("3. Verify responses are grounded in document content")
    print("4. Check that sources are provided")

if __name__ == "__main__":
    main()
