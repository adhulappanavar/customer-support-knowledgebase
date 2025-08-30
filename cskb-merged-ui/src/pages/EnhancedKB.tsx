import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Search, 
  Filter, 
  TrendingUp, 
  Eye,
  Database,
  Lightbulb,
  Zap
} from 'lucide-react';
import { enhancedKBAPI } from '../services/api';
import { EnhancedKBStats, SolutionEntry } from '../types';
import toast from 'react-hot-toast';

const EnhancedKB: React.FC = () => {
  const [stats, setStats] = useState<EnhancedKBStats | null>(null);
  const [solutions, setSolutions] = useState<SolutionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSolution, setSelectedSolution] = useState<SolutionEntry | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, solutionsData] = await Promise.all([
        enhancedKBAPI.getStats(),
        enhancedKBAPI.getHighPrioritySolutions(50)
      ]);
      setStats(statsData);
      setSolutions(solutionsData);
    } catch (error) {
      console.error('Error fetching enhanced KB data:', error);
      toast.error('Failed to fetch knowledge base data');
    } finally {
      setLoading(false);
    }
  };

  const filteredSolutions = solutions.filter(solution => {
    const matchesSearch = 
      solution.solution_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solution.context.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solution.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || solution.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'ai_generated':
        return 'text-primary-600 bg-primary-100';
      case 'human_feedback':
        return 'text-success-600 bg-success-100';
      case 'hybrid':
        return 'text-warning-600 bg-warning-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'text-error-600 bg-error-100';
    if (priority >= 6) return 'text-warning-600 bg-warning-100';
    return 'text-success-600 bg-success-100';
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhanced Knowledge Base</h1>
        <p className="text-gray-600">Explore AI-generated and human-validated solutions from feedback learning</p>
      </div>

      {/* Statistics Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Database className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Solutions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_solutions}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <Lightbulb className="w-6 h-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Human Feedback</p>
                <p className="text-2xl font-bold text-gray-900">{stats.by_source.human_feedback}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded-lg">
                <Zap className="w-6 h-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">AI Generated</p>
                <p className="text-2xl font-bold text-gray-900">{stats.by_source.ai_generated}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats.avg_confidence_score * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Solutions
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search solutions, context, or tags..."
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="account">Account</option>
              <option value="general">General</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchData}
              className="btn-primary w-full"
            >
              <Filter className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Solutions List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Knowledge Base Solutions</h3>
        
        {filteredSolutions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No solutions found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSolutions.map((solution) => (
              <div key={solution.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`badge ${getSourceColor(solution.source)}`}>
                        {solution.source.replace('_', ' ')}
                      </span>
                      <span className={`badge ${getPriorityColor(solution.priority)}`}>
                        Priority {solution.priority}
                      </span>
                      <span className="badge text-gray-600 bg-gray-100">
                        {solution.category}
                      </span>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-2">
                      {solution.solution_text.substring(0, 100)}...
                    </h4>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {solution.context.substring(0, 150)}...
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Confidence: {(solution.confidence_score * 100).toFixed(1)}%</span>
                      <span>Usage: {solution.usage_count}</span>
                      <span>Feedback Score: {solution.feedback_score}/10</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedSolution(solution)}
                    className="ml-4 text-primary-600 hover:text-primary-900"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Solution Detail Modal */}
      {selectedSolution && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Solution Details
                </h3>
                <button
                  onClick={() => setSelectedSolution(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Solution</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900">
                    {selectedSolution.solution_text}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Context</label>
                  <div className="bg-blue-50 rounded-lg p-3 text-sm text-gray-900">
                    {selectedSolution.context}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                    <span className={`badge ${getSourceColor(selectedSolution.source)}`}>
                      {selectedSolution.source.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <span className={`badge ${getPriorityColor(selectedSolution.priority)}`}>
                      {selectedSolution.priority}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confidence</label>
                    <span className="text-lg font-bold text-primary-600">
                      {(selectedSolution.confidence_score * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Score</label>
                    <span className="text-lg font-bold text-success-600">
                      {selectedSolution.feedback_score}/10
                    </span>
                  </div>
                </div>

                {selectedSolution.tags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedSolution.tags.map((tag, index) => (
                        <span key={index} className="badge text-gray-600 bg-gray-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Usage Count:</span>
                    <span className="ml-2 text-gray-900">{selectedSolution.usage_count}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Version:</span>
                    <span className="ml-2 text-gray-900">{selectedSolution.version}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedSolution(null)}
                    className="btn-secondary w-full"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedKB;

