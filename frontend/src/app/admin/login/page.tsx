'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff, Shield } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      console.log('Token found, redirecting to dashboard...');
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Starting login process...');
      
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('📦 Login response received:', {
        status: response.status,
        success: data.success,
        hasToken: !!data.token
      });

      if (response.ok && data.success && data.token) {
        console.log('✅ Login successful, storing token...');
        
        // Store token in localStorage
        localStorage.setItem('adminToken', data.token);
        
        // Store token in cookie for middleware
        document.cookie = `adminToken=${data.token}; path=/; max-age=86400; SameSite=Lax`;
        
        console.log('🚀 Token stored, initiating redirect...');
        
        // Use router.push for SPA navigation
        router.push('/admin/dashboard');
        
        // Fallback: Force navigation if router.push doesn't work
        setTimeout(() => {
          const currentPath = window.location.pathname;
          console.log('🔍 Current path after redirect attempt:', currentPath);
          
          if (currentPath !== '/admin/dashboard') {
            console.log('⚠️ Router.push failed, using window.location...');
            window.location.href = '/admin/dashboard';
          }
        }, 100);
        
      } else {
        console.log('❌ Login failed:', data.message);
        setError(data.message || 'Login failed');
        setLoading(false);
      }
    } catch (err) {
      console.error('🔥 Network error:', err);
      setError('Network error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <form onSubmit={handleLogin} className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-8 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm mb-6">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-blue-300 uppercase tracking-wider">Admin Access</span>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400">Please sign in to your admin account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Email Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin@example.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-700 rounded focus:ring-blue-500"
                disabled={loading}
              />
              <span className="ml-2 text-sm text-slate-300">Remember me</span>
            </label>
            <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : 'Sign In'}
          </button>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              Protected by advanced security measures
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;