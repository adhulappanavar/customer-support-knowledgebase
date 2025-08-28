#!/usr/bin/env python3
"""
Debug script to test PDF reading and document creation
"""

import asyncio
from agno.knowledge.agent import Document, Reader
from agno.vectordb.lancedb import LanceDb
from agno.vectordb.search import SearchType

async def test_pdf_reading():
    """Test PDF reading functionality"""
    try:
        print("Testing PDF reading...")
        
        # Test Reader
        reader = Reader()
        print(f"Reader created: {reader}")
        
        # Test reading PDF
        documents = await reader.async_read("test_support_guide.pdf")
        print(f"Documents read: {len(documents)}")
        
        for i, doc in enumerate(documents):
            print(f"Document {i}:")
            print(f"  Content length: {len(doc.content)}")
            print(f"  Content preview: {doc.content[:100]}...")
            print(f"  Has id: {hasattr(doc, 'id')}")
            print(f"  Has name: {hasattr(doc, 'name')}")
        
        return documents
        
    except Exception as e:
        print(f"Error reading PDF: {e}")
        import traceback
        traceback.print_exc()
        return None

async def test_document_creation():
    """Test Document creation"""
    try:
        print("\nTesting Document creation...")
        
        doc = Document(
            content="Test content for customer support",
            id="test_001",
            name="Test Document",
            meta_data={"source": "test"}
        )
        
        print(f"Document created: {doc}")
        print(f"Document content: {doc.content}")
        print(f"Document id: {doc.id}")
        print(f"Document name: {doc.name}")
        
        return doc
        
    except Exception as e:
        print(f"Error creating Document: {e}")
        import traceback
        traceback.print_exc()
        return None

async def test_vector_db():
    """Test vector database operations"""
    try:
        print("\nTesting vector database...")
        
        vector_db = LanceDb(
            table_name="test_kb",
            uri="data/test_lancedb",
            search_type=SearchType.hybrid,
        )
        
        print(f"Vector DB created: {vector_db}")
        
        # Test adding a document
        test_doc = Document(
            content="Test content for vector database",
            id="test_001",
            name="Test Document"
        )
        
        print("Adding document to vector DB...")
        await vector_db.add_documents([test_doc])
        print("Document added successfully!")
        
        # Test search
        print("Testing search...")
        results = await vector_db.search("test content", max_results=5)
        print(f"Search results: {len(results)}")
        
        return vector_db
        
    except Exception as e:
        print(f"Error with vector database: {e}")
        import traceback
        traceback.print_exc()
        return None

async def main():
    """Run all tests"""
    print("🔍 Debugging PDF and Document functionality")
    print("=" * 60)
    
    # Test PDF reading
    docs = await test_pdf_reading()
    
    # Test Document creation
    doc = await test_document_creation()
    
    # Test vector database
    vector_db = await test_vector_db()
    
    print("\n" + "=" * 60)
    if docs and doc and vector_db:
        print("✅ All tests passed!")
    else:
        print("❌ Some tests failed!")

if __name__ == "__main__":
    asyncio.run(main())
