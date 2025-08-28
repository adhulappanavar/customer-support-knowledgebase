# High-Level App Description

## System Overview

The Customer Support Knowledge Base system is a comprehensive solution that combines AI-powered knowledge management with traditional ticketing workflows. The system consists of three main components working together to provide intelligent customer support.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React UI      │    │   RAG API       │    │ Ticketing API   │
│   (Port 3000)   │◄──►│   (Port 8000)   │    │  (Port 8001)    │
│                 │    │                 │    │                 │
│ • PDF Upload    │    │ • PDF Processing│    │ • Ticket Mgmt   │
│ • Knowledge     │    │ • Vector Search │    │ • Comments      │
│   Query         │    │ • AI Generation │    │ • Statistics    │
│ • Ticketing     │    │ • Document Store│    │ • User Mgmt     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Browser       │    │   LanceDB       │    │   SQLite DB     │
│   Storage       │    │   Vector Store  │    │   (tickets.db)  │
│                 │    │                 │    │                 │
│ • Local State   │    │ • Embeddings    │    │ • Tickets       │
│ • Session Data  │    │ • Document      │    │ • Users         │
│                 │    │   Chunks        │    │ • Categories    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Component Details

### 1. React UI (Frontend)
- **Purpose**: User interface for all system operations
- **Features**: PDF upload, knowledge querying, ticket management
- **Technology**: React + TypeScript + Material-UI

### 2. RAG API (Knowledge Engine)
- **Purpose**: Process PDFs and provide AI-powered responses
- **Features**: Document ingestion, vector search, AI generation
- **Technology**: FastAPI + Agno + LanceDB + OpenAI

### 3. Ticketing API (Support System)
- **Purpose**: Manage customer support tickets and workflows
- **Features**: CRUD operations, comments, statistics
- **Technology**: FastAPI + SQLite

## Data Flow Diagrams

### PDF Ingestion Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │    │   React UI  │    │   RAG API   │    │   LanceDB   │
│   Uploads   │───►│   Sends     │───►│   Processes │───►│   Stores    │
│   PDF       │    │   File      │    │   Document  │    │   Vectors   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   File      │    │   Form      │    │   Text      │    │   Document  │
│   Selected  │    │   Data      │    │   Chunking  │    │   Indexed   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Knowledge Query Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │    │   React UI  │    │   RAG API   │    │   LanceDB   │
│   Types     │───►│   Sends     │───►│   Searches  │───►│   Returns   │
│   Query     │    │   Query     │    │   Vectors   │    │   Chunks    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Question  │    │   HTTP      │    │   Vector    │    │   Relevant  │
│   Input     │    │   Request   │    │   Search    │    │   Documents │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                              │                   │
                              ▼                   ▼
                       ┌─────────────┐    ┌─────────────┐
                       │   OpenAI    │    │   Response  │
                       │   Generates │◄───│   with      │
                       │   Answer    │    │   Sources   │
                       └─────────────┘    └─────────────┘
```

### AI Resolution Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Support   │    │   React UI  │    │   RAG API   │    │   AI        │
│   Agent     │───►│   Creates   │───►│   Receives  │───►│   Generates │
│   Clicks    │    │   Query     │    │   Ticket    │    │   Solution  │
│   AI Icon   │    │   from      │    │   Details   │    │   Based on  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Ticket    │    │   Formatted │    │   Knowledge │    │   Relevant  │
│   Details   │    │   Query     │    │   Base      │    │   Response  │
│   Displayed │    │   String    │    │   Search    │    │   with      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                              │
                                                              ▼
                                                       ┌─────────────┐
                                                       │   Support   │
                                                       │   Agent     │
                                                       │   Views     │
                                                       │   Solution  │
                                                       └─────────────┘
```

## Sequence Diagrams

### PDF Upload Sequence

```
User          React UI        RAG API        LanceDB
  │              │              │              │
  │─Select PDF──►│              │              │
  │              │─Upload File─►│              │
  │              │              │─Process PDF──│
  │              │              │              │─Store Vectors
  │              │              │              │
  │              │              │◄─Success─────│
  │              │◄─Success─────│              │
  │◄─Success─────│              │              │
```

### Knowledge Query Sequence

```
User          React UI        RAG API        LanceDB        OpenAI
  │              │              │              │              │
  │─Type Query──►│              │              │              │
  │              │─Send Query──►│              │              │
  │              │              │─Search──────►│              │
  │              │              │              │◄─Chunks─────│
  │              │              │─Generate────►│              │
  │              │              │              │◄─Response───│
  │              │              │◄─Answer─────│              │
  │              │◄─Response───│              │              │
  │◄─Response───│              │              │              │
```

### AI Resolution Sequence

