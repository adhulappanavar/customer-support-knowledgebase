import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { systemAPI } from '../services/api';
import { SystemHealth as SystemHealthType } from '../types';
import toast from 'react-hot-toast';

const SystemHealthPage: React.FC = () => {
  const [systemHealth, setSystemHealth] = useState<SystemHealthType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemHealth();
    const interval = setInterval(fetchSystemHealth, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSystemHealth = async () => {
    try {
      const data = await systemAPI.getSystemHealth();
      setSystemHealth(data);
    } catch (error) {
      console.error('Error fetching system health:', error);
      toast.error('Failed to fetch system health');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'active':
        return <CheckCircle className="w-5 h-5 text-success-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-warning-500" />;
      case 'error':
      case 'failed':
        return <XCircle className="w-5 h-5 text-error-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Health</h1>
        <p className="text-gray-600">Monitor the overall health and status of the CSKB system</p>
      </div>

      {/* Overall System Status */}
      {systemHealth && (
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Overall System Status</h2>
            <div className="flex items-center space-x-2">
              {getStatusIcon(systemHealth.overall_status)}
              <span className={`badge ${getStatusColor(systemHealth.overall_status)}`}>
                {systemHealth.overall_status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {Object.keys(systemHealth.agents).length}
              </div>
              <div className="text-sm text-gray-600">Active Agents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {Object.keys(systemHealth.databases).length}
              </div>
              <div className="text-sm text-gray-600">Database Connections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {new Date(systemHealth.timestamp).toLocaleTimeString()}
              </div>
              <div className="text-sm text-gray-600">Last Updated</div>
            </div>
          </div>
        </div>
      )}

      {/* Agent Status */}
      {systemHealth && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Agent Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(systemHealth.agents).map(([name, agent]) => (
              <div key={name} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900 capitalize">
                    {name.replace('_', ' ')}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(agent.status)}
                    <span className={`badge ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Metrics:</span>
                    <span className="font-medium">{Object.keys(agent.metrics).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Update:</span>
                    <span className="font-medium">
                      {new Date(agent.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                {/* Key Metrics Display */}
                {Object.entries(agent.metrics).slice(0, 3).map(([key, value]) => (
                  <div key={key} className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 capitalize">
                        {key.replace('_', ' ')}:
                      </span>
                      <span className="font-medium">
                        {typeof value === 'number' ? value.toFixed(2) : String(value)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Database Status */}
      {systemHealth && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Database Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(systemHealth.databases).map(([name, status]) => (
              <div key={name} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 capitalize">
                    {name.replace('_', ' ')}
                  </h3>
                  <span className={`badge ${getStatusColor(status)}`}>
                    {status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-6 text-center">
        <button
          onClick={fetchSystemHealth}
          className="btn-primary"
        >
          <Activity className="w-4 h-4 mr-2" />
          Refresh System Health
        </button>
      </div>
    </div>
  );
};

export default SystemHealthPage;
