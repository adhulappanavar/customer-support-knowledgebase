# CSKB Feedback Agents System

A sophisticated feedback collection and learning system that integrates with your existing Agno + LanceDB knowledge base to create continuously improving AI solutions.

## 🎯 **What This System Does**

The CSKB Feedback Agents System extends your existing customer support knowledge base with intelligent feedback processing and learning capabilities. It maintains your **original knowledge base unchanged** while building a separate **enhanced knowledge base** that learns from user feedback.

## 🏗️ **Architecture Overview**

```
┌─────────────────────────────────────────────────────────────────┐
│                    Your Existing System                        │
├─────────────────────────────────────────────────────────────────┤
│  React UI → RAG API → Agno Agent → LanceDB (Original KB)      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              NEW: Feedback Agents Layer                        │
├─────────────────────────────────────────────────────────────────┤
│  Feedback Agent → Learning Agent → Enhanced LanceDB            │
│  Quality Agent → Pattern Agent → Feedback SQLite               │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 **Key Features**

### **1. Feedback Collection & Processing**
- **Intelligent Feedback Scoring**: Automatically calculates effectiveness scores
- **Learning Priority Calculation**: Determines which feedback should trigger learning
- **Context-Aware Processing**: Considers ticket category, priority, and tags

### **2. Enhanced Knowledge Base**
- **Separate LanceDB Instance**: Keeps your original KB untouched
- **Solution Variants**: Creates improved versions of existing solutions
- **Feedback-Weighted Ranking**: Prioritizes solutions based on user feedback

### **3. Agent-Based Architecture**
- **Modular Design**: Each agent has specific responsibilities
- **Inter-Agent Communication**: Coordinated message passing system
- **Scalable Framework**: Easy to add new agents and capabilities

### **4. Quality Assurance**
- **Consistency Validation**: Ensures new solutions align with existing knowledge
- **Conflict Detection**: Identifies and resolves knowledge conflicts
- **Approval Workflows**: Multi-layer validation before applying changes

## 🛠️ **Technology Stack**

- **Framework**: FastAPI (Python web framework)
- **AI Agents**: Custom agent framework built on Agno principles
- **Vector Database**: LanceDB for enhanced knowledge storage
- **Relational Database**: SQLite for feedback and learning data
- **AI Integration**: OpenAI API for intelligent processing
- **Logging**: Structured logging with structlog
- **Monitoring**: Built-in metrics and health checks

## 📋 **Prerequisites**

- **Python 3.12+** (required for modern async features)
- **OpenAI API Key** (for AI-powered learning)
- **Existing Agno + LanceDB Setup** (for integration)

## 🚀 **Quick Start**

### **1. Clone and Setup**
```bash
cd cskb-feedback-agents
chmod +x start.sh
```

### **2. Configure Environment**
```bash
# Copy and edit .env file
cp .env.example .env

# Add your OpenAI API key
OPENAI_API_KEY=your_actual_api_key_here
```

### **3. Start the System**
```bash
./start.sh
```

The system will:
- ✅ Check Python version
- ✅ Create virtual environment
- ✅ Install dependencies
- ✅ Validate configuration
- ✅ Start the API server

### **4. Access the System**
- **API Documentation**: http://localhost:8002/docs
- **Health Check**: http://localhost:8002/health
- **API Base URL**: http://localhost:8002/api/v1

## 📚 **API Endpoints**

### **Feedback Management**
- `POST /feedback` - Collect user feedback
- `GET /feedback/{ticket_id}` - Get feedback for a ticket
- `GET /feedback/stats` - Get feedback statistics

### **System Monitoring**
- `GET /health` - System health check
- `GET /agents/status` - Agent status and metrics
- `GET /system/health` - Overall system health

### **Enhanced Knowledge Base**
- `GET /enhanced-kb/stats` - Enhanced KB statistics
- `GET /enhanced-kb/solutions/{category}` - Solutions by category
- `GET /enhanced-kb/solutions` - High priority solutions

## 🔄 **How It Works**

### **1. Feedback Collection**
```
User Rates AI Solution → Feedback Agent → Store in SQLite → Calculate Priority
```

### **2. Learning Process**
```
High Priority Feedback → Learning Agent → Update Enhanced KB → Quality Check
```

### **3. Knowledge Enhancement**
```
Original KB (Protected) + Enhanced KB (Learning) = Intelligent Responses
```

### **4. Quality Assurance**
```
New Knowledge → Quality Agent → Consistency Check → Approval/Rejection
```

## 🎯 **Integration with Your Existing System**

### **Current Integration Points**
1. **Feedback Collection**: Works with your existing ticketing system
2. **Knowledge Enhancement**: Builds on your existing Agno knowledge
3. **Response Generation**: Combines original and enhanced knowledge

### **Future Integration Points**
1. **Enhanced Query Agent**: Will search both KBs intelligently
2. **Learning Agent**: Will update enhanced KB based on feedback
3. **Pattern Recognition**: Will identify knowledge gaps and trends

## 📊 **Feedback Types**

| Type | Description | Learning Priority | Example |
|------|-------------|-------------------|---------|
| **PERFECT** | AI solution worked exactly as expected | Low | User follows AI steps successfully |
| **MINOR_CHANGES** | AI solution worked with small adjustments | Medium | User modifies a few steps |
| **NEW_SOLUTION** | AI solution didn't work, human found alternative | High | User discovers completely different approach |

## 🔧 **Configuration**

### **Environment Variables**
```bash
# OpenAI Configuration
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-3.5-turbo

