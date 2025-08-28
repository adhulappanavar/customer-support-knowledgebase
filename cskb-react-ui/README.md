# Customer Support Knowledge Base - React UI

A modern, responsive React interface for the Customer Support Knowledge Base RAG API. This UI provides an intuitive way to upload PDF documents, query the knowledge base, and manage ingested documents.

## 🚀 Features

### **Document Management**
- **PDF Upload**: Drag & drop or click to upload PDF documents
- **Document Categorization**: Add categories to organize your knowledge base
- **Status Tracking**: Monitor upload and ingestion status
- **Document List**: View all ingested documents with metadata

### **RAG Query Interface**
- **Natural Language Queries**: Ask questions in plain English
- **Real-time Responses**: Get instant answers from your knowledge base
- **Source Attribution**: See which documents were used for each response
- **RAG Indicators**: Clear indication when RAG is being used

### **Modern UI/UX**
- **Material-UI Design**: Clean, professional interface
- **Responsive Layout**: Works on desktop and mobile devices
- **Tabbed Interface**: Organized workflow with intuitive navigation
- **Real-time Status**: System health monitoring and notifications

## 🛠️ Technology Stack

- **React 18** with TypeScript
- **Material-UI (MUI)** for components and theming
- **Axios** for API communication
- **React Dropzone** for file uploads
- **Custom CSS** for enhanced styling

## 📦 Installation

1. **Navigate to the React UI directory:**
   ```bash
   cd cskb-react-ui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🔧 Prerequisites

- **Node.js** (v16 or higher)
- **RAG API Backend** running on `http://localhost:8000`
- **Modern web browser** with ES6+ support

## 🎯 Usage

### **1. Upload Documents**
- Navigate to the "Upload Documents" tab
- Drag & drop PDF files or click to browse
- Enter document name and optional category
- Click "Upload Document" to ingest into the knowledge base

### **2. Query Knowledge**
- Switch to the "Query Knowledge" tab
- Type your question in natural language
- Press Enter or click "Ask" to get a response
- View the answer and source documents used

### **3. Manage Documents**
- Check the "Documents" tab to see all ingested files
- Monitor upload status and document metadata
- Refresh the list to see new documents

## 🏗️ Project Structure

```
src/
├── components/
│   ├── PDFUpload.tsx          # PDF upload interface
│   ├── KnowledgeQuery.tsx     # RAG query interface
│   └── DocumentsList.tsx      # Document management
├── services/
│   └── api.ts                 # API communication layer
├── App.tsx                    # Main application component
└── index.css                  # Custom styles
```

## 🔌 API Integration

The UI communicates with your RAG backend through these endpoints:

- `GET /health` - System health check
- `POST /ingest/pdf` - PDF document ingestion
- `POST /query` - Knowledge base queries
- `GET /documents` - List all documents

## 🎨 Customization

### **Theming**
Modify the Material-UI theme in `App.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Your brand color
    },
    // ... other theme options
  },
});
```

### **Styling**
Custom CSS classes are available in `index.css` for:
- Custom scrollbars
- Enhanced dropzone styling
- Smooth transitions
- Focus states

## 🚀 Production Build

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## 🔍 Troubleshooting

### **Common Issues**

1. **API Connection Failed**
   - Ensure your RAG backend is running on port 8000
   - Check CORS configuration in the backend
   - Verify network connectivity

2. **Upload Failures**
   - Check file size limits (default: 50MB)
   - Ensure PDF files are valid and not corrupted
   - Verify backend storage permissions

3. **Query Timeouts**
   - Check OpenAI API key configuration
   - Monitor backend logs for errors
   - Verify vector database connectivity

### **Development Tips**

- Use browser developer tools to monitor API calls
- Check the Network tab for request/response details
- Monitor console for JavaScript errors
- Verify backend logs for server-side issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review backend logs
3. Verify API connectivity
4. Check browser console for errors

---

**Happy RAG-ing! 🧠✨**
