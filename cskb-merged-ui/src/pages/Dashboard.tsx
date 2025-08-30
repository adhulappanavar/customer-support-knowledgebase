import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  TrendingUp, 
  Activity, 
  Brain,
  Plus,
  Search,
  BarChart3,
  Workflow,
  Users
} from 'lucide-react';
import { systemAPI, workflowAPI } from '../services/api';
import { SystemHealth, AgentStatus } from '../types';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [agentStatus, setAgentStatus] = useState<Record<string, AgentStatus> | null>(null);
  const [loading, setLoading] = useState(true);
  const [ticketId, setTicketId] = useState('');
  const [ticketQuery, setTicketQuery] = useState('');
  const [workflowStatus, setWorkflowStatus] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [health, status] = await Promise.all([
          systemAPI.getSystemHealth(),
          systemAPI.getAgentStatus()
        ]);
        setSystemHealth(health);
        setAgentStatus(status);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCreateTicket = async () => {
    if (!ticketId || !ticketQuery) {
      toast.error('Please provide both Ticket ID and Query');
      return;
    }

    try {
      const result = await workflowAPI.createTicketResolution(ticketId, ticketQuery);
      if (result.success) {
        setWorkflowStatus(result);
        toast.success('Ticket resolution created successfully!');
        setTicketId('');
        setTicketQuery('');
      } else {
        toast.error(result.error || 'Failed to create ticket resolution');
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create ticket resolution');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'active':
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">CSKB Merged Workflow Dashboard</h1>
        <p className="text-gray-600">Monitor and manage integrated ticket resolution, feedback collection, and knowledge base workflows</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-primary-600" />
            Create New Ticket Resolution
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ticket ID
              </label>
              <input
                type="text"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                placeholder="e.g., TICKET-001"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Query
              </label>
              <textarea
                value={ticketQuery}
                onChange={(e) => setTicketQuery(e.target.value)}
                placeholder="Describe the customer's issue or question..."
                rows={3}
                className="input-field"
              />
            </div>
            <button
              onClick={handleCreateTicket}
              className="btn-primary w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Ticket Resolution
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Workflow className="w-5 h-5 mr-2 text-primary-600" />
            Workflow Status
          </h3>
          {workflowStatus ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Ticket ID:</span>
                <span className="text-sm font-medium">{workflowStatus.ticket_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`badge ${getStatusColor(workflowStatus.ai_response ? 'completed' : 'pending')}`}>
                  {workflowStatus.ai_response ? 'Completed' : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Confidence:</span>
                <span className="text-sm font-medium">
                  {workflowStatus.ai_response ? `${(workflowStatus.ai_response.confidence * 100).toFixed(1)}%` : 'N/A'}
                </span>
              </div>
              {workflowStatus.ai_response && (
                <div className="pt-2">
                  <button
                    onClick={() => setWorkflowStatus(null)}
                    className="btn-secondary w-full text-sm"
                  >
                    Clear Status
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Workflow className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No active workflow</p>
              <p className="text-sm">Create a ticket resolution to see workflow status</p>
            </div>
          )}
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">System Status</p>
              <p className={`text-lg font-semibold ${getStatusColor(systemHealth?.overall_status || 'unknown')}`}>
                {systemHealth?.overall_status || 'Unknown'}
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
              <p className="text-lg font-semibold text-gray-900">
                {agentStatus ? Object.keys(agentStatus).length : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Brain className="w-6 h-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Knowledge Base</p>
              <p className="text-lg font-semibold text-gray-900">Enhanced</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Learning Mode</p>
              <p className="text-lg font-semibold text-success-600">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Status Overview */}
      {agentStatus && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-primary-600" />
            Agent Status Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(agentStatus).map(([name, status]) => (
              <div key={name} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 capitalize">{name.replace('_', ' ')}</h4>
                  <span className={`badge ${getStatusColor(status.status)}`}>
                    {status.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Metrics: {Object.keys(status.metrics).length}</p>
                  <p>Last Update: {new Date(status.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

