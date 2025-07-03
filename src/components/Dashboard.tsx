import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageCircle, 
  BookOpen, 
  TrendingUp,
  UserCheck,
  UserX,
  Clock,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface BotStats {
  totalUsers: number;
  activeUsers: number;
  pausedUsers: number;
  newUsersToday: number;
  activeThisWeek: number;
  engagementRate: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<BotStats>({
    totalUsers: 0,
    activeUsers: 0,
    pausedUsers: 0,
    newUsersToday: 0,
    activeThisWeek: 0,
    engagementRate: '0'
  });
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchActivity();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/bot/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setStats({
          totalUsers: 0,
          activeUsers: 0,
          pausedUsers: 0,
          newUsersToday: 0,
          activeThisWeek: 0,
          engagementRate: '0'
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        pausedUsers: 0,
        newUsersToday: 0,
        activeThisWeek: 0,
        engagementRate: '0'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchActivity = async () => {
    setActivityLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/bot/activity', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setActivity(data);
      } else {
        setActivity([]);
      }
    } catch (error) {
      setActivity([]);
    } finally {
      setActivityLoading(false);
    }
  };

  function timeAgo(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  }

  // Skeleton loader for stats
  const StatSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
          <div className="h-3 bg-gray-100 rounded w-20 mt-2"></div>
        </div>
        <div className="p-3 rounded-lg bg-gray-100 w-10 h-10"></div>
      </div>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, color, description, delay = 0 }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${color} mt-1`}>
            {loading ? <span className="inline-block w-10 h-8 bg-gray-200 animate-pulse rounded"></span> : value}
          </p>
          {description && (
            <p className="text-gray-500 text-xs mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text-wa-', 'bg-wa-').replace('-600', '-100')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-4xl select-none" role="img" aria-label="Bot">🤖</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">Dashboard Overview <span className="ml-2">📊</span></h1>
            <p className="text-gray-600 mt-1">
              {user ? `Good day, ${user.username}! 👋 Monitor your WhatsApp microlearning bot performance below.` : 'Monitor your WhatsApp microlearning bot performance'}
            </p>
          </div>
        </div>
        <button 
          onClick={fetchStats}
          className="bg-wa-teal hover:bg-wa-teal-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Users 👥"
              value={stats.totalUsers.toLocaleString()}
              icon={Users}
              color="text-blue-600"
              description="All registered users"
              delay={0.1}
            />
            <StatCard
              title="Active Users 🟢"
              value={stats.activeUsers.toLocaleString()}
              icon={UserCheck}
              color="text-wa-green"
              description="Currently receiving lessons"
              delay={0.2}
            />
            <StatCard
              title="Paused Users ⏸️"
              value={stats.pausedUsers.toLocaleString()}
              icon={UserX}
              color="text-amber-600"
              description="Temporarily paused"
              delay={0.3}
            />
            <StatCard
              title="New Today ✨"
              value={stats.newUsersToday.toLocaleString()}
              icon={TrendingUp}
              color="text-purple-600"
              description="New registrations"
              delay={0.4}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Engagement</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active This Week</span>
              <span className="font-semibold text-gray-900">{stats.activeThisWeek}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Engagement Rate</span>
              <span className="font-semibold text-wa-green">{stats.engagementRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-wa-green h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.engagementRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bot Status</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-wa-green rounded-full"></div>
              <span className="text-gray-600">WhatsApp Service</span>
              <span className="text-wa-green font-medium">Online</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-wa-green rounded-full"></div>
              <span className="text-gray-600">Daily Scheduler</span>
              <span className="text-wa-green font-medium">Running</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-wa-green rounded-full"></div>
              <span className="text-gray-600">Database</span>
              <span className="text-wa-green font-medium">Connected</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {activityLoading ? (
            <div className="text-gray-400 text-sm">Loading...</div>
          ) : activity.length === 0 ? (
            <div className="text-gray-400 text-sm">No recent activity.</div>
          ) : (
            activity.map((event, idx) => (
              <div key={idx} className={`flex items-center space-x-3 p-3 rounded-lg ${event.type === 'lesson' ? 'bg-blue-50' : event.type === 'user' ? 'bg-green-50' : 'bg-purple-50'}`}>
                {event.type === 'lesson' && <MessageCircle className="w-5 h-5 text-blue-600" />}
                {event.type === 'user' && <UserCheck className="w-5 h-5 text-green-600" />}
                {event.type === 'content' && <BookOpen className="w-5 h-5 text-purple-600" />}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {event.type === 'lesson' && 'Daily lesson sent'}
                    {event.type === 'user' && 'New user registered'}
                    {event.type === 'content' && 'Content added'}
                  </p>
                  <p className="text-xs text-gray-600">{event.details}</p>
                </div>
                <span className="text-xs text-gray-500 ml-auto">{timeAgo(event.timestamp)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;