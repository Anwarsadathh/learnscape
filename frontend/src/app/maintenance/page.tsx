'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

const MaintenancePage = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    // Auto-refresh every 30 seconds to check if maintenance is over
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/admin/settings/maintenance');
        
        if (response.ok) {
          const data = await response.json();
          if (!data.maintenanceMode) {
            router.push('/');
            return;
          }
        }
        
        // Reset countdown
        setCountdown(30);
      } catch (error) {
        console.error('Auto-check failed:', error);
      }
    }, 30000);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 30);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, [router]);

  const handleCheckAgain = async () => {
    try {
      const response = await fetch('/api/admin/settings/maintenance');
      
      if (response.ok) {
        const data = await response.json();
        if (!data.maintenanceMode) {
          router.push('/');
        } else {
          // Reload the page to get latest maintenance message
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Manual check failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-lg mx-auto text-center mb-12">
        
        {/* Glass Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl mt-16 ">
          
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-orange-500/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-orange-400" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-4">
            Under Maintenance
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-blue-100 mb-6">
            We&apos;re making improvements
          </p>

          {/* Description */}
          <p className="text-slate-300 mb-8 leading-relaxed">
            We are currently performing maintenance to improve your experience. 
            Please check back soon - we&apos;ll be up and running shortly!
          </p>

          {/* Auto-refresh countdown */}
          <div className="flex items-center justify-center gap-3 text-blue-300 mb-6">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="text-sm">Auto-checking in {countdown} seconds...</span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={handleCheckAgain}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Check Again
            </button>
            
            <button 
              onClick={() => router.push('/')}
              className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors border border-white/30 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Try Homepage
            </button>
          </div>

        </div>

        {/* Footer */}
        <p className="text-white/60 text-sm mt-6">
          Thank you for your patience • LearnScape Team
        </p>
      </div>
    </div>
  );
};

export default MaintenancePage;
