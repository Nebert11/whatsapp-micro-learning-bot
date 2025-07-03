import React, { useState, useEffect } from 'react';
import { Plus, Search, BookOpen, Edit, Trash2, Eye, X } from 'lucide-react';

interface Topic {
  _id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
}

interface Content {
  _id: string;
  title: string;
  content: string;
  topicId: Topic;
  lessonNumber: number;
  type: string;
  difficulty: string;
  estimatedReadTime: number;
  viewCount: number;
  completionCount: number;
  isActive: boolean;
  createdAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const Content = () => {
  const [content, setContent] = useState<Content[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [newTopic, setNewTopic] = useState({ name: '', icon: '', description: '', category: '' });
  const [topicLoading, setTopicLoading] = useState(false);
  const [topicError, setTopicError] = useState('');
  const [newContent, setNewContent] = useState({
    title: '',
    content: '',
    topicId: '',
    lessonNumber: 1,
    type: 'text',
    difficulty: 'beginner',
    estimatedReadTime: 3,
    isActive: true
  });
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState('');

  useEffect(() => {
    fetchContent();
    fetchTopics();
  }, []);

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/content`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setContent(data.content || []);
      } else {
        // Demo data fallback
        setContent([
          {
            _id: '1',
            title: 'Introduction to JavaScript Variables',
            content: 'Variables are containers for storing data values. In JavaScript, you can create variables using var, let, or const keywords...',
            topicId: { _id: '1', name: 'JavaScript Basics', icon: '💻', description: 'Learn JavaScript fundamentals', category: 'coding' },
            lessonNumber: 1,
            type: 'text',
            difficulty: 'beginner',
            estimatedReadTime: 3,
            viewCount: 45,
            completionCount: 38,
            isActive: true,
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            _id: '2',
            title: 'Understanding Functions',
            content: 'Functions are blocks of code designed to perform particular tasks. They are executed when they are called (invoked)...',
            topicId: { _id: '1', name: 'JavaScript Basics', icon: '💻', description: 'Learn JavaScript fundamentals', category: 'coding' },
            lessonNumber: 2,
            type: 'text',
            difficulty: 'beginner',
            estimatedReadTime: 4,
            viewCount: 32,
            completionCount: 28,
            isActive: true,
            createdAt: '2024-01-16T10:30:00Z'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/content/topics/all`);
      
      if (response.ok) {
        const data = await response.json();
        setTopics(data);
      } else {
        // Demo topics
        setTopics([
          { _id: '1', name: 'JavaScript Basics', icon: '💻', description: 'Learn JavaScript fundamentals', category: 'coding' },
          { _id: '2', name: 'Healthy Living', icon: '🏥', description: 'Health and wellness tips', category: 'health' },
          { _id: '3', name: 'Personal Finance', icon: '💰', description: 'Money management skills', category: 'finance' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTopic = selectedTopic === 'all' || item.topicId._id === selectedTopic;
    
    return matchesSearch && matchesTopic;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz': return '❓';
      case 'tip': return '💡';
      case 'exercise': return '🏋️';
      case 'reflection': return '🤔';
      default: return '📖';
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setTopicLoading(true);
    setTopicError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/content/topics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTopic)
      });
      if (response.ok) {
        setShowTopicModal(false);
        setNewTopic({ name: '', icon: '', description: '', category: '' });
        fetchTopics();
      } else {
        const data = await response.json();
        setTopicError(data.message || 'Failed to create topic');
      }
    } catch (error) {
      setTopicError('Failed to create topic');
    } finally {
      setTopicLoading(false);
    }
  };

