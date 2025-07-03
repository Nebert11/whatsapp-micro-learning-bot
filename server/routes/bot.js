import express from 'express';
import { handleWhatsAppWebhook, sendWhatsAppMessage, broadcastMessage } from '../services/whatsapp.js';
import { authenticateToken } from './auth.js';
import User from '../models/User.js';
import Content from '../models/Content.js';
import Topic from '../models/Topic.js';

const router = express.Router();

// WhatsApp webhook endpoint
router.post('/webhook', handleWhatsAppWebhook);

// WhatsApp webhook verification (GET request)
router.get('/webhook', (req, res) => {
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'demo-verify-token';
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  if (token === verifyToken) {
    res.send(challenge);
  } else {
    res.status(403).send('Forbidden');
  }
});

// Send test message (admin only)
router.post('/send-message', authenticateToken, async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;
    
    if (!phoneNumber || !message) {
      return res.status(400).json({ message: 'Phone number and message are required' });
    }
    
    const result = await sendWhatsAppMessage(phoneNumber, message);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Broadcast message to all active users (admin only)
router.post('/broadcast', authenticateToken, async (req, res) => {
  try {
    const { message, targetGroup = 'all' } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }
    
    let query = { isActive: true };
    
    switch (targetGroup) {
      case 'active':
        query.isPaused = false;
        break;
      case 'paused':
        query.isPaused = true;
        break;
      case 'new':
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        query.createdAt = { $gte: oneDayAgo };
        break;
    }
    
    const users = await User.find(query).select('phoneNumber');
    const phoneNumbers = users.map(user => user.phoneNumber);
    
    const results = await broadcastMessage(phoneNumbers, message);
    
    res.json({
      message: 'Broadcast initiated',
      targetCount: phoneNumbers.length,
      results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bot statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true, isPaused: false });
    const pausedUsers = await User.countDocuments({ isPaused: true });
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    
    // Calculate engagement metrics
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeThisWeek = await User.countDocuments({
      lastActive: { $gte: weekAgo }
    });
    
    res.json({
      totalUsers,
      activeUsers,
      pausedUsers,
      newUsersToday,
      activeThisWeek,
      engagementRate: totalUsers > 0 ? (activeThisWeek / totalUsers * 100).toFixed(1) : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent activity for dashboard
router.get('/activity', authenticateToken, async (req, res) => {
  try {
    // Recent lessons sent: use lastActive from users
    const recentLessons = await User.find({ lastActive: { $ne: null } })
      .sort({ lastActive: -1 })
      .limit(5)
      .select('phoneNumber lastActive preferredTopics');
    const lessonsEvents = recentLessons.map(u => ({
      type: 'lesson',
      details: `${u.phoneNumber} received lesson in ${u.preferredTopics.length > 0 ? u.preferredTopics[0].name || 'a topic' : 'a topic'}`,
      timestamp: u.lastActive
    }));

    // Recent new users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('phoneNumber createdAt preferredTopics');
    const userEvents = recentUsers.map(u => ({
      type: 'user',
      details: `${u.phoneNumber} joined ${u.preferredTopics.length > 0 ? u.preferredTopics[0].name || 'a topic' : 'a topic'}`,
      timestamp: u.createdAt
    }));

    // Recent content added
    const recentContent = await Content.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title createdAt topicId');
    const contentEvents = recentContent.map(c => ({
      type: 'content',
      details: `New lesson: "${c.title}"`,
      timestamp: c.createdAt
    }));

    // Merge and sort all events by timestamp desc, limit to 10
    const allEvents = [...lessonsEvents, ...userEvents, ...contentEvents]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);

    res.json(allEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Analytics: Monthly growth overview
router.get('/analytics/overview', authenticateToken, async (req, res) => {
  try {
    // Group users and lessons by month for the last 6 months
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        name: d.toLocaleString('default', { month: 'short' }),
        year: d.getFullYear(),
        month: d.getMonth()
      });
    }
    const userCounts = await Promise.all(months.map(async (m) => {
      const start = new Date(m.year, m.month, 1);
      const end = new Date(m.year, m.month + 1, 1);
      const users = await User.countDocuments({ createdAt: { $gte: start, $lt: end } });
      return users;
    }));
    const lessonCounts = await Promise.all(months.map(async (m) => {
      const start = new Date(m.year, m.month, 1);
      const end = new Date(m.year, m.month + 1, 1);
      const lessons = await Content.countDocuments({ createdAt: { $gte: start, $lt: end } });
      return lessons;
    }));
    // Engagement: percent of users active in each month
    const engagementRates = await Promise.all(months.map(async (m) => {
      const start = new Date(m.year, m.month, 1);
      const end = new Date(m.year, m.month + 1, 1);
      const total = await User.countDocuments({ createdAt: { $lte: end } });
      const active = await User.countDocuments({ lastActive: { $gte: start, $lt: end } });
      return total > 0 ? Math.round((active / total) * 100) : 0;
    }));
    const chartData = months.map((m, i) => ({
      name: m.name,
      users: userCounts[i],
      lessons: lessonCounts[i],
      engagement: engagementRates[i]
    }));
    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Analytics: Top topics
router.get('/analytics/topics', authenticateToken, async (req, res) => {
  try {
    // Top topics by user count and completion
    const topics = await Topic.find().limit(10);
    const users = await User.find();
    const topicStats = topics.map(topic => {
      const userCount = users.filter(u => u.preferredTopics.some(tid => tid.toString() === topic._id.toString())).length;
      // Completion: percent of users with a badge for this topic
      const completion = users.length > 0 ? Math.round((users.filter(u => u.badges && u.badges.some(b => b.topicId.toString() === topic._id.toString())).length / users.length) * 100) : 0;
      return {
        name: topic.name,
        users: userCount,
        completion,
        icon: topic.icon || '📚'
      };
    });
    // Sort by user count descending
    topicStats.sort((a, b) => b.users - a.users);
    res.json(topicStats.slice(0, 5));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Analytics: User activity
router.get('/analytics/activity', authenticateToken, async (req, res) => {
  try {
    // Peak hours: group lastActive by hour
    const users = await User.find({ lastActive: { $ne: null } }).select('lastActive');
    const hourCounts = Array(24).fill(0);
    users.forEach(u => {
      const h = new Date(u.lastActive).getHours();
      hourCounts[h]++;
    });
    const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
    // Retention: percent of users active in last 30 days
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const total = await User.countDocuments();
    const retained = await User.countDocuments({ lastActive: { $gte: monthAgo } });
    const retention = total > 0 ? Math.round((retained / total) * 100) : 0;
    // Response rate: percent of users with lastActive in last 7 days
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const responded = await User.countDocuments({ lastActive: { $gte: weekAgo } });
    const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;
    res.json({
      peakHour,
      retention,
      responseRate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;