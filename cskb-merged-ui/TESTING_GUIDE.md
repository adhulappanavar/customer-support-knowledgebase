# CSKB Merged UI Testing Guide

This guide provides step-by-step instructions to test the merged workflow UI that integrates both the AI ticket resolution system and feedback collection system.

## Prerequisites

Before testing, ensure the following services are running:

1. **Merged UI (React App)**: `http://localhost:3001`
2. **Feedback Agents Backend**: `http://localhost:8002`
3. **Knowledge API Backend**: `http://localhost:8000` (optional for full functionality)

## Quick Start

1. **Open your browser** and navigate to `http://localhost:3001`
2. **Wait for the page to load** - you should see the dashboard with navigation sidebar

## Step-by-Step Testing Instructions

### 1. Dashboard Overview Testing

#### 1.1 Verify Dashboard Loads
- ✅ **Expected**: Dashboard displays with system overview cards
- ✅ **Expected**: Quick ticket resolution form is visible
- ✅ **Expected**: System health and agent status are displayed

#### 1.2 Check System Health
- Look for the "System Health" card
- Verify it shows "Healthy" status
- Check that agent status is displayed

#### 1.3 Verify Agent Status
- Look for the "Agent Status" card
- Should show feedback_agent and learning_agent as "running"
- Check that metrics are displayed (feedback_collected, learning_triggers, etc.)

### 2. Ticket Resolution Workflow Testing

#### 2.1 Create New Ticket Resolution
1. **Enter Ticket ID**: Type a test ticket ID (e.g., `TEST-001`)
2. **Enter Customer Query**: Type a test query (e.g., "How do I reset my password?")
3. **Click "Generate AI Resolution"**
4. **Expected Result**: 
   - Loading spinner appears
   - AI resolution is generated and displayed
   - Feedback mode is automatically enabled
   - Success toast notification appears

#### 2.2 Review AI Resolution
- ✅ **Expected**: AI solution text is displayed
- ✅ **Expected**: Confidence score is shown with color coding
- ✅ **Expected**: Sources are listed (if available)
- ✅ **Expected**: Feedback form appears below

#### 2.3 Test Feedback Collection
1. **Select Feedback Type**:
   - **Perfect**: AI solution was completely accurate
   - **Minor Changes**: AI solution needed small adjustments  
   - **New Solution**: AI solution was incorrect or incomplete

2. **Provide Human Solution** (if not "Perfect"):
   - Enter your solution/correction in the text area
   - This field only appears for "Minor Changes" or "New Solution"

3. **Add Comments**: Enter additional feedback or context

4. **Submit Feedback**: Click "Submit Feedback" button

5. **Expected Result**:
   - Success toast notification
   - Form resets to initial state
   - AI resolution is cleared
   - Returns to ticket input mode

### 3. Feedback Collection Testing

#### 3.1 Navigate to Feedback Collection
1. Click "Feedback Collection" in the sidebar
2. **Expected**: Page loads with feedback statistics and table

#### 3.2 View Feedback Statistics
- ✅ **Expected**: Total feedback count is displayed
- ✅ **Expected**: Feedback type distribution is shown
- ✅ **Expected**: Average effectiveness score is displayed

#### 3.3 Browse Feedback Entries
1. **Search Functionality**: Use the search bar to find specific feedback
2. **Filter by Type**: Use the type filter dropdown
3. **View Details**: Click on any feedback entry to see full details
4. **Expected**: Modal opens with complete feedback information

#### 3.4 Test Feedback Detail Modal
- ✅ **Expected**: Ticket ID is displayed
- ✅ **Expected**: AI solution is shown
- ✅ **Expected**: Human solution (if provided) is displayed
- ✅ **Expected**: Feedback type and comments are visible
- ✅ **Expected**: Timestamp and metadata are shown

### 4. Enhanced Knowledge Base Testing

#### 4.1 Navigate to Enhanced KB
1. Click "Enhanced KB" in the sidebar
2. **Expected**: Page loads with KB statistics and solutions

#### 4.2 View KB Statistics
- ✅ **Expected**: Total solutions count is displayed
- ✅ **Expected**: Source distribution (AI generated, human feedback, hybrid)
- ✅ **Expected**: Average confidence and feedback scores

#### 4.3 Browse Solutions
1. **Search Solutions**: Use the search functionality
2. **Filter by Category**: Use category dropdown
3. **View Solution Details**: Click on any solution
4. **Expected**: Modal opens with solution details

#### 4.4 Test Solution Detail Modal
- ✅ **Expected**: Solution text is displayed
- ✅ **Expected**: Context and metadata are shown
- ✅ **Expected**: Feedback score and usage count are visible
- ✅ **Expected**: Tags and category information is displayed

### 5. System Health Monitoring Testing

#### 5.1 Navigate to System Health
1. Click "System Health" in the sidebar
2. **Expected**: Page loads with comprehensive system status

#### 5.2 Check Overall Status
- ✅ **Expected**: Overall system status is displayed (Healthy/Warning/Error)
- ✅ **Expected**: Last updated timestamp is shown

#### 5.3 Review Agent Status
- ✅ **Expected**: All agents show "running" status
- ✅ **Expected**: Agent metrics are displayed
- ✅ **Expected**: Communication bus status is shown

