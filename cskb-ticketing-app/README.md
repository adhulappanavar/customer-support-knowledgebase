# 🎫 Customer Support Knowledge Base - Ticketing App

A comprehensive ticketing system built with FastAPI and SQLite, designed to integrate with your customer support knowledge base. This system provides full ticket lifecycle management, user management, and comprehensive reporting.

## 🚀 Features

### **Core Ticketing System**
- **Ticket Creation & Management**: Full CRUD operations for support tickets
- **Priority Management**: 5-level priority system with SLA tracking
- **Status Tracking**: Complete ticket lifecycle from Open to Closed
- **Category Organization**: Organized ticket categorization with SLA requirements
- **Assignment System**: Agent assignment and workload management

### **Advanced Features**
- **Comment System**: Public and internal comments for ticket communication
- **History Tracking**: Complete audit trail of all ticket changes
- **SLA Management**: Automatic due date calculation based on priority and category
- **Tagging System**: Flexible tagging for better ticket organization
- **User Roles**: Customer, Agent, Manager, and Admin role management

### **Reporting & Analytics**
- **Real-time Statistics**: Dashboard with key metrics
- **Category Analysis**: Ticket distribution by category
- **Priority Distribution**: Critical ticket identification
- **Performance Metrics**: Open vs. resolved ticket tracking

## 🛠️ Technology Stack

- **Backend**: FastAPI (Python 3.8+)
- **Database**: SQLite with automatic schema creation
- **API Documentation**: Auto-generated OpenAPI/Swagger docs
- **Data Validation**: Pydantic models with comprehensive validation
- **CORS Support**: Full cross-origin request support

## 📦 Installation

### **Prerequisites**
- Python 3.8 or higher
- pip package manager

### **Quick Start**
1. **Clone or navigate to the directory:**
   ```bash
   cd cskb-ticketing-app
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the application:**
   ```bash
   # Option 1: Use the startup script
   chmod +x start.sh
   ./start.sh
   
   # Option 2: Run directly
   python main.py
   ```

4. **Access the application:**
   - **API**: http://localhost:8001
   - **Interactive Docs**: http://localhost:8001/docs
   - **Alternative Docs**: http://localhost:8001/redoc
   - **Health Check**: http://localhost:8001/health

## 🎯 API Endpoints

### **Core Ticket Operations**
- `POST /tickets` - Create new ticket
- `GET /tickets` - List tickets with filters
- `GET /tickets/{id}` - Get specific ticket
- `PUT /tickets/{id}` - Update ticket
- `POST /tickets/{id}/comments` - Add comment
- `GET /tickets/{id}/comments` - Get ticket comments
- `GET /tickets/{id}/history` - Get ticket history

### **Reference Data**
- `GET /categories` - List all categories
- `GET /priorities` - List priority levels
- `GET /statuses` - List ticket statuses
- `GET /users` - List users (with role filtering)

### **Analytics**
- `GET /statistics` - Get comprehensive ticket statistics

## 🗄️ Database Schema

### **Core Tables**
- **users**: User accounts with roles
- **tickets**: Main ticket information
- **categories**: Ticket categories with SLA requirements
- **priority_levels**: Priority definitions with colors and SLA
- **statuses**: Ticket status definitions
- **ticket_comments**: Public and internal comments
- **ticket_history**: Complete audit trail

### **Sample Data**
The system comes pre-loaded with:
- 5 sample users (admin, customers, agents, managers)
- 5 ticket categories (Technical, Billing, Feature Request, etc.)
- 5 priority levels (Low to Emergency)
- 5 status types (Open to Closed)
- 5 sample tickets with comments

## 🔧 Configuration

### **Port Configuration**
The default port is 8001. To change it, modify the `main.py` file:

```python
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)  # Change port here
```

### **Database Configuration**
The SQLite database is automatically created as `tickets.db` in the current directory. To use a different location:

```python
# In database.py
db = TicketDatabase("path/to/your/tickets.db")
```

### **CORS Configuration**
CORS is enabled for all origins by default. For production, restrict this in `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Restrict origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📊 Sample Usage

### **Create a New Ticket**
```bash
curl -X POST "http://localhost:8001/tickets" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Login Issue",
    "description": "Cannot access the system with my credentials",
    "user_id": 2,
    "category_id": 1,
    "priority_id": 3,
    "tags": "login,access"
  }'
```

### **Get All Tickets**
```bash
curl "http://localhost:8001/tickets"
```

### **Get Ticket Statistics**
```bash
curl "http://localhost:8001/statistics"
```

### **Add a Comment**
```bash
curl -X POST "http://localhost:8001/tickets/1/comments?user_id=4" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "Investigating the issue now",
    "is_internal": false
  }'
```

## 🔍 Integration with RAG System

This ticketing system is designed to work alongside your RAG-based knowledge base:

1. **Knowledge Integration**: Tickets can reference knowledge base articles
2. **Automated Responses**: Use RAG to suggest responses to common issues
3. **Workflow Enhancement**: Combine ticket tracking with intelligent knowledge retrieval
4. **Customer Experience**: Provide instant answers while tracking complex issues

## 🚨 Troubleshooting

### **Common Issues**

1. **Port Already in Use**
   ```bash
   # Check what's using port 8001
   lsof -i :8001
   
   # Kill the process or change the port
   ```

2. **Database Permission Issues**
   ```bash
   # Ensure write permissions
   chmod 755 .
   ```

3. **Missing Dependencies**
   ```bash
   # Reinstall requirements
   pip install -r requirements.txt --force-reinstall
   ```

### **Development Tips**

- Use the interactive API docs at `/docs` for testing
- Check the console for detailed error messages
- Monitor the SQLite database file for data integrity
- Use the health endpoint to verify system status

## 🔮 Future Enhancements

### **Planned Features**
- **Email Integration**: Automatic ticket creation from emails
- **Webhook Support**: Real-time notifications to external systems
- **Advanced Reporting**: Custom report generation
- **Mobile App**: Native mobile application
- **Multi-tenant Support**: Organization-level isolation

### **Integration Possibilities**
- **Slack/Discord**: Real-time notifications
- **CRM Systems**: Customer data synchronization
- **Analytics Platforms**: Advanced metrics and insights
- **Knowledge Base**: Direct integration with your RAG system

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation at `/docs`
3. Check console logs for error details
4. Verify database connectivity

---

**Happy Ticketing! 🎫✨**

Your customer support team now has a powerful, scalable ticketing system that can grow with your needs and integrate seamlessly with your existing RAG knowledge base.