# API Configuration
API_HOST=0.0.0.0
API_PORT=8002
DEBUG=false

# Agent Configuration
LEARNING_THRESHOLD=0.7
CONSISTENCY_THRESHOLD=0.8
QUALITY_THRESHOLD=0.7

# Database Paths
ORIGINAL_KB_PATH=../cskb-api/data/lancedb
ENHANCED_KB_PATH=data/enhanced_kb
FEEDBACK_DB_PATH=data/feedback.db
```

### **Agent Settings**
```yaml
agents:
  feedback_agent:
    enabled: true
    auto_collection: true
    
  learning_agent:
    enabled: true
    learning_threshold: 0.7
    max_variants_per_solution: 5
    
  quality_assurance_agent:
    enabled: true
    consistency_threshold: 0.8
    quality_threshold: 0.7
    auto_approval: false
```

## 📈 **Monitoring & Metrics**

### **Agent Metrics**
- **Feedback Collected**: Total feedback entries
- **Learning Triggers**: Number of learning processes initiated
- **Average Effectiveness**: Overall solution effectiveness score

### **System Metrics**
- **Database Connections**: Status of all databases
- **Agent Health**: Status of all running agents
- **Message Throughput**: Inter-agent communication statistics

### **Knowledge Base Metrics**
- **Total Solutions**: Count of enhanced solutions
- **Source Distribution**: AI vs. Human vs. Hybrid solutions
- **Confidence Scores**: Average confidence of solutions

## 🧪 **Testing**

### **Manual Testing**
```bash
# Health check
curl http://localhost:8002/health

# Get agent status
curl http://localhost:8002/agents/status

# Submit feedback
curl -X POST http://localhost:8002/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TKT-001",
    "ai_solution": "Restart the service",
    "feedback_type": "MINOR_CHANGES",
    "human_solution": "Restart the service and clear cache",
    "context": {"category": "Technical Issue"}
  }'
```

### **Automated Testing**
```bash
# Run tests (when implemented)
pytest tests/

# Run with coverage
pytest --cov=. tests/
```

## 🔍 **Troubleshooting**

### **Common Issues**

#### **1. OpenAI API Key Error**
```
Error: OpenAI API key not configured
Solution: Set OPENAI_API_KEY in .env file
```

#### **2. Port Already in Use**
```
Error: [Errno 48] Address already in use
Solution: Change API_PORT in config or kill existing process
```

#### **3. Database Connection Error**
```
Error: Database not accessible
Solution: Check file permissions and paths in config
```

#### **4. Agent Communication Error**
```
Error: Agent not responding
Solution: Check agent startup logs and communication bus
```

### **Debug Mode**
```bash
# Enable debug mode
DEBUG=true ./start.sh

# Check logs
tail -f logs/feedback_agents.log
```

## 🚀 **Development**

### **Project Structure**
```
cskb-feedback-agents/
├── agents/                 # Agent implementations
│   ├── base_agent.py      # Base agent class
│   ├── feedback_agent.py  # Feedback collection agent
│   └── ...                # Other agents
├── data/                   # Data layer
│   ├── feedback_database.py      # SQLite feedback DB
│   └── enhanced_knowledge_base.py # LanceDB enhanced KB
├── config/                 # Configuration
│   └── config.py          # Settings and environment
├── communication/          # Inter-agent communication
├── tools/                  # Agent tools and utilities
├── tests/                  # Test suite
├── main.py                # FastAPI application
├── start.sh               # Startup script
└── requirements.txt        # Python dependencies
```

### **Adding New Agents**
1. **Create Agent Class**: Extend `BaseAgent`
2. **Register Message Handlers**: Handle specific message types
3. **Add to Main App**: Initialize in startup event
4. **Update API Endpoints**: Add relevant endpoints

### **Adding New Features**
1. **Database Schema**: Update relevant database classes
2. **API Models**: Add Pydantic models for new endpoints
3. **Agent Logic**: Implement business logic in agents
4. **Testing**: Add comprehensive tests

## 🔮 **Roadmap**

### **Phase 1: Core Feedback System** ✅
- [x] Feedback collection and storage
- [x] Basic agent communication
- [x] Enhanced knowledge base setup

### **Phase 2: Learning & Enhancement** 🚧
- [ ] Learning agent implementation
- [ ] Quality assurance agent
- [ ] Pattern recognition agent

### **Phase 3: Advanced Features** 📋
- [ ] Integration agent
- [ ] Workflow management
- [ ] Advanced analytics

### **Phase 4: Production Ready** 📋
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Deployment automation

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create a feature branch**
3. **Implement your changes**
4. **Add tests**
5. **Submit a pull request**

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🆘 **Support**

- **Documentation**: Check this README and API docs
- **Issues**: Report bugs and feature requests
- **Discussions**: Join community discussions

## 🎉 **Success Metrics**

- **Feedback Collection Rate**: >80% of AI resolutions get feedback
- **Learning Effectiveness**: >70% of feedback triggers learning
- **Solution Quality**: >85% of enhanced solutions pass quality checks
- **System Uptime**: >99% availability

---

**Built with ❤️ to enhance your customer support knowledge base!**

The system is designed to work **alongside** your existing Agno setup, not replace it. It creates a **learning layer** that continuously improves while keeping your **core knowledge stable and protected**.
