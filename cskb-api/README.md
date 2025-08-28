# Customer Support Knowledge Base API

A FastAPI-based API for ingesting PDF documents and querying customer support knowledge using Agno + LanceDB.

## Features

- **PDF Ingestion**: Upload and process PDF documents into the knowledge base
- **RAG Implementation**: True Retrieval-Augmented Generation using vector search
- **Knowledge Querying**: Query the knowledge base using natural language
- **Vector Database**: Powered by LanceDB for efficient similarity search
- **Agno Integration**: Uses Agno agents for intelligent responses
- **RESTful API**: Clean REST endpoints for easy integration
- **Source Attribution**: All responses include source documents for transparency

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the API

```bash
python run.py
```

The API will start on `http://localhost:8000`

### 3. View API Documentation

Open `http://localhost:8000/docs` in your browser for interactive API documentation.

## API Endpoints

### Ingest PDF Document
```http
POST /ingest/pdf
Content-Type: multipart/form-data

file: [PDF file]
document_name: "Customer Support Guide"
category: "General" (optional)
```

### Query Knowledge Base
```http
POST /query
Content-Type: application/json

{
  "query": "How do I reset my password?",
  "user_id": "user123",
  "max_results": 5
}
```

**Response includes:**
- `response`: Answer grounded in retrieved documents
- `sources`: Source documents used for the response
- `rag_used`: Boolean indicating if RAG was used
- `documents_retrieved`: Number of documents retrieved

### List Documents
```http
GET /documents
```

### Health Check
```http
GET /health
```

## Usage Examples

### Python Client Example

```python
import requests

# Ingest a PDF
with open("support_guide.pdf", "rb") as f:
    files = {"file": f}
    data = {"document_name": "Support Guide", "category": "General"}
    response = requests.post("http://localhost:8000/ingest/pdf", files=files, data=data)
    print(response.json())

# Query the knowledge base
query_data = {
    "query": "How do I contact customer support?",
    "user_id": "user123"
}
response = requests.post("http://localhost:8000/query", json=query_data)
print(response.json())
```

### cURL Examples

```bash
# Ingest PDF
curl -X POST "http://localhost:8000/ingest/pdf" \
  -F "file=@support_guide.pdf" \
  -F "document_name=Support Guide" \
  -F "category=General"

# Query knowledge base
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{"query": "How do I reset my password?", "user_id": "user123"}'
```

## Configuration

Environment variables (optional):

- `API_HOST`: API host (default: 0.0.0.0)
- `API_PORT`: API port (default: 8000)
- `API_WORKERS`: Number of workers (default: 1)
- `MAX_FILE_SIZE`: Maximum file size in MB (default: 50)

## Project Structure

```
cskb-api/
├── main.py              # FastAPI application
├── run.py               # Startup script
├── config.py            # Configuration
├── requirements.txt      # Dependencies
├── services/            # Business logic
│   ├── __init__.py
│   ├── knowledge_service.py  # Agno knowledge base service
│   └── pdf_service.py        # PDF processing service
└── data/                # Data storage
    ├── uploads/         # Uploaded PDFs
    └── lancedb/         # Vector database
```

## Development

### Running with Auto-reload
```bash
python run.py
```

### Running Tests
```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

## Dependencies

- **FastAPI**: Modern web framework
- **Agno**: AI agent framework
- **LanceDB**: Vector database
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation

## License

MIT License
