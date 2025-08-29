#!/usr/bin/env python3
"""
Test script to directly test vector database functionality
"""

import asyncio
from agno.vectordb.lancedb import LanceDb
from agno.vectordb.search import SearchType

async def test_vector_db():
    """Test vector database operations directly"""
    try:
        print("Testing vector database directly...")
        
        # Create vector database instance
        vector_db = LanceDb(
            table_name="customer_support_kb",
            uri="data/lancedb",
            search_type=SearchType.hybrid,
        )
        
        print(f"Vector DB created: {vector_db}")
        
        # Try to search
        print("Testing search...")
        try:
            results = await vector_db.async_search("customer support hours", limit=5)
            print(f"Search successful! Found {len(results)} results")
            
            for i, result in enumerate(results):
                print(f"Result {i+1}:")
                print(f"  Content: {result.content[:100]}...")
                print(f"  ID: {result.id}")
                print(f"  Name: {result.name}")
                
        except Exception as e:
            print(f"Search failed: {e}")
            import traceback
            traceback.print_exc()
        
        return vector_db
        
    except Exception as e:
        print(f"Error with vector database: {e}")
        import traceback
        traceback.print_exc()
        return None

async def main():
    """Run vector database test"""
    print("🔍 Testing Vector Database Directly")
    print("=" * 50)
    
    vector_db = await test_vector_db()
    
    if vector_db:
        print("✅ Vector database test completed")
    else:
        print("❌ Vector database test failed")

if __name__ == "__main__":
    asyncio.run(main())
