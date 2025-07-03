import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';

const router = express.Router();

// Handle preflight OPTIONS for /login
router.options('/login', cors());

// Demo admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }
    
    // Demo credentials
    if (username === 'admin' && password === 'admin123') {
      const token = jwt.sign(
        { id: 'admin', username: 'admin' },
        process.env.JWT_SECRET || 'demo-secret',
        { expiresIn: '24h' }
      );
      
      return res.json({
        success: true,
        token,
        user: { id: 'admin', username: 'admin', role: 'admin' }
      });
    } else {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
  } catch (error) {
    console.error('Login route error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error during login' 
    });
  }
});

// Verify token middleware
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'demo-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
    req.user = user;
    next();
  });
};

export default router;