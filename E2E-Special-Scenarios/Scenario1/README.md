# E2E Scenario 1: Complete Knowledge Base Enhancement Workflow

## Overview
This scenario demonstrates the complete workflow from initial knowledge base setup through AI resolution generation and human feedback integration, showcasing the enhanced knowledge base capabilities.

## 🎯 Scenario Steps

1. **🧹 Clean All Data** - All KB's and Databases
2. **📄 Ingest a PDF** - Process and index new knowledge
3. **🎫 Create Relevant Tickets** - Store in ticketing database
4. **🤖 Pickup a Ticket and Ask for AI Resolution** - Generate initial AI solution
5. **👤 Provide Human Feedback** - Submit feedback on the ticket
6. **🚀 Query Ticket Again for AI Resolution** - Get both Original KB and Enhanced KB

## 🚀 Quick Start

### Prerequisites
1. **Backend Services Running**:
   - CSKB API (port 8000)
   - Feedback Agents (port 8002)
   - React UI (port 3001)

2. **Python Environment**:
   ```bash
   python3 --version  # Python 3.8+
   pip3 --version     # pip package manager
   ```

### Installation
```bash
# Install Python dependencies
pip3 install -r requirements.txt
```

### Execution
```bash
# Run the complete E2E scenario
python3 e2e_scenario1.py
```

## 📋 Detailed Execution

### Step-by-Step Breakdown

#### Step 1: Clean All Data
- Cleans knowledge base database
- Cleans enhanced knowledge base
- Cleans feedback database
- Cleans ticketing database

#### Step 2: Ingest PDF
- Uploads PDF to knowledge base service
- Processes text extraction
- Indexes content for search

#### Step 3: Create Ticket
- Generates unique ticket ID
- Stores customer issue description
- Sets priority and category
- Links to knowledge base

#### Step 4: AI Resolution
- Requests AI resolution for ticket
- Processes ticket content
- Searches knowledge base
- Generates solution with confidence scores

#### Step 5: Human Feedback
- Reviews AI resolution
- Provides effectiveness rating
- Submits detailed feedback
- Updates enhanced knowledge base

#### Step 6: Enhanced AI Resolution
- Queries ticket again
- Incorporates both original and enhanced KB
- Generates improved resolution
- Shows confidence improvements

## 🔧 Configuration

### API Endpoints
```python
self.base_url = "http://localhost:8000"      # CSKB API
self.feedback_url = "http://localhost:8002"  # Feedback Agents
```

### Test Parameters
```python
pdf_path = "../pdf-files/technical_troubleshooting_guide.pdf"
issue_description = "Customer experiencing network connectivity issues after system update"
```

## 📊 Expected Results

| Step | Expected Outcome | Validation Criteria |
|------|------------------|-------------------|
| 1. Clean Data | All databases empty | No existing records |
| 2. Ingest PDF | Document indexed | Searchable content available |
| 3. Create Ticket | Ticket stored | Unique ID generated |
| 4. AI Resolution | Resolution generated | Confidence score > 0.5 |
| 5. Human Feedback | Feedback stored | Enhanced KB updated |
| 6. Enhanced Resolution | Improved resolution | Higher confidence or more sources |

## 🐛 Troubleshooting

### Common Issues

#### Service Unavailable
```bash
# Check if services are running
curl http://localhost:8000/health
curl http://localhost:8002/health
```

#### PDF Not Found
```bash
# Verify PDF file path
ls -la ../pdf-files/
```

#### Database Connection Issues
```bash
# Check database services
ps aux | grep -E "(postgres|sqlite|mysql)"
```

### Debug Mode
Enable detailed logging:
```python
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
```

## 📁 File Structure

```
Scenario1/
├── E2EScenario1.md          # Complete scenario documentation
├── e2e_scenario1.py         # Python implementation
├── requirements.txt          # Python dependencies
└── README.md                # This file
```

## 🔍 Monitoring & Validation

### Log Output
The script provides detailed logging for each step:
- ✅ Success indicators
- ❌ Error details
- 📊 Progress tracking
- 🎯 Step completion

### Data Validation
- Ticket creation verification
- AI resolution quality assessment
- Feedback submission confirmation
- Enhanced resolution comparison

## 🎉 Success Criteria

The scenario is considered successful when:
1. All 6 steps complete without errors
2. AI resolution confidence improves
3. Enhanced knowledge base incorporates feedback
4. Data consistency maintained across databases

## 📈 Performance Metrics

- **Total Execution Time**: Target < 2 minutes
- **PDF Processing Time**: Target < 30 seconds
- **AI Resolution Time**: Target < 15 seconds per request
- **Feedback Processing**: Target < 10 seconds

## 🔄 Reusability

This scenario can be:
- **Reused** for regression testing
- **Modified** for different PDF content
- **Extended** with additional validation steps
- **Integrated** into CI/CD pipelines

## 📞 Support

For issues or questions:
1. Check the logs for detailed error information
2. Verify all backend services are running
3. Ensure PDF file paths are correct
4. Validate API endpoint configurations

---

*This E2E scenario provides comprehensive testing of the knowledge base enhancement workflow, validating that the system can learn from human feedback and improve AI resolution quality over time.*
