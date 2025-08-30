// API Response Types
export interface APIResponse<T = any> {
  data?: T;
  error?: string;
  status: string;
}

// Knowledge Base Types (from cskb-api)
export interface QueryRequest {
  query: string;
  user_id?: string;
  max_results?: number;
}

export interface QueryResponse {
  answer: string;
  sources: string[];
  confidence: number;
  metadata?: any;
}

export interface DocumentInfo {
  id: string;
  name: string;
  category?: string;
  uploaded_at: string;
  size: number;
}

// Feedback Types (from cskb-feedback-agents)
export interface FeedbackRequest {
  ticket_id: string;
  ai_solution: string;
  human_solution?: string;
  feedback_type: 'PERFECT' | 'MINOR_CHANGES' | 'NEW_SOLUTION';
  user_role: string;
  comments: string;
  context?: Record<string, any>;
}

export interface FeedbackResponse {
  feedback_id: number;
  effectiveness_score: number;
  learning_priority: number;
  status: string;
}

export interface FeedbackEntry {
  id: number;
  ticket_id: string;
  ai_solution: string;
  human_solution?: string;
  feedback_type: string;
  effectiveness_score: number;
  user_role: string;
  timestamp: string;
  context?: string;
  comments?: string;
  learning_priority: number;
  query_hash: string;
  category?: string;
  tags?: string[];
}

// Enhanced Knowledge Base Types
export interface EnhancedKBStats {
  total_solutions: number;
  by_source: {
    ai_generated: number;
    human_feedback: number;
    hybrid: number;
  };
  avg_confidence_score: number;
  avg_feedback_score: number;
  total_usage_count: number;
  timestamp: string;
}

export interface SolutionEntry {
  id: string;
  query_hash: string;
  solution_text: string;
  context: string;
  feedback_score: number;
  usage_count: number;
  created_at: string;
  updated_at: string;
  confidence_score: number;
  source: string;
  tags: string[];
  similarity_group: string;
  category: string;
  priority: number;
  version: number;
  parent_solution_id?: string;
  metadata: string;
}

// Agent Status Types
export interface AgentStatus {
  agent_name: string;
  status: string;
  metrics: Record<string, any>;
  timestamp: string;
}

export interface SystemHealth {
  overall_status: string;
  agents: Record<string, AgentStatus>;
  databases: Record<string, string>;
  timestamp: string;
}

// Ticket Resolution Types
export interface TicketResolution {
  ticket_id: string;
  query: string;
  ai_solution: string;
  confidence: number;
  sources: string[];
  feedback?: FeedbackRequest;
  status: 'pending' | 'resolved' | 'feedback_collected' | 'learning_triggered';
  created_at: string;
  updated_at: string;
}

// Workflow Types
export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  data?: any;
  timestamp: string;
}

export interface MergedWorkflow {
  id: string;
  ticket_id: string;
  steps: WorkflowStep[];
  current_step: number;
  status: 'active' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

