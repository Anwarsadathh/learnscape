const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

// FIX: Correct path - go up 2 levels from routes/admin/
const SETTINGS_FILE = path.join(__dirname, '../../config/settings.json');

// Default settings structure
const DEFAULT_SETTINGS = {
  siteName: 'LearnScape',
  adminEmail: 'admin@learnscape.com',
  emailNotifications: true,
  systemNotifications: false,
  maintenanceMode: false,
  maintenanceMessage: 'We are currently performing maintenance. Please check back soon.',
  version: '1.0.0',
  lastUpdated: new Date().toISOString()
};

// Ensure settings file exists and is valid
const ensureSettingsFile = async () => {
  try {
    // Check if file exists
    await fs.access(SETTINGS_FILE);
    
    // Try to read and parse the file to ensure it's valid JSON
    const data = await fs.readFile(SETTINGS_FILE, 'utf8');
    if (!data.trim()) {
      throw new Error('Empty file');
    }
    JSON.parse(data);
    
    console.log('✅ Settings file exists and is valid');
  } catch (error) {
    console.log('⚠️  Settings file missing or corrupted, creating default...');
    
    // Ensure config directory exists
    const dir = path.dirname(SETTINGS_FILE);
    await fs.mkdir(dir, { recursive: true });
    
    // Create default settings file
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
    console.log('✅ Default settings file created at:', SETTINGS_FILE);
  }
};

// Get settings
router.get('/', async (req, res) => {
  try {
    await ensureSettingsFile();
    
    const data = await fs.readFile(SETTINGS_FILE, 'utf8');
    const settings = JSON.parse(data);
    
    // Don't send sensitive data
    const publicSettings = { ...settings };
    delete publicSettings.adminPassword;
    
    res.json({
      success: true,
      settings: publicSettings
    });
  } catch (error) {
    console.error('Error reading settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to read settings'
    });
  }
});

// Update settings
router.put('/', async (req, res) => {
  try {
    await ensureSettingsFile();
    
    const currentData = await fs.readFile(SETTINGS_FILE, 'utf8');
    const currentSettings = JSON.parse(currentData);
    
    const {
      siteName,
      adminEmail,
      currentPassword,
      newPassword,
      emailNotifications,
      systemNotifications,
      maintenanceMode,
      maintenanceMessage
    } = req.body;

    // Update settings with explicit boolean handling
    const updatedSettings = {
      ...currentSettings,
      siteName: siteName || currentSettings.siteName,
      adminEmail: adminEmail || currentSettings.adminEmail,
      emailNotifications: typeof emailNotifications === 'boolean' ? emailNotifications : currentSettings.emailNotifications,
      systemNotifications: typeof systemNotifications === 'boolean' ? systemNotifications : currentSettings.systemNotifications,
      maintenanceMode: typeof maintenanceMode === 'boolean' ? maintenanceMode : currentSettings.maintenanceMode,
      maintenanceMessage: maintenanceMessage || currentSettings.maintenanceMessage,
      lastUpdated: new Date().toISOString()
    };

    // Handle password change
    if (currentPassword && newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updatedSettings.adminPassword = hashedPassword;
    }

    // Save updated settings with proper formatting
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(updatedSettings, null, 2));
    
    // Don't send sensitive data
    const publicSettings = { ...updatedSettings };
    delete publicSettings.adminPassword;
    
    console.log('Settings updated:', publicSettings);
    console.log('✅ Settings saved to:', SETTINGS_FILE);
    
    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: publicSettings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
});

// Toggle maintenance mode with improved error handling
router.post('/maintenance/toggle', async (req, res) => {
  try {
    await ensureSettingsFile();
    
    console.log('📁 Reading settings from:', SETTINGS_FILE);
    
    // Read current settings with error handling
    const data = await fs.readFile(SETTINGS_FILE, 'utf8');
    
    if (!data.trim()) {
      throw new Error('Settings file is empty');
    }
    
    const settings = JSON.parse(data);
    
    console.log('📄 Current settings:', settings);
    
    // Toggle maintenance mode
    settings.maintenanceMode = !settings.maintenanceMode;
    settings.lastUpdated = new Date().toISOString();
    
    console.log('🔄 Toggling maintenance mode to:', settings.maintenanceMode);
    
    // Save updated settings with proper formatting
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    
    console.log(`✅ Maintenance mode ${settings.maintenanceMode ? 'ENABLED' : 'DISABLED'}`);
    
    res.json({
      success: true,
      maintenanceMode: settings.maintenanceMode,
      message: `Maintenance mode ${settings.maintenanceMode ? 'enabled' : 'disabled'}`
    });
  } catch (error) {
    console.error('❌ Error toggling maintenance mode:', error.message);
    console.error('Full error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle maintenance mode'
    });
  }
});

// Get maintenance status only (public endpoint - no auth required)
router.get('/maintenance', async (req, res) => {
  try {
    await ensureSettingsFile();
    
    const data = await fs.readFile(SETTINGS_FILE, 'utf8');
    const settings = JSON.parse(data);
    
    console.log(`[Settings] Maintenance status check - Mode: ${settings.maintenanceMode}`);
    
    res.json({
      success: true,
      maintenanceMode: settings.maintenanceMode || false,
      maintenanceMessage: settings.maintenanceMessage || 'We are currently performing maintenance. Please check back soon.'
    });
  } catch (error) {
    console.error('Error reading maintenance status:', error);
    // Default to maintenance OFF on error
    res.json({
      success: true,
      maintenanceMode: false,
      maintenanceMessage: ''
    });
  }
});
module.exports = router;
