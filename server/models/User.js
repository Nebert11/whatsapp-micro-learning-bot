import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
  currentLessonIndex: { type: Number, default: 0 },
  lastLessonDate: { type: Date },
  totalLessonsCompleted: { type: Number, default: 0 }
});

const userSchema = new mongoose.Schema({
  phoneNumber: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^\+[1-9]\d{1,14}$/ // E.164 format
  },
  name: { type: String, required: true, trim: true },
  preferredTopics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
  isActive: { type: Boolean, default: true },
  isPaused: { type: Boolean, default: false },
  registrationDate: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  progress: [progressSchema],
  timezone: { type: String, default: 'UTC' },
  preferredTime: { type: String, default: '09:00' }, // 24-hour format
  totalScore: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastStreakDate: { type: Date },
  // Subscription fields
  isSubscribed: { type: Boolean, default: false },
  subscriptionType: { type: String, enum: ['daily', 'weekly', null], default: null },
  subscriptionExpiry: { type: Date, default: null },
  // Daily lesson tracking
  dailyLessonCount: { type: Number, default: 0 },
  dailyLessonDate: { type: Date, default: null },
  // Badges and certificates
  badges: [{
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
    awardedAt: { type: Date, default: Date.now }
  }],
  certificates: [{
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
    awardedAt: { type: Date, default: Date.now },
    url: { type: String }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
userSchema.index({ phoneNumber: 1 });
userSchema.index({ isActive: 1, isPaused: 1 });

export default mongoose.model('User', userSchema);
export { userSchema };