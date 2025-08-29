import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import FeedbackCollection from './pages/FeedbackCollection';
import FeedbackHistory from './pages/FeedbackHistory';
import AgentStatus from './pages/AgentStatus';
import SystemHealth from './pages/SystemHealth';
import EnhancedKB from './pages/EnhancedKB';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/feedback" element={<FeedbackCollection />} />
                <Route path="/history" element={<FeedbackHistory />} />
                <Route path="/agents" element={<AgentStatus />} />
                <Route path="/health" element={<SystemHealth />} />
                <Route path="/knowledge" element={<EnhancedKB />} />
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
            }}
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
