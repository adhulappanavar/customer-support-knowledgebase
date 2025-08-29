# CSKB Feedback Agents - Project Structure

## 📁 Directory Structure

```
customer-support-knowledgebase/
├── README.md                           # Main project documentation
├── .gitignore                          # Git ignore rules
├── PROJECT_STRUCTURE.md                # This file - project structure overview
├── .env.example                        # Environment variables template
│
├── cskb-feedback-agents/              # Backend Python application
│   ├── main.py                        # FastAPI main application
│   ├── requirements.txt                # Python dependencies
│   ├── setup.sh                       # Setup script
│   ├── start.sh                       # Startup script
│   │
│   ├── agents/                        # AI agent implementations
│   │   ├── base_agent.py             # Base agent class
│   │   ├── feedback_agent.py         # Feedback collection agent
│   │   └── learning_agent.py         # Knowledge learning agent
│   │
│   ├── config/                        # Configuration management
│   │   └── config.py                 # Environment and settings
│   │
│   ├── data/                          # Data layer
│   │   ├── feedback_database.py      # SQLite feedback storage
│   │   └── enhanced_knowledge_base.py # LanceDB knowledge base
│   │
│   ├── communication/                 # Agent communication
│   │   └── message_bus.py            # Message routing system
│   │
│   ├── tests/                         # Test files
│   │   └── test_system.py            # System integration tests
│   │
│   ├── logs/                          # Application logs
│   ├── data/                          # SQLite database files
│   └── enhanced_kb/                   # LanceDB knowledge base files
│
└── cskb-feedback-agent-reactui/       # Frontend React application
    ├── package.json                   # Node.js dependencies
    ├── tsconfig.json                  # TypeScript configuration
    ├── tailwind.config.js             # Tailwind CSS configuration
    │
    ├── public/                        # Static assets
    │   ├── index.html                 # Main HTML file
    │   ├── manifest.json              # PWA manifest
    │   ├── favicon.ico                # Favicon
    │   └── robots.txt                 # SEO robots file
    │
    └── src/                           # React source code
        ├── App.tsx                    # Main application component
        ├── index.tsx                  # Application entry point
        │
        ├── components/                # Reusable UI components
        │   ├── LoadingSpinner.tsx     # Loading indicator
        │   ├── ErrorBoundary.tsx      # Error handling
        │   └── ...                    # Other components
        │
        ├── pages/                     # Application pages
        │   ├── Dashboard.tsx          # Main dashboard with query tool
        │   ├── FeedbackHistory.tsx    # Feedback history display
        │   ├── EnhancedKB.tsx         # Knowledge base explorer
        │   ├── AgentStatus.tsx        # Agent monitoring
        │   └── SystemHealth.tsx       # System health overview
        │
        ├── services/                  # API and data services
        │   └── api.ts                 # Centralized API client
        │
        ├── types/                     # TypeScript type definitions
        │   └── index.ts               # Common types
        │
        └── utils/                     # Utility functions
            └── helpers.ts             # Helper functions
```

## 🔧 Key Components

### Backend (Python/FastAPI)
- **Main Application**: `main.py` - FastAPI server with all endpoints
- **AI Agents**: Autonomous agents for feedback processing and learning
- **Data Layer**: SQLite for feedback, LanceDB for knowledge base
- **Communication**: Message bus for inter-agent communication

### Frontend (React/TypeScript)
- **Dashboard**: Central hub with real-time metrics and query tool
- **Components**: Reusable UI components with Tailwind CSS
- **Services**: Centralized API communication layer
- **Types**: TypeScript interfaces for type safety

## 🚀 Quick Start Commands

### Backend Setup
```bash
cd cskb-feedback-agents
./setup.sh                    # Run setup script
source venv/bin/activate      # Activate virtual environment
python main.py                # Start backend server
```

### Frontend Setup
```bash
cd cskb-feedback-agent-reactui
npm install                   # Install dependencies
npm start                     # Start development server
```

## 🌐 Service Ports

- **Backend API**: http://localhost:8002
- **Frontend UI**: http://localhost:3000
- **API Docs**: http://localhost:8002/docs

## 📊 Data Flow

1. **Feedback Submission** → FeedbackAgent
2. **Learning Trigger** → LearningAgent
3. **Knowledge Extraction** → Enhanced Knowledge Base
4. **Real-time Updates** → React Dashboard
5. **Query Interface** → Interactive Knowledge Exploration

## 🔍 Monitoring & Debugging

- **Agent Status**: `/agents/status` endpoint
- **System Health**: `/system/health` endpoint
- **Console Logs**: Backend logging with structlog
- **Browser DevTools**: Frontend debugging and network monitoring
