import asyncio
import json
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional, Union
from abc import ABC, abstractmethod
import structlog

logger = structlog.get_logger()

class Message:
    """Message structure for inter-agent communication."""
    
    def __init__(self, from_agent: str, to_agent: str, message_type: str, data: Any):
        self.id = str(uuid.uuid4())
        self.from_agent = from_agent
        self.to_agent = to_agent
        self.message_type = message_type
        self.data = data
        self.timestamp = datetime.now()
        self.status = "pending"
        self.response = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'from_agent': self.from_agent,
            'to_agent': self.to_agent,
            'type': self.message_type,
            'data': self.data,
            'timestamp': self.timestamp.isoformat(),
            'status': self.status,
            'response': self.response
        }
    
    def __repr__(self):
        return f"Message({self.from_agent} -> {self.to_agent}: {self.message_type})"

class AgentCommunicationBus:
    """Central communication hub for all agents."""
    
    def __init__(self):
        self.agents: Dict[str, 'BaseAgent'] = {}
        self.message_queue: List[Message] = []
        self.message_history: List[Message] = []
        self._running = False
        self._message_handlers: Dict[str, List[callable]] = {}
        
        logger.info("Agent Communication Bus initialized")
    
    def register_agent(self, agent: 'BaseAgent') -> None:
        """Register an agent with the communication bus."""
        self.agents[agent.name] = agent
        logger.info(f"Agent '{agent.name}' registered with communication bus")
    
    def unregister_agent(self, agent_name: str) -> None:
        """Unregister an agent from the communication bus."""
        if agent_name in self.agents:
            del self.agents[agent_name]
            logger.info(f"Agent '{agent_name}' unregistered from communication bus")
    
    async def send_message(self, from_agent: str, to_agent: str, message_type: str, data: Any) -> Message:
        """Send a message from one agent to another."""
        message = Message(from_agent, to_agent, message_type, data)
        self.message_queue.append(message)
        
        logger.info(f"Message queued: {from_agent} -> {to_agent}: {message_type}")
        
        # Process message immediately if target agent is available
        if to_agent in self.agents:
            await self._process_message(message)
        
        return message
    
    async def broadcast_message(self, from_agent: str, message_type: str, data: Any) -> List[Message]:
        """Broadcast a message to all registered agents."""
        messages = []
        for agent_name in self.agents:
            if agent_name != from_agent:
                message = await self.send_message(from_agent, agent_name, message_type, data)
                messages.append(message)
        return messages
    
    async def _process_message(self, message: Message) -> None:
        """Process a message by delivering it to the target agent."""
        if message.to_agent not in self.agents:
            logger.warning(f"Target agent '{message.to_agent}' not found for message {message.id}")
            message.status = "failed"
            return
        
        try:
            target_agent = self.agents[message.to_agent]
            response = await target_agent.receive_message(message)
            
            message.status = "delivered"
            message.response = response
            
            logger.info(f"Message {message.id} delivered to {message.to_agent}")
            
        except Exception as e:
            logger.error(f"Error processing message {message.id}: {str(e)}")
            message.status = "error"
            message.response = {"error": str(e)}
    
    async def start(self) -> None:
        """Start the communication bus."""
        self._running = True
        logger.info("Agent Communication Bus started")
        
        # Process queued messages
        while self._running:
            if self.message_queue:
                message = self.message_queue.pop(0)
                await self._process_message(message)
                
                # Store message in history
                if hasattr(message, 'id'):
                    self.message_history.append(message)
                
                # Limit history size
                if len(self.message_history) > 1000:
                    self.message_history = self.message_history[-500:]
            
            await asyncio.sleep(0.1)
    
    async def stop(self) -> None:
        """Stop the communication bus."""
        self._running = False
        logger.info("Agent Communication Bus stopped")
    
    def get_agent_status(self) -> Dict[str, str]:
        """Get status of all registered agents."""
        return {name: "registered" for name in self.agents.keys()}
    
    def get_message_stats(self) -> Dict[str, int]:
        """Get message statistics."""
        return {
            'queued': len(self.message_queue),
            'history': len(self.message_history),
            'agents': len(self.agents)
        }

class BaseAgent(ABC):
    """Base class for all agents in the system."""
    
    def __init__(self, name: str, communication_bus: AgentCommunicationBus):
        self.name = name
        self.communication_bus = communication_bus
        self.state: Dict[str, Any] = {}
        self.message_handlers: Dict[str, callable] = {}
        self.metrics: Dict[str, Any] = {}
        
        # Register with communication bus
        self.communication_bus.register_agent(self)
        
        # Register default message handlers
        self._register_default_handlers()
        
        logger.info(f"Agent '{name}' initialized")
    
    def _register_default_handlers(self) -> None:
        """Register default message handlers."""
        self.message_handlers.update({
            'GET_STATUS': self._handle_get_status,
            'GET_METRICS': self._handle_get_metrics,
            'UPDATE_STATE': self._handle_update_state,
        })
    
    async def send_message(self, target_agent: str, message_type: str, data: Any) -> Message:
        """Send a message to another agent."""
        return await self.communication_bus.send_message(self.name, target_agent, message_type, data)
    
    async def broadcast_message(self, message_type: str, data: Any) -> List[Message]:
        """Broadcast a message to all other agents."""
        return await self.communication_bus.broadcast_message(self.name, message_type, data)
    
    async def receive_message(self, message: Message) -> Any:
        """Receive and process a message from another agent."""
        try:
            handler = self.message_handlers.get(message.message_type)
            if handler:
                response = await handler(message)
                logger.info(f"Agent '{self.name}' processed message: {message.message_type}")
                return response
            else:
                logger.warning(f"Agent '{self.name}' received unknown message type: {message.message_type}")
                return {"status": "unknown_message_type"}
        
        except Exception as e:
            logger.error(f"Agent '{self.name}' error processing message: {str(e)}")
            return {"status": "error", "error": str(e)}
    
    def register_message_handler(self, message_type: str, handler: callable) -> None:
        """Register a custom message handler."""
        self.message_handlers[message_type] = handler
        logger.info(f"Agent '{self.name}' registered handler for message type: {message_type}")
    
    async def _handle_get_status(self, message: Message) -> Dict[str, Any]:
        """Handle status request messages."""
        return {
            "agent": self.name,
            "status": "running",
            "state": self.state,
            "timestamp": datetime.now().isoformat()
        }
    
    async def _handle_get_metrics(self, message: Message) -> Dict[str, Any]:
        """Handle metrics request messages."""
        return {
            "agent": self.name,
            "metrics": self.metrics,
            "timestamp": datetime.now().isoformat()
        }
    
    async def _handle_update_state(self, message: Message) -> Dict[str, Any]:
        """Handle state update messages."""
        if isinstance(message.data, dict):
            self.state.update(message.data)
            return {"status": "success", "updated_state": message.data}
        return {"status": "error", "message": "Invalid state data"}
    
    @abstractmethod
    async def start(self) -> None:
        """Start the agent."""
        pass
    
    @abstractmethod
    async def stop(self) -> None:
        """Stop the agent."""
        pass
    
    def update_metric(self, metric_name: str, value: Any) -> None:
        """Update a metric value."""
        self.metrics[metric_name] = {
            'value': value,
            'timestamp': datetime.now().isoformat()
        }
    
    def get_metric(self, metric_name: str) -> Any:
        """Get a metric value."""
        metric = self.metrics.get(metric_name)
        return metric['value'] if metric else None
    
    def __repr__(self):
        return f"{self.__class__.__name__}(name='{self.name}')"
