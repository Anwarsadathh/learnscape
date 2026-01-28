const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Import auth middleware functions
const { invalidateAllSessions, verifyAdminToken } = require('../../middleware/auth');

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

// Verify token
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

// Clear cookies route
router.post('/clear-cookies', async (req, res) => {
  try {
    // Clear all authentication cookies
    res.clearCookie('token', { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    res.clearCookie('session', { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    // Destroy express-session
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
        }
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Cookies and session cleared successfully' 
    });
  } catch (error) {
    console.error('Error clearing cookies:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to clear cookies' 
    });
  }
});

// Invalidate ALL sessions (kicks everyone out)
router.post('/invalidate-all-sessions', verifyAdminToken, (req, res) => {
  try {
    const newVersion = invalidateAllSessions();
    
    console.log(`[Auth] All sessions invalidated by admin: ${req.user.email}`);
    
    res.json({ 
      success: true, 
      message: 'All user sessions have been invalidated. Everyone must log in again.',
      sessionVersion: newVersion
    });
  } catch (error) {
    console.error('Error invalidating sessions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to invalidate sessions' 
    });
  }
});

module.exports = router;
