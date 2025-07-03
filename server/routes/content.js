import express from 'express';
import Content from '../models/Content.js';
import Topic from '../models/Topic.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Get all content
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { topic, page = 1, limit = 20 } = req.query;
    const query = topic ? { topicId: topic } : {};
    
    const content = await Content.find(query)
      .populate('topicId')
      .sort({ lessonNumber: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Content.countDocuments(query);
    
    res.json({
      content,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get content by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id).populate('topicId');
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new content
router.post('/', async (req, res) => {
  try {
    const content = new Content(req.body);
    await content.save();
    
    // Update topic lesson count
    await Topic.findByIdAndUpdate(
      content.topicId,
      { $inc: { totalLessons: 1 } }
    );
    
    await content.populate('topicId');
    res.status(201).json(content);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update content
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('topicId');
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    res.json(content);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete content
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    // Update topic lesson count
    await Topic.findByIdAndUpdate(
      content.topicId,
      { $inc: { totalLessons: -1 } }
    );
    
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all topics
router.get('/topics/all', async (req, res) => {
  try {
    const topics = await Topic.find({ isActive: true }).sort({ name: 1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new topic
router.post('/topics', async (req, res) => {
  try {
    const topic = new Topic(req.body);
    await topic.save();
    res.status(201).json(topic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;