import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import contentRoutes from './routes/content.js';
import botRoutes from './routes/bot.js';
import { startCronJobs } from './services/scheduler.js';
import { initializeWhatsAppService } from './services/whatsapp.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - must be first, before any other middleware
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests explicitly
app.options('*', cors());
app.options('/api/*', cors());

// Add explicit OPTIONS handler for all routes
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).end();
    return;
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database connection (non-blocking)
let databaseStatus = 'disconnected';
initializeDatabase().then((connected) => {
  databaseStatus = connected ? 'connected' : 'disconnected';
  if (connected) {
    // Only start cron jobs if database is connected
    startCronJobs();
  }
}).catch((error) => {
  console.error('Database initialization failed:', error);
  databaseStatus = 'error';
});

// Initialize WhatsApp service
try {
  initializeWhatsAppService();
} catch (error) {
  console.error('WhatsApp service initialization failed:', error);
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/bot', botRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'WhatsApp Microlearning Bot is running',
    database: databaseStatus,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 WhatsApp Bot ready for messages`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

//The end