# High-Level App Description

## System Overview

The Customer Support Knowledge Base system is a comprehensive solution that combines AI-powered knowledge management with traditional ticketing workflows. The system consists of three main components working together to provide intelligent customer support.

## System Architecture

```
┌─────────────────┐    ┌─────────────────────────────────────────────────┐    ┌─────────────────┐
│   React UI      │    │                   RAG API                       │    │ Ticketing API   │
│   (Port 3000)   │◄──►│                 (Port 8000)                     │    │  (Port 8001)    │
│                 │    │                                                 │    │                 │
│ • PDF Upload    │    │ ┌─────────────────────────────────────────────┐ │    │ • Ticket Mgmt   │
│ • Knowledge     │    │ │              Agno Framework                 │ │    │ • Comments      │
│   Query         │    │ │                                             │ │    │ • Statistics    │
│ • Ticketing     │    │ │ ┌───────────────┐ ┌─────────────────────┐   │ |    │ • User Mgmt     │
└─────────────────┘    │ │ │   Agent       │ │     Tools           │   │ |    └─────────────────┘
         │             │ │ │               │ │                     │   │ |            │
         │             │ │ │ • Knowledge   │ │ • PDF Reader        │   │ |            │
         ▼             │ │ |  Management   │ │ • Text Chunker      │   │ |            ▼
┌─────────────────┐    │ │ |• Query        │ │ • Vector Indexer    │   │ |   ┌─────────────────┐
│   Browser       │    │ │ |  Processing   │ │ • OpenAI Integration│   │ |   │   SQLite DB     │
│   Storage       │    │ │ |• RAG Logic    │ │                     │   │ |   │   (tickets.db)  │
│                 │    │ | └───────────────┘ └─────────────────────┘   │ |   │                 │
│ • Local State   │    │ |                    │                        │ |   │ • Tickets       │
│ • Session Data  │    │ |                    ▼                        │ |   │ • Users         │
└─────────────────┘    │ │           ┌─────────────────┐               │ │   | • Categories    │
                       │ │           │    LanceDB      │               │ │   └─────────────────┘
                       │ │           │  Vector Store   │               │ │
                       │ │           │                 │               │ │
                       │ │           │ • Embeddings    │               │ │
                       │ │           │ • Document      │               │ │
                       │ │           │   Chunks        │               │ │
                       │ │           │ • Vector Index  │               │ │
                       │ └───────────┴─────────────────┴──────────----─┘ │
                       └────────────────────────────────────────────----─┘
```

## Component Details

### 1. React UI (Frontend)
- **Purpose**: User interface for all system operations
- **Features**: PDF upload, knowledge querying, ticket management
- **Technology**: React + TypeScript + Material-UI

### 2. RAG API (Knowledge Engine)
- **Purpose**: Process PDFs and provide AI-powered responses using Agno framework
- **Features**: Document ingestion, vector search, AI generation, intelligent agents
- **Technology**: FastAPI + Agno Framework + LanceDB + OpenAI
- **Agno Components**:
  - **Agent**: Central intelligence for knowledge management and query processing
  - **Tools**: PDF Reader, Text Chunker, Vector Indexer, OpenAI Integration
  - **Knowledge Base**: LanceDB integration for vector storage and retrieval

### 3. Ticketing API (Support System)
- **Purpose**: Manage customer support tickets and workflows
- **Features**: CRUD operations, comments, statistics
- **Technology**: FastAPI + SQLite

## Agno Framework Architecture

The Agno Framework is the core AI engine that powers the RAG API. It provides a structured approach to building intelligent agents with specialized tools.

### Agno Components

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Agno Framework                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐      │
│  │     Agent       │    │   Knowledge     │    │     Tools       │      │
│  │                 │    │     Base        │    │                 │      │
│  │ • Orchestrates  │◄──►│ • Manages       │◄──►│ • PDF Reader    │      │
│  │   all tools     │    │   document      │    │ • Text Chunker  │      │
│  │ • Processes     │    │   lifecycle     │    │ • Vector        │      │
│  │   user queries  │    │ • Coordinates   │    │   Indexer       │      │
│  │ • Manages RAG   │    │   with LanceDB  │    │ • OpenAI        │      │
│  │   workflow      │    │ • Handles       │    │   Integration   │      │
│  │                 │    │   embeddings    │    │                 │      │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘      │
│           │                       │                       │             │
│           │                       │                       │             │
│           ▼                       ▼                       ▼             │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    LanceDB Integration                          │    │
│  │                                                                 │    │
│  │ • Stores document embeddings and chunks                         │    │
│  │ • Provides vector search capabilities                           │    │
│  │ • Enables semantic similarity search                            │    │
│  │ • Maintains document metadata and relationships                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

### Agent Capabilities

The Agno Agent serves as the central intelligence that:

