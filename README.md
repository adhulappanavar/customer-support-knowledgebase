# Customer Support Knowledge Base (CSKB) - Feedback Agents & React UI

A sophisticated feedback learning system that automatically processes customer support feedback and builds an enhanced knowledge base using AI agents and machine learning.

## 🚀 System Overview

The CSKB Feedback Agents system transforms customer feedback into actionable knowledge through:
- **Intelligent Feedback Processing**: AI agents analyze feedback patterns and extract insights
- **Enhanced Knowledge Base**: Automatically populated with solutions from human feedback
- **Learning Loop**: Continuous improvement through feedback analysis
- **Modern React UI**: Intuitive dashboard for monitoring and querying the system

## 🏗️ Architecture

### Backend Components
- **FeedbackAgent**: Collects and processes customer feedback
- **LearningAgent**: Extracts insights and populates knowledge base
- **AgentCommunicationBus**: Coordinates communication between agents
- **Enhanced Knowledge Base**: LanceDB-powered vector database for solutions
- **SQLite Database**: Stores feedback entries and metadata

### Frontend Components
- **Dashboard**: System overview with real-time metrics
- **Feedback History**: View and analyze all feedback entries
- **Enhanced KB**: Explore knowledge base solutions
- **Agent Status**: Monitor agent health and performance
- **Query Tool**: Interactive knowledge base querying interface

## 🛠️ Technology Stack

### Backend
- **Python 3.12+**: Core application logic
- **FastAPI**: High-performance web framework
- **LanceDB**: Vector database for knowledge storage
- **SQLite**: Relational database for feedback storage
- **Pandas**: Data processing and analysis
- **Structlog**: Structured logging

### Frontend
- **React 18**: Modern UI framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication
- **Recharts**: Data visualization
- **React Hook Form**: Form management

## 📋 Prerequisites

- Python 3.12 or higher
- Node.js 18+ and npm
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd customer-support-knowledgebase
```

### 2. Backend Setup
```bash
cd cskb-feedback-agents

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the backend server
python main.py
```

The backend will be available at `http://localhost:8002`

### 3. Frontend Setup
```bash
cd cskb-feedback-agent-reactui

# Install dependencies
npm install

# Start the development server
npm start
```

The React UI will be available at `http://localhost:3000`

## 🔧 Configuration

### Environment Variables (.env)
```bash
# Database Configuration
DB_PATH=./data/feedback.db
ENHANCED_KB_PATH=./data/enhanced_kb

# Server Configuration
HOST=0.0.0.0
PORT=8002

# Logging
LOG_LEVEL=INFO
```

## 📊 API Endpoints

### Feedback Management
- `GET /feedback` - Get all feedback entries with pagination
- `GET /feedback/{ticket_id}` - Get feedback by ticket ID
- `POST /feedback` - Submit new feedback
- `GET /feedback/stats` - Get feedback statistics

### Enhanced Knowledge Base
- `GET /enhanced-kb/stats` - Get KB statistics
- `GET /enhanced-kb/solutions` - Get all solutions
- `GET /enhanced-kb/solutions/{category}` - Get solutions by category
- `POST /enhanced-kb/populate` - Manually trigger KB population

### System Monitoring
- `GET /system/health` - System health check
- `GET /agents/status` - Agent status and metrics

## 🎯 Features

### Intelligent Feedback Processing
- **Automatic Categorization**: Feedback automatically categorized by type and domain
- **Effectiveness Scoring**: AI calculates solution effectiveness scores
- **Learning Priority**: Automatic prioritization for learning focus
- **Pattern Recognition**: Identifies recurring issues and knowledge gaps

### Enhanced Knowledge Base
- **Solution Extraction**: Automatically extracts solutions from feedback
- **Metadata Preservation**: Maintains context, user roles, and feedback history
- **Category Organization**: Solutions organized by technical domain
- **Priority Scoring**: High-priority solutions for critical learning areas

### Real-time Dashboard
- **Live Metrics**: Real-time feedback collection and learning metrics
- **Agent Monitoring**: Live status of all AI agents
- **System Health**: Comprehensive system health monitoring
- **Interactive Queries**: Built-in knowledge base querying tool

## 🔍 Usage Examples

### Submit Feedback
```bash
curl -X POST http://localhost:8002/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TICKET-001",
    "ai_solution": "Restart the service",
    "human_solution": "Clear cache first, then restart service",
    "feedback_type": "NEW_SOLUTION",
    "user_role": "support_engineer",
    "comments": "AI missed the cache clearing step",
    "context": {"category": "technical", "priority": "high"}
  }'
```

### Query Knowledge Base
```bash
# Get KB statistics
curl http://localhost:8002/enhanced-kb/stats

# Get technical solutions
curl "http://localhost:8002/enhanced-kb/solutions/technical?limit=5"

# Get all solutions
curl "http://localhost:8002/enhanced-kb/solutions?limit=20"
```

### Dashboard Queries
Use the built-in query tool in the React UI:
1. **Sample Queries**: One-click access to common queries
2. **Custom Queries**: Build your own queries with parameters
3. **Query History**: Track and re-run previous queries
4. **Real-time Results**: See results immediately

## 📈 Learning Process

### 1. Feedback Collection
- User submits feedback via API or UI
- FeedbackAgent processes and stores feedback
- Effectiveness scores calculated automatically

### 2. Learning Trigger
- Non-perfect feedback triggers learning process
- LearningAgent extracts insights and patterns
- Knowledge gaps identified and tracked

### 3. Knowledge Base Update
- Solutions extracted from human feedback
- Enhanced KB populated with new knowledge
- Metadata preserved for context and learning

### 4. Continuous Improvement
- System learns from every feedback submission
- Knowledge base grows with real-world solutions
- Patterns identified for proactive improvements

## 🧪 Testing

### Backend Testing
```bash
cd cskb-feedback-agents
source venv/bin/activate

# Test API endpoints
curl http://localhost:8002/system/health
curl http://localhost:8002/agents/status
curl http://localhost:8002/feedback
```

### Frontend Testing
```bash
cd cskb-feedback-agent-reactui

# Run tests
npm test

# Build for production
npm run build
```

## 🚀 Deployment

### Production Build
```bash
# Backend
cd cskb-feedback-agents
pip install -r requirements.txt
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8002

# Frontend
cd cskb-feedback-agent-reactui
npm run build
# Serve the build folder with your web server
```

### Docker (Optional)
```dockerfile
# Backend Dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

## 🔧 Troubleshooting

### Common Issues

#### Backend Won't Start
- Check if port 8002 is available
- Verify virtual environment is activated
- Check .env file configuration

#### Empty Query Results
- Ensure backend is running on port 8002
- Check browser console for errors
- Verify API endpoints are responding

#### Knowledge Base Empty
- Run `/enhanced-kb/populate` endpoint
- Check LearningAgent is running
- Verify feedback data exists

### Debug Mode
Enable debug logging in .env:
```bash
LOG_LEVEL=DEBUG
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **FastAPI**: High-performance web framework
- **LanceDB**: Vector database for AI applications
- **React**: Modern UI framework
- **Tailwind CSS**: Utility-first CSS framework

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section
- Review the API documentation at `/docs` endpoint

---

**Built with ❤️ for intelligent customer support systems**
