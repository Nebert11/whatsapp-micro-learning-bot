import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  MessageCircle,
  Bot
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Content', href: '/content', icon: BookOpen },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar = () => {
  return (
    <div className="bg-wa-teal-dark text-white w-64 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-wa-green to-wa-teal rounded-full flex items-center justify-center text-3xl shadow-lg select-none" role="img" aria-label="Bot">🤖</div>
          <div>
            <h2 className="text-xl font-bold flex items-center">MicroLearn <span className="ml-2">✨</span></h2>
            <p className="text-gray-300 text-sm">Bot Dashboard</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-wa-teal to-wa-green text-white shadow-md'
                  : 'text-gray-300 hover:bg-wa-teal hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">
              {item.name === 'Dashboard' && 'Dashboard 🏠'}
              {item.name === 'Users' && 'Users 👥'}
              {item.name === 'Content' && 'Content 📚'}
              {item.name === 'Analytics' && 'Analytics 📈'}
              {item.name === 'Settings' && 'Settings ⚙️'}
              {!['Dashboard','Users','Content','Analytics','Settings'].includes(item.name) && item.name}
            </span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-wa-teal">
        <div className="flex items-center space-x-3 text-gray-300">
          <span className="text-lg" role="img" aria-label="Bot">🤖</span>
          <div>
            <p className="text-sm font-medium">Bot Status <span className="ml-1">🟢</span></p>
            <p className="text-xs">Online & Ready</p>
          </div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;