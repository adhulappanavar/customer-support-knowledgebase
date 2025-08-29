import React, { useState, useEffect } from 'react';
import { Heart, Activity, Database, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { systemAPI, SystemHealth as SystemHealthType } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const SystemHealth: React.FC = () => {
  const [systemHealth, setSystemHealth] = useState<SystemHealthType | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    fetchSystemHealth();
    const interval = setInterval(fetchSystemHealth, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSystemHealth = async () => {
    try {
      const health = await systemAPI.getSystemHealth();
      setSystemHealth(health);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching system health:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOverallStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return 'text-success-600 bg-success-100';
      case 'degraded':
        return 'text-warning-600 bg-warning-100';
      case 'error':
        return 'text-error-600 bg-error-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getOverallStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return <CheckCircle className="w-6 h-6 text-success-600" />;
      case 'degraded':
        return <AlertTriangle className="w-6 h-6 text-warning-600" />;
      case 'error':
        return <AlertTriangle className="w-6 h-6 text-error-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'connected':
      case 'running':
        return 'text-success-600 bg-success-100';
      case 'connecting':
      case 'starting':
        return 'text-warning-600 bg-warning-100';
      case 'disconnected':
      case 'stopped':
      case 'error':
        return 'text-error-600 bg-error-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return 'N/A';
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return timestamp;
    }
  };

  const getHealthScore = () => {
    if (!systemHealth) return 0;
    
    let totalComponents = 0;
    let healthyComponents = 0;
    
    // Count agents
    Object.values(systemHealth.agents).forEach(agent => {
      totalComponents++;
      if (agent.status === 'running') healthyComponents++;
    });
    
    // Count databases
    Object.values(systemHealth.databases).forEach(db => {
      totalComponents++;
      if (db === 'connected') healthyComponents++;
    });
    
    return totalComponents > 0 ? (healthyComponents / totalComponents) * 100 : 0;
  };

  const getHealthChartData = () => {
    if (!systemHealth) return [];
    
    const data: Array<{
      name: string;
      value: number;
      status: string;
      type: string;
    }> = [];
    
    // Add agents
    Object.entries(systemHealth.agents).forEach(([name, agent]) => {
      data.push({
        name: name.replace('_', ' ').toUpperCase(),
        value: agent.status === 'running' ? 1 : 0,
        status: agent.status,
        type: 'agent'
      });
    });
    
    // Add databases
    Object.entries(systemHealth.databases).forEach(([name, status]) => {
      data.push({
        name: name.replace('_', ' ').toUpperCase(),
        value: status === 'connected' ? 1 : 0,
        status: status,
        type: 'database'
      });
    });
    
    return data;
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
            <p className="text-gray-600 mt-1">Monitor overall system status and performance</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Last Updated</p>
          <p className="text-sm font-medium text-gray-900">
            {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
          </p>
        </div>
      </div>

      {/* Overall Health Status */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Overall System Status</h2>
          <button onClick={fetchSystemHealth} className="btn-primary">
            Refresh Status
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Overall Status */}
          <div className="text-center">
            <div className="flex justify-center mb-3">
              {getOverallStatusIcon(systemHealth?.overall_status || 'unknown')}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Status</h3>
            <span className={`badge text-lg px-4 py-2 ${getOverallStatusColor(systemHealth?.overall_status || 'unknown')}`}>
              {systemHealth?.overall_status || 'Unknown'}
            </span>
          </div>
          
          {/* Health Score */}
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {getHealthScore().toFixed(0)}%
            </div>
            <h3 className="text-lg font-medium text-gray-900">Health Score</h3>
            <p className="text-sm text-gray-600">Component availability</p>
          </div>
          
          {/* Last Update */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {systemHealth?.timestamp ? formatTimestamp(systemHealth.timestamp) : 'N/A'}
            </div>
            <h3 className="text-lg font-medium text-gray-900">Last Check</h3>
            <p className="text-sm text-gray-600">System timestamp</p>
          </div>
        </div>
      </div>

      {/* Health Overview Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Components Health</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={getHealthChartData()}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value === 1 ? 'Healthy' : 'Unhealthy'}`}
              >
                {getHealthChartData().map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.value === 1 ? '#22c55e' : '#ef4444'} 
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Component Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Status */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Status</h3>
          <div className="space-y-3">
            {systemHealth?.agents && Object.entries(systemHealth.agents).map(([name, agent]) => (
              <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Activity className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-900">
                    {name.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`badge ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(agent.timestamp)}
                  </span>
                </div>
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
                <div className="flex items-center space-x-3">
                  <Database className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-900">
                    {name.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <span className={`badge ${getStatusColor(status)}`}>
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 mb-2">
              {systemHealth?.agents ? Object.keys(systemHealth.agents).length : 0}
            </div>
            <div className="text-sm text-gray-600">Total Agents</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-success-600 mb-2">
              {systemHealth?.agents ? Object.values(systemHealth.agents).filter(a => a.status === 'running').length : 0}
            </div>
            <div className="text-sm text-gray-600">Running Agents</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-warning-600 mb-2">
              {systemHealth?.agents ? Object.values(systemHealth.agents).filter(a => a.status !== 'running').length : 0}
            </div>
            <div className="text-sm text-gray-600">Non-Running Agents</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 mb-2">
              {systemHealth?.databases ? Object.keys(systemHealth.databases).length : 0}
            </div>
            <div className="text-sm text-gray-600">Total Databases</div>
          </div>
        </div>
      </div>

      {/* Health Alerts */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Alerts</h3>
        <div className="space-y-3">
          {systemHealth?.overall_status === 'degraded' && (
            <div className="flex items-center space-x-3 p-3 bg-warning-50 border border-warning-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-warning-600" />
              <div>
                <p className="font-medium text-warning-800">System Degraded</p>
                <p className="text-sm text-warning-700">Some components are not running optimally</p>
              </div>
            </div>
          )}
          
          {systemHealth?.overall_status === 'error' && (
            <div className="flex items-center space-x-3 p-3 bg-error-50 border border-error-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-error-600" />
              <div>
                <p className="font-medium text-error-800">System Error</p>
                <p className="text-sm text-error-700">Critical components are not functioning</p>
              </div>
            </div>
          )}
          
          {systemHealth?.overall_status === 'healthy' && (
            <div className="flex items-center space-x-3 p-3 bg-success-50 border border-success-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-success-600" />
              <div>
                <p className="font-medium text-success-800">All Systems Operational</p>
                <p className="text-sm text-success-700">All components are running normally</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
