import asyncio
import json
import hashlib
from datetime import datetime
from typing import Dict, List, Optional, Any
from agents.base_agent import BaseAgent, Message
from data.enhanced_knowledge_base import EnhancedKnowledgeBase
from data.feedback_database import FeedbackDatabase
import structlog

logger = structlog.get_logger()

class LearningAgent(BaseAgent):
    """Agent responsible for learning from feedback and populating the knowledge base."""
    
    def __init__(self, communication_bus, enhanced_kb: EnhancedKnowledgeBase, feedback_db: FeedbackDatabase):
        super().__init__("learning_agent", communication_bus)
        self.enhanced_kb = enhanced_kb
        self.feedback_db = feedback_db
        self.learning_metrics = {
            'solutions_processed': 0,
            'knowledge_gaps_identified': 0,
            'patterns_discovered': 0,
            'last_learning_cycle': None
        }
        
        # Register message handlers
        self.register_message_handler('PROCESS_FEEDBACK', self._handle_process_feedback)
        self.register_message_handler('ANALYZE_PATTERNS', self._handle_analyze_patterns)
        self.register_message_handler('UPDATE_KNOWLEDGE_BASE', self._handle_update_knowledge_base)
    
    async def _handle_process_feedback(self, message: Message) -> Dict[str, Any]:
        """Process new feedback and extract learning insights."""
        try:
            message_data = message.data
            logger.info(f"Processing feedback for learning: {message_data.get('feedback_id')}")
            
            # Extract the actual feedback data from the message
            feedback_data = message_data.get('feedback', message_data)
            
            # Extract learning insights from feedback
            insights = self._extract_learning_insights(feedback_data)
            
            # Update knowledge base with new insights
            await self._update_knowledge_base(insights)
            
            # Update learning metrics
            self.learning_metrics['solutions_processed'] += 1
            self.learning_metrics['last_learning_cycle'] = datetime.now().isoformat()
            
            logger.info(f"Feedback processed successfully, insights extracted: {len(insights)}")
            
            return {
                'status': 'success',
                'insights_extracted': len(insights),
                'knowledge_updated': True
            }
            
        except Exception as e:
            logger.error(f"Error processing feedback for learning: {str(e)}")
            return {'status': 'error', 'error': str(e)}
    
    def _extract_learning_insights(self, feedback_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract learning insights from feedback data."""
        insights = []
        
        # Extract solution insights
        if feedback_data.get('human_solution'):
            solution_insight = {
                'type': 'solution_improvement',
                'original_solution': feedback_data['ai_solution'],
                'improved_solution': feedback_data['human_solution'],
                'feedback_type': feedback_data['feedback_type'],
                'effectiveness_score': feedback_data.get('effectiveness_score', 0.0),
                'category': feedback_data.get('category', 'general'),
                'priority': feedback_data.get('learning_priority', 5),
                'context': feedback_data.get('context', {}),
                'tags': feedback_data.get('tags', []),
                'timestamp': datetime.now().isoformat()
            }
            insights.append(solution_insight)
        
        # Extract pattern insights
        pattern_insight = {
            'type': 'feedback_pattern',
            'feedback_type': feedback_data['feedback_type'],
            'category': feedback_data.get('category', 'general'),
            'user_role': feedback_data.get('user_role', 'user'),
            'effectiveness_score': feedback_data.get('effectiveness_score', 0.0),
            'frequency': 1,
            'timestamp': datetime.now().isoformat()
        }
        insights.append(pattern_insight)
        
        # Extract knowledge gap insights
        if feedback_data['feedback_type'] in ['MINOR_CHANGES', 'NEW_SOLUTION']:
            gap_insight = {
                'type': 'knowledge_gap',
                'category': feedback_data.get('category', 'general'),
                'description': f"AI solution needs improvement for {feedback_data.get('category', 'general')} issues",
                'severity': 'high' if feedback_data['feedback_type'] == 'NEW_SOLUTION' else 'medium',
                'feedback_count': 1,
                'timestamp': datetime.now().isoformat()
            }
            insights.append(gap_insight)
        
        return insights
    
    async def _update_knowledge_base(self, insights: List[Dict[str, Any]]) -> None:
        """Update the enhanced knowledge base with new insights."""
        try:
            for insight in insights:
                if insight['type'] == 'solution_improvement':
                    # Store improved solution
                    solution_data = {
                        'id': self._generate_solution_id(insight),
                        'query_hash': self._generate_query_hash(insight['original_solution'], insight['context']),
                        'solution_text': insight['improved_solution'],
                        'context': json.dumps(insight['context']),
                        'feedback_score': insight['effectiveness_score'],
                        'usage_count': 1,
                        'created_at': datetime.now(),
                        'updated_at': datetime.now(),
                        'confidence_score': insight['effectiveness_score'],
                        'source': 'human_feedback',
                        'tags': json.dumps(insight['tags']),
                        'similarity_group': insight['category'],
                        'category': insight['category'],
                        'priority': insight['priority'],
                        'version': 1,
                        'parent_solution_id': None,
                        'metadata': json.dumps({
                            'feedback_type': insight['feedback_type'],
                            'user_role': insight.get('user_role', 'user'),
                            'original_solution': insight['original_solution']
                        })
                    }
                    
                    # Add to enhanced KB
                    self.enhanced_kb.add_solution(solution_data)
                    
                elif insight['type'] == 'knowledge_gap':
                    # Update knowledge gap tracking
                    self.enhanced_kb.update_knowledge_gap(insight)
            
            logger.info(f"Knowledge base updated with {len(insights)} insights")
            
        except Exception as e:
            logger.error(f"Error updating knowledge base: {str(e)}")
            raise
    
    def _generate_solution_id(self, insight: Dict[str, Any]) -> str:
        """Generate a unique solution ID."""
        content = f"{insight['improved_solution']}:{insight['category']}:{insight['timestamp']}"
        return hashlib.sha256(content.encode()).hexdigest()[:16]
    
    def _generate_query_hash(self, solution: str, context: Dict[str, Any]) -> str:
        """Generate a hash for the query context."""
        context_str = json.dumps(context, sort_keys=True) if context else ""
        combined = f"{solution[:100]}:{context_str}".lower().strip()
        return hashlib.sha256(combined.encode()).hexdigest()[:16]
    
    async def _handle_analyze_patterns(self, message: Message) -> Dict[str, Any]:
        """Analyze feedback patterns and identify trends."""
        try:
            logger.info("Starting pattern analysis...")
            
            # Get feedback statistics
            stats = self.feedback_db.get_feedback_statistics()
            
            # Identify patterns
            patterns = self._identify_patterns(stats)
            
            # Update learning metrics
            self.learning_metrics['patterns_discovered'] += len(patterns)
            
            logger.info(f"Pattern analysis complete, {len(patterns)} patterns identified")
            
            return {
                'status': 'success',
                'patterns': patterns,
                'total_patterns': len(patterns)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing patterns: {str(e)}")
            return {'status': 'error', 'error': str(e)}
    
    def _identify_patterns(self, stats: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Identify patterns in feedback data."""
        patterns = []
        
        # Analyze feedback type distribution
        if 'feedback_type_distribution' in stats:
            for feedback_type, count in stats['feedback_type_distribution'].items():
                if feedback_type != 'PERFECT' and count > 2:
                    patterns.append({
                        'type': 'high_failure_rate',
                        'feedback_type': feedback_type,
                        'frequency': count,
                        'severity': 'high' if count > 5 else 'medium'
                    })
        
        # Analyze category performance
        if 'category_performance' in stats:
            for category, performance in stats['category_performance'].items():
                if performance.get('avg_effectiveness', 1.0) < 0.7:
                    patterns.append({
                        'type': 'low_performance_category',
                        'category': category,
                        'avg_effectiveness': performance.get('avg_effectiveness', 0.0),
                        'feedback_count': performance.get('count', 0)
                    })
        
        return patterns
    
    async def _handle_update_knowledge_base(self, message: Message) -> Dict[str, Any]:
        """Trigger a comprehensive knowledge base update."""
        try:
            logger.info("Starting comprehensive knowledge base update...")
            
            # Get all recent feedback
            recent_feedback = self.feedback_db.get_all_feedback(limit=100, offset=0)
            
            # Process each feedback entry
            total_insights = 0
            for feedback in recent_feedback:
                insights = self._extract_learning_insights(feedback)
                await self._update_knowledge_base(insights)
                total_insights += len(insights)
            
            logger.info(f"Knowledge base update complete, {total_insights} insights processed")
            
            return {
                'status': 'success',
                'total_insights': total_insights,
                'feedback_processed': len(recent_feedback)
            }
            
        except Exception as e:
            logger.error(f"Error updating knowledge base: {str(e)}")
            return {'status': 'error', 'error': str(e)}
    
    async def start(self) -> None:
        """Start the learning agent."""
        logger.info("Learning Agent started")
        self.state['status'] = 'running'
        self.state['started_at'] = datetime.now().isoformat()
    
    async def stop(self) -> None:
        """Stop the learning agent."""
        logger.info("Learning Agent stopped")
        self.state['status'] = 'stopped'
        self.state['stopped_at'] = datetime.now().isoformat()
    
    def get_agent_summary(self) -> Dict[str, Any]:
        """Get a summary of the learning agent's current state."""
        return {
            'agent_name': self.name,
            'status': self.state.get('status', 'unknown'),
            'metrics': {**self.metrics, **self.learning_metrics},
            'enhanced_kb_path': str(self.enhanced_kb.db_path) if self.enhanced_kb else None,
            'started_at': self.state.get('started_at'),
            'stopped_at': self.state.get('stopped_at')
        }
