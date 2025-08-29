import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { MessageSquare, Send, AlertCircle } from 'lucide-react';
import { feedbackAPI, FeedbackRequest } from '../services/api';

const FeedbackCollection: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contextFields, setContextFields] = useState([{ key: '', value: '' }]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FeedbackRequest>();

  const onSubmit = async (data: FeedbackRequest) => {
    setIsSubmitting(true);
    try {
      // Convert context fields to object
      const context: Record<string, any> = {};
      contextFields.forEach(field => {
        if (field.key && field.value) {
          context[field.key] = field.value;
        }
      });
      
      const feedbackData = {
        ...data,
        context
      };

      const response = await feedbackAPI.submitFeedback(feedbackData);
      
      toast.success(`Feedback submitted successfully! ID: ${response.feedback_id}`);
      reset();
      setContextFields([{ key: '', value: '' }]);
      
      // Reset context fields
      setContextFields([{ key: '', value: '' }]);
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      toast.error(error.response?.data?.detail || 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addContextField = () => {
    setContextFields([...contextFields, { key: '', value: '' }]);
  };

  const removeContextField = (index: number) => {
    if (contextFields.length > 1) {
      setContextFields(contextFields.filter((_, i) => i !== index));
    }
  };

  const updateContextField = (index: number, field: 'key' | 'value', value: string) => {
    const newFields = [...contextFields];
    newFields[index][field] = value;
    setContextFields(newFields);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feedback Collection</h1>
          <p className="text-gray-600 mt-1">Submit feedback to improve AI solutions</p>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="card max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="ticket_id" className="block text-sm font-medium text-gray-700 mb-2">
                Ticket ID *
              </label>
              <input
                type="text"
                id="ticket_id"
                {...register('ticket_id', { required: 'Ticket ID is required' })}
                className="input-field"
                placeholder="e.g., TICKET-001"
              />
              {errors.ticket_id && (
                <p className="text-error-600 text-sm mt-1">{errors.ticket_id.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="user_role" className="block text-sm font-medium text-gray-700 mb-2">
                User Role *
              </label>
              <select
                id="user_role"
                {...register('user_role', { required: 'User role is required' })}
                className="input-field"
              >
                <option value="">Select role</option>
                <option value="customer">Customer</option>
                <option value="agent">Support Agent</option>
                <option value="manager">Manager</option>
                <option value="admin">Administrator</option>
              </select>
              {errors.user_role && (
                <p className="text-error-600 text-sm mt-1">{errors.user_role.message}</p>
              )}
            </div>
          </div>

          {/* Feedback Type */}
          <div>
            <label htmlFor="feedback_type" className="block text-sm font-medium text-gray-700 mb-2">
              Feedback Type *
            </label>
            <select
              id="feedback_type"
              {...register('feedback_type', { required: 'Feedback type is required' })}
              className="input-field"
            >
              <option value="">Select feedback type</option>
              <option value="PERFECT">Perfect - No changes needed</option>
              <option value="MINOR_CHANGES">Minor Changes - Small improvements</option>
              <option value="NEW_SOLUTION">New Solution - Completely different approach</option>
            </select>
            {errors.feedback_type && (
              <p className="text-error-600 text-sm mt-1">{errors.feedback_type.message}</p>
            )}
          </div>

          {/* AI Solution */}
          <div>
            <label htmlFor="ai_solution" className="block text-sm font-medium text-gray-700 mb-2">
              AI-Generated Solution *
            </label>
            <textarea
              id="ai_solution"
              rows={4}
              {...register('ai_solution', { required: 'AI solution is required' })}
              className="input-field"
              placeholder="Paste the AI-generated solution here..."
            />
            {errors.ai_solution && (
              <p className="text-error-600 text-sm mt-1">{errors.ai_solution.message}</p>
            )}
          </div>

          {/* Human Solution */}
          <div>
            <label htmlFor="human_solution" className="block text-sm font-medium text-gray-700 mb-2">
              Human Solution *
            </label>
            <textarea
              id="human_solution"
              rows={4}
              {...register('human_solution', { required: 'Human solution is required' })}
              className="input-field"
              placeholder="Provide the human-generated solution or correction..."
            />
            {errors.human_solution && (
              <p className="text-error-600 text-sm mt-1">{errors.human_solution.message}</p>
            )}
          </div>

          {/* Comments */}
          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Comments
            </label>
            <textarea
              id="comments"
              rows={3}
              {...register('comments')}
              className="input-field"
              placeholder="Any additional feedback or context..."
            />
          </div>

          {/* Context Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Context Information
            </label>
            <div className="space-y-3">
              {contextFields.map((field, index) => (
                <div key={index} className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="Key (e.g., category, priority)"
                    value={field.key}
                    onChange={(e) => updateContextField(index, 'key', e.target.value)}
                    className="input-field flex-1"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={field.value}
                    onChange={(e) => updateContextField(index, 'value', e.target.value)}
                    className="input-field flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeContextField(index)}
                    className="px-3 py-2 text-error-600 hover:bg-error-50 rounded-lg border border-error-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addContextField}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                + Add Context Field
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <AlertCircle className="w-4 h-4" />
              <span>All fields marked with * are required</span>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Help Information */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Submit Effective Feedback</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">Be Specific</h4>
            <p>Provide detailed feedback about what worked and what didn't. Include specific examples.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Include Context</h4>
            <p>Add relevant context like category, priority, or user type to help improve future solutions.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Compare Solutions</h4>
            <p>Clearly show the difference between AI and human solutions to highlight learning opportunities.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Rate Effectiveness</h4>
            <p>The system will automatically calculate effectiveness scores based on your feedback type.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCollection;
