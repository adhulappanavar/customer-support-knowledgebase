import os
import uuid
import shutil
from pathlib import Path
from typing import Dict, Any, Optional
from datetime import datetime
import asyncio

from .knowledge_service import KnowledgeService

class PDFService:
    def __init__(self):
        self.upload_dir = Path("data/uploads")
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        
        # Reference to knowledge service (will be set after initialization)
        self.knowledge_service: Optional[KnowledgeService] = None
    
    def set_knowledge_service(self, knowledge_service: KnowledgeService):
        """Set reference to knowledge service"""
        self.knowledge_service = knowledge_service
    
    async def process_and_ingest_pdf(
        self, 
        file_path: str, 
        document_name: str,
        category: Optional[str] = None
    ) -> str:
        """Process and ingest a PDF file into the knowledge base"""
        
        if not self.knowledge_service:
            raise Exception("Knowledge service not initialized")
        
        # Generate unique document ID
        document_id = str(uuid.uuid4())
        
        # Copy file to uploads directory
        dest_path = self.upload_dir / f"{document_id}.pdf"
        shutil.copy2(file_path, dest_path)
        
        # Create document info
        document_info = {
            "id": document_id,
            "name": document_name,
            "category": category,
            "file_path": str(dest_path),
            "uploaded_at": datetime.utcnow().isoformat(),
            "file_size": os.path.getsize(dest_path),
            "status": "uploaded"
        }
        
        # Add to knowledge service tracking
        self.knowledge_service.add_document(document_id, document_info)
        print(f"DEBUG: Document added to tracking: {document_id}")
        
        # Update the knowledge base with the new PDF file
        try:
            await self.knowledge_service.add_document_to_knowledge_base(document_id, str(dest_path))
            print(f"DEBUG: Document added to knowledge base: {document_id}")
        except Exception as e:
            print(f"DEBUG: Error adding to knowledge base: {e}")
            raise
        
        # Update status
        document_info["status"] = "ingested"
        self.knowledge_service.add_document(document_id, document_info)
        print(f"DEBUG: Document status updated to ingested: {document_id}")
        
        return document_id
    
    async def remove_document(self, document_id: str) -> bool:
        """Remove a document from the knowledge base"""
        
        if not self.knowledge_service:
            raise Exception("Knowledge service not initialized")
        
        document_info = self.knowledge_service.get_document(document_id)
        if not document_info:
            return False
        
        try:
            # Remove file
            file_path = Path(document_info["file_path"])
            if file_path.exists():
                file_path.unlink()
            
            # Remove from tracking
            self.knowledge_service.documents.pop(document_id, None)
            
            # Reload knowledge base
            await self.knowledge_service.reload_knowledge_base()
            
            return True
            
        except Exception as e:
            raise Exception(f"Failed to remove document: {str(e)}")
    
    def get_document_path(self, document_id: str) -> Optional[str]:
        """Get the file path for a document"""
        if not self.knowledge_service:
            return None
        
        document_info = self.knowledge_service.get_document(document_id)
        return document_info.get("file_path") if document_info else None
    
    def list_uploaded_files(self) -> list:
        """List all uploaded PDF files"""
        pdf_files = []
        for file_path in self.upload_dir.glob("*.pdf"):
            pdf_files.append({
                "filename": file_path.name,
                "size": file_path.stat().st_size,
                "modified": datetime.fromtimestamp(file_path.stat().st_mtime).isoformat()
            })
        return pdf_files
