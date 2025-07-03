import React from 'react';
import { Bell, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-3xl select-none" role="img" aria-label="Bot">🤖</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">Dashboard <span className="ml-2">🚀</span></h1>
            <p className="text-gray-600">Manage your WhatsApp microlearning bot with ease!</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-xl shadow select-none" role="img" aria-label="User">👤</div>
              <span className="text-sm font-semibold text-gray-800">{user ? `Hi, ${user.username}!` : 'Welcome!'}</span>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;