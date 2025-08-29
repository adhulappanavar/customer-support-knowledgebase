import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  TrendingUp, 
  Activity, 
  Brain,
  Plus,
  Search,
  BarChart3
} from 'lucide-react';
import { systemAPI, agentAPI, feedbackAPI, enhancedKBAPI } from '../services/api';
import { SystemHealth, AgentStatus } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard: React.FC = () => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [agentStatus, setAgentStatus] = useState<Record<string, AgentStatus> | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTicket, setSearchTicket] = useState('');
  
  // Knowledge Base Query state
  const [queryType, setQueryType] = useState('enhanced-kb');
  const [queryCategory, setQueryCategory] = useState('');
  const [queryLimit, setQueryLimit] = useState(10);
  const [queryResults, setQueryResults] = useState<any>(null);
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryHistory, setQueryHistory] = useState<Array<{description: string, query: any}>>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [health, agents] = await Promise.all([
          systemAPI.getSystemHealth(),
          agentAPI.getAgentStatus()
        ]);
        setSystemHealth(health);
        setAgentStatus(agents);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'running':
        return 'text-success-600 bg-success-100';
      case 'degraded':
        return 'text-warning-600 bg-warning-100';
      case 'error':
      case 'stopped':
        return 'text-error-600 bg-error-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'running':
        return '🟢';
      case 'degraded':
        return '🟡';
      case 'error':
      case 'stopped':
        return '🔴';
      default:
        return '⚪';
    }
  };

  // Knowledge Base Query Functions
  const executeQuery = async (query: any) => {
    setIsQuerying(true);
    setQueryResults(null);
    
    console.log('Executing query:', query); // Debug log
    
    try {
      let data: any;
      let description = '';
      
      if (query.type === 'feedback') {
        if (query.ticketId) {
          console.log('Getting feedback for ticket:', query.ticketId); // Debug log
          data = await feedbackAPI.getFeedbackByTicket(query.ticketId);
          description = `Get feedback for ticket ${query.ticketId}`;
        } else {
          console.log('Getting all feedback with limit:', query.limit); // Debug log
          data = await feedbackAPI.getAllFeedback(query.limit || 10, 0);
          description = `Get ${query.limit || 10} feedback entries`;
        }
      } else if (query.type === 'enhanced-kb') {
        if (query.category) {
          console.log('Getting KB solutions for category:', query.category); // Debug log
          data = await enhancedKBAPI.getSolutionsByCategory(query.category, query.limit || 10);
          description = `Get ${query.limit || 10} ${query.category} solutions`;
        } else if (query.endpoint === 'stats') {
          console.log('Getting KB stats'); // Debug log
          data = await enhancedKBAPI.getStats();
          description = 'Get KB statistics';
        } else {
          console.log('Getting high priority KB solutions'); // Debug log
          data = await enhancedKBAPI.getHighPrioritySolutions(query.limit || 10);
          description = `Get ${query.limit || 10} solutions`;
        }
      }
      
      console.log('Query result data:', data); // Debug log
      setQueryResults(data);
      
      // Add to query history
      const historyItem = { description, query };
      setQueryHistory(prev => [historyItem, ...prev.slice(0, 4)]);
      
    } catch (error) {
      console.error('Query error:', error);
      setQueryResults({ error: 'Failed to execute query', details: error });
    } finally {
      setIsQuerying(false);
    }
  };

  const executeSampleQuery = (queryType: string) => {
    let query: any = {};
    
    switch (queryType) {
      case 'feedback-all':
        query = { type: 'feedback', limit: 10 };
        break;
      case 'feedback-ticket':
        query = { type: 'feedback', ticketId: 'TEST-001' };
        break;
      case 'kb-stats':
        query = { type: 'enhanced-kb', endpoint: 'stats' };
        break;
      case 'kb-solutions':
        query = { type: 'enhanced-kb', limit: 10 };
        break;
      case 'kb-technical':
        query = { type: 'enhanced-kb', category: 'technical', limit: 5 };
        break;
      case 'kb-network':
        query = { type: 'enhanced-kb', category: 'network', limit: 5 };
        break;
      default:
        return;
    }
    
    executeQuery(query);
  };

  const executeCustomQuery = () => {
    let query: any = {};
    
    if (queryType === 'feedback') {
      // For feedback queries, use category field as ticket ID if provided
      if (queryCategory) {
        query = {
          type: 'feedback',
          ticketId: queryCategory,
          limit: queryLimit
        };
      } else {
        query = {
          type: 'feedback',
          limit: queryLimit
        };
      }
    } else if (queryType === 'enhanced-kb') {
      query = {
        type: 'enhanced-kb',
        category: queryCategory || undefined,
        limit: queryLimit
      };
    }
    
    executeQuery(query);
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">CSKB Feedback Agents System Overview</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Feedback</span>
          </button>
        </div>
      </div>

      {/* Quick Search */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label htmlFor="ticket-search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Ticket Feedback
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                id="ticket-search"
                placeholder="Enter ticket ID..."
                value={searchTicket}
                onChange={(e) => setSearchTicket(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <button className="btn-primary mt-6">
            Search
          </button>
        </div>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Overall System Health */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Status</p>
              <p className={`text-2xl font-bold ${getStatusColor(systemHealth?.overall_status || 'unknown')}`}>
                {systemHealth?.overall_status || 'Unknown'}
              </p>
            </div>
            <div className="text-2xl">
              {getStatusIcon(systemHealth?.overall_status || 'unknown')}
            </div>
          </div>
        </div>

        {/* Feedback Collected */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Feedback Collected</p>
              <p className="text-2xl font-bold text-primary-600">
                {agentStatus?.feedback_agent?.metrics?.feedback_collected?.value || 0}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-primary-400" />
          </div>
        </div>

        {/* Learning Triggers */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Learning Triggers</p>
              <p className="text-2xl font-bold text-warning-600">
                {agentStatus?.feedback_agent?.metrics?.learning_triggers?.value || 0}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-warning-400" />
          </div>
        </div>

        {/* Active Agents */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Agents</p>
              <p className="text-2xl font-bold text-success-600">
                {Object.keys(agentStatus || {}).length}
              </p>
            </div>
            <Activity className="w-8 h-8 text-success-400" />
          </div>
        </div>
      </div>

      {/* Agent Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Status */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Status</h3>
          <div className="space-y-3">
            {agentStatus && Object.entries(agentStatus).map(([name, status]) => (
              <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(status.status).split(' ')[0]}`}></div>
                  <span className="font-medium text-gray-900">{name.replace('_', ' ').toUpperCase()}</span>
                </div>
                <span className={`badge ${getStatusColor(status.status)}`}>
                  {status.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Database Status */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Status</h3>
          <div className="space-y-3">
            {systemHealth?.databases && Object.entries(systemHealth.databases).map(([name, status]) => (
              <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{name.replace('_', ' ').toUpperCase()}</span>
                <span className={`badge ${getStatusColor(status)}`}>
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <MessageSquare className="w-5 h-5 text-primary-600" />
            <span className="font-medium">Submit Feedback</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart3 className="w-5 h-5 text-warning-600" />
            <span className="font-medium">View Analytics</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Brain className="w-5 h-5 text-success-600" />
            <span className="font-medium">Knowledge Base</span>
          </button>
        </div>
      </div>

      {/* Knowledge Base Query UI */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Knowledge Base Query Tool</h3>
        
        {/* Query Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Query Type</label>
          <select 
            value={queryType} 
            onChange={(e) => setQueryType(e.target.value)}
            className="input-field w-full md:w-64"
          >
            <option value="feedback">Feedback Database</option>
            <option value="enhanced-kb">Enhanced Knowledge Base</option>
          </select>
        </div>

        {/* Query Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Query Parameters</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder={queryType === 'feedback' ? 'Ticket ID (e.g., TEST-001)' : 'Category (e.g., technical, network, billing)'}
              value={queryCategory}
              onChange={(e) => setQueryCategory(e.target.value)}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Limit (e.g., 10)"
              value={queryLimit}
              onChange={(e) => setQueryLimit(parseInt(e.target.value) || 10)}
              className="input-field"
            />
          </div>
        </div>

        {/* Sample Queries */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sample Queries</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <button
              onClick={() => executeSampleQuery('feedback-all')}
              className="text-left p-2 text-sm bg-blue-50 text-blue-700 rounded border hover:bg-blue-100 transition-colors"
            >
              📋 Get All Feedback
            </button>
            <button
              onClick={() => executeSampleQuery('feedback-ticket')}
              className="text-left p-2 text-sm bg-blue-50 text-blue-700 rounded border hover:bg-blue-100 transition-colors"
            >
              🎫 Get Feedback by Ticket
            </button>
            <button
              onClick={() => executeSampleQuery('kb-stats')}
              className="text-left p-2 text-sm bg-green-50 text-green-700 rounded border hover:bg-green-100 transition-colors"
            >
              📊 KB Statistics
            </button>
            <button
              onClick={() => executeSampleQuery('kb-solutions')}
              className="text-left p-2 text-sm bg-green-50 text-green-700 rounded border hover:bg-green-100 transition-colors"
            >
              🧠 All Solutions
            </button>
            <button
              onClick={() => executeSampleQuery('kb-technical')}
              className="text-left p-2 text-sm bg-green-50 text-green-700 rounded border hover:bg-green-100 transition-colors"
            >
              🔧 Technical Solutions
            </button>
            <button
              onClick={() => executeSampleQuery('kb-network')}
              className="text-left p-2 text-sm bg-green-50 text-green-700 rounded border hover:bg-green-100 transition-colors"
            >
              🌐 Network Solutions
            </button>
          </div>
        </div>

        {/* Execute Query Button */}
        <div className="mb-4 flex space-x-3">
          <button
            onClick={executeCustomQuery}
            disabled={isQuerying}
            className="btn-primary"
          >
            {isQuerying ? 'Querying...' : 'Execute Query'}
          </button>
          <button
            onClick={() => {
              setQueryResults(null);
              setQueryHistory([]);
            }}
            className="btn-secondary"
          >
            Clear Results
          </button>
        </div>

        {/* Query Results */}
        {queryResults && (
          <div className="mt-6">
            <h4 className="text-md font-semibold text-gray-900 mb-2">Query Results</h4>
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              {queryResults.error ? (
                <div className="text-red-600">
                  <strong>Error:</strong> {queryResults.error}
                  {queryResults.details && (
                    <div className="mt-2 text-sm">
                      <strong>Details:</strong> {JSON.stringify(queryResults.details, null, 2)}
                    </div>
                  )}
                </div>
              ) : Array.isArray(queryResults) && queryResults.length === 0 ? (
                <div className="text-gray-500">
                  <strong>No results found.</strong> The query returned an empty array.
                </div>
              ) : (
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                  {JSON.stringify(queryResults, null, 2)}
                </pre>
              )}
            </div>
          </div>
        )}

        {/* Query History */}
        {queryHistory.length > 0 && (
          <div className="mt-4">
            <h4 className="text-md font-semibold text-gray-900 mb-2">Recent Queries</h4>
            <div className="space-y-2">
              {queryHistory.slice(0, 5).map((query, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <span className="text-gray-700">{query.description}</span>
                  <button
                    onClick={() => executeQuery(query)}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    Re-run
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
