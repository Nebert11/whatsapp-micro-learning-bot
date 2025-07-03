import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from './auth.js';
import PDFDocument from 'pdfkit';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await User.find()
      .populate('preferredTopics')
      .populate('badges.topicId')
      .populate('certificates.topicId')
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const pausedUsers = await User.countDocuments({ isPaused: true });
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    
    res.json({
      totalUsers,
      activeUsers,
      pausedUsers,
      newUsersToday
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by phone number
router.get('/:phoneNumber', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ phoneNumber: req.params.phoneNumber })
      .populate('preferredTopics progress.topicId');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user
router.put('/:phoneNumber', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { phoneNumber: req.params.phoneNumber },
      req.body,
      { new: true }
    ).populate('preferredTopics');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete('/:phoneNumber', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ phoneNumber: req.params.phoneNumber });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Payment page (placeholder)
router.get('/pay', (req, res) => {
  res.send(`
    <html>
      <head><title>Subscribe to MicroLearn</title></head>
      <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        <h1>Subscribe to MicroLearn</h1>
        <p>Unlock unlimited daily lessons and certificates!</p>
        <a href="#" style="display: inline-block; padding: 12px 24px; background: #25D366; color: white; border-radius: 8px; text-decoration: none; font-size: 1.2em;">Pay with Stripe (Demo)</a>
        <p style="margin-top: 30px; color: #888;">(Payment integration coming soon)</p>
      </body>
    </html>
  `);
});

// Certificate download endpoint
router.get('/certificate/:userId/:topicId', async (req, res) => {
  const { userId, topicId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');
    const badge = user.badges.find(b => b.topicId.toString() === topicId);
    if (!badge) return res.status(403).send('You have not completed this topic');
    const now = new Date();
    const isSubscribed = user.isSubscribed && user.subscriptionExpiry && user.subscriptionExpiry > now;
    if (!isSubscribed) return res.status(403).send('Subscribe to unlock your certificate');

    // Generate a simple PDF certificate
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${topicId}.pdf`);
    doc.fontSize(24).text('Certificate of Completion', { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).text(`Awarded to: ${user.name}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`For completing the topic:`, { align: 'center' });
    doc.fontSize(20).text(`${topicId}`, { align: 'center', underline: true });
    doc.moveDown();
    doc.fontSize(14).text(`Date: ${now.toLocaleDateString()}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text('MicroLearn Bot', { align: 'center' });
    doc.end();
    doc.pipe(res);
  } catch (err) {
    res.status(500).send('Error generating certificate');
  }
});

export default router;