import asyncio
from typing import Dict, List, Any, Optional
from agno.agent import Agent
from agno.knowledge.agent import Document
from agno.vectordb.lancedb import LanceDb
from agno.vectordb.search import SearchType
import uuid
import os
from pathlib import Path
import PyPDF2

class KnowledgeService:
    def __init__(self):
        # Check if OpenAI API key is available
        from config import OPENAI_API_KEY
        if not OPENAI_API_KEY:
            raise Exception("OPENAI_API_KEY environment variable is required")
        
        self.vector_db = LanceDb(
            table_name="customer_support_kb",
            uri="data/lancedb",
            search_type=SearchType.hybrid,
        )
        
        self.documents = {}  # Track ingested documents
        self.agents = {}  # Cache agents per user
        
        # Ensure data directory exists
        os.makedirs("data/lancedb", exist_ok=True)
    
    async def query(
        self, 
        query: str, 
        user_id: str = "default_user",
        max_results: int = 5
    ) -> Dict[str, Any]:
        """Query the knowledge base using RAG (Retrieval-Augmented Generation)"""
        
        try:
            # First, check if we have any documents
            if not self.documents:
                return {
                    "query": query,
                    "response": "No documents have been ingested yet. Please upload some PDF documents first.",
                    "user_id": user_id,
                    "sources": [],
                    "timestamp": None,
                    "rag_used": False
                }
            
            # Try vector database search first
            relevant_docs = []
            try:
                relevant_docs = await self.vector_db.async_search(query, limit=max_results)
            except Exception as e:
                print(f"Vector search failed: {e}")
                # Fallback to semantic search using stored chunks
                relevant_docs = self.semantic_search_fallback(query, max_results)
            
            if not relevant_docs:
                return {
                    "query": query,
                    "response": "No relevant documents found in the knowledge base for your query.",
                    "user_id": user_id,
                    "sources": [],
                    "timestamp": None,
                    "rag_used": False
                }
            
            # Extract document content and metadata
            sources = []
            context_parts = []
            
            for doc in relevant_docs:
                # Extract document info
                doc_id = getattr(doc, 'id', str(uuid.uuid4()))
                doc_name = getattr(doc, 'name', 'Unknown Document')
                doc_content = getattr(doc, 'content', str(doc))
                
                sources.append({
                    "id": doc_id,
                    "name": doc_name,
                    "content": doc_content[:200] + "..." if len(doc_content) > 200 else doc_content
                })
                
                context_parts.append(f"Document: {doc_name}\nContent: {doc_content}")
            
            # Combine all relevant context
            full_context = "\n\n".join(context_parts)
            
            # Create a prompt that uses the retrieved context
            rag_prompt = f"""Based on the following documents from the customer support knowledge base, please answer the user's question. 
            If the information is not available in the provided documents, say so clearly.

            Documents:
            {full_context}

            User Question: {query}

            Please provide a comprehensive answer based only on the information in the documents above."""
            
            # Get response from agent using the RAG-enhanced prompt
            agent = Agent(
                user_id=user_id,
                search_knowledge=False,  # We're doing manual retrieval
                show_tool_calls=False,
            )
            
            response = await agent.arun(rag_prompt)
            
            return {
                "query": query,
                "response": response.content if hasattr(response, 'content') else str(response),
                "user_id": user_id,
                "sources": sources,
                "timestamp": response.timestamp.isoformat() if hasattr(response, 'timestamp') else None,
                "rag_used": True,
                "documents_retrieved": len(sources)
            }
            
        except Exception as e:
            raise Exception(f"Query failed: {str(e)}")
    
    async def list_documents(self) -> List[Dict[str, Any]]:
        """List all ingested documents"""
        return list(self.documents.values())
    
    def add_document(self, document_id: str, document_info: Dict[str, Any]):
        """Add document to tracking"""
        self.documents[document_id] = document_info
    
    def get_document(self, document_id: str) -> Optional[Dict[str, Any]]:
        """Get document info by ID"""
        return self.documents.get(document_id)
    
    def read_pdf_content(self, file_path: str) -> str:
        """Read PDF content using PyPDF2"""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                content = ""
                for page in pdf_reader.pages:
                    content += page.extract_text() + "\n"
                return content
        except Exception as e:
            raise Exception(f"Failed to read PDF: {str(e)}")
    
    async def add_document_to_knowledge_base(self, document_id: str, file_path: str):
        """Add a new document to the knowledge base"""
        try:
            # Read the PDF content
            pdf_content = self.read_pdf_content(file_path)
            
            # Split content into chunks (simple approach)
            chunks = self.chunk_content(pdf_content, chunk_size=1000)
            
            # Store chunks in memory for now (we'll implement proper vector search)
            if not hasattr(self, 'document_chunks'):
                self.document_chunks = {}
            
            self.document_chunks[document_id] = chunks
            
            # Add each chunk to the vector database
            for i, chunk in enumerate(chunks):
                document = Document(
                    content=chunk,
                    id=f"{document_id}_chunk_{i}",
                    name=f"Customer Support Guide - Chunk {i+1}",
                    meta_data={
                        "source_file": file_path,
                        "document_id": document_id,
                        "chunk_id": i,
                        "chunk_size": len(chunk)
                    }
                )
                
                # Try to add to vector database, but don't fail if it doesn't work
                try:
                    await self.vector_db.async_insert([document])
                except Exception as e:
                    print(f"Warning: Could not add to vector database: {e}")
                    # Continue with in-memory storage
            
        except Exception as e:
            raise Exception(f"Failed to add document to knowledge base: {str(e)}")
    
    def chunk_content(self, content: str, chunk_size: int = 1000) -> List[str]:
        """Split content into chunks"""
        chunks = []
        words = content.split()
        current_chunk = []
        current_size = 0
        
        for word in words:
            word_size = len(word) + 1  # +1 for space
            if current_size + word_size > chunk_size and current_chunk:
                chunks.append(" ".join(current_chunk))
                current_chunk = [word]
                current_size = word_size
            else:
                current_chunk.append(word)
                current_size += word_size
        
        if current_chunk:
            chunks.append(" ".join(current_chunk))
        
        return chunks
    
    def semantic_search_fallback(self, query: str, max_results: int) -> List[Document]:
        """Fallback semantic search using stored document chunks"""
        if not hasattr(self, 'document_chunks') or not self.document_chunks:
            return []
        
        # Simple keyword-based search as fallback
        query_lower = query.lower()
        relevant_chunks = []
        
        for doc_id, chunks in self.document_chunks.items():
            for i, chunk in enumerate(chunks):
                chunk_lower = chunk.lower()
                
                # Calculate relevance score based on keyword matches
                score = 0
                query_words = query_lower.split()
                for word in query_words:
                    if word in chunk_lower:
                        score += 1
                
                if score > 0:
                    # Create a Document object for consistency
                    document = Document(
                        content=chunk,
                        id=f"{doc_id}_chunk_{i}",
                        name=f"Document Chunk {i+1}",
                        meta_data={
                            "source_file": self.documents.get(doc_id, {}).get("file_path", "unknown"),
                            "document_id": doc_id,
                            "chunk_id": i,
                            "relevance_score": score
                        }
                    )
                    relevant_chunks.append((document, score))
        
        # Sort by relevance score and return top results
        relevant_chunks.sort(key=lambda x: x[1], reverse=True)
        return [doc for doc, score in relevant_chunks[:max_results]]
    
    async def reload_knowledge_base(self):
        """Reload the knowledge base with current documents"""
        try:
            # For now, we'll just clear the agent cache
            # Documents are already in the vector database
            self.agents.clear()
            
        except Exception as e:
            raise Exception(f"Failed to reload knowledge base: {str(e)}")
