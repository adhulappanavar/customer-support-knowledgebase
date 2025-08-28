# Customer Support Knowledge Base

A comprehensive AI-powered customer support system that combines intelligent knowledge management with traditional ticketing workflows.

## 🚀 Features

- **AI-Powered Knowledge Base**: RAG (Retrieval-Augmented Generation) system for intelligent document processing and querying
- **PDF Document Ingestion**: Automatic text extraction, chunking, and vector storage
- **Intelligent Search**: Semantic search with source attribution
- **Integrated Ticketing System**: Complete customer support ticket lifecycle management
- **AI Resolution Suggestions**: AI-powered ticket resolution based on knowledge base
- **Modern Web Interface**: React-based UI with Material-UI components

## 🏗️ Architecture

The system consists of three main components:

- **RAG API** (Port 8000): FastAPI-based knowledge engine with Agno + LanceDB
- **Ticketing API** (Port 8001): FastAPI-based ticket management system
- **React UI** (Port 3000): Modern web interface for all operations

## 📋 Prerequisites

- Python 3.12+
- Node.js 18+
- OpenAI API Key
- Git

## 🛠️ Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd customer-support-knowledgebase
```

### 2. Set Up Environment

```bash
# Set up Python environments
cd cskb-api && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt
cd ../cskb-ticketing-app && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt
cd ../cskb-react-ui && npm install

# Set up environment variables
cd ../cskb-api
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
```

### 3. Start Services

```bash
# Terminal 1: Start RAG API
cd cskb-api && source venv/bin/activate && python3 main.py

# Terminal 2: Start Ticketing API  
cd cskb-ticketing-app && source venv/bin/activate && python3 main.py

# Terminal 3: Start React UI
cd cskb-react-ui && npm start
```

### 4. Access the System

- **React UI**: http://localhost:3000
- **RAG API**: http://localhost:8000
- **Ticketing API**: http://localhost:8001

## 📚 Documentation

- **[High-Level App Description](app-usage-docs/high-level-app-description.md)** - System architecture and flow diagrams
- **[Build and Run Guide](app-usage-docs/build-and-run-guide.md)** - Complete setup and deployment instructions
- **[Testing Guide](app-usage-docs/testing-guide.md)** - Comprehensive testing instructions and examples

## 🔧 Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Agno** - AI agent framework
- **LanceDB** - Vector database for embeddings
- **OpenAI** - Language model integration
- **PyPDF2** - PDF text extraction

### Frontend
- **React 18** - User interface framework
- **TypeScript** - Type safety
- **Material-UI** - Component library
- **Axios** - HTTP client

### Database
- **SQLite** - Ticketing data storage
- **LanceDB** - Vector storage for embeddings

## 🎯 Use Cases

- **Customer Support Teams**: AI-powered knowledge retrieval and ticket resolution
- **Document Management**: Intelligent PDF processing and search
- **Knowledge Base Creation**: Automated document indexing and chunking
- **Support Ticket Management**: Complete ticket lifecycle with AI assistance

## 🚀 Getting Started

1. **Upload Documents**: Use the PDF Upload tab to ingest support documentation
2. **Query Knowledge**: Ask questions and get AI-powered responses with sources
3. **Manage Tickets**: Create and manage customer support tickets
4. **AI Resolution**: Get intelligent resolution suggestions for tickets

## 🔒 Security

- Environment variables for sensitive configuration
- CORS protection for API endpoints
- Input validation and sanitization
- Secure file upload handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the [documentation](app-usage-docs/)
- Review the [testing guide](app-usage-docs/testing-guide.md)
- Open an issue on GitHub

## 🗺️ Roadmap

- [ ] User authentication and authorization
- [ ] Multi-tenant support
- [ ] Advanced analytics and reporting
- [ ] Mobile application
- [ ] Integration with external ticketing systems
- [ ] Advanced AI models and fine-tuning

---

**Built with ❤️ using modern AI and web technologies**
