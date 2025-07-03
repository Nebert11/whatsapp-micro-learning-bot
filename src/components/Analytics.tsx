import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, BookOpen, MessageCircle, Target, Clock } from 'lucide-react';

const Analytics = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [topTopics, setTopTopics] = useState<any[]>([]);
  const [activity, setActivity] = useState<any>({ peakHour: null, retention: null, responseRate: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [overviewRes, topicsRes, activityRes] = await Promise.all([
        fetch('/api/bot/analytics/overview', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/bot/analytics/topics', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/bot/analytics/activity', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      setChartData(overviewRes.ok ? await overviewRes.json() : []);
      setTopTopics(topicsRes.ok ? await topicsRes.json() : []);
      setActivity(activityRes.ok ? await activityRes.json() : { peakHour: null, retention: null, responseRate: null });
    } catch (e) {
      setChartData([]);
      setTopTopics([]);
      setActivity({ peakHour: null, retention: null, responseRate: null });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-2">
        <span className="text-3xl select-none" role="img" aria-label="Bot">🤖</span>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">Analytics <span className="ml-2">📈</span></h1>
          <p className="text-gray-600 mt-1">Track your bot's performance and user engagement!</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Messages Sent</p>
              <p className="text-3xl font-bold text-wa-teal mt-1">{loading ? '...' : chartData.reduce((sum, d) => sum + (d.lessons || 0), 0)}</p>
              <p className="text-wa-green text-sm mt-1">&nbsp;</p>
            </div>
            <MessageCircle className="w-8 h-8 text-wa-teal" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Avg. Engagement Rate</p>
              <p className="text-3xl font-bold text-wa-green mt-1">{loading ? '...' : chartData.length > 0 ? (chartData.reduce((sum, d) => sum + (d.engagement || 0), 0) / chartData.length).toFixed(1) + '%' : '0%'}</p>
              <p className="text-wa-green text-sm mt-1">&nbsp;</p>
            </div>
            <Target className="w-8 h-8 text-wa-green" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Avg. Daily Streak</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">-</p>
              <p className="text-green-600 text-sm mt-1">&nbsp;</p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Content Completion</p>
              <p className="text-3xl font-bold text-amber-600 mt-1">-</p>
              <p className="text-green-600 text-sm mt-1">&nbsp;</p>
            </div>
            <BookOpen className="w-8 h-8 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">Growth Overview <span className='ml-2'>🌱</span></h3>
        <div className="space-y-4">
          {loading ? (
            <div className="text-gray-400 text-sm">Loading...</div>
          ) : chartData.length === 0 ? (
            <div className="text-gray-400 text-sm">No data.</div>
          ) : (
            chartData.map((data, index) => (
              <div key={data.name} className="flex items-center space-x-4">
                <div className="w-8 text-sm font-medium text-gray-600">{data.name}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Users: {data.users}</span>
                    <span className="text-gray-600">Lessons: {data.lessons}</span>
                    <span className="text-gray-600">Engagement: {data.engagement}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-wa-teal to-wa-green h-2 rounded-full transition-all duration-300"
                      style={{ width: `${data.engagement}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Topics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">Popular Topics <span className='ml-2'>🔥</span></h3>
          <div className="space-y-4">
            {loading ? (
              <div className="text-gray-400 text-sm">Loading...</div>
            ) : topTopics.length === 0 ? (
              <div className="text-gray-400 text-sm">No data.</div>
            ) : (
              topTopics.map((topic, index) => (
                <div key={topic.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{topic.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{topic.name}</p>
                      <p className="text-sm text-gray-600">{topic.users} active users</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-wa-green">{topic.completion}%</p>
                    <p className="text-xs text-gray-500">completion</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">User Activity <span className='ml-2'>💬</span></h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-wa-light rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-wa-teal" />
                <span className="font-medium text-gray-900">Peak Hours</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-wa-teal">{loading || activity.peakHour === null ? '...' : `${activity.peakHour}:00 - ${activity.peakHour + 1}:00`}</p>
                <p className="text-xs text-gray-500">Most active time</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-wa-light rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-wa-green" />
                <span className="font-medium text-gray-900">Retention Rate</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-wa-green">{loading || activity.retention === null ? '...' : `${activity.retention}%`}</p>
                <p className="text-xs text-gray-500">30-day retention</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">Response Rate</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-purple-600">{loading || activity.responseRate === null ? '...' : `${activity.responseRate}%`}</p>
                <p className="text-xs text-gray-500">User responses</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;