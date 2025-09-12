// backend/middleware/maintenanceMode.js
const fs = require('fs').promises;
const path = require('path');

const SETTINGS_FILE = path.join(__dirname, '../config/settings.json');

const maintenanceMode = async (req, res, next) => {
  // IMPORTANT: Allow these paths to bypass maintenance mode
  const bypassPaths = [
    '/api/admin/settings/maintenance',  // Allow checking maintenance status
    '/api/admin/auth',                  // Allow admin login
    '/api/admin/settings',               // Allow admin to manage settings
    '/uploads',                          // Static files
  ];

  // Check if current path should bypass maintenance
  const shouldBypass = bypassPaths.some(path => req.path.startsWith(path)) || 
                       req.method === 'OPTIONS' ||
                       req.path.includes('.');

  if (shouldBypass) {
    return next();
  }

  try {
    console.log('🔍 Checking maintenance for:', req.path);
    
    const data = await fs.readFile(SETTINGS_FILE, 'utf8');
    const settings = JSON.parse(data);
    
    if (settings.maintenanceMode === true) {
      console.log(`🚫 MAINTENANCE ACTIVE - Blocking ${req.method} ${req.path}`);
      
      // For API requests, return JSON
      if (req.path.startsWith('/api/')) {
        return res.status(503).json({
          success: false,
          message: settings.maintenanceMessage || 'API is under maintenance',
          maintenanceMode: true
        });
      }
      
      // For other requests, send HTML maintenance page
      const maintenancePage = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Maintenance - ${settings.siteName || 'LearnScape'}</title>
          <style>
            * { 
              margin: 0; 
              padding: 0; 
              box-sizing: border-box; 
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
            }
            .maintenance-container {
              text-align: center;
              max-width: 600px;
              padding: 3rem;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 25px;
              backdrop-filter: blur(15px);
              box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
              border: 1px solid rgba(255, 255, 255, 0.2);
              animation: fadeIn 0.6s ease-out;
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .icon { 
              font-size: 5rem; 
              margin-bottom: 1.5rem;
              animation: pulse 2s infinite;
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.1); }
            }
            h1 { 
              font-size: 3rem; 
              margin-bottom: 1.5rem; 
              font-weight: 700;
              text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            p { 
              font-size: 1.2rem; 
              margin-bottom: 2rem; 
              opacity: 0.9; 
              line-height: 1.6;
            }
            .spinner {
              width: 60px; 
              height: 60px; 
              margin: 0 auto 2rem;
              border: 4px solid rgba(255, 255, 255, 0.3);
              border-top: 4px solid white;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .progress-bar {
              width: 100%;
              height: 4px;
              background: rgba(255,255,255,0.2);
              border-radius: 2px;
              margin-top: 2rem;
              overflow: hidden;
            }
            .progress-fill {
              height: 100%;
              background: linear-gradient(90deg, #4facfe, #00f2fe);
              border-radius: 2px;
              animation: progress 30s linear infinite;
            }
            @keyframes progress {
              from { width: 0%; }
              to { width: 100%; }
            }
          </style>
        </head>
        <body>
          <div class="maintenance-container">
            <div class="icon">🔧</div>
            <h1>Under Maintenance</h1>
            <div class="spinner"></div>
            <p>${settings.maintenanceMessage || 'We are currently performing scheduled maintenance. Please check back soon!'}</p>
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
            <p style="margin-top: 2rem; font-size: 0.9rem; opacity: 0.7;">
              This page will automatically refresh every 30 seconds
            </p>
          </div>
          <script>
            setTimeout(() => {
              window.location.reload();
            }, 30000);
          </script>
        </body>
        </html>
      `;
      
      return res.status(503).send(maintenancePage);
    }
    
    next();
  } catch (error) {
    console.error('❌ Maintenance middleware error:', error);
    // On error, allow request to continue (fail-safe)
    next();
  }
};

module.exports = maintenanceMode;