```
Agent         React UI        RAG API        LanceDB        OpenAI
  │              │              │              │              │
  │─Click AI────►│              │              │              │
  │              │─Create Query►│              │              │
  │              │              │─Search──────►│              │
  │              │              │              │◄─Chunks─────│
  │              │              │─Generate────►│              │
  │              │              │              │◄─Solution───│
  │              │              │◄─Response───│              │
  │              │◄─Solution───│              │              │
  │◄─Solution───│              │              │              │
```

## Flow Charts

### Main Application Flow

```
                    Start
                      │
                      ▼
              ┌─────────────────┐
              │   React App     │
              │   Loads         │
              └─────────────────┘
                      │
                      ▼
              ┌─────────────────┐
              │   Navigation    │
              │   Tabs          │
              └─────────────────┘
                      │
                      ▼
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  PDF Upload │ │ Knowledge   │ │ Ticketing  │
│             │ │ Query       │ │ System     │
└─────────────┘ └─────────────┘ └─────────────┘
        │             │             │
        ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  Upload     │ │  Query      │ │  View      │
│  Success    │ │  Response   │ │  Tickets   │
└─────────────┘ └─────────────┘ └─────────────┘
```

### PDF Processing Flow

```
                    Start
                      │
                      ▼
              ┌─────────────────┐
              │   PDF File      │
              │   Selected      │
              └─────────────────┘
                      │
                      ▼
              ┌─────────────────┐
              │   Upload to     │
              │   RAG API       │
              └─────────────────┘
                      │
                      ▼
              ┌─────────────────┐
              │   Extract Text  │
              │   from PDF      │
              └─────────────────┘
                      │
                      ▼
              ┌─────────────────┐
              │   Chunk Text    │
              │   into Segments │
              └─────────────────┘
                      │
                      ▼
              ┌─────────────────┐
              │   Generate      │
              │   Embeddings    │
              └─────────────────┘
                      │
                      ▼
              ┌─────────────────┐
              │   Store in      │
              │   LanceDB       │
              └─────────────────┘
                      │
                      ▼
                    Success
```

### Knowledge Query Flow

```
                    Start
                      │
                      ▼
              ┌─────────────────┐
              │   User Inputs   │
              │   Query         │
              └─────────────────┘
                      │
                      ▼
              ┌─────────────────┐
              │   Send to       │
              │   RAG API       │
              └─────────────────┘
                      │
                      ▼
              ┌─────────────────┐
              │   Vector        │
              │   Search        │
              └─────────────────┘
                      │
                      ▼
              ┌─────────────────┐
              │   Retrieve      │
              │   Relevant      │
              │   Chunks        │
              └─────────────────┘
                      │
                      ▼
              ┌─────────────────┐
              │   Generate      │
              │   AI Response   │
              └─────────────────┘
                      │
                      ▼
                    Success
```

## Data Models

### Document Structure
```
Document
├── id: string
├── name: string
├── category: string
├── file_path: string
├── uploaded_at: datetime
├── file_size: int
└── status: string
```

### Ticket Structure
```
Ticket
├── id: int
├── ticket_number: string
├── title: string
├── description: string
├── user_id: int
├── category: string
├── priority: string
├── status: string
├── assigned_to: string
├── created_at: datetime
├── updated_at: datetime
└── tags: string
```

### Query Response Structure
```
QueryResponse
├── query: string
├── response: string
├── user_id: string
├── sources: Array<Source>
├── timestamp: datetime
├── rag_used: boolean
└── documents_retrieved: int
```

## Technology Stack

### Frontend
- **React 18** - User interface framework
- **TypeScript** - Type safety
- **Material-UI** - Component library
- **Axios** - HTTP client

### Backend APIs
- **FastAPI** - Web framework
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### AI & Knowledge
- **Agno** - AI agent framework
- **OpenAI** - Language model
- **LanceDB** - Vector database
- **PyPDF2** - PDF processing

### Database
- **SQLite** - Ticketing data
- **LanceDB** - Vector storage

## Key Features

### 1. Intelligent Document Processing
- Automatic PDF text extraction
- Smart content chunking
- Vector embedding generation

### 2. AI-Powered Knowledge Retrieval
- Semantic search capabilities
- Context-aware responses
- Source attribution

### 3. Integrated Ticketing System
- Complete ticket lifecycle management
- AI-powered resolution suggestions
- User and assignment management

### 4. Modern Web Interface
- Responsive design
- Real-time updates
- Intuitive user experience

## System Benefits

1. **Efficiency** - Automated knowledge retrieval
2. **Accuracy** - AI-powered responses with sources
3. **Integration** - Unified support platform
4. **Scalability** - Modular architecture
5. **User Experience** - Modern, intuitive interface

---

This document provides a high-level understanding of the system architecture. For detailed implementation and testing instructions, refer to the `testing-guide.md` file.
