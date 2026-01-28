const jwt = require('jsonwebtoken');

// Global session version - increments when you want to invalidate all sessions
let currentSessionVersion = Date.now();

// Export function to get current version
const getCurrentSessionVersion = () => currentSessionVersion;

// Export function to invalidate all sessions
const invalidateAllSessions = () => {
  currentSessionVersion = Date.now();
  console.log(`[Auth] All sessions invalidated at: ${currentSessionVersion}`);
  return currentSessionVersion;
};

// Original session-based authentication (for traditional routes)
const verifyLogin = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    res.redirect('/admin/');
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    res.redirect('/admin/');
  }
};

// JWT-based authentication (for API routes)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No token provided' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if token was issued before current session version
    if (decoded.iat * 1000 < currentSessionVersion) {
      console.log(`[Auth] Token expired due to session invalidation`);
      return res.status(401).json({ 
        success: false,
        message: 'Session expired. Please log in again.' 
      });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('[Auth] Token verification failed:', error.message);
    return res.status(401).json({ 
      success: false,
      message: 'Invalid token' 
    });
  }
};

// Verify admin JWT token specifically
const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No admin token provided' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check session version
    if (decoded.iat * 1000 < currentSessionVersion) {
      return res.status(401).json({ 
        success: false,
        message: 'Session expired. Please log in again.' 
      });
    }
    
    // Check if user is admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Admin access required' 
      });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false,
      message: 'Invalid admin token' 
    });
  }
};

module.exports = {
  // Original exports (keep existing functionality)
  verifyLogin,
  verifyAdmin,
  
  // New JWT-based exports
  verifyToken,
  verifyAdminToken,
  
  // Session management exports
  invalidateAllSessions,
  getCurrentSessionVersion
};
