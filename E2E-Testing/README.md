# CSKB E2E Testing with Playwright

This directory contains comprehensive End-to-End (E2E) testing for the CSKB Merged UI using Playwright. The tests cover both API endpoints and UI functionality with proper data cleanup and setup.

## 🚀 Quick Start

### Prerequisites

1. **Backend Services Running**:
   - Feedback Agents Service: `http://localhost:8002`
   - Knowledge API: `http://localhost:8000` (optional)
   - Merged UI: `http://localhost:3001`

2. **Node.js**: Version 16 or higher
3. **npm**: For package management

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run install-browsers

# Setup test data
npm run setup
```

## 🧪 Running Tests

### All Tests
```bash
npm test
```

### UI Tests Only
```bash
npm run test:ui
```

### API Tests Only
```bash
npm run test:api
```

### Headed Mode (with browser visible)
```bash
npm run test:headed
```

### Debug Mode
```bash
npm run test:debug
```

### Generate Test Report
```bash
npm run test:report
```

## 📁 Test Structure

```
E2E-Testing/
├── tests/
│   ├── api/                    # API endpoint tests
│   │   ├── feedback-api.spec.ts
│   │   └── system-api.spec.ts
│   └── ui/                     # UI functionality tests
│       ├── dashboard.spec.ts
│       └── feedback-collection.spec.ts
├── utils/                      # Test utilities
│   ├── test-helpers.ts         # Common test operations
│   └── test-data-setup.ts      # Test data management
├── scripts/                    # Setup and cleanup scripts
│   ├── setup-test-data.js      # Prepare test environment
│   └── cleanup-test-data.js    # Clean up after tests
├── global-setup.ts             # Global test setup
├── global-teardown.ts          # Global test cleanup
├── playwright.config.ts        # Playwright configuration
└── package.json                # Dependencies and scripts
```

## 🔧 Test Data Management

### Automatic Setup
Test data is automatically set up before each test run and cleaned up after completion.

### Manual Setup
```bash
# Setup test data manually
npm run test:setup

# Clean up test data manually
npm run cleanup
```

### Force Cleanup
```bash
# Force cleanup with additional checks
npm run cleanup -- --force
```

## 📊 Test Coverage

### API Tests (`@api`)
- **Feedback API**: CRUD operations, validation, error handling
- **System API**: Health checks, agent status, enhanced KB
- **Performance**: Concurrent requests, large data handling
- **Error Handling**: Invalid inputs, network failures

### UI Tests (`@ui`)
- **Dashboard**: System overview, ticket creation, navigation
- **Feedback Collection**: Statistics, filtering, pagination
- **Responsive Design**: Mobile, tablet, desktop layouts
- **Error Handling**: Network errors, validation messages
- **Loading States**: Spinners, progress indicators

## 🎯 Test Scenarios

### Dashboard Testing
- ✅ Page loads successfully
- ✅ System health information displayed
- ✅ Agent status information displayed
- ✅ Ticket resolution workflow
- ✅ Form validation and error handling
- ✅ Responsive design across devices
- ✅ Navigation between pages
- ✅ Loading states and auto-refresh

### Feedback Collection Testing
- ✅ Page loads with statistics
- ✅ Feedback table displays data
- ✅ Filtering by feedback type
- ✅ Search functionality
- ✅ Pagination controls
- ✅ Export functionality
- ✅ Empty state handling
- ✅ Network error handling

### API Endpoint Testing
- ✅ CRUD operations for feedback
- ✅ System health endpoints
- ✅ Agent status endpoints
- ✅ Enhanced KB endpoints
- ✅ Input validation
- ✅ Error handling
- ✅ Performance under load
- ✅ Data consistency

## 🔍 Test Configuration

### Playwright Config
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Parallel Execution**: Enabled for faster test runs
- **Retries**: 2 retries in CI, 0 in development
- **Screenshots**: On failure only
- **Videos**: Retained on failure
- **Traces**: On first retry

### Environment Variables
```bash
# Optional: Override default URLs
REACT_APP_API_URL=http://localhost:8000
REACT_APP_FEEDBACK_AGENTS_URL=http://localhost:8002
```

## 🚨 Troubleshooting

### Common Issues

#### Backend Services Not Running
```bash
# Check if services are accessible
curl http://localhost:8002/health
curl http://localhost:8000/health
```

#### Test Data Cleanup Issues
```bash
# Force cleanup
npm run cleanup -- --force

