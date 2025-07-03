import React, { useState } from 'react';
import { 
  Save, 
  MessageCircle, 
  Clock, 
  Database, 
  Bell,
  Shield,
  Smartphone,
  Globe,
  AlertTriangle
} from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    // WhatsApp Settings
    twilioAccountSid: '',
    twilioAuthToken: '',
    whatsappNumber: '',
    webhookUrl: 'https://be2a-2c0f-fe38-2102-fb73-9cb0-1472-7e1f-306b.ngrok-free.app/api/bot/webhook',
    
    // Bot Settings
    defaultDeliveryTime: '09:00',
    timezone: 'UTC',
    welcomeMessage: 'Welcome to MicroLearn Bot! 🤖',
    helpMessage: 'Available commands: HELP, PAUSE, RESUME, SWITCH, PROGRESS',
    
    // Database Settings
    mongoUri: 'mongodb://localhost:27017/whatsapp-microlearning',
    
    // Notification Settings
    adminNotifications: true,
    errorAlerts: true,
    dailyReports: false,
    
    // Security Settings
    jwtSecret: '',
    verifyToken: '',
    rateLimitEnabled: true,
    maxRequestsPerMinute: 10
  });

  const handleInputChange = (key: string, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    // In a real app, this would save to the backend
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  const testWhatsAppConnection = async () => {
    // Mock test
    alert('WhatsApp connection test initiated. Check console for results.');
  };

  const exportData = () => {
    alert('Data export initiated. You will receive a download link shortly.');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-3xl select-none" role="img" aria-label="Bot">🤖</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">Settings <span className="ml-2">⚙️</span></h1>
            <p className="text-gray-600 mt-1">Configure your WhatsApp microlearning bot with ease!</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="bg-gradient-to-r from-wa-teal to-wa-green hover:from-wa-teal-dark hover:to-wa-green text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WhatsApp Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Smartphone className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">WhatsApp Configuration <span className='ml-2'>💬</span></h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twilio Account SID
              </label>
              <input
                type="text"
                value={settings.twilioAccountSid}
                onChange={(e) => handleInputChange('twilioAccountSid', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wa-teal focus:border-transparent"
                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twilio Auth Token
              </label>
              <input
                type="password"
                value={settings.twilioAuthToken}
                onChange={(e) => handleInputChange('twilioAuthToken', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wa-teal focus:border-transparent"
                placeholder="••••••••••••••••••••••••••••••••"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wa-teal focus:border-transparent"
                placeholder="+1234567890"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook URL
              </label>
              <input
                type="url"
                value={settings.webhookUrl}
                onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wa-teal focus:border-transparent"
                placeholder="https://your-domain.com/api/bot/webhook"
              />
            </div>
            
            <button 
              onClick={testWhatsAppConnection}
              className="w-full bg-wa-green hover:bg-wa-teal-dark text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Test Connection
            </button>
          </div>
        </div>

        {/* Bot Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">Bot Configuration <span className='ml-2'>🤖</span></h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Delivery Time
              </label>
              <input
                type="time"
                value={settings.defaultDeliveryTime}
                onChange={(e) => handleInputChange('defaultDeliveryTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wa-teal focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wa-teal focus:border-transparent"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Welcome Message
              </label>
              <textarea
                value={settings.welcomeMessage}
                onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wa-teal focus:border-transparent"
                placeholder="Enter welcome message..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Help Message
              </label>
              <textarea
                value={settings.helpMessage}
                onChange={(e) => handleInputChange('helpMessage', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wa-teal focus:border-transparent"
                placeholder="Enter help message..."
              />
            </div>
          </div>
        </div>

        {/* Database Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Database className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">Database Configuration <span className='ml-2'>🗄️</span></h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                MongoDB URI
              </label>
              <input
                type="text"
                value={settings.mongoUri}
                onChange={(e) => handleInputChange('mongoUri', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wa-teal focus:border-transparent"
                placeholder="mongodb://localhost:27017/whatsapp-microlearning"
              />
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={() => alert('Database connection test initiated.')}
                className="flex-1 bg-wa-teal hover:bg-wa-teal-dark text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Test Connection
              </button>
              <button 
                onClick={exportData}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="w-6 h-6 text-amber-600" />
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">Notifications <span className='ml-2'>🔔</span></h3>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.adminNotifications}
                onChange={(e) => handleInputChange('adminNotifications', e.target.checked)}
                className="w-4 h-4 text-wa-teal bg-gray-100 border-gray-300 rounded focus:ring-wa-teal"
              />
              <span className="text-sm font-medium text-gray-700">Admin Notifications</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.errorAlerts}
                onChange={(e) => handleInputChange('errorAlerts', e.target.checked)}
                className="w-4 h-4 text-wa-teal bg-gray-100 border-gray-300 rounded focus:ring-wa-teal"
              />
              <span className="text-sm font-medium text-gray-700">Error Alerts</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.dailyReports}
                onChange={(e) => handleInputChange('dailyReports', e.target.checked)}
                className="w-4 h-4 text-wa-teal bg-gray-100 border-gray-300 rounded focus:ring-wa-teal"
              />
              <span className="text-sm font-medium text-gray-700">Daily Reports</span>
            </label>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">Security Settings <span className='ml-2'>🔒</span></h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              JWT Secret
            </label>
            <input
              type="password"  
              value={settings.jwtSecret}
              onChange={(e) => handleInputChange('jwtSecret', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wa-teal focus:border-transparent"
              placeholder="••••••••••••••••••••••••••••••••"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Webhook Verify Token
            </label>
            <input
              type="text"
              value={settings.verifyToken}
              onChange={(e) => handleInputChange('verifyToken', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wa-teal focus:border-transparent"
              placeholder="Enter verify token"
            />
          </div>
          
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.rateLimitEnabled}
                onChange={(e) => handleInputChange('rateLimitEnabled', e.target.checked)}
                className="w-4 h-4 text-wa-teal bg-gray-100 border-gray-300 rounded focus:ring-wa-teal"
              />
              <span className="text-sm font-medium text-gray-700">Enable Rate Limiting</span>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Requests Per Minute
            </label>
            <input
              type="number"
              value={settings.maxRequestsPerMinute}
              onChange={(e) => handleInputChange('maxRequestsPerMinute', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wa-teal focus:border-transparent"
              min="1"
              max="100"
            />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900 flex items-center">Danger Zone <span className='ml-2'>⚠️</span></h3>
        </div>
        
        <div className="space-y-3">
          <p className="text-red-700 text-sm">
            These actions are irreversible. Please proceed with caution.
          </p>
          
          <div className="flex space-x-4">
            <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Reset All Settings
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Delete All User Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;