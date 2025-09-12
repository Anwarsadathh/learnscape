'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, X, LayoutDashboard, GraduationCap,Award, Settings, LogOut, Bell, Search, MessageSquare, Mail, User, ChevronDown
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Colleges', href: '/admin/colleges', icon: GraduationCap },
  { name: 'Contacts', href: '/admin/contacts', icon: MessageSquare },
  { name: 'Enquiries', href: '/admin/enquiries', icon: Mail },
  { name: 'Scholarships', href: '/admin/scholarships', icon: Award }, // ✅ Added Scholarships
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];
  const isActive = (path: string) => pathname === path;

  // Helper function to delete cookie
  const deleteCookie = (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  };

  // Updated sign out function
  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);

      // Get token from localStorage for API call
      const token = localStorage.getItem('adminToken');

      // Call logout API endpoint (we don't need to store response)
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      // Clear token from both localStorage AND cookies
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      deleteCookie('adminToken');
      
      console.log('✅ Token cleared from localStorage and cookies');

      // Force reload to ensure middleware picks up the change
      window.location.href = '/admin/login';
      
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, still clear local data and redirect
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      deleteCookie('adminToken');
      window.location.href = '/admin/login';
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold">LearnScape</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all
                    ${isActive(item.href)
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer - Sign Out Button */}
          <div className="p-4 border-t border-slate-800">
            <button 
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className={`w-5 h-5 ${isLoggingOut ? 'animate-spin' : ''}`} />
              {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800">
          <div className="flex items-center justify-between h-full px-6">
            
            {/* Left Side */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-slate-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              {/* Search Bar */}
              <div className="hidden md:flex items-center gap-2 max-w-sm">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              
              {/* Notifications */}
              <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-2">
                    <button className="block w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded">
                      Profile
                    </button>
                    <button className="block w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded">
                      Settings
                    </button>
                    <hr className="my-2 border-slate-700" />
                    <button 
                      onClick={handleSignOut}
                      disabled={isLoggingOut}
                      className="block w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-800 rounded disabled:opacity-50"
                    >
                      {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
