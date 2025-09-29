'use client';

import React, { useEffect, useState } from 'react';
import {
  User,
  Phone,
  Calendar,
  Mail,
  Eye,
  X,
  Search,
  Filter,
  GraduationCap,
  Award,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  FileText,
  Download,
  RefreshCw,
  DollarSign,
  Users,
  Image as ImageIcon,
  ExternalLink,
  CreditCard,
  Copy,
  Gift,
  Tag
} from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';

interface PaymentDetails {
  orderId?: string;
  paymentId?: string;
  amount?: number;
  currency?: string;
  status?: string;
  method?: string;
  signature?: string;
  verifiedAt?: string;
}

interface ScholarshipApplication {
  _id: string;
  applicationId: string;
  applicantName: string;
  email: string;
  mobile: string;
  courseInterested: string;
  address: string;
  pin: string;
  nationality: string;
  dob: string;
  aadhaar: string;
  bloodGroup: string;
  gender: string;
  caste: string;
  category: string;
  fatherName: string;
  fatherOccupation: string;
  fatherQualification: string;
  annualIncome: string;
  fatherMobile: string;
  motherName: string;
  motherQualification: string;
  motherOccupation: string;
  localGuardian?: string;
  guardianMobile?: string;
  guardianAddress?: string;
  sourceCode?: string; // ✅ This will be displayed as "Referral Code"
  status: string;
  paymentStatus?: string; 
  payment?: PaymentDetails;
  photo?: string;
  sslcMarksCard?: string;
  hscMarksCard?: string;
  aadhaarCard?: string;
  transferCertificate?: string;
  createdAt: string;
  reviewedAt?: string;
  adminNotes?: string;
}

interface Statistics {
  totalApplications: number;
  totalRevenue: number;
  paidApplications: number;
  failedPayments: number;
  pendingPayments: number;
}

