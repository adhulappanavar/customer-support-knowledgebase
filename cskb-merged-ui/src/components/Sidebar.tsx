import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  ThumbsUp, 
  Brain, 
  Activity, 
  Users,
  Workflow
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Ticket Resolution', href: '/ticket-resolution', icon: MessageSquare },
    { name: 'Feedback Collection', href: '/feedback-collection', icon: ThumbsUp },
    { name: 'Enhanced KB', href: '/enhanced-kb', icon: Brain },
    { name: 'System Health', href: '/system-health', icon: Activity },
    { name: 'Agent Status', href: '/agent-status', icon: Users },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <Workflow className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">CSKB</h1>
            <p className="text-sm text-gray-500">Merged Workflow</p>
          </div>
        </div>
      </div>

      <nav className="px-4 pb-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                  ${isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon
                  className={`
                    mr-3 h-5 w-5 transition-colors duration-200
                    ${isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'}
                  `}
                />
                {item.name}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            CSKB Merged Workflow UI
          </p>
          <p className="text-xs text-gray-400 mt-1">
            v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

