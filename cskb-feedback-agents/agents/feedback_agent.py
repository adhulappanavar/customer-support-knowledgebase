import hashlib
import json
from datetime import datetime
from typing import Dict, List, Optional, Any
from agents.base_agent import BaseAgent, Message
from data.feedback_database import FeedbackDatabase
import structlog

logger = structlog.get_logger()

class FeedbackAgent(BaseAgent):
    """Agent responsible for collecting and processing user feedback."""
    
    def __init__(self, communication_bus, feedback_db: FeedbackDatabase):
        super().__init__("feedback_agent", communication_bus)
        self.feedback_db = feedback_db
        
        # Register custom message handlers
        self.register_message_handler('COLLECT_FEEDBACK', self._handle_collect_feedback)
        self.register_message_handler('GET_FEEDBACK_STATS', self._handle_get_feedback_stats)
        self.register_message_handler('ANALYZE_FEEDBACK_PATTERNS', self._handle_analyze_patterns)
        
        # Initialize metrics from database
        self._initialize_metrics()
        
        logger.info("Feedback Agent initialized")
    
    def _initialize_metrics(self) -> None:
        """Initialize metrics with actual database counts."""
        try:
            # Get total feedback count from database
            all_feedback = self.feedback_db.get_all_feedback(limit=1000, offset=0)
            total_feedback = len(all_feedback)
            
            # Calculate average effectiveness from existing feedback
            if total_feedback > 0:
                total_effectiveness = sum(f.get('effectiveness_score', 0.0) for f in all_feedback)
                avg_effectiveness = total_effectiveness / total_feedback
            else:
                avg_effectiveness = 0.0
            
            # Count learning triggers (non-perfect feedback)
            learning_triggers = sum(1 for f in all_feedback if f.get('feedback_type') != 'PERFECT')
            
            # Update metrics with actual values
            self.update_metric('feedback_collected', total_feedback)
            self.update_metric('learning_triggers', learning_triggers)
            self.update_metric('avg_effectiveness', avg_effectiveness)
            
            logger.info(f"Metrics initialized: feedback={total_feedback}, learning_triggers={learning_triggers}, avg_effectiveness={avg_effectiveness:.2f}")
            
        except Exception as e:
            logger.error(f"Error initializing metrics: {str(e)}")
            # Fallback to default values
            self.update_metric('feedback_collected', 0)
            self.update_metric('learning_triggers', 0)
            self.update_metric('avg_effectiveness', 0.0)
    
    async def collect_feedback(self, ticket_id: str, ai_solution: str, 
                              human_solution: Optional[str], feedback_type: str,
                              user_role: str = "user", comments: str = "",
                              context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Collect and store feedback from users."""
        try:
            # Calculate effectiveness score
            effectiveness_score = self._calculate_effectiveness(feedback_type, human_solution)
            
            # Generate query hash for learning
            query_hash = self._generate_query_hash(ai_solution, context)
            
            # Extract category and tags from context
            category = context.get('category', '') if context else ''
            tags = context.get('tags', []) if context else []
            
            # Calculate learning priority
            learning_priority = self._calculate_learning_priority(feedback_type, effectiveness_score, context)
            
            # Create feedback record
            feedback_data = {
                'ticket_id': ticket_id,
                'ai_solution': ai_solution,
                'human_solution': human_solution,
                'feedback_type': feedback_type,
                'effectiveness_score': effectiveness_score,
                'user_role': user_role,
                'context': json.dumps(context) if context else '',
                'comments': comments,
                'learning_priority': learning_priority,
                'query_hash': query_hash,
                'category': category,
                'tags': tags
            }
            
            # Store feedback in database
            feedback_id = self.feedback_db.store_feedback(feedback_data)
            
            # Update metrics
            self._update_feedback_metrics(feedback_data)
            
            # Trigger learning process if needed
            if feedback_type != 'PERFECT':
                await self._trigger_learning(feedback_id, feedback_data)
            
            # Store solution history if human solution provided
            if human_solution:
                self._store_solution_history(feedback_id, human_solution, feedback_type)
            
            logger.info(f"Feedback collected successfully: ID={feedback_id}, Type={feedback_type}, Score={effectiveness_score}")
            
            return {
                'feedback_id': feedback_id,
                'effectiveness_score': effectiveness_score,
                'learning_priority': learning_priority,
                'status': 'success'
            }
            
        except Exception as e:
            logger.error(f"Error collecting feedback: {str(e)}")
            return {
                'status': 'error',
                'error': str(e)
            }
    
    def _calculate_effectiveness(self, feedback_type: str, human_solution: Optional[str]) -> float:
        """Calculate effectiveness score based on feedback type and human solution."""
        base_scores = {
            'PERFECT': 1.0,
            'MINOR_CHANGES': 0.8,
            'NEW_SOLUTION': 0.6
        }
        
        base_score = base_scores.get(feedback_type, 0.5)
        
        # Adjust based on human solution quality if available
        if human_solution:
            quality_bonus = self._assess_solution_quality(human_solution)
            return min(1.0, base_score + quality_bonus)
        
        return base_score
    
    def _assess_solution_quality(self, solution: str) -> float:
        """Assess the quality of a human-provided solution."""
        # Simple heuristics for solution quality
        quality_score = 0.0
        
        # Length bonus (longer solutions tend to be more detailed)
        if len(solution) > 100:
            quality_score += 0.1
        if len(solution) > 200:
            quality_score += 0.1
        
        # Structure bonus (numbered lists, bullet points)
        if any(char in solution for char in ['1.', '2.', '3.', '-', '•']):
            quality_score += 0.1
        
        # Technical terms bonus
        technical_terms = ['configure', 'install', 'update', 'restart', 'check', 'verify']
        if any(term in solution.lower() for term in technical_terms):
            quality_score += 0.1
        
        # Action-oriented bonus
        action_words = ['do', 'run', 'execute', 'perform', 'complete', 'finish']
        if any(word in solution.lower() for word in action_words):
            quality_score += 0.1
        
        return min(0.3, quality_score)  # Cap at 0.3 bonus
    
    def _generate_query_hash(self, ai_solution: str, context: Optional[Dict[str, Any]]) -> str:
        """Generate a hash for the query context."""
        # Combine relevant context information
        context_str = ""
        if context:
            # Extract key information for hashing
            key_info = {
                'category': context.get('category', ''),
                'priority': context.get('priority', ''),
                'tags': sorted(context.get('tags', []))
            }
            context_str = json.dumps(key_info, sort_keys=True)
        
        # Combine AI solution and context for hashing
        combined = f"{ai_solution[:100]}:{context_str}".lower().strip()
        return hashlib.sha256(combined.encode()).hexdigest()[:16]
    
    def _calculate_learning_priority(self, feedback_type: str, effectiveness_score: float, 
                                   context: Optional[Dict[str, Any]]) -> int:
        """Calculate learning priority (1-10) for the feedback."""
        priority = 1  # Base priority
        
        # Feedback type priority
        type_priorities = {
            'PERFECT': 1,
            'MINOR_CHANGES': 5,
            'NEW_SOLUTION': 8
        }
        priority += type_priorities.get(feedback_type, 3)
        
        # Effectiveness score priority (lower effectiveness = higher priority)
        if effectiveness_score < 0.5:
            priority += 3
        elif effectiveness_score < 0.8:
            priority += 1
        
        # Context-based priority
        if context:
            # High priority categories
            high_priority_categories = ['critical', 'urgent', 'security', 'outage']
            if any(cat in context.get('category', '').lower() for cat in high_priority_categories):
                priority += 2
            
            # High priority tags
            high_priority_tags = ['escalation', 'urgent', 'critical', 'blocker']
            if any(tag in context.get('tags', []) for tag in high_priority_tags):
                priority += 1
        
        return min(10, priority)  # Cap at 10
    
    def _update_feedback_metrics(self, feedback_data: Dict[str, Any]) -> None:
        """Update feedback collection metrics."""
        # Increment feedback count
        current_count = self.get_metric('feedback_collected') or 0
        self.update_metric('feedback_collected', current_count + 1)
        
        # Update average effectiveness
        current_avg = self.get_metric('avg_effectiveness') or 0.0
        current_count = self.get_metric('feedback_collected') or 1
        
        new_avg = ((current_avg * (current_count - 1)) + feedback_data['effectiveness_score']) / current_count
        self.update_metric('avg_effectiveness', new_avg)
        
        # Update database metrics
        self.feedback_db.update_learning_metric(
            'feedback_collected_total', 
            current_count + 1,
            f"Feedback type: {feedback_data['feedback_type']}"
        )
    
    async def _trigger_learning(self, feedback_id: int, feedback_data: Dict[str, Any]) -> None:
        """Trigger the learning process for non-perfect feedback."""
        try:
            # Send message to learning agent
            await self.send_message('learning_agent', 'PROCESS_FEEDBACK', {
                'feedback_id': feedback_id,
                'feedback': feedback_data,
                'timestamp': datetime.now().isoformat()
            })
            
            # Update metrics
            current_triggers = self.get_metric('learning_triggers') or 0
            self.update_metric('learning_triggers', current_triggers + 1)
            
            logger.info(f"Learning triggered for feedback {feedback_id}")
            
        except Exception as e:
            logger.error(f"Error triggering learning for feedback {feedback_id}: {str(e)}")
    
    def _store_solution_history(self, feedback_id: int, human_solution: str, feedback_type: str) -> None:
        """Store human solution in solution history."""
        try:
            solution_data = {
                'solution_id': f"human_sol_{feedback_id}",
                'version': 1,
                'solution_text': human_solution,
                'feedback_id': feedback_id,
                'change_type': 'IMPROVED' if feedback_type == 'MINOR_CHANGES' else 'EXPANDED'
            }
            
            self.feedback_db.store_solution_history(solution_data)
            logger.info(f"Solution history stored for feedback {feedback_id}")
            
        except Exception as e:
            logger.error(f"Error storing solution history for feedback {feedback_id}: {str(e)}")
    
    async def _handle_collect_feedback(self, message: Message) -> Dict[str, Any]:
        """Handle feedback collection message from other agents."""
        try:
            data = message.data
            result = await self.collect_feedback(
                ticket_id=data['ticket_id'],
                ai_solution=data['ai_solution'],
                human_solution=data.get('human_solution'),
                feedback_type=data['feedback_type'],
                user_role=data.get('user_role', 'user'),
                comments=data.get('comments', ''),
                context=data.get('context')
            )
            
            return result
            
        except Exception as e:
            logger.error(f"Error handling feedback collection message: {str(e)}")
            return {'status': 'error', 'error': str(e)}
    
    async def _handle_get_feedback_stats(self, message: Message) -> Dict[str, Any]:
        """Handle request for feedback statistics."""
        try:
            stats = self.feedback_db.get_feedback_statistics()
            
            # Add agent-specific metrics
            stats['agent_metrics'] = {
                'feedback_collected': self.get_metric('feedback_collected'),
                'learning_triggers': self.get_metric('learning_triggers'),
                'avg_effectiveness': self.get_metric('avg_effectiveness')
            }
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting feedback statistics: {str(e)}")
            return {'status': 'error', 'error': str(e)}
    
    async def _handle_analyze_patterns(self, message: Message) -> Dict[str, Any]:
        """Handle request for feedback pattern analysis."""
        try:
            # Get failed solutions
            failed_solutions = self.feedback_db.get_failed_solutions()
            
            # Identify knowledge gaps
            knowledge_gaps = self.feedback_db.identify_knowledge_gaps()
            
            # Get feedback statistics
            stats = self.feedback_db.get_feedback_statistics()
            
            patterns = {
                'failed_solutions': failed_solutions,
                'knowledge_gaps': knowledge_gaps,
                'feedback_stats': stats,
                'analysis_timestamp': datetime.now().isoformat()
            }
            
            return patterns
            
        except Exception as e:
            logger.error(f"Error analyzing feedback patterns: {str(e)}")
            return {'status': 'error', 'error': str(e)}
    
    def get_feedback_by_ticket(self, ticket_id: str) -> List[Dict[str, Any]]:
        """Get all feedback for a specific ticket."""
        return self.feedback_db.get_feedback_by_ticket(ticket_id)
    
    def get_all_feedback(self, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        """Get all feedback entries with pagination."""
        return self.feedback_db.get_all_feedback(limit=limit, offset=offset)
    
    def get_feedback_by_id(self, feedback_id: int) -> Optional[Dict[str, Any]]:
        """Get feedback by ID."""
        return self.feedback_db.get_feedback(feedback_id)
    
    async def start(self) -> None:
        """Start the feedback agent."""
        logger.info("Feedback Agent started")
        self.state['status'] = 'running'
        self.state['started_at'] = datetime.now().isoformat()
    
    async def stop(self) -> None:
        """Stop the feedback agent."""
        logger.info("Feedback Agent stopped")
        self.state['status'] = 'stopped'
        self.state['stopped_at'] = datetime.now().isoformat()
    
    def get_agent_summary(self) -> Dict[str, Any]:
        """Get a summary of the feedback agent's current state."""
        return {
            'agent_name': self.name,
            'status': self.state.get('status', 'unknown'),
            'metrics': self.metrics,
            'feedback_db_path': str(self.feedback_db.db_path),
            'started_at': self.state.get('started_at'),
            'stopped_at': self.state.get('stopped_at')
        }
