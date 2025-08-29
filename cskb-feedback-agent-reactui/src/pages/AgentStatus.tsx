import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { agentAPI, AgentStatus as AgentStatusType } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AgentStatus: React.FC = () => {
  const [agentStatus, setAgentStatus] = useState<Record<string, AgentStatusType> | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<string>('');

  useEffect(() => {
    fetchAgentStatus();
    const interval = setInterval(fetchAgentStatus, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAgentStatus = async () => {
    try {
      const status = await agentAPI.getAgentStatus();
      setAgentStatus(status);
      if (!selectedAgent && Object.keys(status).length > 0) {
        setSelectedAgent(Object.keys(status)[0]);
      }
    } catch (error) {
      console.error('Error fetching agent status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running':
        return <CheckCircle className="w-5 h-5 text-success-600" />;
      case 'starting':
        return <Clock className="w-5 h-5 text-warning-600" />;
      case 'stopped':
      case 'error':
        return <AlertCircle className="w-5 h-5 text-error-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running':
        return 'text-success-600 bg-success-100';
      case 'starting':
        return 'text-warning-600 bg-warning-100';
      case 'stopped':
      case 'error':
        return 'text-error-600 bg-error-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatMetricValue = (metric: any) => {
    if (typeof metric === 'object' && metric.value !== undefined) {
      return metric.value;
    }
    return metric;
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return 'N/A';
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return timestamp;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Activity className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agent Status</h1>
          <p className="text-gray-600 mt-1">Monitor agent performance and system health</p>
        </div>
      </div>

      {/* Agent Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {agentStatus && Object.entries(agentStatus).map(([name, status]) => (
          <div key={name} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {name.replace('_', ' ').toUpperCase()}
              </h3>
              {getStatusIcon(status.status)}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`badge ${getStatusColor(status.status)}`}>
                  {status.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Update</span>
                <span className="text-sm text-gray-900">
                  {formatTimestamp(status.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Selection and Details */}
      {agentStatus && Object.keys(agentStatus).length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Agent Details</h3>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="input-field w-64"
            >
              {Object.keys(agentStatus).map(name => (
                <option key={name} value={name}>
                  {name.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {selectedAgent && agentStatus[selectedAgent] && (
            <div className="space-y-6">
              {/* Agent Metrics */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Performance Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(agentStatus[selectedAgent].metrics).map(([key, metric]) => (
                    <div key={key} className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        {key.replace('_', ' ').toUpperCase()}
                      </h5>
                      <p className="text-2xl font-bold text-primary-600">
                        {formatMetricValue(metric)}
                      </p>
                      {typeof metric === 'object' && metric.timestamp && (
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimestamp(metric.timestamp)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics Chart */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Metrics Trend</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={Object.entries(agentStatus[selectedAgent].metrics).map(([key, metric]) => ({
                        metric: key.replace('_', ' ').toUpperCase(),
                        value: formatMetricValue(metric)
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Communication Bus Metrics */}
              {selectedAgent === 'communication_bus' && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Communication Metrics</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { metric: 'Queued Messages', value: agentStatus[selectedAgent].metrics.queued || 0 },
                          { metric: 'Message History', value: agentStatus[selectedAgent].metrics.history || 0 },
                          { metric: 'Active Agents', value: agentStatus[selectedAgent].metrics.agents || 0 }
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="metric" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* System Health Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {agentStatus ? Object.keys(agentStatus).length : 0}
            </div>
            <div className="text-sm text-gray-600">Total Agents</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-success-600 mb-2">
              {agentStatus ? Object.values(agentStatus).filter(a => a.status === 'running').length : 0}
            </div>
            <div className="text-sm text-gray-600">Running Agents</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-warning-600 mb-2">
              {agentStatus ? Object.values(agentStatus).filter(a => a.status !== 'running').length : 0}
            </div>
            <div className="text-sm text-gray-600">Non-Running Agents</div>
          </div>
        </div>
      </div>

      {/* Agent Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary flex items-center justify-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Refresh Status</span>
          </button>
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>View Logs</span>
          </button>
          <button className="btn-warning flex items-center justify-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>Restart Agent</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentStatus;