1. **Orchestrates Workflows**: Coordinates between different tools and data sources
2. **Manages Knowledge**: Handles document ingestion, processing, and storage
3. **Processes Queries**: Understands user intent and routes requests appropriately
4. **Implements RAG Logic**: Combines retrieval and generation for intelligent responses
5. **Integrates External Services**: Connects with OpenAI for advanced language processing

### Tool Integration

Each tool in the Agno Framework has a specific responsibility:

- **PDF Reader**: Extracts text content from uploaded PDF documents
- **Text Chunker**: Breaks down documents into manageable chunks for processing
- **Vector Indexer**: Converts text chunks into vector embeddings for storage
- **OpenAI Integration**: Provides advanced language model capabilities for response generation

### Knowledge Base Management

The Agno Framework manages the knowledge base through:

1. **Document Lifecycle**: From upload to indexed storage
2. **Vector Operations**: Embedding generation and similarity search
3. **Metadata Management**: Document categorization and relationship tracking
4. **Query Processing**: Intelligent retrieval based on user intent

## Data Flow Diagrams

### PDF Ingestion Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────────────────────────┐    ┌─────────────┐
│   User      │    │   React UI  │    │           RAG API               │    │   LanceDB   │
│   Uploads   │───►│   Sends     │───►│                                 │───►│   Stores    │
│   PDF       │    │   File      │    │ ┌─────────────────────────────┐ │    │   Vectors   │
└─────────────┘    └─────────────┘    │ │      Agno Framework         │ │    └─────────────┘
       │                   │          │ │                             │ │            │
       │                   │          │ │ ┌─────────┐ ┌─────────────┐ │ │            │
       ▼                   ▼          │ │ │  Agent │ │    Tools     │ │ │            │
┌─────────────┐    ┌─────────────┐    │ │ │        │ │              │ │ │            ▼
│   File      │    │   Form      │    │ │ │ • PDF  │ │ • PDF Reader │ │ │    ┌─────────────┐
│   Selected  │    │   Data      │    │ │ │ Process│ │ • Chunker    │ │ │    │   Document  │
└─────────────┘    └─────────────┘    │ │ │ • Store│ │ • Indexer    │ │ │    │   Indexed   │
                                      │ │ └─────────┘ └─────────────┘ │ │    └─────────────┘
                                      │ └─────────────────────────────┘ │
                                      └─────────────────────────────────┘
```

### Knowledge Query Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────────────────────────┐    ┌─────────────┐
│   User      │    │   React UI  │    │           RAG API               │    │   LanceDB   │
│   Types     │───►│   Sends     │───►│                                 │───►│   Returns   │
│   Query     │    │   Query     │    │ ┌─────────────────────────────┐ │    │   Chunks    │
└─────────────┘    └─────────────┘    │ │      Agno Framework         │ │    └─────────────┘
       │                   │          │ │                             │ │            │
       │                   │          │ │ ┌─────────┐ ┌─────────────┐ │ │            │
       ▼                   ▼          │ │ │  Agent │ │    Tools     │ │ │            ▼
┌─────────────┐    ┌─────────────┐    │ │ │        │ │              │ │ │    ┌─────────────┐
│   Question  │    │   HTTP      │    │ │ │ • Query│ │ • Vector     │ │ │    │   Relevant  │
│   Input     │    │   Request   │    │ │ │ Process│ │   Search     │ │ │    │   Documents │
└─────────────┘    └─────────────┘    │ │ │ • RAG  │ │ • OpenAI     │ │ │    └─────────────┘
                                      │ │ │ Logic  │ │   Integration│ │ │           │
                                      │ │ └─────────┘ └─────────────┘ │ │           │
                                      │ └─────────────────────────────┘ │           │
                                      └─────────────────────────────────┘           │
                                                              │                     │
                                                              ▼                     │
                                                       ┌─────────────┐              │
                                                       │   OpenAI    │              │
                                                       │   Generates │◄─────────────┘
                                                       │   Answer    │
                                                       └─────────────┘
```

### AI Resolution Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────────────────────────┐    ┌─────────────┐
│   Support   │    │   React UI  │    │           RAG API               │    │   AI        │
│   Agent     │───►│   Creates   │───►│                                 │───►│   Generates │
│   Clicks    │    │   Query     │    │ ┌─────────────────────────────┐ │    │   Solution  │
│   AI Icon   │    │   from      │    │ │      Agno Framework         │ │    │   Based on  │
└─────────────┘    └─────────────┘    │ │                             │ │    └─────────────┘
       │                   │          │ │ ┌─────────┐ ┌─────────────┐ │ │            │
       │                   │          │ │ │  Agent  │ │    Tools    │ │ │            ▼
       ▼                   ▼          │ │ │         │ │             │ │ │    ┌─────────────┐
