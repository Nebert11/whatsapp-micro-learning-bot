import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Use environment variable or fallback to local MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp-microlearning';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(`📁 MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('🔄 Running in demo mode without database connection');
    console.log('💡 To fix: Start MongoDB locally or configure MONGODB_URI in .env');
    console.log('');
    console.log('Quick start options:');
    console.log('  • macOS: brew services start mongodb-community');
    console.log('  • Ubuntu/Debian: sudo systemctl start mongod');
    console.log('  • Windows: net start MongoDB');
    console.log('  • Or use MongoDB Atlas cloud database');
    console.log('');
    
    // Return false to indicate database is not available
    return false;
  }
};

// Export a flag to track database status
export let isDatabaseConnected = false;

export const initializeDatabase = async () => {
  isDatabaseConnected = await connectDB();
  return isDatabaseConnected;
};