const ScholarshipManagementPage = () => {
  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [referralFilter, setReferralFilter] = useState(''); // ✅ Added referral filter
  const [selectedApplication, setSelectedApplication] = useState<ScholarshipApplication | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewingDocument, setViewingDocument] = useState<{type: string, url: string} | null>(null);
  const [referralCodes, setReferralCodes] = useState<string[]>([]); // ✅ Added referral codes state
  const [statistics, setStatistics] = useState<Statistics>({
    totalApplications: 0,
    totalRevenue: 0,
    paidApplications: 0,
    failedPayments: 0,
    pendingPayments: 0
  });

  const fetchApplications = async (page = 1, search = '', status = '', paymentStatus = '', referralCode = '') => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        ...(referralCode && { referralCode }) // ✅ Added referral code filter
      });

      const response = await fetch(`/api/admin/scholarships?${queryParams}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate'
        }
      });

      const data = await response.json();

      if (data.success) {
        setApplications(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setCurrentPage(page);
        setReferralCodes(data.referralCodes || []); // ✅ Set referral codes for filter
        setStatistics(data.statistics || {
          totalApplications: 0,
          totalRevenue: 0,
          paidApplications: 0,
          failedPayments: 0,
          pendingPayments: 0
        });
        setError(null);
      } else {
        setError('Failed to load scholarship applications');
        setApplications([]);
      }
    } catch {
      setError('Network error occurred');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(currentPage, searchTerm, statusFilter, paymentFilter, referralFilter);
  }, [currentPage, searchTerm, statusFilter, paymentFilter, referralFilter]);

  const updateStatus = async (applicationId: string, newStatus: string, adminNotes?: string) => {
    try {
      const response = await fetch(`/api/admin/scholarships/${applicationId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminNotes })
      });

      if (response.ok) {
        fetchApplications(currentPage, searchTerm, statusFilter, paymentFilter, referralFilter);
        setSelectedApplication(null);
        alert('Status updated successfully');
      } else {
        alert('Failed to update status');
      }
    } catch {
      alert('Error updating status');
    }
  };

  const downloadDocument = (filename: string, documentType: string) => {
    if (!filename) {
      alert('Document not available');
      return;
    }
    
    const link = document.createElement('a');
    link.href = `/api/admin/scholarships/files/${filename}`;
    link.download = `${documentType}_${filename}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const viewDocument = (filename: string, documentType: string) => {
    if (!filename) {
      alert('Document not available');
      return;
    }
    
    setViewingDocument({
      type: documentType,
      url: `/api/admin/scholarships/files/${filename}`
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Copied to clipboard!');
    }
  };

 const exportApplications = async () => {
  try {
    setLoading(true);
    
    // Build query parameters for filtered export
    const queryParams = new URLSearchParams({
      format: 'csv',
      ...(searchTerm && { search: searchTerm }),
      ...(statusFilter && { status: statusFilter }),
      ...(paymentFilter && { paymentStatus: paymentFilter }),
      ...(referralFilter && { referralCode: referralFilter })
    });

    const response = await fetch(`/api/admin/scholarships/export?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Export failed');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Generate filename with current date and filters
    const date = new Date().toISOString().split('T')[0];
    let filename = `scholarship-applications-${date}`;
    
    if (statusFilter) filename += `-${statusFilter}`;
    if (paymentFilter) filename += `-${paymentFilter}`;
    if (referralFilter) filename += `-ref-${referralFilter}`;
    
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    alert('✅ Export completed successfully!');
  } catch (error) {
    console.error('Export error:', error);
    alert('❌ Error exporting applications. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const getStatusColor = (status: string | undefined | null) => {
    if (!status) return 'bg-gray-50 text-gray-600 border-gray-200';
    
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'processing': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'payment_failed': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string | undefined | null) => {
    if (!status) return 'bg-gray-50 text-gray-600 border-gray-200';
    
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'created': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      case 'incomplete': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'signature_mismatch': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const formatPaymentStatus = (status: string | undefined | null) => {
    if (!status) return 'N/A';
    
    switch (status.toLowerCase()) {
      case 'signature_mismatch': return 'Sig. Mismatch';
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      case 'created': return 'Created';
      case 'failed': return 'Failed';
      case 'incomplete': return 'Incomplete';
      default: return status;
    }
  };

  return (
    <AdminLayout>
     <div className="space-y-4 sm:space-y-6 min-h-screen text-white">

        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                Scholarship Applications
              </h1>
              <p className="text-sm sm:text-base text-gray-300">Manage scholarship applications and payments</p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={exportApplications}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                Export CSV
              </button>
              <button
                onClick={() => fetchApplications(currentPage, searchTerm, statusFilter, paymentFilter, referralFilter)}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-red-300 mb-1">Error Loading Applications</h4>
                <p className="text-sm text-red-200 mb-2">{error}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchApplications(currentPage, searchTerm, statusFilter, paymentFilter, referralFilter)}
                    className="text-xs px-3 py-1.5 bg-red-700 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Retry
                  </button>
                  <button
                    onClick={() => setError(null)}
                    className="text-xs px-3 py-1.5 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 p-2 sm:p-4 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-10 sm:h-10 bg-blue-900 rounded-md sm:rounded-lg flex items-center justify-center">
                <Award className="w-3 h-3 sm:w-5 sm:h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Total Apps</p>
                <p className="text-sm sm:text-xl font-bold text-white">{statistics.totalApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 p-2 sm:p-4 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-10 sm:h-10 bg-green-900 rounded-md sm:rounded-lg flex items-center justify-center">
                <CheckCircle className="w-3 h-3 sm:w-5 sm:h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Paid Apps</p>
                <p className="text-sm sm:text-xl font-bold text-white">{statistics.paidApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 p-2 sm:p-4 col-span-2 sm:col-span-1 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-10 sm:h-10 bg-yellow-900 rounded-md sm:rounded-lg flex items-center justify-center">
                <Clock className="w-3 h-3 sm:w-5 sm:h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Pending Pay</p>
                <p className="text-sm sm:text-xl font-bold text-white">{statistics.pendingPayments}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 p-2 sm:p-4 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-10 sm:h-10 bg-red-900 rounded-md sm:rounded-lg flex items-center justify-center">
                <XCircle className="w-3 h-3 sm:w-5 sm:h-5 text-red-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Failed Pay</p>
                <p className="text-sm sm:text-xl font-bold text-white">{statistics.failedPayments}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 p-2 sm:p-4 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-10 sm:h-10 bg-purple-900 rounded-md sm:rounded-lg flex items-center justify-center">
                <DollarSign className="w-3 h-3 sm:w-5 sm:h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Revenue</p>
                <p className="text-sm sm:text-xl font-bold text-white">₹{(statistics.totalRevenue / 100).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Updated Filters with Referral Code */}
        <div className="bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-700 p-3 sm:p-6 mb-4 sm:mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 justify-between items-start lg:items-center">
            {/* Search */}
            <div className="flex-1 max-w-md w-full">
              <div className="relative">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 sm:pl-10 pr-3 py-2 text-xs sm:text-sm bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-700 border border-gray-600 text-white rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                >
                  <option value="">All Status</option>
                  <option value="New">New</option>
                  <option value="Processing">Processing</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="payment_failed">Payment Failed</option>
                </select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="bg-gray-700 border border-gray-600 text-white rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                >
                  <option value="">All Payments</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="created">Created</option>
                  <option value="failed">Failed</option>
                  <option value="incomplete">Incomplete</option>
                  <option value="signature_mismatch">Signature Mismatch</option>
                </select>
              </div>

              {/* ✅ NEW: Referral Code Filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={referralFilter}
                  onChange={(e) => setReferralFilter(e.target.value)}
                  className="bg-gray-700 border border-gray-600 text-white rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                >
                  <option value="">All Referrals</option>
                  {referralCodes.map((code) => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Updated Applications Table with Referral Code Column */}
        <div className="bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-200">Student</th>
                  <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-200">Course</th>
                  <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-200">Family</th>
                  <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-200">Status</th>
                  <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-200">Payment</th>
                  <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-200">Referral Code</th>
                  <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-200">Date</th>
                  <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-2 sm:px-6 py-4 sm:py-8 text-center text-xs sm:text-sm text-gray-400">
                      <div className="flex items-center justify-center gap-3">
                        <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                        Loading applications...
                      </div>
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-2 sm:px-6 py-4 sm:py-8 text-center text-xs sm:text-sm text-gray-400">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  applications.map((application) => (
                    <tr key={application._id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-2 sm:px-6 py-2 sm:py-4">
                        <div>
                          <h3 className="text-white font-semibold text-xs sm:text-sm">{application.applicantName}</h3>
                          <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-400 mt-1">
                            <Mail className="w-2 h-2 sm:w-3 sm:h-3" />
                            <span className="truncate max-w-[120px] sm:max-w-none">{application.email}</span>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-400 mt-1">
                            <Phone className="w-2 h-2 sm:w-3 sm:h-3" />
                            <span>{application.mobile}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            ID: {application.applicationId.slice(-6)}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                          <span className="text-white font-medium text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">{application.courseInterested}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {application.category}
                        </div>
                      </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4">
                        <div className="text-xs sm:text-sm text-white">
                          <div className="truncate max-w-[120px] sm:max-w-none">Father: {application.fatherName}</div>
                          <div className="truncate max-w-[120px] sm:max-w-none">Mother: {application.motherName}</div>
                          <div className="text-gray-400">{application.annualIncome}</div>
                        </div>
                      </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4">
                        <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs rounded-full border ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4">
                        <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs rounded-full border ${getPaymentStatusColor(application.paymentStatus)}`}>
                          {formatPaymentStatus(application.paymentStatus)}
                        </span>
                        {application.payment?.amount && (
                          <div className="text-xs text-gray-400 mt-1">
                            ₹{(application.payment.amount / 100).toFixed(2)}
                          </div>
                        )}
                      </td>
                      {/* ✅ NEW: Referral Code Column */}
                      <td className="px-2 sm:px-6 py-2 sm:py-4">
                        {application.sourceCode ? (
                          <div className="flex items-center gap-1">
                            <Gift className="w-3 h-3 text-purple-400" />
                            <code className="px-2 py-1 bg-purple-900 text-purple-300 border border-purple-700 rounded text-xs font-mono">
                              {application.sourceCode}
                            </code>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">No referral</span>
                        )}
                      </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4">
                        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-300">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{new Date(application.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4">
                        <button
                          onClick={() => setSelectedApplication(application)}
                          className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-all"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-3 sm:px-6 py-3 sm:py-4 bg-gray-700 border-t border-gray-600">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-1 sm:gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-gray-600 border border-gray-500 text-gray-200 rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-gray-600 border border-gray-500 text-gray-200 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ✅ Updated Application Detail Modal with Referral Code Section - Dark Theme */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-700 p-3 sm:p-6 max-w-5xl w-full h-[85vh] sm:h-[80vh] overflow-y-auto shadow-xl">
              <div className="flex justify-between items-center mb-3 sm:mb-6 sticky top-0 bg-gray-800 pb-2 border-b border-gray-700">
                <h2 className="text-lg sm:text-xl font-bold text-white">Application Details</h2>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-200 p-1"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6 text-xs sm:text-sm">
                {/* Personal Information */}
                <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-4 sm:p-6 border border-blue-800">
                  <h3 className="text-base sm:text-lg font-semibold text-blue-200 mb-2 sm:mb-4 flex items-center gap-2">
                    <div className="p-2 bg-blue-800 rounded-lg">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
                    </div>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                    <div className="bg-gray-800 rounded-lg p-3 border border-blue-700">
                      <label className="text-xs text-blue-300 font-medium">Application ID</label>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <p className="text-blue-100 font-semibold text-xs sm:text-sm">{selectedApplication.applicationId}</p>
                        <button
                          onClick={() => copyToClipboard(selectedApplication.applicationId)}
                          className="text-blue-400 hover:text-blue-300 p-1"
                        >
                          <Copy className="w-2 h-2 sm:w-3 sm:h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 border border-blue-700">
                      <label className="text-xs text-blue-300 font-medium">Student Name</label>
                      <p className="text-blue-100 font-semibold text-xs sm:text-sm">{selectedApplication.applicantName}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 border border-blue-700">
                      <label className="text-xs text-blue-300 font-medium">Email</label>
                      <p className="text-blue-100 font-semibold text-xs sm:text-sm truncate">{selectedApplication.email}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 border border-blue-700">
                      <label className="text-xs text-blue-300 font-medium">Mobile</label>
                      <p className="text-blue-100 font-semibold text-xs sm:text-sm">{selectedApplication.mobile}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 border border-blue-700">
                      <label className="text-xs text-blue-300 font-medium">Course</label>
                      <p className="text-blue-100 font-semibold text-xs sm:text-sm">{selectedApplication.courseInterested}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 border border-blue-700">
                      <label className="text-xs text-blue-300 font-medium">Category</label>
                      <p className="text-blue-100 font-semibold text-xs sm:text-sm">{selectedApplication.category}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 border border-blue-700">
                      <label className="text-xs text-blue-300 font-medium">Date of Birth</label>
                      <p className="text-blue-100 font-semibold text-xs sm:text-sm">{new Date(selectedApplication.dob).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 border border-blue-700">
                      <label className="text-xs text-blue-300 font-medium">Gender</label>
                      <p className="text-blue-100 font-semibold text-xs sm:text-sm">{selectedApplication.gender}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 border border-blue-700">
                      <label className="text-xs text-blue-300 font-medium">Blood Group</label>
                      <p className="text-blue-100 font-semibold text-xs sm:text-sm">{selectedApplication.bloodGroup}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 border border-blue-700">
                      <label className="text-xs text-blue-300 font-medium">Aadhaar Number</label>
                      <p className="text-blue-100 font-semibold text-xs sm:text-sm">{selectedApplication.aadhaar}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 border border-blue-700">
                      <label className="text-xs text-blue-300 font-medium">Nationality</label>
                      <p className="text-blue-100 font-semibold text-xs sm:text-sm">{selectedApplication.nationality}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 border border-blue-700">
                      <label className="text-xs text-blue-300 font-medium">PIN Code</label>
                      <p className="text-blue-100 font-semibold text-xs sm:text-sm">{selectedApplication.pin}</p>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-4 bg-gray-800 rounded-lg p-3 border border-blue-700">
                    <label className="text-xs text-blue-300 font-medium">Address</label>
                    <p className="text-blue-100 font-semibold text-xs sm:text-sm">{selectedApplication.address}</p>
                  </div>
                </div>

                {/* ✅ NEW: Referral Information Section - Dark Theme */}
                {selectedApplication.sourceCode && (
                  <div className="bg-gradient-to-r from-purple-900 to-violet-900 rounded-2xl p-4 sm:p-6 border border-purple-800">
                    <h3 className="text-base sm:text-lg font-semibold text-purple-200 mb-2 sm:mb-4 flex items-center gap-2">
                      <div className="p-2 bg-purple-800 rounded-lg">
                        <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
                      </div>
                      Referral Information
                    </h3>
                    <div className="bg-gray-800 rounded-lg p-4 border border-purple-700">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-purple-400" />
                        <label className="text-sm text-purple-300 font-medium">Referral Code</label>
                        <code className="px-3 py-1 bg-purple-800 text-purple-200 border border-purple-700 rounded text-sm font-mono">
                          {selectedApplication.sourceCode}
                        </code>
                        <button
                          onClick={() => copyToClipboard(selectedApplication.sourceCode!)}
                          className="text-purple-400 hover:text-purple-300 p-1"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Family Information - Dark Theme */}
                <div className="bg-gradient-to-r from-green-900 to-emerald-900 rounded-2xl p-4 sm:p-6 border border-green-800">
                  <h3 className="text-base sm:text-lg font-semibold text-green-200 mb-2 sm:mb-4 flex items-center gap-2">
                    <div className="p-2 bg-green-800 rounded-lg">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-300" />
                    </div>
                    Family Information
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                    <div className="bg-gray-800 rounded-lg p-3 border border-green-700">
                      <label className="text-xs text-green-300 font-medium">Father&apos;s Name</label>
                      <p className="text-green-100 font-semibold text-xs sm:text-sm">{selectedApplication.fatherName}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 border border-green-700">
                      <label className="text-xs text-green-300 font-medium">Father&apos;s Occupation</label>
                      <p className="text-green-100 font-semibold text-xs sm:text-sm">{selectedApplication.fatherOccupation}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 border border-green-700">
                      <label className="text-xs text-green-300 font-medium">Father&apos;s Education</label>
                      <p className="text-green-100 font-semibold text-xs sm:text-sm">{selectedApplication.fatherQualification}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 border border-green-700">
                      <label className="text-xs text-green-300 font-medium">Father&apos;s Mobile</label>
                      <p className="text-green-100 font-semibold text-xs sm:text-sm">{selectedApplication.fatherMobile}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 border border-green-700">
                      <label className="text-xs text-green-300 font-medium">Mother&apos;s Name</label>
                      <p className="text-green-100 font-semibold text-xs sm:text-sm">{selectedApplication.motherName}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 border border-green-700">
                      <label className="text-xs text-green-300 font-medium">Mother&apos;s Education</label>
                      <p className="text-green-100 font-semibold text-xs sm:text-sm">{selectedApplication.motherQualification}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 border border-green-700">
                      <label className="text-xs text-green-300 font-medium">Mother&apos;s Occupation</label>
                      <p className="text-green-100 font-semibold text-xs sm:text-sm">{selectedApplication.motherOccupation}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 border border-green-700">
                      <label className="text-xs text-green-300 font-medium">Annual Income</label>
                      <p className="text-green-100 font-semibold text-xs sm:text-sm">{selectedApplication.annualIncome}</p>
                    </div>
                    {selectedApplication.localGuardian && (
                      <div className="bg-gray-800 rounded-lg p-3 border border-green-700">
                        <label className="text-xs text-green-300 font-medium">Local Guardian</label>
                        <p className="text-green-100 font-semibold text-xs sm:text-sm">{selectedApplication.localGuardian}</p>
                      </div>
                    )}
                  </div>
                </div>

               {/* Documents Section - Dark Theme */}
<div className="bg-gradient-to-r from-orange-900 to-amber-900 rounded-2xl p-4 sm:p-6 border border-orange-800">
  <h3 className="text-base sm:text-lg font-semibold text-orange-200 mb-2 sm:mb-4 flex items-center gap-2">
    <div className="p-2 bg-orange-800 rounded-lg">
      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-orange-300" />
    </div>
    Uploaded Documents
  </h3>
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
    
    {/* Photo */}
    <div className="bg-gray-800 rounded-lg p-3 border border-orange-700 shadow-sm">
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <h4 className="text-xs font-semibold text-orange-200">Photo</h4>
        <div className="flex gap-1">
          {selectedApplication.photo && (
            <>
              <button
                onClick={() => viewDocument(selectedApplication.photo!, 'Photo')}
                className="p-1 text-orange-400 hover:text-orange-300 bg-orange-800 hover:bg-orange-700 rounded transition-all"
                title="View Photo"
              >
                <Eye className="w-3 h-3" />
              </button>
              <button
                onClick={() => downloadDocument(selectedApplication.photo!, 'Photo')}
                className="p-1 text-green-400 hover:text-green-300 bg-green-800 hover:bg-green-700 rounded transition-all"
                title="Download Photo"
              >
                <Download className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>
      {selectedApplication.photo ? (
        <div className="flex items-center gap-1 text-xs text-green-300 bg-green-900 rounded p-2">
          <ImageIcon className="w-3 h-3" />
          <span className="font-medium">Uploaded</span>
        </div>
      ) : (
        <div className="text-xs text-red-300 bg-red-900 rounded p-2 font-medium">Not uploaded</div>
      )}
    </div>

    {/* SSLC Marks Card */}
    <div className="bg-gray-800 rounded-lg p-3 border border-orange-700 shadow-sm">
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <h4 className="text-xs font-semibold text-orange-200">SSLC Marks</h4>
        <div className="flex gap-1">
          {selectedApplication.sslcMarksCard && (
            <>
              <button
                onClick={() => viewDocument(selectedApplication.sslcMarksCard!, 'SSLC Marks Card')}
                className="p-1 text-orange-400 hover:text-orange-300 bg-orange-800 hover:bg-orange-700 rounded transition-all"
                title="View SSLC Marks Card"
              >
                <Eye className="w-3 h-3" />
              </button>
              <button
                onClick={() => downloadDocument(selectedApplication.sslcMarksCard!, 'SSLC_Marks_Card')}
                className="p-1 text-green-400 hover:text-green-300 bg-green-800 hover:bg-green-700 rounded transition-all"
                title="Download SSLC Marks Card"
              >
                <Download className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>
      {selectedApplication.sslcMarksCard ? (
        <div className="flex items-center gap-1 text-xs text-green-300 bg-green-900 rounded p-2">
          <FileText className="w-3 h-3" />
          <span className="font-medium">Uploaded</span>
        </div>
      ) : (
        <div className="text-xs text-red-300 bg-red-900 rounded p-2 font-medium">Not uploaded</div>
      )}
    </div>

    {/* HSC Marks Card */}
    <div className="bg-gray-800 rounded-lg p-3 border border-orange-700 shadow-sm">
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <h4 className="text-xs font-semibold text-orange-200">HSC Marks</h4>
        <div className="flex gap-1">
          {selectedApplication.hscMarksCard && (
            <>
              <button
                onClick={() => viewDocument(selectedApplication.hscMarksCard!, 'HSC Marks Card')}
                className="p-1 text-orange-400 hover:text-orange-300 bg-orange-800 hover:bg-orange-700 rounded transition-all"
                title="View HSC Marks Card"
              >
                <Eye className="w-3 h-3" />
              </button>
              <button
                onClick={() => downloadDocument(selectedApplication.hscMarksCard!, 'HSC_Marks_Card')}
                className="p-1 text-green-400 hover:text-green-300 bg-green-800 hover:bg-green-700 rounded transition-all"
                title="Download HSC Marks Card"
              >
                <Download className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>
      {selectedApplication.hscMarksCard ? (
        <div className="flex items-center gap-1 text-xs text-green-300 bg-green-900 rounded p-2">
          <FileText className="w-3 h-3" />
          <span className="font-medium">Uploaded</span>
        </div>
      ) : (
        <div className="text-xs text-red-300 bg-red-900 rounded p-2 font-medium">Not uploaded</div>
      )}
    </div>

    {/* Aadhaar Card */}
    <div className="bg-gray-800 rounded-lg p-3 border border-orange-700 shadow-sm">
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <h4 className="text-xs font-semibold text-orange-200">Aadhaar Card</h4>
        <div className="flex gap-1">
          {selectedApplication.aadhaarCard && (
            <>
              <button
                onClick={() => viewDocument(selectedApplication.aadhaarCard!, 'Aadhaar Card')}
                className="p-1 text-orange-400 hover:text-orange-300 bg-orange-800 hover:bg-orange-700 rounded transition-all"
                title="View Aadhaar Card"
              >
                <Eye className="w-3 h-3" />
              </button>
              <button
                onClick={() => downloadDocument(selectedApplication.aadhaarCard!, 'Aadhaar_Card')}
                className="p-1 text-green-400 hover:text-green-300 bg-green-800 hover:bg-green-700 rounded transition-all"
                title="Download Aadhaar Card"
              >
                <Download className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>
      {selectedApplication.aadhaarCard ? (
        <div className="flex items-center gap-1 text-xs text-green-300 bg-green-900 rounded p-2">
          <FileText className="w-3 h-3" />
          <span className="font-medium">Uploaded</span>
        </div>
      ) : (
        <div className="text-xs text-red-300 bg-red-900 rounded p-2 font-medium">Not uploaded</div>
      )}
    </div>

    {/* Transfer Certificate */}
    <div className="bg-gray-800 rounded-lg p-3 border border-orange-700 shadow-sm">
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <h4 className="text-xs font-semibold text-orange-200">Transfer Cert</h4>
        <div className="flex gap-1">
          {selectedApplication.transferCertificate && (
            <>
              <button
                onClick={() => viewDocument(selectedApplication.transferCertificate!, 'Transfer Certificate')}
                className="p-1 text-orange-400 hover:text-orange-300 bg-orange-800 hover:bg-orange-700 rounded transition-all"
                title="View Transfer Certificate"
              >
                <Eye className="w-3 h-3" />
              </button>
              <button
                onClick={() => downloadDocument(selectedApplication.transferCertificate!, 'Transfer_Certificate')}
                className="p-1 text-green-400 hover:text-green-300 bg-green-800 hover:bg-green-700 rounded transition-all"
                title="Download Transfer Certificate"
              >
                <Download className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>
      {selectedApplication.transferCertificate ? (
        <div className="flex items-center gap-1 text-xs text-green-300 bg-green-900 rounded p-2">
          <FileText className="w-3 h-3" />
          <span className="font-medium">Uploaded</span>
        </div>
      ) : (
        <div className="text-xs text-red-300 bg-red-900 rounded p-2 font-medium">Not uploaded</div>
      )}
    </div>
  </div>
</div>

                {/* Payment Information - Dark Theme */}
                {selectedApplication.payment && (
                  <div className="bg-gradient-to-r from-teal-900 to-cyan-900 rounded-2xl p-4 sm:p-6 border border-teal-800">
                    <h3 className="text-base sm:text-lg font-semibold text-teal-200 mb-2 sm:mb-4 flex items-center gap-2">
                      <div className="p-2 bg-teal-800 rounded-lg">
                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300" />
                      </div>
                      Payment Information
                    </h3>
                    <div className="bg-gray-800 rounded-lg p-4 border border-teal-700">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                        <div className="bg-teal-900 rounded-lg p-3 border border-teal-700">
                          <label className="text-xs text-teal-300 font-medium">Payment Status</label>
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full border font-medium ${getPaymentStatusColor(selectedApplication.paymentStatus)}`}>
                            {formatPaymentStatus(selectedApplication.paymentStatus)}
                          </span>
                        </div>
                        <div className="bg-teal-900 rounded-lg p-3 border border-teal-700">
                          <label className="text-xs text-teal-300 font-medium">Amount</label>
                          <p className="text-teal-100 font-bold text-xs sm:text-sm">
                            ₹{selectedApplication.payment.amount ? (selectedApplication.payment.amount / 100).toFixed(2) : '0.00'}
                          </p>
                        </div>
                        {selectedApplication.payment.orderId && (
                          <div className="bg-teal-900 rounded-lg p-3 border border-teal-700">
                            <label className="text-xs text-teal-300 font-medium">Order ID</label>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <p className="text-teal-100 font-mono text-xs truncate max-w-[100px] sm:max-w-none">{selectedApplication.payment.orderId}</p>
                              <button
                                onClick={() => copyToClipboard(selectedApplication.payment!.orderId!)}
                                className="text-teal-400 hover:text-teal-300 p-1"
                              >
                                <Copy className="w-2 h-2 sm:w-3 sm:h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Information - Dark Theme */}
                <div className="bg-gradient-to-r from-slate-800 to-gray-800 rounded-2xl p-4 sm:p-6 border border-slate-700">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-200 mb-2 sm:mb-4 flex items-center gap-2">
                    <div className="p-2 bg-slate-700 rounded-lg">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
                    </div>
                    Status Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    <div className="bg-gray-800 rounded-lg p-3 border border-slate-600">
                      <label className="text-xs text-slate-300 font-medium">Application Status</label>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full border font-medium ${getStatusColor(selectedApplication.status)}`}>
                        {selectedApplication.status}
                      </span>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 border border-slate-600">
                      <label className="text-xs text-slate-300 font-medium">Submitted</label>
                      <p className="text-slate-100 font-semibold text-xs sm:text-sm">{new Date(selectedApplication.createdAt).toLocaleString()}</p>
                    </div>
                    {selectedApplication.reviewedAt && (
                      <div className="bg-gray-800 rounded-lg p-3 border border-slate-600">
                        <label className="text-xs text-slate-300 font-medium">Last Reviewed</label>
                        <p className="text-slate-100 font-semibold text-xs sm:text-sm">{new Date(selectedApplication.reviewedAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  {selectedApplication.adminNotes && (
                    <div className="mt-2 sm:mt-4 bg-gray-800 rounded-lg p-3 border border-slate-600">
                      <label className="text-xs text-slate-300 font-medium">Admin Notes</label>
                      <p className="text-slate-100 whitespace-pre-wrap text-xs sm:text-sm font-medium">{selectedApplication.adminNotes}</p>
                    </div>
                  )}
                </div>

                {/* Actions - Dark Theme */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 sm:pt-4 border-t-2 border-gray-700 gap-3 sm:gap-0 bg-gray-700 rounded-xl p-4">
                  <div>
                    <label className="text-sm text-gray-200 font-semibold">Update Status</label>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => updateStatus(selectedApplication._id, 'Processing')}
                      className="px-4 py-2 text-sm bg-yellow-800 text-yellow-200 border-2 border-yellow-700 rounded-xl hover:bg-yellow-700 transition-all font-medium shadow-sm"
                    >
                      Processing
                    </button>
                    <button
                      onClick={() => updateStatus(selectedApplication._id, 'Approved')}
                      className="px-4 py-2 text-sm bg-green-800 text-green-200 border-2 border-green-700 rounded-xl hover:bg-green-700 transition-all font-medium shadow-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(selectedApplication._id, 'Rejected')}
                      className="px-4 py-2 text-sm bg-red-800 text-red-200 border-2 border-red-700 rounded-xl hover:bg-red-700 transition-all font-medium shadow-sm"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Document Viewer Modal - Dark Theme */}
        {viewingDocument && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-60 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-700 p-3 sm:p-6 max-w-4xl w-full h-[80vh] sm:h-[75vh] overflow-auto shadow-xl">
              <div className="flex justify-between items-center mb-2 sm:mb-4">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                  {viewingDocument.type}
                </h3>
                <div className="flex gap-1 sm:gap-2">
                  <button
                    onClick={() => window.open(viewingDocument.url, '_blank')}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-400 bg-blue-900 hover:bg-blue-800 rounded-lg transition-all"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = viewingDocument.url;
                      link.download = `${viewingDocument.type.replace(/\s+/g, '_')}_${Date.now()}`;
                      link.target = '_blank';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-green-400 bg-green-900 hover:bg-green-800 rounded-lg transition-all"
                    title="Download document"
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => setViewingDocument(null)}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-200 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-2 sm:p-4 flex justify-center items-center min-h-[300px] border border-gray-600">
                {viewingDocument.url.toLowerCase().endsWith('.pdf') ? (
                  <div className="w-full h-full">
                    <iframe
                      src={viewingDocument.url}
                      className="w-full h-[50vh] sm:h-[60vh] border-0 rounded"
                      title={`${viewingDocument.type} document`}
                    />
                    <div className="mt-2 text-center">
                      <p className="text-xs text-gray-300">PDF Document - {viewingDocument.type}</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={viewingDocument.url}
                      alt={`${viewingDocument.type} document preview`}
                      className="w-full h-auto max-h-[60vh] object-contain border-0 rounded mx-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="flex flex-col items-center justify-center h-40 text-gray-400">
                              <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                              </svg>
                              <p class="text-sm">Unable to preview document</p>
                              <p class="text-xs">Click download to view file</p>
                            </div>
                          `;
                        }
                      }}
                    />
                    <div className="mt-2">
                      <p className="text-xs text-gray-300">Image Document - {viewingDocument.type}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default ScholarshipManagementPage;
