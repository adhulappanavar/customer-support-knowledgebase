import asyncio
import structlog
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import uvicorn

from config.config import settings
from agents.base_agent import AgentCommunicationBus
from agents.feedback_agent import FeedbackAgent
from agents.learning_agent import LearningAgent
from data.feedback_database import FeedbackDatabase
from data.enhanced_knowledge_base import EnhancedKnowledgeBase

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Pydantic models for API requests/responses
class FeedbackRequest(BaseModel):
    ticket_id: str
    ai_solution: str
    human_solution: Optional[str] = None
    feedback_type: str  # 'PERFECT', 'MINOR_CHANGES', 'NEW_SOLUTION'
    user_role: str = "user"
    comments: str = ""
    context: Optional[Dict[str, Any]] = None

class FeedbackResponse(BaseModel):
    feedback_id: int
    effectiveness_score: float
    learning_priority: int
    status: str

class AgentStatusResponse(BaseModel):
    agent_name: str
    status: str
    metrics: Dict[str, Any]
    timestamp: str

class SystemHealthResponse(BaseModel):
    overall_status: str
    agents: Dict[str, AgentStatusResponse]
    databases: Dict[str, str]
    timestamp: str

# Initialize FastAPI app
app = FastAPI(
    title="CSKB Feedback Agents API",
    description="API for managing feedback agents and learning systems",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances
communication_bus: Optional[AgentCommunicationBus] = None
feedback_agent: Optional[FeedbackAgent] = None
learning_agent: Optional[LearningAgent] = None
feedback_db: Optional[FeedbackDatabase] = None
enhanced_kb: Optional[EnhancedKnowledgeBase] = None

@app.on_event("startup")
async def startup_event():
    """Initialize the system on startup."""
    global communication_bus, feedback_agent, learning_agent, feedback_db, enhanced_kb
    
    try:
        logger.info("Starting CSKB Feedback Agents system...")
        
        # Initialize communication bus
        communication_bus = AgentCommunicationBus()
        
        # Initialize databases
        feedback_db = FeedbackDatabase(settings.FEEDBACK_DB_PATH)
        enhanced_kb = EnhancedKnowledgeBase(settings.ENHANCED_KB_PATH)
        
        # Initialize agents
        feedback_agent = FeedbackAgent(communication_bus, feedback_db)
        learning_agent = LearningAgent(communication_bus, enhanced_kb, feedback_db)
        
        # Start communication bus
        asyncio.create_task(communication_bus.start())
        
        # Start agents
        await feedback_agent.start()
        await learning_agent.start()
        
        logger.info("CSKB Feedback Agents system started successfully")
        
    except Exception as e:
        logger.error(f"Error during startup: {str(e)}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown."""
    global communication_bus, feedback_agent, learning_agent, feedback_db, enhanced_kb
    
    try:
        logger.info("Shutting down CSKB Feedback Agents system...")
        
        if feedback_agent:
            await feedback_agent.stop()
        
        if learning_agent:
            await learning_agent.stop()
        
        if communication_bus:
            await communication_bus.stop()
        
        if feedback_db:
            feedback_db.close()
        
        if enhanced_kb:
            enhanced_kb.close()
        
        logger.info("CSKB Feedback Agents system shut down successfully")
        
    except Exception as e:
        logger.error(f"Error during shutdown: {str(e)}")

@app.get("/health", response_model=Dict[str, str])
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "CSKB Feedback Agents API",
        "timestamp": str(asyncio.get_event_loop().time())
    }

@app.post("/feedback", response_model=FeedbackResponse)
async def collect_feedback(feedback_request: FeedbackRequest):
    """Collect feedback from users."""
    try:
        if not feedback_agent:
            raise HTTPException(status_code=503, detail="Feedback agent not initialized")
        
        result = await feedback_agent.collect_feedback(
            ticket_id=feedback_request.ticket_id,
            ai_solution=feedback_request.ai_solution,
            human_solution=feedback_request.human_solution,
            feedback_type=feedback_request.feedback_type,
            user_role=feedback_request.user_role,
            comments=feedback_request.comments,
            context=feedback_request.context
        )
        
        if result['status'] == 'error':
            raise HTTPException(status_code=400, detail=result['error'])
        
        return FeedbackResponse(
            feedback_id=result['feedback_id'],
            effectiveness_score=result['effectiveness_score'],
            learning_priority=result['learning_priority'],
            status=result['status']
        )
        
    except Exception as e:
        logger.error(f"Error collecting feedback: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/feedback/{ticket_id}", response_model=List[Dict[str, Any]])
async def get_feedback_by_ticket(ticket_id: str):
    """Get all feedback for a specific ticket."""
    try:
        if not feedback_agent:
            raise HTTPException(status_code=503, detail="Feedback agent not initialized")
        
        feedback_list = feedback_agent.get_feedback_by_ticket(ticket_id)
        return feedback_list
        
    except Exception as e:
        logger.error(f"Error getting feedback for ticket {ticket_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/feedback/stats", response_model=Dict[str, Any])
async def get_feedback_statistics():
    """Get feedback statistics."""
    try:
        if not feedback_agent:
            raise HTTPException(status_code=503, detail="Feedback agent not initialized")
        
        # Send message to get stats
        response = await feedback_agent.send_message(
            'feedback_agent', 'GET_FEEDBACK_STATS', {}
        )
        
        return response.data if hasattr(response, 'data') else response
        
    except Exception as e:
        logger.error(f"Error getting feedback statistics: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/feedback", response_model=List[Dict[str, Any]])
async def get_all_feedback(limit: int = 100, offset: int = 0):
    """Get all feedback entries with pagination."""
    try:
        if not feedback_agent:
            raise HTTPException(status_code=503, detail="Feedback agent not initialized")
        
        # Get all feedback from database
        all_feedback = feedback_agent.get_all_feedback(limit=limit, offset=offset)
        return all_feedback
        
    except Exception as e:
        logger.error(f"Error getting all feedback: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/agents/status", response_model=Dict[str, AgentStatusResponse])
async def get_agent_status():
    """Get status of all agents."""
    try:
        if not communication_bus:
            raise HTTPException(status_code=503, detail="Communication bus not initialized")
        
        agent_status = {}
        
        # Get feedback agent status
        if feedback_agent:
            agent_status['feedback_agent'] = AgentStatusResponse(
                agent_name=feedback_agent.name,
                status=feedback_agent.state.get('status', 'unknown'),
                metrics=feedback_agent.metrics,
                timestamp=feedback_agent.state.get('started_at', '')
            )
        
        # Get learning agent status
        if learning_agent:
            agent_status['learning_agent'] = AgentStatusResponse(
                agent_name=learning_agent.name,
                status=learning_agent.state.get('status', 'unknown'),
                metrics=learning_agent.metrics,
                timestamp=learning_agent.state.get('started_at', '')
            )
        
        # Get communication bus status
        bus_stats = communication_bus.get_message_stats()
        agent_status['communication_bus'] = AgentStatusResponse(
            agent_name='communication_bus',
            status='running',
            metrics=bus_stats,
            timestamp=''
        )
        
        return agent_status
        
    except Exception as e:
        logger.error(f"Error getting agent status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/system/health", response_model=SystemHealthResponse)
async def get_system_health():
    """Get overall system health."""
    try:
        # Get agent status
        agent_status = await get_agent_status()
        
        # Check database status
        db_status = {}
        if feedback_db:
            db_status['feedback_db'] = 'connected'
        if enhanced_kb:
            db_status['enhanced_kb'] = 'connected'
        
        # Determine overall status
        overall_status = 'healthy'
        for agent_name, status in agent_status.items():
            if status.status != 'running':
                overall_status = 'degraded'
                break
        
        return SystemHealthResponse(
            overall_status=overall_status,
            agents=agent_status,
            databases=db_status,
            timestamp=str(asyncio.get_event_loop().time())
        )
        
    except Exception as e:
        logger.error(f"Error getting system health: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/enhanced-kb/stats", response_model=Dict[str, Any])
async def get_enhanced_kb_statistics():
    """Get enhanced knowledge base statistics."""
    try:
        if not enhanced_kb:
            raise HTTPException(status_code=503, detail="Enhanced knowledge base not initialized")
        
        stats = enhanced_kb.get_statistics()
        return stats
        
    except Exception as e:
        logger.error(f"Error getting enhanced KB statistics: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/enhanced-kb/solutions/{category}", response_model=List[Dict[str, Any]])
async def get_solutions_by_category(category: str, limit: int = 50):
    """Get solutions by category from enhanced knowledge base."""
    try:
        if not enhanced_kb:
            raise HTTPException(status_code=503, detail="Enhanced knowledge base not initialized")
        
        solutions = enhanced_kb.get_solutions_by_category(category, limit)
        return solutions
        
    except Exception as e:
        logger.error(f"Error getting solutions by category {category}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/enhanced-kb/solutions", response_model=List[Dict[str, Any]])
async def get_high_priority_solutions(limit: int = 20):
    """Get high priority solutions from enhanced knowledge base."""
    try:
        if not enhanced_kb:
            raise HTTPException(status_code=503, detail="Enhanced knowledge base not initialized")
        
        solutions = enhanced_kb.get_high_priority_solutions(limit)
        return solutions
        
    except Exception as e:
        logger.error(f"Error getting high priority solutions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/enhanced-kb/populate", response_model=Dict[str, Any])
async def populate_knowledge_base():
    """Manually trigger knowledge base population from existing feedback."""
    try:
        if not learning_agent:
            raise HTTPException(status_code=503, detail="Learning agent not initialized")
        
        # Send message to learning agent to update knowledge base
        response = await learning_agent.send_message(
            'learning_agent', 'UPDATE_KNOWLEDGE_BASE', {}
        )
        
        return response.data if hasattr(response, 'data') else response
        
    except Exception as e:
        logger.error(f"Error populating knowledge base: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    )
