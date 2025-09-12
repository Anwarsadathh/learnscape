'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Settings, AlertTriangle, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const pathname = usePathname();

  // Determine if user is on admin route
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <div className={`min-h-screen flex items-center justify-center ${isAdminRoute ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <div className="max-w-md mx-auto text-center px-6">
        
        {/* 404 Icon and Number */}
        <div className="mb-8">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
            isAdminRoute ? 'bg-red-500/20' : 'bg-red-100'
          }`}>
            <AlertTriangle className={`w-12 h-12 ${isAdminRoute ? 'text-red-400' : 'text-red-500'}`} />
          </div>
          <h1 className={`text-8xl font-bold mb-4 ${isAdminRoute ? 'text-white' : 'text-gray-900'}`}>
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className={`text-2xl font-semibold mb-4 ${isAdminRoute ? 'text-white' : 'text-gray-900'}`}>
            Page Not Found
          </h2>
          <p className={`text-lg mb-2 ${isAdminRoute ? 'text-slate-300' : 'text-gray-600'}`}>
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <p className={`text-sm ${isAdminRoute ? 'text-slate-400' : 'text-gray-500'}`}>
            URL: <code className={`px-2 py-1 rounded text-xs ${isAdminRoute ? 'bg-slate-800 text-slate-300' : 'bg-gray-200 text-gray-700'}`}>
              {pathname}
            </code>
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-4">
          {isAdminRoute ? (
            // Admin Routes
            <div className="space-y-3">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-2 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Settings className="w-5 h-5" />
                Go to Admin Dashboard
              </Link>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 w-full px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Admin Login
              </Link>
            </div>
          ) : (
            // User Routes
            <div className="space-y-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Home className="w-5 h-5" />
                Go to Homepage
              </Link>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
            </div>
          )}
        </div>

        {/* Additional Help */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-800">
          <p className={`text-sm ${isAdminRoute ? 'text-slate-400' : 'text-gray-500'}`}>
            If you think this is a mistake, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
