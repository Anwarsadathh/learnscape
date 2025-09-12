const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Admin login
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email, password: '***' });
    
    // Replace with your admin credentials logic
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@learnscape.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (email === adminEmail && password === adminPassword) {
      const token = jwt.sign(
        { email, role: 'admin' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      console.log('Login successful for:', email);
      
      res.json({
        success: true,
        token,
        user: { email, role: 'admin' },
        message: 'Login successful'
      });
    } else {
      console.log('Invalid credentials for:', email);
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Admin logout
router.post('/logout', (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      // In a production app, you might want to:
      // 1. Add token to a blacklist
      // 2. Store blacklisted tokens in Redis/Database
      // 3. Check blacklist in your auth middleware
      
      console.log('Admin logged out successfully');
    }
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Verify token (optional - for checking if user is still authenticated)
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    res.json({
      success: true,
      user: decoded,
      message: 'Token is valid'
    });
    
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

module.exports = router;
