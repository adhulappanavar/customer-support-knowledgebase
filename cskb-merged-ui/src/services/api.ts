import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const FEEDBACK_AGENTS_URL = process.env.REACT_APP_FEEDBACK_AGENTS_URL || 'http://localhost:8002';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
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
  human_solution: string;
  feedback_type: string;
  effectiveness_score: number;
  user_role: string;
  timestamp: string;
  context: string;
  comments: string;
  learning_priority: number;
  query_hash: string;
  category: string;
  tags: string[];
}

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

export interface TicketResolutionRequest {
  ticket_id: string;
  query: string;
  priority?: string;
  category?: string;
}

export interface TicketResolutionResponse {
  success: boolean;
  ticket_id: string;
  resolution_id?: string;
  error?: string;
  ai_response?: {
    answer: string;
    confidence: number;
    sources: string[];
  };
}

export interface KnowledgeQueryRequest {
  query: string;
  category?: string;
  limit?: number;
}

export interface KnowledgeQueryResponse {
  solutions: Array<{
    id: string;
    content: string;
    confidence: number;
    category: string;
    tags: string[];
  }>;
  total_count: number;
}

// API methods
export const feedbackAPI = {
  // Submit feedback
  submitFeedback: async (data: FeedbackRequest): Promise<FeedbackResponse> => {
    const response = await axios.post(`${FEEDBACK_AGENTS_URL}/feedback`, data);
    return response.data;
  },

  // Get feedback by ticket ID
  getFeedbackByTicket: async (ticketId: string): Promise<FeedbackEntry[]> => {
    const response = await axios.get(`${FEEDBACK_AGENTS_URL}/feedback/${ticketId}`);
    return response.data;
  },

  // Get all feedback entries
  getAllFeedback: async (limit: number = 100, offset: number = 0): Promise<FeedbackEntry[]> => {
    const response = await axios.get(`${FEEDBACK_AGENTS_URL}/feedback`, {
      params: { limit, offset }
    });
    return response.data;
  },

  // Get feedback statistics
  getFeedbackStats: async (): Promise<any> => {
    const response = await axios.get(`${FEEDBACK_AGENTS_URL}/feedback/stats`);
    return response.data;
  },
};

export const agentAPI = {
  // Get agent status
  getAgentStatus: async (): Promise<Record<string, AgentStatus>> => {
    const response = await axios.get(`${FEEDBACK_AGENTS_URL}/agents/status`);
    return response.data;
  },
};

export const systemAPI = {
  // Get system health
  getSystemHealth: async (): Promise<SystemHealth> => {
    const response = await axios.get(`${FEEDBACK_AGENTS_URL}/system/health`);
    return response.data;
  },

  // Get agent status
  getAgentStatus: async (): Promise<Record<string, AgentStatus>> => {
    const response = await axios.get(`${FEEDBACK_AGENTS_URL}/agents/status`);
    return response.data;
  },

  // Get health check
  getHealth: async (): Promise<any> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export const workflowAPI = {
  // Create ticket resolution
  createTicketResolution: async (ticketId: string, query: string): Promise<TicketResolutionResponse> => {
    const response = await api.post('/workflow/ticket-resolution', {
      ticket_id: ticketId,
      query: query
    });
    return response.data;
  },

  // Submit ticket feedback
  submitTicketFeedback: async (ticketId: string, feedback: FeedbackRequest): Promise<{ success: boolean; error?: string }> => {
    const response = await api.post(`/workflow/ticket-feedback/${ticketId}`, feedback);
    return response.data;
  },

  // Get workflow status
  getWorkflowStatus: async (workflowId: string): Promise<any> => {
    const response = await api.get(`/workflow/status/${workflowId}`);
    return response.data;
  },
};

export const knowledgeAPI = {
  // Query knowledge base
  queryKnowledge: async (request: KnowledgeQueryRequest): Promise<KnowledgeQueryResponse> => {
    const response = await api.post('/knowledge/query', request);
    return response.data;
  },

  // Get knowledge categories
  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/knowledge/categories');
    return response.data;
  },
};

export const enhancedKBAPI = {
  // Get enhanced KB statistics
  getStats: async (): Promise<EnhancedKBStats> => {
    const response = await axios.get(`${FEEDBACK_AGENTS_URL}/enhanced-kb/stats`);
    return response.data;
  },

  // Get solutions by category
  getSolutionsByCategory: async (category: string, limit: number = 50): Promise<any[]> => {
    const response = await axios.get(`${FEEDBACK_AGENTS_URL}/enhanced-kb/solutions/${category}`, {
      params: { limit }
    });
    return response.data;
  },

  // Get high priority solutions
  getHighPrioritySolutions: async (limit: number = 20): Promise<any[]> => {
    const response = await axios.get(`${FEEDBACK_AGENTS_URL}/enhanced-kb/solutions`, {
      params: { limit }
    });
    return response.data;
  },
};

export default api;
