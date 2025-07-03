import React, { useState, useEffect } from 'react';
import { Search, Filter, UserPlus, Phone, Calendar, Target } from 'lucide-react';

interface User {
  _id: string;
  phoneNumber: string;
  name: string;
  preferredTopics: Array<{ name: string; icon: string }>;
  isActive: boolean;
  isPaused: boolean;
  streak: number;
  totalScore: number;
  createdAt: string;
  lastActive: string;
  badges?: Array<{ topicId?: { icon?: string; name?: string }; awardedAt?: string }>;
  certificates?: Array<{ topicId?: { icon?: string; name?: string }; url?: string }>;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phoneNumber.includes(searchTerm);
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'active' && user.isActive && !user.isPaused) ||
                         (filterStatus === 'paused' && user.isPaused) ||
                         (filterStatus === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (user: User) => {
    if (!user.isActive) return 'bg-gray-100 text-gray-800';
    if (user.isPaused) return 'bg-amber-100 text-amber-800';
    return 'bg-wa-light text-wa-teal-dark';
  };

  const getStatusText = (user: User) => {
    if (!user.isActive) return 'Inactive';
    if (user.isPaused) return 'Paused';
    return 'Active';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage registered bot users</p>
        </div>
        <button className="bg-gradient-to-r from-wa-teal to-wa-green hover:from-wa-teal-dark hover:to-wa-green text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow">
          <UserPlus className="w-4 h-4" />
          <span>Export Users</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wa-teal focus:border-transparent w-full md:w-64"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-wa-teal focus:border-transparent"
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="inactive">Inactive</option>
              </select>
              
              <span className="text-sm text-gray-600">
                {filteredUsers.length} users found
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Topics
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <React.Fragment key={user._id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-wa-light rounded-full flex items-center justify-center">
                            <span className="text-wa-teal-dark font-medium text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="w-3 h-3 mr-1" />
                              {user.phoneNumber}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {user.preferredTopics.map((topic, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {topic.icon} {topic.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user)}`}>
                        {getStatusText(user)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4 text-gray-400" />
                          <span>{user.streak} day streak</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {user.totalScore} points
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.lastActive)}
                    </td>
                  </tr>
                  {/* Badges & Certificates Row */}
                  <tr className="bg-wa-light/40">
                    <td colSpan={6} className="px-6 py-2">
                      <div className="flex flex-wrap items-center gap-6">
                        {/* Badges */}
                        <div>
                          <div className="font-semibold text-wa-teal-dark flex items-center mb-1">
                            🏅 Badges
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {user.badges && user.badges.length > 0 ? (
                              user.badges.map((badge, idx) => (
                                <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-wa-green/10 text-wa-teal-dark border border-wa-green">
                                  {badge.topicId?.icon || '🏅'} {badge.topicId?.name || 'Topic'} <span className="ml-1 text-gray-500">({badge.awardedAt ? new Date(badge.awardedAt).toLocaleDateString() : ''})</span>
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-gray-400">No badges yet</span>
                            )}
                          </div>
                        </div>
                        {/* Certificates */}
                        <div>
                          <div className="font-semibold text-wa-teal-dark flex items-center mb-1">
                            📜 Certificates
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {user.certificates && user.certificates.length > 0 ? (
                              user.certificates.map((cert, idx) => (
                                <a
                                  key={idx}
                                  href={cert.url || `/api/users/certificate/${user._id}/${cert.topicId?._id || cert.topicId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-wa-teal text-white hover:bg-wa-green transition-colors border border-wa-teal"
                                >
                                  {cert.topicId?.icon || '📜'} {cert.topicId?.name || 'Topic'} <span className="ml-1">Download</span>
                                </a>
                              ))
                            ) : (
                              <span className="text-xs text-gray-400">No certificates yet</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;