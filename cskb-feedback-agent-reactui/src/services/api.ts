import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8002';

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
  human_solution: string;
  feedback_type: 'PERFECT' | 'MINOR_CHANGES' | 'NEW_SOLUTION';
  user_role: string;
  comments: string;
  context: Record<string, any>;
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
  categories: string[];
  avg_confidence: number;
  last_updated: string;
}

// API methods
export const feedbackAPI = {
  // Submit feedback
  submitFeedback: async (data: FeedbackRequest): Promise<FeedbackResponse> => {
    const response = await api.post('/feedback', data);
    return response.data;
  },

  // Get feedback by ticket ID
  getFeedbackByTicket: async (ticketId: string): Promise<FeedbackEntry[]> => {
    const response = await api.get(`/feedback/${ticketId}`);
    return response.data;
  },

  // Get all feedback entries
  getAllFeedback: async (limit: number = 100, offset: number = 0): Promise<FeedbackEntry[]> => {
    const response = await api.get('/feedback', {
      params: { limit, offset }
    });
    return response.data;
  },

  // Get feedback statistics
  getFeedbackStats: async (): Promise<any> => {
    const response = await api.get('/feedback/stats');
    return response.data;
  },
};

export const agentAPI = {
  // Get agent status
  getAgentStatus: async (): Promise<Record<string, AgentStatus>> => {
    const response = await api.get('/agents/status');
    return response.data;
  },
};

export const systemAPI = {
  // Get system health
  getSystemHealth: async (): Promise<SystemHealth> => {
    const response = await api.get('/system/health');
    return response.data;
  },

  // Get health check
  getHealth: async (): Promise<any> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export const enhancedKBAPI = {
  // Get enhanced KB statistics
  getStats: async (): Promise<EnhancedKBStats> => {
    const response = await api.get('/enhanced-kb/stats');
    return response.data;
  },

  // Get solutions by category
  getSolutionsByCategory: async (category: string, limit: number = 50): Promise<any[]> => {
    const response = await api.get(`/enhanced-kb/solutions/${category}`, {
      params: { limit }
    });
    return response.data;
  },

  // Get high priority solutions
  getHighPrioritySolutions: async (limit: number = 20): Promise<any[]> => {
    const response = await api.get('/enhanced-kb/solutions', {
      params: { limit }
    });
    return response.data;
  },
};

export default api;