# Manual cleanup via API
curl -X DELETE http://localhost:8002/feedback/{feedback_id}
```

#### Browser Installation Issues
```bash
# Reinstall browsers
npx playwright install --force
```

#### Network Timeouts
- Increase timeout in `playwright.config.ts`
- Check firewall settings
- Verify service accessibility

### Debug Mode
```bash
# Run tests with debug information
npm run test:debug

# This will:
# - Show browser window
# - Pause on failures
# - Provide step-by-step debugging
```

## 📈 Performance Testing

### Load Testing
- **Concurrent API Requests**: Tests multiple simultaneous calls
- **Large Data Handling**: Tests with large feedback entries
- **Auto-refresh Performance**: Tests UI responsiveness during updates

### Memory Testing
- **Long-running Tests**: Ensures no memory leaks
- **Data Cleanup**: Verifies proper cleanup after tests

## 🔒 Security Testing

### Input Validation
- **Special Characters**: Tests with special characters in inputs
- **Large Inputs**: Tests with very long text inputs
- **XSS Prevention**: Tests script injection attempts

### API Security
- **Authentication**: Tests unauthorized access handling
- **Input Sanitization**: Tests data sanitization
- **Rate Limiting**: Tests API abuse prevention

## 🌐 Browser Compatibility

### Supported Browsers
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Chrome
- ✅ Mobile Safari

### Responsive Testing
- **Viewport Sizes**: 375x667, 768x1024, 1920x1080
- **Touch Interactions**: Mobile-specific test scenarios
- **Layout Adaptation**: Responsive design verification

## 📝 Adding New Tests

### API Test Template
```typescript
import { test, expect } from '@playwright/test';
import axios from 'axios';

test.describe('@api New API Tests', () => {
  test('should test new endpoint', async () => {
    const response = await axios.get('http://localhost:8002/new-endpoint');
    expect(response.status).toBe(200);
  });
});
```

### UI Test Template
```typescript
import { test, expect } from '@playwright/test';
import { TestHelpers, setupTest, teardownTest } from '../../utils/test-helpers';

test.describe('@ui New UI Tests', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    await setupTest(page);
    helpers = new TestHelpers(page);
  });

  test('should test new functionality', async ({ page }) => {
    // Test implementation
  });
});
```

## 🎉 Best Practices

### Test Organization
- Use descriptive test names
- Group related tests with `test.describe`
- Tag tests with `@api` or `@ui` for selective execution

### Data Management
- Always clean up test data
- Use unique identifiers for test data
- Avoid hardcoded values

### Error Handling
- Test both success and failure scenarios
- Verify error messages and states
- Test network error conditions

### Performance
- Keep tests focused and fast
- Use appropriate waits and timeouts
- Avoid unnecessary delays

## 📊 Reporting

### HTML Report
```bash
npm run test:report
```
Opens detailed HTML report with:
- Test results and timing
- Screenshots on failure
- Video recordings on failure
- Trace files for debugging

### CI Integration
- JUnit XML output for CI systems
- JSON results for custom reporting
- Exit codes for build integration

## 🤝 Contributing

### Adding New Tests
1. Create test file in appropriate directory
2. Follow naming conventions
3. Include proper setup/teardown
4. Add comprehensive test coverage
5. Update this README if needed

### Test Data
1. Use `setupTestData()` for test preparation
2. Clean up in `afterEach` or `afterAll`
3. Use unique identifiers for test data
4. Document test data requirements

---

**Happy Testing! 🚀**

For questions or issues, check the troubleshooting section or review the test logs.
