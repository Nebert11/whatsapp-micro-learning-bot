import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  lessonNumber: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['text', 'quiz', 'tip', 'exercise', 'reflection'], 
    default: 'text' 
  },
  difficulty: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'], 
    default: 'beginner' 
  },
  estimatedReadTime: { type: Number, default: 2 }, // in minutes
  tags: [{ type: String, trim: true }],
  isActive: { type: Boolean, default: true },
  
  // Quiz-specific fields
  question: { type: String },
  options: [{ type: String }],
  correctAnswer: { type: Number }, // index of correct option
  explanation: { type: String },
  
  // Engagement metrics
  viewCount: { type: Number, default: 0 },
  completionCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  
  // Media attachments
  mediaUrl: { type: String },
  mediaType: { type: String, enum: ['image', 'video', 'audio'] },
  
  createdBy: { type: String, default: 'admin' }
}, {
  timestamps: true
});

// Compound index for efficient topic-based queries
contentSchema.index({ topicId: 1, lessonNumber: 1 });
contentSchema.index({ topicId: 1, isActive: 1 });

export default mongoose.model('Content', contentSchema);