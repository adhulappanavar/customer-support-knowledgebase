# CSKB Feedback Agents React UI

A modern, responsive React frontend for the CSKB Feedback Agents system, providing an intuitive interface for managing AI-powered customer support knowledge enhancement.

## Features

### 🎯 **Dashboard**
- Real-time system overview with key metrics
- Quick access to all major functions
- System status monitoring
- Agent performance tracking

### 📝 **Feedback Collection**
- Intuitive feedback submission form
- Support for multiple feedback types (Perfect, Minor Changes, New Solution)
- Dynamic context field management
- Form validation and error handling

### 📊 **Feedback History**
- Comprehensive feedback viewing and analysis
- Advanced filtering and search capabilities
- Performance metrics and statistics
- Export functionality

### 🤖 **Agent Status**
- Real-time agent monitoring
- Performance metrics visualization
- Interactive charts and graphs
- System health indicators

### 💓 **System Health**
- Overall system status monitoring
- Component health tracking
- Visual health score representation
- Real-time alerts and notifications

### 🧠 **Enhanced Knowledge Base**
- Dual view modes (Statistics & Solutions)
- Knowledge solution browsing
- Category-based organization
- Learning insights and analytics

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom component classes
- **Routing**: React Router v6
- **State Management**: React Hooks
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- CSKB Feedback Agents backend running on port 8002

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd cskb-feedback-agent-reactui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
# or
yarn build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Sidebar.tsx     # Navigation sidebar
├── pages/              # Main application pages
│   ├── Dashboard.tsx           # Main dashboard
│   ├── FeedbackCollection.tsx  # Feedback submission
│   ├── FeedbackHistory.tsx     # Feedback viewing
│   ├── AgentStatus.tsx         # Agent monitoring
│   ├── SystemHealth.tsx        # System health
│   └── EnhancedKB.tsx          # Knowledge base
├── services/           # API integration
│   └── api.ts         # API client and types
├── App.tsx            # Main application component
├── index.tsx          # Application entry point
└── index.css          # Global styles and Tailwind
```

## API Integration

The frontend communicates with the CSKB Feedback Agents backend through the following endpoints:

- **Health Check**: `/health`
- **Feedback Management**: `/feedback`
- **Agent Status**: `/agents/status`
- **System Health**: `/system/health`
- **Enhanced KB**: `/enhanced-kb/*`

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8002
```

### Proxy Configuration

The development server is configured to proxy API requests to the backend:

```json
{
  "proxy": "http://localhost:8002"
}
```

## Customization

### Styling

The application uses Tailwind CSS with custom component classes defined in `src/index.css`. You can customize:

- Color schemes in `tailwind.config.js`
- Component styles in the CSS layer components
- Responsive breakpoints and layouts

### Components

All components are built with reusability in mind. You can easily:

- Modify existing components
- Create new components following the established patterns
- Extend the component library

## Development

### Code Style

- Use TypeScript for type safety
- Follow React functional component patterns
- Implement proper error handling
- Use React hooks for state management

### Adding New Features

1. Create new page components in `src/pages/`
2. Add routing in `src/App.tsx`
3. Update the sidebar navigation
4. Implement API integration in `src/services/api.ts`

### Testing

```bash
npm test
# or
yarn test
```

## Deployment

### Build Process

1. Run the build command: `npm run build`
2. The `build/` folder contains the production-ready files
3. Deploy the contents to your web server

### Docker (Optional)

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Ensure the CSKB Feedback Agents backend is running on port 8002
   - Check network connectivity and firewall settings

2. **Build Errors**
   - Clear `node_modules` and reinstall dependencies
   - Check Node.js version compatibility

3. **Styling Issues**
   - Verify Tailwind CSS is properly configured
   - Check for CSS conflicts

### Debug Mode

Enable debug logging by setting the environment variable:

```bash
REACT_APP_DEBUG=true npm start
```

## Contributing

1. Follow the established code patterns
2. Add proper TypeScript types
3. Include error handling
4. Test your changes thoroughly
5. Update documentation as needed

## License

This project is part of the CSKB Feedback Agents system and follows the same licensing terms.

## Support

For issues and questions:
- Check the backend logs for API errors
- Review the browser console for frontend errors
- Ensure all dependencies are properly installed
- Verify the backend is accessible from the frontend

---

**Built with ❤️ for the CSKB Feedback Agents System**
