import cron from 'node-cron';
import User from '../models/User.js';
import Content from '../models/Content.js';
import { sendWhatsAppMessage } from './whatsapp.js';

export const startCronJobs = () => {
  // Daily lesson delivery at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('🕘 Starting daily lesson delivery...');
    await deliverDailyLessons();
  });
  
  // Weekly progress report on Sundays at 6:00 PM
  cron.schedule('0 18 * * 0', async () => {
    console.log('📊 Sending weekly progress reports...');
    await sendWeeklyReports();
  });
  
  console.log('⏰ Cron jobs scheduled successfully');
};

const deliverDailyLessons = async () => {
  try {
    const activeUsers = await User.find({ 
      isActive: true, 
      isPaused: false 
    }).populate('preferredTopics progress.topicId');
    
    console.log(`📚 Delivering lessons to ${activeUsers.length} users`);
    
    for (const user of activeUsers) {
      await deliverLessonToUser(user);
      // Add delay to avoid rate limiting
      await delay(2000);
    }
    
    console.log('✅ Daily lesson delivery completed');
  } catch (error) {
    console.error('❌ Error in daily lesson delivery:', error.message);
  }
};

const deliverLessonToUser = async (user) => {
  try {
    // Get user's current progress for their preferred topics
    for (const progress of user.progress) {
      const topic = progress.topicId;
      
      // Get next lesson for this topic
      const nextLesson = await Content.findOne({
        topicId: topic._id,
        lessonNumber: progress.currentLessonIndex + 1,
        isActive: true
      });
      
      if (nextLesson) {
        const lessonMessage = formatLessonMessage(nextLesson, topic, progress);
        await sendWhatsAppMessage(user.phoneNumber, lessonMessage);
        
        // Update user progress
        progress.currentLessonIndex += 1;
        progress.lastLessonDate = new Date();
        
        // Update lesson metrics
        nextLesson.viewCount += 1;
        await nextLesson.save();
        
        // Update user streak
        updateUserStreak(user);
        
        await user.save();
        
        console.log(`📖 Lesson delivered to ${user.phoneNumber}: ${nextLesson.title}`);
        break; // Send one lesson per day
      } else {
        // No more lessons: topic completed!
        // Check if badge already awarded
        const hasBadge = user.badges.some(b => b.topicId.toString() === topic._id.toString());
        if (!hasBadge) {
          user.badges.push({ topicId: topic._id });
          // Only award certificate if subscribed
          const now = new Date();
          const isSubscribed = user.isSubscribed && user.subscriptionExpiry && user.subscriptionExpiry > now;
          if (isSubscribed) {
            // Generate a simple certificate URL (placeholder)
            const certUrl = `https://your-certificates.com/cert/${user._id}/${topic._id}`;
            user.certificates.push({ topicId: topic._id, url: certUrl });
            await sendWhatsAppMessage(user.phoneNumber, `🎉 *Congratulations!*\n\nYou have completed the topic *${topic.name}* and earned a badge and certificate!\n\nDownload your certificate: ${certUrl}`);
          } else {
            await sendWhatsAppMessage(user.phoneNumber, `🏅 *Topic Completed!*\n\nYou have finished all lessons in *${topic.name}* and earned a badge!\n\nSubscribe to unlock your official certificate: https://your-payment-link.com`);
          }
          await user.save();
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error delivering lesson to ${user.phoneNumber}:`, error.message);
  }
};

const formatLessonMessage = (lesson, topic, progress) => {
  const lessonNumber = progress.currentLessonIndex + 1;
  const estimatedTime = lesson.estimatedReadTime || 2;
  
  let message = `
📚 *Daily Lesson #${lessonNumber}*
🎯 *Topic:* ${topic.name}
⏱️ *Reading Time:* ${estimatedTime} min

*${lesson.title}*

${lesson.content}
  `;
  
  if (lesson.type === 'quiz') {
    message += `\n\n❓ *Quick Quiz:*\n${lesson.question}\n\n`;
    lesson.options.forEach((option, index) => {
      message += `${index + 1}. ${option}\n`;
    });
    message += `\nReply with the number of your answer!`;
  }
  
  message += `\n\n💪 Great job learning today! Your streak: ${progress.currentLessonIndex + 1} days`;
  message += `\n\n*Commands:* HELP | PAUSE | PROGRESS | NEXT`;
  
  return message.trim();
};

const updateUserStreak = (user) => {
  const today = new Date();
  const lastStreakDate = user.lastStreakDate;
  
  if (!lastStreakDate) {
    user.streak = 1;
  } else {
    const daysDiff = Math.floor((today - lastStreakDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      user.streak += 1;
    } else if (daysDiff > 1) {
      user.streak = 1; // Reset streak
    }
    // If daysDiff === 0, user already completed today, don't change streak
  }
  
  user.lastStreakDate = today;
};

const sendWeeklyReports = async () => {
  try {
    const activeUsers = await User.find({ 
      isActive: true 
    }).populate('preferredTopics');
    
    for (const user of activeUsers) {
      const reportMessage = await generateWeeklyReport(user);
      await sendWhatsAppMessage(user.phoneNumber, reportMessage);
      await delay(3000);
    }
    
    console.log(`📊 Weekly reports sent to ${activeUsers.length} users`);
  } catch (error) {
    console.error('❌ Error sending weekly reports:', error.message);
  }
};

const generateWeeklyReport = async (user) => {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  
  const weeklyProgress = user.progress.filter(p => 
    p.lastLessonDate && p.lastLessonDate >= weekStart
  );
  
  const totalLessonsThisWeek = weeklyProgress.reduce((sum, p) => 
    sum + (p.totalLessonsCompleted || 0), 0
  );
  
  return `
📊 *Weekly Learning Report*

🗓️ *This Week's Achievements:*
• Lessons Completed: ${totalLessonsThisWeek}
• Current Streak: ${user.streak} days
• Total Score: ${user.totalScore} points

🎯 *Your Topics:*
${user.preferredTopics.map(t => `• ${t.icon} ${t.name}`).join('\n')}

${user.streak >= 7 ? '🔥 Amazing! You\'ve maintained your streak for a week!' : ''}
${totalLessonsThisWeek >= 5 ? '⭐ Excellent progress this week!' : ''}

Keep up the fantastic work! 💪

*Reply HELP for commands*
  `.trim();
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));