#### 5.4 Check Database Status
- ✅ **Expected**: Feedback database shows "connected"
- ✅ **Expected**: Enhanced KB database shows "connected"

### 6. Agent Status Performance Testing

#### 6.1 Navigate to Agent Status
1. Click "Agent Status" in the sidebar
2. **Expected**: Page loads with detailed agent metrics

#### 6.2 Review Agent Overview
- ✅ **Expected**: Agent count and overall status
- ✅ **Expected**: Performance summary cards

#### 6.3 Check Individual Agent Metrics
1. **Feedback Agent**:
   - ✅ **Expected**: Status shows "running"
   - ✅ **Expected**: Feedback collected count is displayed
   - ✅ **Expected**: Learning triggers count is shown
   - ✅ **Expected**: Average effectiveness score is visible

2. **Learning Agent**:
   - ✅ **Expected**: Status shows "running"
   - ✅ **Expected**: Processing metrics are displayed

#### 6.4 Test Auto-refresh
- ✅ **Expected**: Data refreshes automatically every 30 seconds
- ✅ **Expected**: Manual refresh button works

### 7. Error Handling Testing

#### 7.1 Test Invalid Inputs
1. **Empty Ticket ID**: Try submitting without ticket ID
   - ✅ **Expected**: Error message appears
   - ✅ **Expected**: Form doesn't submit

2. **Empty Customer Query**: Try submitting without query
   - ✅ **Expected**: Error message appears
   - ✅ **Expected**: Form doesn't submit

3. **Invalid Feedback**: Try submitting feedback without required fields
   - ✅ **Expected**: Error message appears
   - ✅ **Expected**: Form doesn't submit

#### 7.2 Test Network Errors
1. **Disconnect Backend**: Stop the feedback agents backend
2. **Try to Submit**: Attempt to create a ticket resolution
3. **Expected**: Error message about connection failure
4. **Reconnect Backend**: Restart the backend
5. **Retry**: Should work normally again

### 8. Navigation and UI Testing

#### 8.1 Test Sidebar Navigation
- ✅ **Expected**: All navigation links work
- ✅ **Expected**: Active page is highlighted
- ✅ **Expected**: Responsive design on different screen sizes

#### 8.2 Test Responsive Design
1. **Resize Browser**: Test different window sizes
2. **Mobile View**: Test on mobile device or mobile view
3. **Expected**: UI adapts appropriately

#### 8.3 Test Loading States
- ✅ **Expected**: Loading spinners appear during API calls
- ✅ **Expected**: Loading states are properly managed

## Expected Results Summary

### ✅ Success Indicators
- All pages load without errors
- Navigation works smoothly between sections
- Forms submit successfully with proper validation
- Data is displayed correctly from backend APIs
- Error handling works appropriately
- UI is responsive and user-friendly

### ⚠️ Common Issues to Watch For
- **Knowledge API not running**: Ticket resolution may fail
- **Backend connection issues**: API calls may timeout
- **Empty data**: Some sections may show "No data available"
- **TypeScript errors**: Check browser console for compilation issues

## Troubleshooting

### If Ticket Resolution Fails
1. Check if Knowledge API is running on port 8000
2. Verify network connectivity
3. Check browser console for error messages

### If Feedback Submission Fails
1. Check if Feedback Agents backend is running on port 8002
2. Verify all required fields are filled
3. Check browser console for validation errors

### If Pages Don't Load
1. Verify React app is running on port 3001
2. Check browser console for JavaScript errors
3. Ensure all dependencies are installed

## Performance Testing

### Load Testing
1. **Multiple Tickets**: Create 5-10 ticket resolutions quickly
2. **Multiple Feedback**: Submit feedback for multiple tickets
3. **Expected**: UI remains responsive, no performance degradation

### Data Volume Testing
1. **Large Queries**: Test with long customer queries
2. **Detailed Feedback**: Test with extensive feedback comments
3. **Expected**: All data is handled properly

## Security Testing

### Input Validation
1. **Special Characters**: Test with special characters in inputs
2. **Long Inputs**: Test with very long text inputs
3. **Expected**: Inputs are properly sanitized and validated

### XSS Prevention
1. **Script Tags**: Try to inject script tags in inputs
2. **Expected**: Script tags are properly escaped

## Browser Compatibility Testing

### Test on Different Browsers
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### Test on Different Devices
- ✅ Desktop
- ✅ Tablet
- ✅ Mobile

## Final Checklist

Before considering testing complete, verify:

- [ ] All 6 main pages load without errors
- [ ] Ticket resolution workflow functions end-to-end
- [ ] Feedback collection works properly
- [ ] Enhanced KB displays solutions correctly
- [ ] System health monitoring is accurate
- [ ] Agent status shows real-time data
- [ ] Error handling works for edge cases
- [ ] UI is responsive on different screen sizes
- [ ] No TypeScript compilation errors in console
- [ ] All API endpoints respond correctly

## Support

If you encounter issues during testing:

1. **Check browser console** for error messages
2. **Verify backend services** are running
3. **Check network tab** for failed API calls
4. **Review this guide** for troubleshooting steps

---

**Happy Testing! 🚀**

The merged UI provides a comprehensive workflow that integrates AI-powered ticket resolution with intelligent feedback collection and knowledge base enhancement.

