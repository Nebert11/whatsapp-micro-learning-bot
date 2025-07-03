import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['coding', 'health', 'finance', 'business', 'personal-development', 'science', 'language', 'other']
  },
  isActive: { type: Boolean, default: true },
  totalLessons: { type: Number, default: 0 },
  subscriberCount: { type: Number, default: 0 },
  difficulty: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'], 
    default: 'beginner' 
  },
  estimatedDuration: { type: String, default: '2-3 minutes' }, // per lesson
  tags: [{ type: String, trim: true }],
  icon: { type: String, default: '📚' }
}, {
  timestamps: true
});

// Index for efficient searches
topicSchema.index({ name: 'text', description: 'text' });
topicSchema.index({ category: 1, isActive: 1 });

export default mongoose.model('Topic', topicSchema);