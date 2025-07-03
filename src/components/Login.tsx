import React, { useState } from 'react';
import { MessageCircle, Bot, Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await login(username, password);
    
    if (!success) {
      setError('Invalid credentials. Try: admin / admin123');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-wa-gray flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-wa-teal to-wa-green rounded-full mb-4 text-5xl shadow select-none" role="img" aria-label="Bot">🤖</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">Welcome to MicroLearn <span className="ml-2">🎓</span></h1>
            <p className="text-gray-600">Sign in to your admin dashboard</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wa-teal focus:border-transparent transition-colors"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wa-teal focus:border-transparent transition-colors"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                <span className="text-xl" role="img" aria-label="Oops">😅</span>
                <p className="text-red-600 text-sm">{error} (Tip: Try the demo credentials below!)</p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-wa-teal to-wa-green hover:from-wa-teal-dark hover:to-wa-green text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Bot className="w-5 h-5 mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>
          <div className="mt-6 p-4 bg-wa-light rounded-lg border border-wa-green">
            <p className="text-sm text-wa-teal-dark text-center">
              <strong>Demo Credentials:</strong><br />
              Username: <span className="font-mono">admin</span><br />
              Password: <span className="font-mono">admin123</span>
            </p>
          </div>
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              WhatsApp Microlearning Bot Dashboard v1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;