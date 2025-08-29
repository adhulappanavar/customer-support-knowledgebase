import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  History, 
  Activity, 
  Heart, 
  Brain,
  Settings
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Feedback Collection', href: '/feedback', icon: MessageSquare },
    { name: 'Feedback History', href: '/history', icon: History },
    { name: 'Agent Status', href: '/agents', icon: Activity },
    { name: 'System Health', href: '/health', icon: Heart },
    { name: 'Enhanced KB', href: '/knowledge', icon: Brain },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">CSKB Feedback</span>
        </div>
      </div>
      
      <nav className="mt-8 px-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                  ${isActive 
                    ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
      
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-500">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
