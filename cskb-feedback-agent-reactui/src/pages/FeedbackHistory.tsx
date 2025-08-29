import React, { useState, useEffect } from 'react';
import { Search, Download, Eye } from 'lucide-react';
import { feedbackAPI, FeedbackEntry } from '../services/api';
import { format } from 'date-fns';
import LoadingSpinner from '../components/LoadingSpinner';

const FeedbackHistory: React.FC = () => {
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFeedbackType, setSelectedFeedbackType] = useState('');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      // Get all feedback entries
      const allFeedback = await feedbackAPI.getAllFeedback(100, 0);
      setFeedback(allFeedback);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  const getFeedbackTypeColor = (type: string) => {
    switch (type) {
      case 'PERFECT':
        return 'badge-success';
      case 'MINOR_CHANGES':
        return 'badge-warning';
      case 'NEW_SOLUTION':
        return 'badge-error';
      default:
        return 'badge-info';
    }
  };

  const getEffectivenessColor = (score: number) => {
    if (score >= 0.8) return 'text-success-600';
    if (score >= 0.6) return 'text-warning-600';
    return 'text-error-600';
  };

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = item.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.comments.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesType = !selectedFeedbackType || item.feedback_type === selectedFeedbackType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const categories = [...new Set(feedback.map(item => item.category))];
  const feedbackTypes = [...new Set(feedback.map(item => item.feedback_type))];

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading feedback history..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feedback History</h1>
          <p className="text-gray-600 mt-2">View and analyze submitted feedback</p>
        </div>
        <button className="btn-secondary flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Data</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tickets or comments..."
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
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Type</label>
            <select
              value={selectedFeedbackType}
              onChange={(e) => setSelectedFeedbackType(e.target.value)}
              className="input-field"
            >
              <option value="">All Types</option>
              {feedbackTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedFeedbackType('');
              }}
              className="btn-secondary w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Feedback Entries ({filteredFeedback.length})
          </h3>
        </div>

        {filteredFeedback.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or submit new feedback.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFeedback.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-gray-900">{item.ticket_id}</span>
                    <span className={`badge ${getFeedbackTypeColor(item.feedback_type)}`}>
                      {item.feedback_type}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(item.timestamp), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Score:</span>
                    <span className={`font-semibold ${getEffectivenessColor(item.effectiveness_score)}`}>
                      {(item.effectiveness_score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">AI Solution</h4>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded border">
                      {item.ai_solution}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Human Solution</h4>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded border">
                      {item.human_solution}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span>Role: {item.user_role}</span>
                    <span>Priority: {item.learning_priority}</span>
                    <span>Category: {item.category}</span>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700 flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                </div>

                {item.comments && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Comments</h4>
                    <p className="text-sm text-gray-900">{item.comments}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Feedback</h3>
          <p className="text-3xl font-bold text-primary-600">{feedback.length}</p>
        </div>
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Avg Effectiveness</h3>
          <p className="text-3xl font-bold text-success-600">
            {feedback.length > 0 
              ? (feedback.reduce((sum, item) => sum + item.effectiveness_score, 0) / feedback.length * 100).toFixed(1)
              : 0
            }%
          </p>
        </div>
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Learning Priority</h3>
          <p className="text-3xl font-bold text-warning-600">
            {feedback.length > 0 
              ? (feedback.reduce((sum, item) => sum + item.learning_priority, 0) / feedback.length).toFixed(1)
              : 0
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackHistory;
