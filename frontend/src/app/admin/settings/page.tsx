'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Settings, Bell, Shield, Globe, Save, Eye, EyeOff, AlertTriangle, CheckCircle
} from 'lucide-react';

interface SettingsData {
  siteName: string;
  adminEmail: string;
  emailNotifications: boolean;
  systemNotifications: boolean;
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

const AdminSettingsPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [settings, setSettings] = useState<SettingsData>({
    siteName: 'LearnScape',
    adminEmail: 'admin@learnscape.com',
    emailNotifications: true,
    systemNotifications: false,
    maintenanceMode: false,
    maintenanceMessage: 'We are currently performing maintenance. Please check back soon.'
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load settings
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: keyof SettingsData, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePasswordChange = (key: string, value: string) => {
    setPasswords(prev => ({ ...prev, [key]: value }));
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      const payload = {
        ...settings,
        ...(passwords.newPassword && {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      };

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Settings saved successfully!');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setSettings(data.settings);
      } else {
        showMessage('error', data.message || 'Failed to save settings');
      }
    } catch  {
      showMessage('error', 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleMaintenanceMode = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/settings/maintenance/toggle', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setSettings(prev => ({ ...prev, maintenanceMode: data.maintenanceMode }));
        showMessage('success', data.message);
      }
    } catch  {
      showMessage('error', 'Error toggling maintenance mode');
    }
  };

  const handleClearCookies = async () => {
    if (!confirm('Are you sure you want to clear cookies? You will be logged out.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/auth/clear-cookies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        showMessage('success', 'Cookies cleared successfully!');
        // Clear local storage and redirect
        localStorage.removeItem('adminToken');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
      } else {
        showMessage('error', data.message || 'Failed to clear cookies');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', 'Error clearing cookies');
    }
  };
const handleInvalidateAllSessions = async () => {
  if (!confirm('⚠️ DANGER: This will forcibly log out ALL users including yourself!\n\nThis cannot be undone. Continue?')) {
    return;
  }

  try {
    const token = localStorage.getItem('adminToken');
    const response = await fetch('/api/admin/auth/invalidate-all-sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      showMessage('success', 'All sessions invalidated! Redirecting to login...');
      localStorage.removeItem('adminToken');
      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 2000);
    } else {
      showMessage('error', data.message || 'Failed to invalidate sessions');
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage('error', 'Error invalidating sessions');
  }
};

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading settings...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Settings className="w-6 h-6 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Settings</h1>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* General Settings */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              General Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwords.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className="w-full px-3 py-2 pr-10 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Email Notifications</span>
                <button
                  onClick={() => handleInputChange('emailNotifications', !settings.emailNotifications)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.emailNotifications ? 'bg-blue-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  } mt-0.5`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-300">System Notifications</span>
                <button
                  onClick={() => handleInputChange('systemNotifications', !settings.systemNotifications)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.systemNotifications ? 'bg-blue-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.systemNotifications ? 'translate-x-6' : 'translate-x-1'
                  } mt-0.5`} />
                </button>
              </div>
            </div>
          </div>

          {/* Maintenance Settings */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Maintenance Mode
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-300">Maintenance Mode</span>
                  <p className="text-xs text-slate-500">Take the site offline for maintenance</p>
                </div>
                <button
                  onClick={toggleMaintenanceMode}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.maintenanceMode ? 'bg-red-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  } mt-0.5`} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Maintenance Message
                </label>
                <textarea
                  value={settings.maintenanceMessage}
                  onChange={(e) => handleInputChange('maintenanceMessage', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Session Management */}
<div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800">
  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
    <Shield className="w-5 h-5 text-red-400" />
    Session Management
  </h2>
  
  <div className="space-y-4">
    {/* Clear own cookies */}
    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
      <p className="text-sm text-orange-300 mb-3">
        <AlertTriangle className="w-4 h-4 inline mr-1" />
        Clear your own session and log yourself out.
      </p>
      <button
        onClick={handleClearCookies}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
      >
        <Shield className="w-4 h-4" />
        Clear My Session
      </button>
    </div>

    {/* Invalidate all sessions */}
    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
      <p className="text-sm text-red-300 mb-2 font-semibold">
        ⚠️ DANGER ZONE
      </p>
      <p className="text-sm text-red-300 mb-3">
        This will immediately log out ALL users including yourself. Use only in emergencies.
      </p>
      <button
        onClick={handleInvalidateAllSessions}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-700 hover:bg-red-800 text-white rounded-lg font-semibold transition-colors"
      >
        <AlertTriangle className="w-4 h-4" />
        Invalidate All Sessions
      </button>
    </div>
  </div>
</div>

        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-semibold transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
