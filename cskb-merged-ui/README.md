# CSKB Merged Workflow UI

A comprehensive React-based user interface that integrates ticket AI resolution, feedback collection, and enhanced knowledge base management into a unified workflow system.

## 🚀 Features

### **Integrated Workflow Management**
- **Ticket Resolution**: AI-powered ticket resolution using the knowledge base
- **Feedback Collection**: Seamless feedback collection after AI resolution
- **Enhanced Knowledge Base**: Explore learned solutions and insights
- **Real-time Monitoring**: Live system health and agent status monitoring

### **Smart AI Integration**
- **Knowledge Base Query**: Leverages `cskb-api` for intelligent ticket resolution
- **Feedback Learning**: Integrates with `cskb-feedback-agents` for continuous improvement
- **Automated Workflows**: End-to-end ticket resolution with feedback collection

### **Modern User Interface**
- **Responsive Design**: Built with Tailwind CSS for modern, responsive layouts
- **TypeScript**: Full type safety and better development experience
- **Real-time Updates**: Live data updates and system monitoring
- **Interactive Components**: Rich UI components with smooth interactions

## 🏗️ Architecture

### **Frontend Components**
- **Dashboard**: Central hub with workflow overview and quick actions
- **Ticket Resolution**: AI resolution generation and feedback collection
- **Feedback Collection**: Comprehensive feedback management and analysis
- **Enhanced KB**: Knowledge base exploration and solution management
- **System Health**: Real-time system monitoring and status
- **Agent Status**: Detailed agent performance and metrics

### **API Integration**
- **Knowledge API** (`cskb-api`): Document ingestion and querying
- **Feedback API** (`cskb-feedback-agents`): Feedback collection and learning
- **Enhanced KB API**: Solution management and statistics
- **System API**: Health monitoring and agent status

## 🛠️ Technology Stack

- **React 18**: Modern UI framework with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling framework
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication
- **React Hook Form**: Form management
- **React Hot Toast**: Notification system
- **Lucide React**: Modern icon library

## 📋 Prerequisites

- Node.js 18+ and npm
- Both backend services running:
  - `cskb-api` on port 8000
  - `cskb-feedback-agents` on port 8002

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd cskb-merged-ui
npm install
```

### 2. Start Development Server
```bash
npm start
```

The application will be available at `http://localhost:3000`

### 3. Build for Production
```bash
npm run build
```

## 🔧 Configuration

### **API Endpoints**
The UI automatically connects to:
- **Knowledge Base API**: `http://localhost:8000`
- **Feedback Agents API**: `http://localhost:8002`

### **Environment Variables**
Create a `.env` file if you need to customize API endpoints:
```bash
REACT_APP_KNOWLEDGE_API_URL=http://localhost:8000
REACT_APP_FEEDBACK_API_URL=http://localhost:8002
```

## 📱 Usage

### **Dashboard**
- **Quick Actions**: Create new ticket resolutions
- **System Overview**: Monitor system health and agent status
- **Workflow Status**: Track active ticket resolution workflows

### **Ticket Resolution**
1. **Create Ticket**: Enter ticket ID and customer query
2. **AI Resolution**: System generates AI-powered solution
3. **Feedback Collection**: Provide feedback on AI resolution quality
4. **Learning Integration**: Feedback automatically improves knowledge base

### **Feedback Collection**
- **Search & Filter**: Find specific feedback entries
- **Statistics**: View feedback metrics and trends
- **Detailed View**: Examine individual feedback entries

### **Enhanced Knowledge Base**
- **Solution Exploration**: Browse AI-generated and human-validated solutions
- **Category Filtering**: Filter solutions by technical domain
- **Performance Metrics**: View confidence scores and usage statistics

### **System Monitoring**
- **Real-time Health**: Live system status updates
- **Agent Performance**: Monitor AI agent metrics and performance
- **Database Status**: Check database connection health

## 🔄 Workflow Process

### **1. Ticket Creation**
- User creates ticket with customer query
- System queries knowledge base for AI resolution
- AI solution generated with confidence scoring

### **2. Feedback Collection**
- User reviews AI resolution
- Feedback collected on solution quality
- Human solutions captured when AI falls short

### **3. Learning Integration**
- Feedback triggers learning processes
- Knowledge base updated with new insights
- System continuously improves AI resolution quality

### **4. Monitoring & Analytics**
- Real-time system health monitoring
- Agent performance tracking
- Feedback analytics and trends

## 🧪 Testing

### **Development Testing**
```bash
npm test
```

### **API Testing**
Ensure both backend services are running:
```bash
# Test Knowledge API
curl http://localhost:8000/health

# Test Feedback API
curl http://localhost:8002/system/health
```

## 🚀 Deployment

### **Production Build**
```bash
npm run build
```

### **Static Hosting**
Deploy the `build` folder to any static hosting service:
- Netlify
- Vercel
- AWS S3
- GitHub Pages

### **Docker Deployment**
```dockerfile
FROM nginx:alpine
COPY build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔧 Troubleshooting

### **Common Issues**

#### **API Connection Errors**
- Verify both backend services are running
- Check API endpoint URLs in configuration
- Ensure CORS is properly configured on backend

#### **Empty Data**
- Check backend service health
- Verify database connections
- Review backend logs for errors

#### **Build Errors**
- Clear `node_modules` and reinstall
- Check TypeScript compilation errors
- Verify all dependencies are installed

### **Debug Mode**
Enable debug logging in browser console:
```javascript
localStorage.setItem('debug', 'true');
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **React Team**: For the amazing UI framework
- **Tailwind CSS**: For the utility-first CSS framework
- **FastAPI**: For the high-performance backend APIs
- **LanceDB**: For the vector database capabilities

---

**Built with ❤️ for intelligent customer support workflows**

