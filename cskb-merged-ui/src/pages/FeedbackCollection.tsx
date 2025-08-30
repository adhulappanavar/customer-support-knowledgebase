import React, { useState, useEffect } from 'react';
import { 
  ThumbsUp, 
  Search, 
  Filter, 
  Eye, 
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { feedbackAPI } from '../services/api';
import { FeedbackEntry } from '../types';
import toast from 'react-hot-toast';

const FeedbackCollection: React.FC = () => {
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackEntry | null>(null);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const data = await feedbackAPI.getAllFeedback(100, 0);
      setFeedback(data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast.error('Failed to fetch feedback');
    } finally {
      setLoading(false);
    }
  };

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = 
      item.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.comments?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ai_solution.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || item.feedback_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const getFeedbackTypeColor = (type: string) => {
    switch (type) {
      case 'PERFECT':
        return 'text-success-600 bg-success-100';
      case 'MINOR_CHANGES':
        return 'text-warning-600 bg-warning-100';
      case 'NEW_SOLUTION':
        return 'text-error-600 bg-error-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getEffectivenessColor = (score: number) => {
    if (score >= 8) return 'text-success-600';
    if (score >= 6) return 'text-warning-600';
    return 'text-error-600';
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback Collection</h1>
        <p className="text-gray-600">Monitor and analyze feedback for AI resolution improvements</p>
      </div>

      {/* Search and Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Feedback
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ticket ID, comments, or solution..."
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="PERFECT">Perfect</option>
              <option value="MINOR_CHANGES">Minor Changes</option>
              <option value="NEW_SOLUTION">New Solution</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchFeedback}
              className="btn-primary w-full"
            >
              <Filter className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Feedback</p>
              <p className="text-2xl font-bold text-gray-900">{feedback.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Perfect</p>
              <p className="text-2xl font-bold text-gray-900">
                {feedback.filter(f => f.feedback_type === 'PERFECT').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Needs Improvement</p>
              <p className="text-2xl font-bold text-gray-900">
                {feedback.filter(f => f.feedback_type !== 'PERFECT').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Effectiveness</p>
              <p className="text-2xl font-bold text-gray-900">
                {feedback.length > 0 
                  ? (feedback.reduce((sum, f) => sum + f.effectiveness_score, 0) / feedback.length).toFixed(1)
                  : '0.0'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback Entries</h3>
        
        {filteredFeedback.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ThumbsUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No feedback found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Effectiveness
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFeedback.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.ticket_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${getFeedbackTypeColor(item.feedback_type)}`}>
                        {item.feedback_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getEffectivenessColor(item.effectiveness_score)}`}>
                        {item.effectiveness_score}/10
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {item.user_role.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedFeedback(item)}
                        className="text-primary-600 hover:text-primary-900 flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Feedback Detail Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Feedback Details - {selectedFeedback.ticket_id}
                </h3>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">AI Solution</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900">
                    {selectedFeedback.ai_solution}
                  </div>
                </div>

                {selectedFeedback.human_solution && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Human Solution</label>
                    <div className="bg-blue-50 rounded-lg p-3 text-sm text-gray-900">
                      {selectedFeedback.human_solution}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Type</label>
                    <span className={`badge ${getFeedbackTypeColor(selectedFeedback.feedback_type)}`}>
                      {selectedFeedback.feedback_type.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Effectiveness Score</label>
                    <span className={`text-lg font-bold ${getEffectivenessColor(selectedFeedback.effectiveness_score)}`}>
                      {selectedFeedback.effectiveness_score}/10
                    </span>
                  </div>
                </div>

                {selectedFeedback.comments && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900">
                      {selectedFeedback.comments}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">User Role:</span>
                    <span className="ml-2 text-gray-900 capitalize">
                      {selectedFeedback.user_role.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Learning Priority:</span>
                    <span className="ml-2 text-gray-900">{selectedFeedback.learning_priority}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedFeedback(null)}
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

export default FeedbackCollection;

