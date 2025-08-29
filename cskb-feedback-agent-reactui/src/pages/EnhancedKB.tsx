import React, { useState, useEffect } from 'react';
import { Brain, Search, TrendingUp, BookOpen, Lightbulb } from 'lucide-react';
import { enhancedKBAPI, EnhancedKBStats } from '../services/api';

const EnhancedKB: React.FC = () => {
  const [stats, setStats] = useState<EnhancedKBStats | null>(null);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'stats' | 'solutions'>('stats');

  useEffect(() => {
    fetchEnhancedKBData();
  }, []);

  const fetchEnhancedKBData = async () => {
    try {
      const [statsData, solutionsData] = await Promise.all([
        enhancedKBAPI.getStats(),
        enhancedKBAPI.getHighPrioritySolutions()
      ]);
      setStats(statsData);
      setSolutions(solutionsData);
    } catch (error) {
      console.error('Error fetching enhanced KB data:', error);
      setStats(null);
      setSolutions([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = [
      'bg-primary-100 text-primary-800',
      'bg-success-100 text-success-800',
      'bg-warning-100 text-warning-800',
      'bg-error-100 text-error-800',
      'bg-purple-100 text-purple-800',
      'bg-indigo-100 text-indigo-800'
    ];
    const index = category.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'text-error-600 bg-error-100';
    if (priority >= 6) return 'text-warning-600 bg-warning-100';
    if (priority >= 4) return 'text-primary-600 bg-primary-100';
    return 'text-success-600 bg-success-100';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-success-600';
    if (confidence >= 0.6) return 'text-warning-600';
    return 'text-error-600';
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
            <Brain className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Enhanced Knowledge Base</h1>
            <p className="text-gray-600 mt-1">AI-powered knowledge enhancement and learning</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setViewMode('stats')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'stats'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Statistics
          </button>
          <button
            onClick={() => setViewMode('solutions')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'solutions'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Solutions
          </button>
        </div>
      </div>

      {/* View Mode Content */}
      {viewMode === 'stats' ? (
        /* Statistics View */
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Solutions</h3>
              <p className="text-3xl font-bold text-primary-600">
                {stats?.total_solutions || 0}
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-success-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Avg Confidence</h3>
              <p className="text-3xl font-bold text-success-600">
                {stats?.avg_confidence ? (stats.avg_confidence * 100).toFixed(1) : 0}%
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-6 h-6 text-warning-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Categories</h3>
              <p className="text-3xl font-bold text-warning-600">
                {stats?.categories?.length || 0}
              </p>
            </div>
          </div>

          {/* Categories Breakdown */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Knowledge Categories</h3>
            {stats?.categories && stats.categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.categories.map((category, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{category}</span>
                      <span className={`badge ${getCategoryColor(category)}`}>
                        Active
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Solutions available in this category
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-2">📚</div>
                <p className="text-gray-600">No categories available yet</p>
              </div>
            )}
          </div>

          {/* Last Updated */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Last Updated</h4>
                <p className="text-lg text-gray-900">
                  {stats?.last_updated || 'Never'}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Knowledge Status</h4>
                <span className="badge badge-success">
                  {stats?.total_solutions && stats.total_solutions > 0 ? 'Active' : 'Empty'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Solutions View */
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Solutions</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search solutions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field"
                >
                  <option value="">All Categories</option>
                  {stats?.categories?.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                  className="btn-secondary w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Solutions List */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Knowledge Solutions ({solutions.length})
              </h3>
              <button onClick={fetchEnhancedKBData} className="btn-primary">
                Refresh
              </button>
            </div>

            {solutions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🧠</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No solutions available</h3>
                <p className="text-gray-600">The enhanced knowledge base is still learning. Check back later!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {solutions
                  .filter(solution => 
                    (!searchTerm || solution.solution_text?.toLowerCase().includes(searchTerm.toLowerCase())) &&
                    (!selectedCategory || solution.category === selectedCategory)
                  )
                  .map((solution, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className={`badge ${getCategoryColor(solution.category || 'general')}`}>
                            {solution.category || 'General'}
                          </span>
                          <span className={`badge ${getPriorityColor(solution.priority || 5)}`}>
                            Priority {solution.priority || 'N/A'}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Confidence</div>
                          <div className={`font-semibold ${getConfidenceColor(solution.confidence_score || 0)}`}>
                            {solution.confidence_score ? (solution.confidence_score * 100).toFixed(1) : 0}%
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h4 className="font-medium text-gray-900 mb-2">Solution</h4>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded border">
                          {solution.solution_text || 'No solution text available'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Source:</span> {solution.source || 'Unknown'}
                        </div>
                        <div>
                          <span className="font-medium">Version:</span> {solution.version || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Usage:</span> {solution.usage_count || 0} times
                        </div>
                      </div>

                      {solution.tags && solution.tags.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex flex-wrap gap-2">
                            {solution.tags.map((tag: string, tagIndex: number) => (
                              <span key={tagIndex} className="badge badge-info">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Learning Insights */}
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Learning Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-medium mb-2">Continuous Improvement</h4>
                <p>The enhanced knowledge base learns from every feedback submission, improving AI solutions over time.</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Smart Prioritization</h4>
                <p>Solutions are automatically prioritized based on feedback effectiveness and learning triggers.</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Context Awareness</h4>
                <p>Each solution includes context information to help with future similar queries.</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Quality Metrics</h4>
                <p>Confidence scores and usage patterns help identify the most reliable solutions.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Brain className="w-5 h-5 text-primary-600" />
            <span className="font-medium">View Learning Triggers</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp className="w-5 h-5 text-success-600" />
            <span className="font-medium">Performance Analytics</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Lightbulb className="w-5 h-5 text-warning-600" />
            <span className="font-medium">Suggest Improvements</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedKB;
