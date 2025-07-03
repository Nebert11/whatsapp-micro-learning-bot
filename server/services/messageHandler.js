import User from '../models/User.js';
import Topic from '../models/Topic.js';
import Content from '../models/Content.js';
import { sendWhatsAppMessage } from './whatsapp.js';

// Utility to add a "typing" delay for a more natural feel
const typingDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms + Math.random() * 800));

export const handleIncomingMessage = async (phoneNumber, message) => {
  try {
    const user = await User.findOne({ phoneNumber }).populate('preferredTopics progress.topicId');
    const messageText = message.trim().toUpperCase();
    
    if (!user) {
      // New user registration flow
      await handleNewUserRegistration(phoneNumber, message);
    } else {
      // Existing user command handling
      await handleUserCommand(user, messageText);
    }
  } catch (error) {
    console.error('❌ Error handling message:', error.message);
    await sendWhatsAppMessage(phoneNumber, 'Sorry, something went wrong. Please try again later.');
  }
};

const handleNewUserRegistration = async (phoneNumber, message) => {
  // Check if this is the first interaction
  const registrationStep = await getRegistrationStep(phoneNumber);
  
  switch (registrationStep) {
    case 'NAME':
      await handleNameRegistration(phoneNumber, message);
      break;
    case 'TOPIC':
      await handleTopicSelection(phoneNumber, message);
      break;
    default:
      await startRegistration(phoneNumber);
  }
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const motivationalQuotes = [
  "The secret of getting ahead is getting started. ✨",
  "Don't watch the clock; do what it does. Keep going. ⏰",
  "The only way to do great work is to love what you do. ❤️",
  "Believe you can and you're halfway there. 🎯",
  "The future belongs to those who believe in the beauty of their dreams. 🚀",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. 💪",
  "A little progress each day adds up to big results. 🌱"
];
const getRandomQuote = () => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

const startRegistration = async (phoneNumber) => {
  const welcomeMessage = `
🤖 *Welcome to MicroLearn Bot!*
${getGreeting()}! I'm here to help you learn something new every day with bite-sized lessons.
To get started, please tell me your name:
  `;
  
  await typingDelay();
  await sendWhatsAppMessage(phoneNumber, welcomeMessage.trim());
  await setRegistrationStep(phoneNumber, 'NAME');
};

const handleNameRegistration = async (phoneNumber, name) => {
  if (name.length < 2) {
    await typingDelay(500);
    await sendWhatsAppMessage(phoneNumber, '😅 Please provide a valid name with at least 2 characters.');
    return;
  }
  
  await setUserData(phoneNumber, 'name', name);
  
  const topics = await Topic.find({ isActive: true }).limit(8);
  const topicList = topics.map((topic, index) => 
    `${index + 1}. ${topic.icon} *${topic.name}* - ${topic.description}`
  ).join('\n');
  
  const topicMessage = `
Nice to meet you, ${name}! 👋

Choose your preferred learning topic by replying with the number:

${topicList}

Or reply with *ALL* to receive lessons from all topics.
  `;
  
  await typingDelay();
  await sendWhatsAppMessage(phoneNumber, topicMessage.trim());
  await setRegistrationStep(phoneNumber, 'TOPIC');
};

const handleTopicSelection = async (phoneNumber, selection) => {
  const userData = await getUserData(phoneNumber);
  const topics = await Topic.find({ isActive: true }).limit(8);
  
  let selectedTopics = [];
  
  if (selection.toUpperCase() === 'ALL') {
    selectedTopics = topics;
  } else {
    const topicIndex = parseInt(selection) - 1;
    if (topicIndex >= 0 && topicIndex < topics.length) {
      selectedTopics = [topics[topicIndex]];
    } else {
      await typingDelay(500);
      await sendWhatsAppMessage(phoneNumber, 'Invalid selection. Please choose a number from the list or reply with ALL.');
      return;
    }
  }
  
  // Create user account
  const user = new User({
    phoneNumber,
    name: userData.name,
    preferredTopics: selectedTopics.map(t => t._id),
    progress: selectedTopics.map(topic => ({
      topicId: topic._id,
      completedLessons: [],
      currentLessonIndex: 0,
      totalLessonsCompleted: 0
    }))
  });
  
  await user.save();
  
  // Update topic subscriber counts
  await Topic.updateMany(
    { _id: { $in: selectedTopics.map(t => t._id) } },
    { $inc: { subscriberCount: 1 } }
  );
  
  const successMessage = `
✅ *Registration Complete!*

Welcome to MicroLearn, ${userData.name}! 🎉

📚 *Your Topics:* ${selectedTopics.map(t => t.name).join(', ')}
⏰ *Daily Lessons:* 9:00 AM (your timezone)
🔥 *Streak:* 0 days

You'll receive your first lesson tomorrow morning. 

*Available Commands:*
• *HELP* - Show available commands
• *PAUSE* - Pause daily lessons
• *RESUME* - Resume lessons
• *SWITCH [topic]* - Change topic
• *PROGRESS* - See your progress

Ready to start learning? 🚀
  `;
  
  await typingDelay(1500);
  await sendWhatsAppMessage(phoneNumber, successMessage.trim());
  await clearRegistrationData(phoneNumber);
};

const handleUserCommand = async (user, command) => {
  const commands = command.split(' ');
  const mainCommand = commands[0];
  
  switch (mainCommand) {
    case 'HELP':
      await sendHelpMessage(user);
      break;
    case 'PAUSE':
      await pauseLessons(user);
      break;
    case 'RESUME':
      await resumeLessons(user);
      break;
    case 'SWITCH':
      await switchTopic(user, commands.slice(1).join(' '));
      break;
    case 'PROGRESS':
      await sendProgressReport(user);
      break;
    case 'NEXT':
      await sendNextLesson(user);
      break;
    default:
      await typingDelay(500);
      await sendWhatsAppMessage(user.phoneNumber, `
🤔 Unknown command: *${command}*
Type *HELP* to see available commands.
      `.trim());
  }
  
  // Update last active timestamp
  user.lastActive = new Date();
  await user.save();
};

const sendHelpMessage = async (user) => {
  const helpMessage = `
🤖 *${getGreeting()}, ${user.name}! Here are the MicroLearn Bot Commands*

*Learning Commands:*
• *NEXT* - Get next lesson immediately
• *PROGRESS* - View your learning progress

*Settings:*
• *PAUSE* - Pause daily lessons
• *RESUME* - Resume daily lessons
• *SWITCH [topic]* - Change learning topic

*Information:*
• *HELP* - Show this help message

📊 *Your Stats:*
• Streak: ${user.streak} days 🔥
• Total Score: ${user.totalScore}
• Status: ${user.isPaused ? 'Paused ⏸️' : 'Active 🟢'}
Come back tomorrow for another lesson!
  `;
  
  await typingDelay();
  await sendWhatsAppMessage(user.phoneNumber, helpMessage.trim());
};

const pauseLessons = async (user) => {
  user.isPaused = true;
  await user.save();
  
  const pauseMessage = `
⏸️ *Lessons Paused*
You won't receive new lessons. Type *RESUME* at any time to start again.
Happy to see you back soon! 👋
  `;
  await typingDelay();
  await sendWhatsAppMessage(user.phoneNumber, pauseMessage.trim());
};

const resumeLessons = async (user) => {
  if (!user.isPaused) {
    await sendWhatsAppMessage(user.phoneNumber, "Your lessons are already active! Type *NEXT* to get your next lesson.");
    return;
  }
  user.isPaused = false;
  await user.save();
  const resumeMessage = `
▶️ *Lessons Resumed!*
Welcome back, ${user.name}! You'll receive your next lesson at the scheduled time.
Ready to learn? Let's go! 🚀
  `;
  await typingDelay();
  await sendWhatsAppMessage(user.phoneNumber, resumeMessage.trim());
};

const sendProgressReport = async (user) => {
  const progressData = user.progress.map(p => ({
    topic: p.topicId.name,
    completed: p.totalLessonsCompleted,
    current: p.currentLessonIndex + 1
  }));
  
  const progressText = progressData.map(p => 
    `📚 *${p.topic}*: ${p.completed} lessons completed`
  ).join('\n');
  
  const progressMessage = `
📊 *Your Progress Report, ${user.name}!*
*Overall:*
• *Current Streak:* ${user.streak} days ${user.streak > 3 ? '🔥 Keep it up!' : ''}
• *Total Score:* ${user.totalScore} points
*Topics:*
${progressText}
Keep learning and growing! 🌱
  `;
  
  await typingDelay();
  await sendWhatsAppMessage(user.phoneNumber, progressMessage.trim());
};

const sendNextLesson = async (user) => {
  // Subscription and lesson limiting logic
  const now = new Date();
  const today = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const lastLessonDate = user.dailyLessonDate ? user.dailyLessonDate.toISOString().slice(0, 10) : null;

  // Reset daily count if it's a new day
  if (lastLessonDate !== today) {
    user.dailyLessonCount = 0;
    user.dailyLessonDate = now;
  }

  // Check subscription
  const isSubscribed = user.isSubscribed && user.subscriptionExpiry && user.subscriptionExpiry > now;

  if (!isSubscribed && user.dailyLessonCount >= 3) {
    await typingDelay(800);
    await sendWhatsAppMessage(user.phoneNumber, `🚦 *Daily Limit Reached!*

You have completed your 3 free lessons for today. To unlock unlimited daily lessons and earn certificates, please subscribe:

👉 [Subscribe Now](https://your-payment-link.com)

Thank you for learning with MicroLearn!`);
    return;
  }

  // Increment lesson count for free users
  if (!isSubscribed) {
    user.dailyLessonCount += 1;
    user.dailyLessonDate = now;
  }

  // TODO: Implement actual lesson delivery logic here
  await typingDelay(500);
  await sendWhatsAppMessage(user.phoneNumber, `📚 *Next Lesson Coming Up...*

This feature will deliver your next lesson based on your progress.\n\nYour daily lesson will be delivered at your scheduled time.`.trim());

  await user.save();
};

// Temporary storage for registration data (in production, use Redis or database)
const registrationData = new Map();

const getRegistrationStep = async (phoneNumber) => {
  return registrationData.get(`${phoneNumber}_step`) || null;
};

const setRegistrationStep = async (phoneNumber, step) => {
  registrationData.set(`${phoneNumber}_step`, step);
};

const getUserData = async (phoneNumber) => {
  return registrationData.get(`${phoneNumber}_data`) || {};
};

const setUserData = async (phoneNumber, key, value) => {
  const data = registrationData.get(`${phoneNumber}_data`) || {};
  data[key] = value;
  registrationData.set(`${phoneNumber}_data`, data);
};

const clearRegistrationData = async (phoneNumber) => {
  registrationData.delete(`${phoneNumber}_step`);
  registrationData.delete(`${phoneNumber}_data`);
};