  const handleCreateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setContentLoading(true);
    setContentError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newContent)
      });
      if (response.ok) {
        setShowCreateModal(false);
        setNewContent({
          title: '',
          content: '',
          topicId: '',
          lessonNumber: 1,
          type: 'text',
          difficulty: 'beginner',
          estimatedReadTime: 3,
          isActive: true
        });
        fetchContent();
      } else {
        const data = await response.json();
        setContentError(data.message || 'Failed to create content');
      }
    } catch (error) {
      setContentError('Failed to create content');
    } finally {
      setContentLoading(false);
    }
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
        <div className="flex items-center space-x-3">
          <span className="text-3xl select-none" role="img" aria-label="Bot">🤖</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">Content Management <span className="ml-2">📚</span></h1>
            <p className="text-gray-600 mt-1">Create and manage learning content for your bot!</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-wa-teal to-wa-green hover:from-wa-teal-dark hover:to-wa-green text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>New Content</span>
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wa-teal focus:border-transparent w-full md:w-64"
              />
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-wa-teal focus:border-transparent"
              >
                <option value="all">All Topics</option>
                {topics.map(topic => (
                  <option key={topic._id} value={topic._id}>
                    {topic.icon} {topic.name}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-600">
                {filteredContent.length} lessons
              </span>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredContent.map((item) => (
            <div key={item._id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-lg">{getTypeIcon(item.type)}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <span className="text-sm text-gray-500">#{item.lessonNumber}</span>
                  </div>
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {item.content.substring(0, 150)}...
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <span>{item.topicId.icon}</span>
                      <span>{item.topicId.name}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(item.difficulty)}`}> {item.difficulty} </span>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{item.viewCount} views</span>
                    </div>
                    <span>{item.estimatedReadTime} min read</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <span className="text-5xl select-none" role="img" aria-label="Bot">🤖</span>
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No content found matching your criteria. <span role='img' aria-label='sparkles'>✨</span></p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="mt-4 text-wa-teal hover:text-wa-teal-dark font-medium"
            >
              Create your first lesson
            </button>
          </div>
        )}
      </div>
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowCreateModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-wa-teal flex items-center">New Content <span className="ml-2">📝</span></h2>
            <form onSubmit={handleCreateContent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newContent.title}
                  onChange={e => setNewContent({ ...newContent, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-wa-teal focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={newContent.content}
                  onChange={e => setNewContent({ ...newContent, content: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-wa-teal focus:border-transparent"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                <div className="flex items-center space-x-2">
                  <select
                    value={newContent.topicId}
                    onChange={e => setNewContent({ ...newContent, topicId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-wa-teal focus:border-transparent"
                    required
                  >
                    <option value="">Select a topic</option>
                    {topics.map(topic => (
                      <option key={topic._id} value={topic._id}>
                        {topic.icon} {topic.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="text-wa-teal hover:underline text-sm whitespace-nowrap"
                    onClick={() => setShowTopicModal(true)}
                  >
                    + Create New Topic
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Number</label>
                  <input
                    type="number"
                    value={newContent.lessonNumber}
                    onChange={e => setNewContent({ ...newContent, lessonNumber: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-wa-teal focus:border-transparent"
                    min={1}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newContent.type}
                    onChange={e => setNewContent({ ...newContent, type: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-wa-teal focus:border-transparent"
                  >
                    <option value="text">Text</option>
                    <option value="quiz">Quiz</option>
                    <option value="tip">Tip</option>
                    <option value="exercise">Exercise</option>
                    <option value="reflection">Reflection</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={newContent.difficulty}
                    onChange={e => setNewContent({ ...newContent, difficulty: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-wa-teal focus:border-transparent"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Read Time (min)</label>
                  <input
                    type="number"
                    value={newContent.estimatedReadTime}
                    onChange={e => setNewContent({ ...newContent, estimatedReadTime: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-wa-teal focus:border-transparent"
                    min={1}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newContent.isActive}
                  onChange={e => setNewContent({ ...newContent, isActive: e.target.checked })}
                  className="w-4 h-4 text-wa-teal bg-gray-100 border-gray-300 rounded focus:ring-wa-teal"
                />
                <span className="text-sm text-gray-700">Active</span>
              </div>
              {contentError && <div className="text-red-600 text-sm">{contentError}</div>}
              <button
                type="submit"
                disabled={contentLoading}
                className="w-full bg-wa-teal hover:bg-wa-teal-dark text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {contentLoading ? 'Creating...' : 'Create Content'}
              </button>
            </form>
            {showTopicModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowTopicModal(false)}
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h2 className="text-2xl font-bold mb-4 text-wa-teal flex items-center">New Topic <span className="ml-2">📝</span></h2>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setTopicLoading(true);
                    setTopicError('');
                    try {
                      const token = localStorage.getItem('token');
                      const response = await fetch(`${API_BASE_URL}/api/content/topics`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(newTopic)
                      });
                      if (response.ok) {
                        const created = await response.json();
                        setShowTopicModal(false);
                        setNewTopic({ name: '', icon: '', description: '', category: '' });
                        await fetchTopics();
                        setNewContent(prev => ({ ...prev, topicId: created._id }));
                      } else {
                        const data = await response.json();
                        setTopicError(data.message || 'Failed to create topic');
                      }
                    } catch (error) {
                      setTopicError('Failed to create topic');
                    } finally {
                      setTopicLoading(false);
                    }
                  }} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={newTopic.name}
                        onChange={e => setNewTopic({ ...newTopic, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-wa-teal focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Icon <span className="text-xs text-gray-400">(emoji)</span></label>
                      <input
                        type="text"
                        value={newTopic.icon}
                        onChange={e => setNewTopic({ ...newTopic, icon: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-wa-teal focus:border-transparent"
                        maxLength={2}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={newTopic.description}
                        onChange={e => setNewTopic({ ...newTopic, description: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-wa-teal focus:border-transparent"
                        rows={2}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <input
                        type="text"
                        value={newTopic.category}
                        onChange={e => setNewTopic({ ...newTopic, category: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-wa-teal focus:border-transparent"
                        required
                      />
                    </div>
                    {topicError && <div className="text-red-600 text-sm">{topicError}</div>}
                    <button
                      type="submit"
                      disabled={topicLoading}
                      className="w-full bg-wa-teal hover:bg-wa-teal-dark text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {topicLoading ? 'Creating...' : 'Create Topic'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;