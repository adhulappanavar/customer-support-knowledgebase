from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import os
import tempfile
import shutil
from pathlib import Path

from services.knowledge_service import KnowledgeService
from services.pdf_service import PDFService

app = FastAPI(
    title="Customer Support Knowledge Base API",
    description="API for ingesting PDF documents and querying customer support knowledge",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
knowledge_service = KnowledgeService()
pdf_service = PDFService()

# Set up service references
pdf_service.set_knowledge_service(knowledge_service)

class QueryRequest(BaseModel):
    query: str
    user_id: Optional[str] = "default_user"
    max_results: Optional[int] = 5

class IngestResponse(BaseModel):
    message: str
    document_id: str
    status: str

@app.post("/ingest/pdf", response_model=IngestResponse)
async def ingest_pdf(
    file: UploadFile = File(...),
    document_name: str = Form(...),
    category: Optional[str] = Form(None)
):
    """Ingest a PDF document into the knowledge base"""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            shutil.copyfileobj(file.file, tmp_file)
            tmp_path = tmp_file.name
        
        # Process and ingest the PDF
        document_id = await pdf_service.process_and_ingest_pdf(
            file_path=tmp_path,
            document_name=document_name,
            category=category
        )
        
        # Clean up temp file
        os.unlink(tmp_path)
        
        return IngestResponse(
            message="PDF successfully ingested",
            document_id=document_id,
            status="success"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to ingest PDF: {str(e)}")

@app.post("/query")
async def query_knowledge(request: QueryRequest):
    """Query the knowledge base"""
    try:
        response = await knowledge_service.query(
            query=request.query,
            user_id=request.user_id,
            max_results=request.max_results
        )
        return JSONResponse(content=response)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Customer Support Knowledge Base API"}

@app.get("/documents")
async def list_documents():
    """List all ingested documents"""
    try:
        documents = await knowledge_service.list_documents()
        return {"documents": documents}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list documents: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