┌─────────────┐    ┌─────────────┐    │ │ │ • Ticket│ │ • Vector    │ │ │    │   Relevant  │
│   Ticket    │    │   Formatted │    │ │ │ Analysis│ │   Search    │ │ │    │   Response  │
│   Details   │    │   Query     │    │ │ │ • RAG   │ │ • OpenAI    │ │ │    │   with      │
│   Displayed │    │   String    │    │ │ │ Logic   │ │   Integration││ │    │   Sources   │
└─────────────┘    └─────────────┘    │ │ └─────────┘ └─────────────┘ │ │    └─────────────┘
                                      │ └─────────────────────────────┘ │           │
                                      └─────────────────────────────────┘           │
                                                              │                     │
                                                              ▼                     │
                                                       ┌─────────────┐              │
                                                       │   OpenAI    │              │
                                                       │   Generates │◄─────────────┘
                                                       │   Solution  │
                                                       └─────────────┘
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
User          React UI        RAG API        Agno Framework        LanceDB
  │              │              │              │                     │
  │─Select PDF──►│              │              │                     │
  │              │─Upload File─►│              │                     │
  │              │              │─Receive File │                     │
  │              │              │              │─Agent Orchestrates  │
  │              │              │              │─PDF Reader Tool     │
  │              │              │              │─Text Chunker Tool   │
  │              │              │              │─Vector Indexer Tool │
  │              │              │              │                     │─Store Vectors
  │              │              │              │                     │
  │              │              │              │◄─Processing Complete│
  │              │              │◄─Success─────│                     │
  │              │◄─Success─────│              │                     │
  │◄─Success─────│              │              │                     │
```

### Knowledge Query Sequence

```
User          React UI        RAG API        Agno Framework        LanceDB        OpenAI
  │              │              │              │                     │              │
  │─Type Query──►│              │              │                     │              │
  │              │─Send Query──►│              │                     │              │
  │              │              │─Receive Query│                     │              │
  │              │              │              │─Agent Processes     │
  │              │              │              │─Query Intent        │
  │              │              │              │─Vector Search Tool  │
  │              │              │              │                     │─Search Vectors
  │              │              │              │                     │◄─Relevant Chunks
  │              │              │              │─RAG Logic Tool      │
  │              │              │              │─OpenAI Integration  │              │
  │              │              │              │                     │              │─Generate Response
  │              │              │              │                     │              │◄─AI Response
  │              │              │              │◄─Formatted Answer   │              │
  │              │              │◄─Response─-──│                     │              │
  │              │◄─Response───-│              │                     │              │
  │◄─Response─-──│              │              │                     │              │
```

### AI Resolution Sequence

```
Support        React UI        RAG API        Agno Framework        LanceDB        OpenAI
Agent            │              │              │                     │              │
  │              │              │              │                     │              │
  │─Click AI────►│              │              │                     │              │
  │              │─Create Query │              │                     │              │
  │              │─from Ticket  │              │                     │              │
  │              │              │─Receive      │                     │              │
  │              │              │─Ticket Query │                     │              │
  │              │              │              │─Agent Analyzes      │
  │              │              │              │─Ticket Details      │
  │              │              │              │─Formats Query       │
  │              │              │              │─Vector Search Tool  │
  │              │              │              │                     │─Search Vectors
  │              │              │              │                     │◄─Relevant Docs
  │              │              │              │─RAG Logic Tool      │
  │              │              │              │─OpenAI Integration  │              │
  │              │              │              │                     │              │─Generate Solution
  │              │              │              │                     │              │◄─AI Solution
  │              │              │              │◄─Formatted          │              │
  │              │              │              │─Solution with       │              │
  │              │              │              │─Sources             │              │
  │              │              │◄─Solution───-│                     │              │
  │              │◄─Solution─-──│              │                     │              │
  │◄─Solution──-─│              │              │                     │              │
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
               │   Agno Agent    │
               │   Orchestrates  │
               └─────────────────┘
                       │
                       ▼
               ┌─────────────────┐
               │   PDF Reader    │
               │   Tool          │
               └─────────────────┘
                       │
                       ▼
               ┌─────────────────┐
               │   Text Chunker  │
               │   Tool          │
               └─────────────────┘
                       │
                       ▼
               ┌─────────────────┐
               │   Vector        │
               │   Indexer Tool  │
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
               │   Agno Agent    │
               │   Processes     │
               │   Query Intent  │
               └─────────────────┘
                       │
                       ▼
               ┌─────────────────┐
               │   Vector Search │
               │   Tool          │
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
               │   RAG Logic     │
               │   Tool          │
               └─────────────────┘
                       │
                       ▼
               ┌─────────────────┐
               │   OpenAI        │
               │   Integration   │
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
- **Agno Framework** - Core AI agent framework with intelligent tools and agents
- **Agno Agent** - Central intelligence for knowledge management and RAG operations
- **Agno Tools** - Specialized tools for PDF processing, text chunking, and vector operations
- **OpenAI** - Language model integration for advanced text generation
- **LanceDB** - Vector database for storing and searching document embeddings
- **PyPDF2** - PDF text extraction and processing

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
