import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import User from '../models/User.js';
import Topic from '../models/Topic.js';

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp-microlearning';

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Find a topic to award (first topic)
  const topic = await Topic.findOne();
  if (!topic) {
    console.error('No topics found. Please create a topic first.');
    process.exit(1);
  }

  // Find all users
  const users = await User.find();
  if (users.length === 0) {
    console.error('No users found. Please create a user first.');
    process.exit(1);
  }

  for (const user of users) {
    // Add badge if not present
    if (!user.badges.some(b => b.topicId.toString() === topic._id.toString())) {
      user.badges.push({ topicId: topic._id, awardedAt: new Date() });
    }
    // Add certificate if not present
    if (!user.certificates.some(c => c.topicId.toString() === topic._id.toString())) {
      user.certificates.push({ topicId: topic._id, awardedAt: new Date(), url: `/api/users/certificate/${user._id}/${topic._id}` });
    }
    await user.save();
    console.log(`Updated user ${user.name} (${user.phoneNumber}) with badge and certificate for topic: ${topic.name}`);
  }

  console.log('Done!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}); 