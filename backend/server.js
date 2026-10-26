const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const handlebars = require('express-handlebars');
require('dotenv').config();

// Import database connection (native MongoDB driver)
const db = require('./config/connection');

// Import page view tracker middleware
const { trackPageView } = require('./utils/pageViewTracker');

// Import maintenance middleware
const maintenanceMode = require('./middleware/maintenance');

const app = express();

// ✅ FIX: Enable trust proxy BEFORE rate limiter
app.set('trust proxy', 1);

// View engine setup
const hbs = handlebars.create({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    json: (context) => JSON.stringify(context),
    eq: (a, b) => a === b,
    inc: (value) => parseInt(value) + 1
  }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());

// ✅ FIX: Updated rate limiting with proper configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // ✅ Add this to handle proxy properly
  skip: (req) => {
    // Skip rate limiting for localhost during development
    return req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1';
  }
});
app.use('/api/', limiter);

// CORS configuration
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? [
        'https://learnscapeedu.com',
        'https://www.learnscapeedu.com',
        process.env.FRONTEND_URL,
      ].filter(Boolean)
    : ['http://localhost:3000', 'http://localhost:3001'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition', 'X-Total-Count'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ✅ FIX: Session configuration with trust proxy
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// Flash messages
app.use(flash());

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Make flash messages available to all views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Ensure the database is connected before any route/middleware uses it
// (serverless-safe: connects lazily on the first request, reused after).
app.use(async (req, res, next) => {
  try {
    await db.ensureConnected();
    next();
  } catch (err) {
    console.error('Database connection error:', err.message);
    res.status(503).json({ success: false, message: 'Database temporarily unavailable' });
  }
});

// PAGE VIEW TRACKING MIDDLEWARE
app.use(trackPageView);

// MAINTENANCE MODE MIDDLEWARE - ADD BEFORE ROUTES
app.use(maintenanceMode);

// Make database available to all requests
app.use((req, res, next) => {
  req.app.locals.db = db.get();
  next();
});

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
try {
  // Admin API routes (protected from maintenance mode)
  app.use('/api/admin/auth', require('./routes/admin/auth'));
  app.use('/api/admin/settings', require('./routes/admin/settings'));
  app.use('/api/admin/dashboard', require('./routes/admin/dashboard'));
  app.use('/api/admin/colleges', require('./routes/admin/colleges'));
  app.use('/api/admin/scholarships', require('./routes/admin/scholarships'));
  
  // ✅ AI route BEFORE other public routes
  app.use('/api/ai', require('./routes/ai'));
  
  // Public API routes (blocked during maintenance)
  app.use('/api/search', require('./routes/search'));
  app.use('/api/colleges', require('./routes/colleges'));
  app.use('/api/contact', require('./routes/contact')); 
  app.use('/api/scholarships', require('./routes/scholarships'));
  app.use('/api', require('./routes/api'));
  
  // Web routes
  app.use('/admin', require('./routes/admin'));
  app.use('/', require('./routes/index'));
  
  console.log('✅ All routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
}

// API 404 handler
app.use('/api/*', (req, res) => {
  console.log(`API 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
    res.status(err.status || 500).json({ 
      success: false, 
      message: err.message || 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  } else {
    res.status(err.status || 500).render('error', {
      message: err.message || 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  }
});

// Generic 404 handler
app.use('*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  
  if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
    res.status(404).json({ 
      success: false, 
      message: 'Route not found',
      path: req.originalUrl
    });
  } else {
    res.status(404).send(`
      <!DOCTYPE html>
      <html>
      <head><title>404 - Page Not Found</title></head>
      <body>
        <h1>404 - Page Not Found</h1>
        <p>The requested resource <code>${req.originalUrl}</code> was not found.</p>
        <a href="/">Go back to home</a>
      </body>
      </html>
    `);
  }
});

const PORT = process.env.PORT || 5000;

// LOG STARTUP STATISTICS FUNCTION
const logStartupStats = async () => {
  try {
    const pendingCount = await db.get().collection('expert_queries').countDocuments({ status: 'new' });
    const totalColleges = await db.get().collection('collegeoruni').countDocuments({});
    const totalEnquiries = await db.get().collection('expert_queries').countDocuments({});
    const totalContacts = await db.get().collection('contacts').countDocuments({}).catch(() => 0);
    
    console.log('=== STARTUP STATISTICS ===');
    console.log('📊 Total Colleges:', totalColleges);
    console.log('📧 Total Enquiries:', totalEnquiries);
    console.log('📞 Total Contacts:', totalContacts);
    console.log('⏰ Pending Enquiries:', pendingCount);
    console.log('==========================');
  } catch (error) {
    console.error('Error logging startup stats:', error);
  }
};

// Local/traditional server: connect then listen. On Vercel (serverless) this
// block is skipped — the app is exported and the DB connects lazily per request.
if (!process.env.VERCEL) {
  db.connect((err) => {
    if (err) {
      console.error('❌ Database connection failed:', err);
      process.exit(1);
    } else {
      console.log('✅ Connected to MongoDB');

      // Log startup statistics after database connection
      setTimeout(logStartupStats, 1000);

      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    }
  });
}

module.exports = app;
