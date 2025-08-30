import { test, expect } from '@playwright/test';
import axios from 'axios';

const FEEDBACK_AGENTS_URL = 'http://localhost:8002';

test.describe('@api System API E2E Tests', () => {
  test('should get system health status', async () => {
    const response = await axios.get(`${FEEDBACK_AGENTS_URL}/system/health`);
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('overall_status');
    expect(response.data).toHaveProperty('agents');
    expect(response.data).toHaveProperty('databases');
    expect(response.data).toHaveProperty('timestamp');
    
    // Verify overall status is valid
    expect(['healthy', 'degraded', 'error']).toContain(response.data.overall_status);
    
    // Verify agents object structure
    expect(typeof response.data.agents).toBe('object');
    expect(Object.keys(response.data.agents).length).toBeGreaterThan(0);
    
    // Verify databases object structure
    expect(typeof response.data.databases).toBe('object');
  });

  test('should get agent status information', async () => {
    const response = await axios.get(`${FEEDBACK_AGENTS_URL}/agents/status`);
    
    expect(response.status).toBe(200);
    expect(typeof response.data).toBe('object');
    expect(Object.keys(response.data).length).toBeGreaterThan(0);
    
    // Verify each agent has required properties
    for (const [agentName, agentData] of Object.entries(response.data)) {
      expect(agentData).toHaveProperty('agent_name');
      expect(agentData).toHaveProperty('status');
      expect(agentData).toHaveProperty('metrics');
      expect(agentData).toHaveProperty('timestamp');
      
      // Verify agent name matches the key
      expect(agentData.agent_name).toBe(agentName);
      
      // Verify status is valid
      expect(['running', 'stopped', 'error', 'unknown']).toContain(agentData.status);
      
      // Verify metrics is an object
      expect(typeof agentData.metrics).toBe('object');
    }
  });

  test('should get enhanced KB statistics', async () => {
    const response = await axios.get(`${FEEDBACK_AGENTS_URL}/enhanced-kb/stats`);
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('total_solutions');
    expect(response.data).toHaveProperty('by_source');
    expect(response.data).toHaveProperty('avg_confidence_score');
    expect(response.data).toHaveProperty('avg_feedback_score');
    expect(response.data).toHaveProperty('total_usage_count');
    expect(response.data).toHaveProperty('timestamp');
    
    // Verify numeric properties are numbers
    expect(typeof response.data.total_solutions).toBe('number');
    expect(typeof response.data.avg_confidence_score).toBe('number');
    expect(typeof response.data.avg_feedback_score).toBe('number');
    expect(typeof response.data.total_usage_count).toBe('number');
    
    // Verify by_source structure
    expect(response.data.by_source).toHaveProperty('ai_generated');
    expect(response.data.by_source).toHaveProperty('human_feedback');
    expect(response.data.by_source).toHaveProperty('hybrid');
  });

  test('should get solutions by category', async () => {
    const response = await axios.get(`${FEEDBACK_AGENTS_URL}/enhanced-kb/solutions/technical`, {
      params: { limit: 10 }
    });
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    
    // Verify solution structure if solutions exist
    if (response.data.length > 0) {
      const solution = response.data[0];
      expect(solution).toHaveProperty('id');
      expect(solution).toHaveProperty('solution_text');
      expect(solution).toHaveProperty('category');
      expect(solution).toHaveProperty('confidence_score');
    }
  });

  test('should get high priority solutions', async () => {
    const response = await axios.get(`${FEEDBACK_AGENTS_URL}/enhanced-kb/solutions`, {
      params: { limit: 5 }
    });
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeLessThanOrEqual(5);
    
    // Verify solution structure if solutions exist
    if (response.data.length > 0) {
      const solution = response.data[0];
      expect(solution).toHaveProperty('id');
      expect(solution).toHaveProperty('solution_text');
      expect(solution).toHaveProperty('priority');
      expect(solution).toHaveProperty('confidence_score');
    }
  });

  test('should handle invalid category gracefully', async () => {
    const response = await axios.get(`${FEEDBACK_AGENTS_URL}/enhanced-kb/solutions/invalid-category`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    // Should return empty array for invalid category
    expect(response.data.length).toBe(0);
  });

  test('should handle pagination parameters correctly', async () => {
    // Test with different limit values
    const limits = [1, 5, 10, 20];
    
    for (const limit of limits) {
      const response = await axios.get(`${FEEDBACK_AGENTS_URL}/enhanced-kb/solutions`, {
        params: { limit }
      });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeLessThanOrEqual(limit);
    }
  });

  test('should return consistent data structure across calls', async () => {
    // Make multiple calls to ensure consistency
    const responses = await Promise.all([
      axios.get(`${FEEDBACK_AGENTS_URL}/system/health`),
      axios.get(`${FEEDBACK_AGENTS_URL}/agents/status`),
      axios.get(`${FEEDBACK_AGENTS_URL}/enhanced-kb/stats`)
    ]);
    
    responses.forEach(response => {
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
    });
    
    // Verify system health consistency
    const health1 = responses[0].data;
    const health2 = await axios.get(`${FEEDBACK_AGENTS_URL}/system/health`).then(r => r.data);
    
    expect(health1.overall_status).toBe(health2.overall_status);
    expect(Object.keys(health1.agents)).toEqual(Object.keys(health2.agents));
  });

  test('should handle concurrent API requests', async () => {
    const concurrentRequests = [
      axios.get(`${FEEDBACK_AGENTS_URL}/system/health`),
      axios.get(`${FEEDBACK_AGENTS_URL}/agents/status`),
      axios.get(`${FEEDBACK_AGENTS_URL}/enhanced-kb/stats`),
      axios.get(`${FEEDBACK_AGENTS_URL}/enhanced-kb/solutions/technical`),
      axios.get(`${FEEDBACK_AGENTS_URL}/feedback/stats`)
    ];
    
    const responses = await Promise.all(concurrentRequests);
    
    responses.forEach(response => {
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
    });
  });

  test('should return proper error for invalid endpoints', async () => {
    try {
      await axios.get(`${FEEDBACK_AGENTS_URL}/invalid-endpoint`);
      throw new Error('Expected request to fail');
    } catch (error: any) {
      expect(error.response.status).toBe(404);
    }
  });

  test('should handle health check endpoint', async () => {
    const response = await axios.get(`${FEEDBACK_AGENTS_URL}/health`);
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('status');
    expect(response.data).toHaveProperty('service');
    expect(response.data).toHaveProperty('timestamp');
    
    expect(response.data.status).toBe('healthy');
    expect(response.data.service).toBe('CSKB Feedback Agents API');
  });
});
