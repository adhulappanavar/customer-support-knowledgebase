import React, { useState, useEffect } from 'react';
import { Users, Activity, TrendingUp, BarChart3, RefreshCw } from 'lucide-react';
import { systemAPI } from '../services/api';
import { AgentStatus as AgentStatusType } from '../types';
import toast from 'react-hot-toast';

const AgentStatusPage: React.FC = () => {
  const [agentStatus, setAgentStatus] = useState<Record<string, AgentStatusType> | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  useEffect(() => {
    fetchAgentStatus();
    const interval = setInterval(fetchAgentStatus, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAgentStatus = async () => {
    try {
      const data = await systemAPI.getAgentStatus();
      setAgentStatus(data);
    } catch (error) {
      console.error('Error fetching agent status:', error);
      toast.error('Failed to fetch agent status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'healthy':
        return 'text-success-600 bg-success-100';
      case 'warning':
        return 'text-warning-600 bg-warning-100';
      case 'error':
      case 'failed':
        return 'text-error-600 bg-error-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'healthy':
        return <Activity className="w-5 h-5 text-success-500" />;
      case 'warning':
        return <Activity className="w-5 h-5 text-warning-500" />;
      case 'error':
      case 'failed':
        return <Activity className="w-5 h-5 text-error-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatMetricValue = (value: any): string => {
    // Handle the new metrics structure with {value, timestamp}
    if (value && typeof value === 'object' && 'value' in value) {
      return formatMetricValue(value.value);
    }
    
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return String(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent Status</h1>
        <p className="text-gray-600">Monitor the performance and metrics of all AI agents in the system</p>
      </div>

      {/* Agent Overview */}
      {agentStatus && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Agents</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.keys(agentStatus).length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <Activity className="w-6 h-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Agents</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(agentStatus).filter(agent => 
                    agent.status.toLowerCase() === 'active' || agent.status.toLowerCase() === 'healthy'
                  ).length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded-lg">
                <Activity className="w-6 h-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Warning Agents</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(agentStatus).filter(agent => 
                    agent.status.toLowerCase() === 'warning'
                  ).length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-error-100 rounded-lg">
                <Activity className="w-6 h-6 text-error-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Error Agents</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(agentStatus).filter(agent => 
                    agent.status.toLowerCase() === 'error' || agent.status.toLowerCase() === 'failed'
                  ).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Agent List */}
      {agentStatus && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Agent Details</h2>
            <button
              onClick={fetchAgentStatus}
              className="btn-primary"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>

          <div className="space-y-4">
            {Object.entries(agentStatus).map(([name, agent]) => (
              <div key={name} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 capitalize">
                        {name.replace('_', ' ')}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Last updated: {new Date(agent.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(agent.status)}
                    <span className={`badge ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                    <button
                      onClick={() => setSelectedAgent(selectedAgent === name ? null : name)}
                      className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                    >
                      {selectedAgent === name ? 'Hide Details' : 'Show Details'}
                    </button>
                  </div>
                </div>

                {/* Agent Metrics */}
                {selectedAgent === name && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Metrics & Performance
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(agent.metrics).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {key.replace('_', ' ')}
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                              {formatMetricValue(value)}
                            </span>
                          </div>
                          
                          {/* Progress bar for numeric values */}
                          {typeof value === 'number' && value >= 0 && value <= 100 && (
                            <div className="mt-2 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  value >= 80 ? 'bg-success-500' :
                                  value >= 60 ? 'bg-warning-500' : 'bg-error-500'
                                }`}
                                style={{ width: `${value}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Agent Actions */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex space-x-3">
                        <button className="btn-secondary text-sm">
                          View Logs
                        </button>
                        <button className="btn-warning text-sm">
                          Restart Agent
                        </button>
                        <button className="btn-primary text-sm">
                          Configure
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Trends */}
      {agentStatus && (
        <div className="card mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
            Performance Trends
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(agentStatus).map(([name, agent]) => {
              const feedbackMetric = agent.metrics.feedback_collected?.value || agent.metrics.feedback_collected || 0;
              const learningMetric = agent.metrics.learning_triggers?.value || agent.metrics.learning_triggers || 0;
              const effectivenessMetric = agent.metrics.avg_effectiveness?.value || agent.metrics.avg_effectiveness || 0;
              
              return (
                <div key={name} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3 capitalize">
                    {name.replace('_', ' ')} Performance
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Feedback Collected</span>
                        <span className="font-medium">{feedbackMetric}</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: `${Math.min(feedbackMetric / 10 * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Learning Triggers</span>
                        <span className="font-medium">{learningMetric}</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-success-500 h-2 rounded-full"
                          style={{ width: `${Math.min(learningMetric / 10 * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Avg Effectiveness</span>
                        <span className="font-medium">{(effectivenessMetric * 10).toFixed(1)}/10</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            effectivenessMetric >= 0.8 ? 'bg-success-500' :
                            effectivenessMetric >= 0.6 ? 'bg-warning-500' : 'bg-error-500'
                          }`}
                          style={{ width: `${effectivenessMetric * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentStatusPage;
