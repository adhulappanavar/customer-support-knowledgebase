import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Brain, 
  ThumbsUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Send
} from 'lucide-react';
import { knowledgeAPI, workflowAPI, feedbackAPI } from '../services/api';
import { QueryResponse, FeedbackRequest } from '../types';
import toast from 'react-hot-toast';

const TicketResolution: React.FC = () => {
  const [ticketId, setTicketId] = useState('');
  const [customerQuery, setCustomerQuery] = useState('');
  const [aiResolution, setAiResolution] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedbackMode, setFeedbackMode] = useState(false);
  const [feedback, setFeedback] = useState<Omit<FeedbackRequest, 'ticket_id'>>({
    ai_solution: '',
    human_solution: '',
    feedback_type: 'PERFECT',
    user_role: 'support_engineer',
    comments: ''
  });

  const handleSubmitQuery = async () => {
    if (!ticketId || !customerQuery) {
      toast.error('Please provide both Ticket ID and Customer Query');
      return;
    }

    setLoading(true);
    try {
      const result = await workflowAPI.createTicketResolution(ticketId, customerQuery);
      if (result.success && result.ai_response) {
        setAiResolution(result.ai_response);
        // Update feedback with AI solution
        setFeedback(prev => ({
          ...prev,
          ai_solution: result.ai_response!.answer || ''
        }));
        toast.success('AI resolution generated successfully!');
        setFeedbackMode(true);
      } else {
        toast.error(result.error || 'Failed to generate AI resolution');
      }
    } catch (error) {
      console.error('Error generating AI resolution:', error);
      toast.error('Failed to generate AI resolution');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.feedback_type || !feedback.comments || !feedback.ai_solution) {
      toast.error('Please provide feedback type, comments, and ensure AI solution is available');
      return;
    }

    try {
      const result = await workflowAPI.submitTicketFeedback(ticketId, {
        ...feedback,
        ticket_id: ticketId
      });
      if (result.success) {
        toast.success('Feedback submitted successfully!');
        setFeedbackMode(false);
        setFeedback({
          ai_solution: '',
          human_solution: '',
          feedback_type: 'PERFECT',
          user_role: 'support_engineer',
          comments: ''
        });
        setAiResolution(null);
        setTicketId('');
        setCustomerQuery('');
      } else {
        toast.error(result.error || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
    }
  };

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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-success-600';
    if (confidence >= 0.6) return 'text-warning-600';
    return 'text-error-600';
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ticket Resolution Workflow</h1>
        <p className="text-gray-600">AI-powered ticket resolution with integrated feedback collection for continuous learning</p>
      </div>

      {/* Ticket Input Form */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-primary-600" />
          Create New Ticket Resolution
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ticket ID *
            </label>
            <input
              type="text"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              placeholder="e.g., TICKET-001"
              className="input-field"
              disabled={feedbackMode}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Role
            </label>
            <select
              value={feedback.user_role}
              onChange={(e) => setFeedback({ ...feedback, user_role: e.target.value })}
              className="input-field"
            >
              <option value="support_engineer">Support Engineer</option>
              <option value="customer">Customer</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer Query *
          </label>
          <textarea
            value={customerQuery}
            onChange={(e) => setCustomerQuery(e.target.value)}
            placeholder="Describe the customer's issue, question, or request..."
            rows={4}
            className="input-field"
            disabled={feedbackMode}
          />
        </div>

        <div className="mt-6">
          <button
            onClick={handleSubmitQuery}
            disabled={loading || feedbackMode}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating AI Resolution...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Generate AI Resolution
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Resolution Display */}
      {aiResolution && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-primary-600" />
            AI-Generated Resolution
          </h2>

          <div className="space-y-6">
            {/* Resolution Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Solution
              </label>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-900 whitespace-pre-wrap">{aiResolution.answer}</p>
              </div>
            </div>

            {/* Confidence and Sources */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confidence Score
                </label>
                <div className="flex items-center space-x-2">
                  <span className={`text-2xl font-bold ${getConfidenceColor(aiResolution.confidence)}`}>
                    {(aiResolution.confidence * 100).toFixed(1)}%
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        aiResolution.confidence >= 0.8 ? 'bg-success-500' :
                        aiResolution.confidence >= 0.6 ? 'bg-warning-500' : 'bg-error-500'
                      }`}
                      style={{ width: `${aiResolution.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Knowledge Sources
                </label>
                <div className="space-y-2">
                  {aiResolution.sources.map((source, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-success-500" />
                      <span>{source}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Collection */}
      {feedbackMode && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <ThumbsUp className="w-5 h-5 mr-2 text-primary-600" />
            Provide Feedback
          </h2>

          <div className="space-y-6">
            {/* Feedback Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How accurate was the AI resolution? *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: 'PERFECT', label: 'Perfect', description: 'AI solution was completely accurate' },
                  { value: 'MINOR_CHANGES', label: 'Minor Changes', description: 'AI solution needed small adjustments' },
                  { value: 'NEW_SOLUTION', label: 'New Solution', description: 'AI solution was incorrect or incomplete' }
                ].map((type) => (
                  <label
                    key={type.value}
                    className={`
                      relative flex cursor-pointer rounded-lg border p-4 focus:outline-none
                      ${feedback.feedback_type === type.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="feedback_type"
                      value={type.value}
                      checked={feedback.feedback_type === type.value}
                      onChange={(e) => setFeedback({ ...feedback, feedback_type: e.target.value as any })}
                      className="sr-only"
                    />
                    <div className="flex flex-col">
                      <span className={`block text-sm font-medium ${
                        feedback.feedback_type === type.value ? 'text-primary-900' : 'text-gray-900'
                      }`}>
                        {type.label}
                      </span>
                      <span className={`block text-xs ${
                        feedback.feedback_type === type.value ? 'text-primary-700' : 'text-gray-500'
                      }`}>
                        {type.description}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Human Solution Input */}
            {feedback.feedback_type !== 'PERFECT' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Solution / Correction
                </label>
                <textarea
                  value={feedback.human_solution || ''}
                  onChange={(e) => setFeedback({ ...feedback, human_solution: e.target.value })}
                  placeholder="Provide your solution or correction to the AI response..."
                  rows={4}
                  className="input-field"
                />
              </div>
            )}

            {/* Comments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Comments
              </label>
              <textarea
                value={feedback.comments}
                onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
                placeholder="Any additional feedback, context, or suggestions..."
                rows={3}
                className="input-field"
              />
            </div>

            {/* Submit Feedback */}
            <div className="flex space-x-3">
              <button
                onClick={handleSubmitFeedback}
                className="btn-success"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </button>
              
              <button
                onClick={() => {
                  setFeedbackMode(false);
                  setAiResolution(null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Status */}
      {aiResolution && (
        <div className="mt-6">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-success-500" />
              <span>AI Resolution Generated</span>
            </div>
            {feedbackMode && (
              <>
                <div className="w-4 h-1 bg-gray-300 rounded"></div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-warning-500" />
                  <span>Awaiting Feedback</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketResolution;
