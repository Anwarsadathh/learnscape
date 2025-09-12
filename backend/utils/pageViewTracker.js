// backend/utils/pageViewTracker.js
const trackPageView = async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    
    // Only count unique page loads (exclude API calls, static files, etc.)
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      await db.collection('page_views').updateOne(
        { _id: 'total_views' },
        { 
          $inc: { count: 1 },
          $set: { lastUpdated: new Date() }
        },
        { upsert: true }
      );
      
      console.log(`📈 Page view recorded for: ${req.path}`);
    }
    
    next();
  } catch (error) {
    console.error('Error tracking page view:', error);
    next(); // Don't break the request if tracking fails
  }
};

module.exports = { trackPageView };
