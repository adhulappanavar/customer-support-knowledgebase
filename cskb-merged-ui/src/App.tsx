import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TicketResolution from './pages/TicketResolution';
import FeedbackCollection from './pages/FeedbackCollection';
import EnhancedKB from './pages/EnhancedKB';
import SystemHealth from './pages/SystemHealth';
import AgentStatus from './pages/AgentStatus';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ticket-resolution" element={<TicketResolution />} />
              <Route path="/feedback-collection" element={<FeedbackCollection />} />
              <Route path="/enhanced-kb" element={<EnhancedKB />} />
              <Route path="/system-health" element={<SystemHealth />} />
              <Route path="/agent-status" element={<AgentStatus />} />
            </Routes>
          </main>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </Router>
    </ErrorBoundary>
  );
};

export default App;

