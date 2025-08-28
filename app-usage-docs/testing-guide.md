# Customer Support Knowledge Base - Testing Guide

This guide provides comprehensive testing instructions for the Customer Support Knowledge Base system, including the RAG API, Ticketing API, and React UI.

## Table of Contents

1. [System Overview](#system-overview)
2. [Prerequisites](#prerequisites)
3. [Starting the Services](#starting-the-services)
4. [Testing the RAG API](#testing-the-rag-api)
5. [Testing the Ticketing API](#testing-the-ticketing-api)
6. [Testing the React UI](#testing-the-react-ui)
7. [End-to-End Testing](#end-to-end-testing)
8. [Troubleshooting](#troubleshooting)

## System Overview

The system consists of three main components:

- **RAG API** (Port 8000): Handles PDF ingestion and AI-powered knowledge queries
- **Ticketing API** (Port 8001): Manages customer support tickets
- **React UI** (Port 3000/3001): User interface for both systems

## Prerequisites

Before testing, ensure you have:

1. **Python 3.12+** installed
2. **Node.js 18+** installed
3. **OpenAI API Key** in `.env` file
4. **All dependencies** installed

### Environment Setup

```bash
# Set up Python environment
cd cskb-api
pip install -r requirements.txt

# Set up Node.js environment
cd ../cskb-react-ui
npm install

# Set up ticketing app
cd ../cskb-ticketing-app
pip install -r requirements.txt
```

### Environment Variables

Create `.env` file in `cskb-api` directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## Starting the Services

### 1. Start the RAG API

```bash
cd cskb-api
python3 main.py
```

**Expected Output:**
```
INFO:     Started server process [PID]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 2. Start the Ticketing API

```bash
cd cskb-ticketing-app
python3 main.py
```

**Expected Output:**
```
✅ Database initialized: tickets.db
INFO:     Started server process [PID]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8001
```

### 3. Start the React UI

```bash
cd cskb-react-ui
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view cskb-react-ui in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

## Testing the RAG API

### Health Check

```bash
curl -X GET http://localhost:8000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "Customer Support Knowledge Base API"
}
```

### Check Current Documents

```bash
curl -X GET http://localhost:8000/documents
```

**Expected Response:**
```json
{
  "documents": [
    {
      "id": "document_id_1",
      "name": "test_support_guide",
      "category": null,
      "file_path": "data/uploads/document_id_1.pdf",
      "uploaded_at": "2025-08-28T16:01:27.416931",
      "file_size": 3120,
      "status": "ingested"
    },
    {
      "id": "document_id_2",
      "name": "Comprehensive Customer Support Guide",
      "category": "Support Documentation",
      "file_path": "data/uploads/document_id_2.pdf",
      "uploaded_at": "2025-08-28T16:06:15.671069",
      "file_size": 6922,
      "status": "ingested"
    }
  ]
}
```

### Ingest a New PDF

```bash
curl -X POST http://localhost:8000/ingest/pdf \
  -F "file=@test_support_guide.pdf" \
  -F "document_name=Test Support Guide" \
  -F "category=Support Documentation"
```

**Expected Response:**
```json
{
  "message": "PDF successfully ingested",
  "document_id": "new_document_id",
  "status": "success"
}
```

### Test Different Query Types

#### 1. Emergency Procedures Query

```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What are the emergency procedures for critical issues?"}'
```

**Expected Response:**
```json
{
  "query": "What are the emergency procedures for critical issues?",
  "response": "The emergency procedures for critical issues include...",
  "user_id": "default_user",
  "sources": [
    {
      "id": "document_id_chunk_0",
      "name": "Document Chunk 1",
      "content": "Emergency procedures content..."
    }
  ],
  "timestamp": null,
  "rag_used": true,
  "documents_retrieved": 5
}
```

#### 2. Training and Certification Query

```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "How do I get training and certification?"}'
```

**Expected Response:**
```json
{
  "query": "How do I get training and certification?",
  "response": "Based on the provided documents, you can access training...",
  "user_id": "default_user",
  "sources": [
    {
      "id": "document_id_chunk_2",
      "name": "Document Chunk 3",
      "content": "Training and certification content..."
    }
  ],
  "timestamp": null,
  "rag_used": true,
  "documents_retrieved": 5
}
```

#### 3. Payment Methods Query

```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What payment methods are accepted for billing?"}'
```

**Expected Response:**
```json
{
  "query": "What payment methods are accepted for billing?",
  "response": "The accepted payment methods for billing are...",
  "user_id": "default_user",
  "sources": [
    {
      "id": "document_id_chunk_2",
      "name": "Document Chunk 3",
      "content": "Payment methods content..."
    }
  ],
  "timestamp": null,
  "rag_used": true,
  "documents_retrieved": 5
}
```

## Testing the Ticketing API

### Health Check

```bash
curl -X GET http://localhost:8001/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "Ticket Management System"
}
```

### Get All Tickets

```bash
curl -X GET http://localhost:8001/tickets
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "ticket_number": "TKT-001",
    "title": "Cannot login to application",
    "description": "I am unable to access the system with my credentials",
    "user_id": 2,
    "user_username": "john_doe",
    "user_full_name": "John Doe",
    "category_id": 1,
    "category_name": "Technical Issue",
    "priority_id": 3,
    "priority_name": "High",
    "priority_color": "#fd7e14",
    "status_id": 1,
    "status_name": "Open",
    "status_color": "#007bff",
    "assigned_to": 4,
    "assigned_username": "support_agent",
    "assigned_full_name": "Support Agent",
    "created_at": "2024-01-15 09:00:00",
    "updated_at": "2024-01-15 09:00:00",
    "resolved_at": null,
    "due_date": "2024-01-16 09:00:00",
    "tags": "login,access"
  }
]
```

### Create a New Ticket

```bash
curl -X POST http://localhost:8001/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Ticket via API",
    "description": "This is a test ticket created via the API",
    "category": "Technical Issue",
    "priority": "Medium",
    "status": "Open",
    "assigned_to": "John Doe"
  }'
```

**Expected Response:**
```json
{
  "id": 7,
  "ticket_number": "TKT-007",
  "title": "Test Ticket via API",
  "description": "This is a test ticket created via the API",
  "category": "Technical Issue",
  "priority": "Medium",
  "status": "Open",
  "assigned_to": "John Doe",
  "created_at": "2025-08-28T16:30:00",
  "updated_at": "2025-08-28T16:30:00"
}
```

### Get Ticket Comments

```bash
curl -X GET http://localhost:8001/tickets/1/comments
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "ticket_id": 1,
    "user": "support_agent",
    "comment": "We are investigating this login issue.",
    "created_at": "2024-01-15 10:00:00"
  }
]
```

### Get Ticket Statistics

```bash
curl -X GET http://localhost:8001/statistics
```

**Expected Response:**
```json
{
  "total_tickets": 6,
  "open_tickets": 4,
  "in_progress_tickets": 1,
  "resolved_tickets": 1,
  "closed_tickets": 0,
  "high_priority_tickets": 2,
  "medium_priority_tickets": 3,
  "low_priority_tickets": 1
}
```

## Testing the React UI

### 1. Open the Application

Navigate to `http://localhost:3000` in your browser.

### 2. Test PDF Upload

1. Go to the "PDF Upload" tab
2. Click "Choose File" or drag a PDF
3. Enter document name and category
4. Click "Upload PDF"
5. Verify success message

### 3. Test Knowledge Query

1. Go to the "Knowledge Query" tab
2. Enter a query like "How do I reset my password?"
3. Click "Query Knowledge"
4. Verify response with sources

### 4. Test Ticketing System

1. Go to the "Ticketing System" tab
2. View existing tickets
3. Create a new ticket
4. Test AI resolution on a ticket

### 5. Test AI Resolution

1. Click the 🤖 AI icon next to any ticket
2. Wait for AI response
3. Verify the response includes:
   - AI-generated solution
   - Source documents
   - Proper formatting

## End-to-End Testing

### Complete Workflow Test

1. **Upload a PDF** via the React UI
2. **Query the knowledge base** with a relevant question
3. **Create a support ticket** with the same issue
4. **Use AI resolution** on the ticket
5. **Verify consistency** between knowledge query and AI resolution

### Expected Results

- ✅ PDF uploads successfully
- ✅ Knowledge queries return relevant responses
- ✅ AI resolution provides helpful solutions
- ✅ Sources are properly attributed
- ✅ Different queries return different document chunks

## Troubleshooting

### Common Issues

#### 1. CORS Errors

**Symptoms:** Browser console shows CORS policy errors

**Solution:** Ensure CORS middleware is properly configured in `cskb-api/main.py`

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### 2. Vector Search Failures

**Symptoms:** Logs show "Vector search failed" messages

**Solution:** The system automatically falls back to semantic search, but check:
- LanceDB installation
- OpenAI API key configuration
- Database permissions

#### 3. Port Conflicts

**Symptoms:** "Address already in use" errors

**Solution:** Kill existing processes or use different ports

```bash
# Find processes using ports
lsof -i :8000 -i :8001 -i :3000

# Kill specific process
kill <PID>
```

#### 4. React Build Errors

**Symptoms:** TypeScript compilation errors

**Solution:** 
```bash
cd cskb-react-ui
npm run build
```

Check for specific error messages and fix accordingly.

### Debug Commands

#### Check Service Status

```bash
# Check RAG API
curl -X GET http://localhost:8000/health

# Check Ticketing API
curl -X GET http://localhost:8001/health

# Check React UI (if running)
curl -X GET http://localhost:3000
```

#### Check Logs

```bash
# RAG API logs (in terminal where it's running)
# Look for: INFO, DEBUG, ERROR messages

# Ticketing API logs (in terminal where it's running)
# Look for: Database operations, API requests

# React UI logs (in browser console)
# Look for: Network requests, JavaScript errors
```

#### Verify Data

```bash
# Check documents in knowledge base
curl -X GET http://localhost:8000/documents

# Check tickets in system
curl -X GET http://localhost:8001/tickets

# Check specific ticket
curl -X GET http://localhost:8001/tickets/1
```

## Performance Testing

### Load Testing

Test with multiple concurrent requests:

```bash
# Test multiple queries simultaneously
for i in {1..10}; do
  curl -X POST http://localhost:8000/query \
    -H "Content-Type: application/json" \
    -d "{\"query\": \"Test query $i\"}" &
done
wait
```

### Response Time Testing

Measure response times:

```bash
# Test response time
time curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "How do I reset my password?"}'
```

## Success Criteria

A successful test run should demonstrate:

1. ✅ **All services start** without errors
2. ✅ **PDF ingestion works** and documents are stored
3. ✅ **Knowledge queries return** relevant responses
4. ✅ **AI resolution provides** helpful solutions
5. ✅ **Different queries retrieve** different document chunks
6. ✅ **Ticketing system** creates and manages tickets
7. ✅ **React UI** displays all components correctly
8. ✅ **End-to-end workflow** functions smoothly

## Next Steps

After successful testing:

1. **Deploy to production** environment
2. **Set up monitoring** and logging
3. **Configure backup** and recovery procedures
4. **Train support staff** on the new system
5. **Gather user feedback** and iterate

---

**Note:** This testing guide covers the current implementation. As features are added or modified, update this guide accordingly.
