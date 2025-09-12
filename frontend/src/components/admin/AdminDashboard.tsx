'use client';

import React, { useEffect, useState } from 'react';
import {
  GraduationCap, 
  TrendingUp, 
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  Eye,
  AlertCircle
} from 'lucide-react';

interface DashboardStats {
  totalColleges: number;
  totalEnquiries: number;
  totalContacts: number;
  pendingEnquiries: number;
  pageViews: number;
  growth: {
    colleges: string;
    enquiries: string;
    contacts: string;
    pageViews: string;
  };
}

interface Activity {
  id: string;
  action: string;
  description: string;
  user: string;
  time: string;
  type: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 // In your AdminDashboard.tsx component
const fetchStats = async () => {
  try {
    const response = await fetch('/api/admin/dashboard/stats', {
      cache: 'no-store'
    });
    const data = await response.json();
    
    // LOG THE RECEIVED DATA
    console.log('📊 Dashboard API Response:', data);
    
    if (data.success) {
      console.log('✅ Stats loaded successfully:');
      console.log('   Total Colleges:', data.data.totalColleges);
      console.log('   Total Enquiries:', data.data.totalEnquiries);
      console.log('   Pending Enquiries:', data.data.pendingEnquiries);
      console.log('   Page Views:', data.data.pageViews);
      
      setStats(data.data);
    } else {
      console.error('❌ API returned error:', data.message);
      setError('Failed to load statistics');
    }
  } catch (error) {
    console.error('❌ Network error fetching stats:', error);
    setError('Network error occurred');
  }
};


  // Fetch recent activities
  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/activities?limit=8', {
        cache: 'no-store'
      });
      const data = await response.json();
      
      if (data.success) {
        setActivities(data.data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchActivities()]);
      setLoading(false);
    };

    loadDashboardData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'college': return GraduationCap;
      case 'enquiry': return FileText;
      case 'contact': return MessageSquare;
      default: return CheckCircle;
    }
  };

  // SAFE STATS CONFIGURATION WITH NULL CHECKS
  const dashboardStats = stats ? [
    { 
      name: 'Total Colleges', 
      value: (stats.totalColleges || 0).toLocaleString(), 
      change: stats.growth?.colleges || '+0%', 
      changeType: 'increase' as const,
      icon: GraduationCap, 
      color: 'bg-blue-500' 
    },
    { 
      name: 'Total Enquiries', 
      value: (stats.totalEnquiries || 0).toLocaleString(), 
      change: stats.growth?.enquiries || '+0%', 
      changeType: 'increase' as const,
      icon: FileText, 
      color: 'bg-green-500' 
    },
    { 
      name: 'Total Contacts', 
      value: (stats.totalContacts || 0).toLocaleString(), 
      change: stats.growth?.contacts || '+0%', 
      changeType: 'increase' as const,
      icon: MessageSquare, 
      color: 'bg-purple-500' 
    },
    { 
      name: 'Pending Enquiries', 
      value: (stats.pendingEnquiries || 0).toLocaleString(), 
      change: stats.growth?.enquiries || '+0%', 
      changeType: 'increase' as const,
      icon: AlertCircle, 
      color: 'bg-orange-500' 
    },
  ] : [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-slate-400 mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your platform.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-400">
            Last updated: {new Date().toLocaleString()}
          </span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.name} 
              className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 p-6 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-slate-400 mb-1">{stat.name}</p>
                  <p className="text-2xl font-bold text-white mb-2">{stat.value}</p>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-sm text-green-400 font-medium">{stat.change}</span>
                    <span className="text-xs text-slate-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.color}/20 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No recent activities found</p>
            ) : (
              activities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div 
                    key={activity.id} 
                    className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-all"
                  >
                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-slate-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white font-medium">{activity.action}</p>
                          <p className="text-sm text-slate-400 mt-1">{activity.description}</p>
                          <p className="text-xs text-slate-500 mt-1">by {activity.user}</p>
                        </div>
                        <span className="text-xs text-slate-500 ml-4 flex-shrink-0">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="space-y-4">
            {[
              {
                name: 'Manage Colleges',
                description: 'Add or edit college information',
                icon: GraduationCap,
                color: 'bg-blue-500',
                href: '/admin/colleges'
              },
              {
                name: 'View Enquiries',
                description: 'Check recent enquiries',
                icon: FileText,
                color: 'bg-green-500',
                href: '/admin/enquiries'
              },
              {
                name: 'View Contacts',
                description: 'Check contact messages',
                icon: MessageSquare,
                color: 'bg-purple-500',
                href: '/admin/contacts'
              },
              {
                name: 'Analytics',
                description: 'View platform analytics',
                icon: TrendingUp,
                color: 'bg-orange-500',
                href: '/admin/analytics'
              }
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.name}
                  className="w-full flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-all group"
                >
                  <div className={`w-10 h-10 ${action.color}/20 rounded-lg flex items-center justify-center group-hover:${action.color}/30 transition-all`}>
                    <Icon className={`w-5 h-5 ${action.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium">{action.name}</p>
                    <p className="text-xs text-slate-400">{action.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Performance Summary */}
        <div className="md:col-span-2 bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Platform Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Eye className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-xl font-bold text-white">
                    {/* SAFE ACCESS WITH NULL CHECKS */}
                    {stats?.pageViews ? stats.pageViews.toLocaleString() : '0'}
                  </p>
                  <p className="text-sm text-slate-400">Total Views</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-orange-400" />
                <div>
                  <p className="text-xl font-bold text-white">
                    {/* SAFE ACCESS WITH NULL CHECKS */}
                    {stats?.pendingEnquiries ? stats.pendingEnquiries.toLocaleString() : '0'}
                  </p>
                  <p className="text-sm text-slate-400">Pending</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-xl font-bold text-white">
                    {/* SAFE ACCESS WITH NULL CHECKS */}
                    {stats?.growth?.enquiries || '+0%'}
                  </p>
                  <p className="text-sm text-slate-400">Growth</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 p-6">
          <h3 className="text-lg font-bold text-white mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Database</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-400">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">API Server</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-400">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">File Storage</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-400">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Total Storage</span>
              <span className="text-xs text-slate-400">
                {/* SAFE ACCESS WITH NULL CHECKS */}
                {stats?.totalColleges ? `${Math.round(stats.totalColleges * 2.5)} MB used` : 'Loading...'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
