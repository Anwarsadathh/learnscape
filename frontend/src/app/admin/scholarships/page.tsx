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
  Image as ImageIcon, // ✅ Rename the Lucide icon
  ExternalLink,
  CreditCard,
  Copy
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
  sourceCode?: string;
  status: string;
  paymentStatus: string;
  payment?: PaymentDetails;
  // Document files
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
  const [selectedApplication, setSelectedApplication] = useState<ScholarshipApplication | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewingDocument, setViewingDocument] = useState<{type: string, url: string} | null>(null);
  const [statistics, setStatistics] = useState<Statistics>({
    totalApplications: 0,
    totalRevenue: 0,
    paidApplications: 0,
    failedPayments: 0,
    pendingPayments: 0
  });

  const fetchApplications = async (page = 1, search = '', status = '', paymentStatus = '') => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus })
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
    fetchApplications(currentPage, searchTerm, statusFilter, paymentFilter);
  }, [currentPage, searchTerm, statusFilter, paymentFilter]);

  const updateStatus = async (applicationId: string, newStatus: string, adminNotes?: string) => {
    try {
      const response = await fetch(`/api/admin/scholarships/${applicationId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminNotes })
      });

      if (response.ok) {
        fetchApplications(currentPage, searchTerm, statusFilter, paymentFilter);
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
      // Fallback for older browsers
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
      const response = await fetch('/api/admin/scholarships/export/csv');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'scholarship-applications.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      alert('Error exporting applications');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'processing': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'approved': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'payment_failed': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'created': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'failed': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'incomplete': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'signature_mismatch': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const formatPaymentStatus = (status: string) => {
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
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                Scholarship Applications
              </h1>
              <p className="text-sm sm:text-base text-slate-400">Manage scholarship applications and payments</p>
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
                onClick={() => fetchApplications(currentPage, searchTerm, statusFilter, paymentFilter)}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
              <span className="text-sm sm:text-base text-red-400">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Statistics Cards - Mobile 2 per row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg sm:rounded-xl border border-slate-800 p-2 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-10 sm:h-10 bg-blue-500/20 rounded-md sm:rounded-lg flex items-center justify-center">
                <Award className="w-3 h-3 sm:w-5 sm:h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-400">Total Apps</p>
                <p className="text-sm sm:text-xl font-bold text-white">{statistics.totalApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg sm:rounded-xl border border-slate-800 p-2 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-10 sm:h-10 bg-green-500/20 rounded-md sm:rounded-lg flex items-center justify-center">
                <CheckCircle className="w-3 h-3 sm:w-5 sm:h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-400">Paid Apps</p>
                <p className="text-sm sm:text-xl font-bold text-white">{statistics.paidApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg sm:rounded-xl border border-slate-800 p-2 sm:p-4 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-10 sm:h-10 bg-yellow-500/20 rounded-md sm:rounded-lg flex items-center justify-center">
                <Clock className="w-3 h-3 sm:w-5 sm:h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-400">Pending Pay</p>
                <p className="text-sm sm:text-xl font-bold text-white">{statistics.pendingPayments}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg sm:rounded-xl border border-slate-800 p-2 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-10 sm:h-10 bg-red-500/20 rounded-md sm:rounded-lg flex items-center justify-center">
                <XCircle className="w-3 h-3 sm:w-5 sm:h-5 text-red-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-400">Failed Pay</p>
                <p className="text-sm sm:text-xl font-bold text-white">{statistics.failedPayments}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg sm:rounded-xl border border-slate-800 p-2 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-10 sm:h-10 bg-purple-500/20 rounded-md sm:rounded-lg flex items-center justify-center">
                <DollarSign className="w-3 h-3 sm:w-5 sm:h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-400">Revenue</p>
                <p className="text-sm sm:text-xl font-bold text-white">₹{(statistics.totalRevenue / 100).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-slate-800 p-3 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 justify-between items-start lg:items-center">
            {/* Search */}
            <div className="flex-1 max-w-md w-full">
              <div className="relative">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 sm:pl-10 pr-3 py-2 text-xs sm:text-sm bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
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
                  className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
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
            </div>
          </div>
        </div>

        {/* Applications Table - Mobile Responsive */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-semibold text-slate-300">Student</th>
                  <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-semibold text-slate-300">Course</th>
                  <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-semibold text-slate-300">Family</th>
                  <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-semibold text-slate-300">Status</th>
                  <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-semibold text-slate-300">Payment</th>
                  <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-semibold text-slate-300">Date</th>
                  <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-2 sm:px-6 py-4 sm:py-8 text-center text-xs sm:text-sm text-slate-400">
                      Loading applications...
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-2 sm:px-6 py-4 sm:py-8 text-center text-xs sm:text-sm text-slate-400">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  applications.map((application) => (
                    <tr key={application._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-2 sm:px-6 py-2 sm:py-4">
                        <div>
                          <h3 className="text-white font-semibold text-xs sm:text-sm">{application.applicantName}</h3>
                          <div className="flex items-center gap-1 sm:gap-2 text-xs text-slate-400 mt-1">
                            <Mail className="w-2 h-2 sm:w-3 sm:h-3" />
                            <span className="truncate max-w-[120px] sm:max-w-none">{application.email}</span>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2 text-xs text-slate-400 mt-1">
                            <Phone className="w-2 h-2 sm:w-3 sm:h-3" />
                            <span>{application.mobile}</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            ID: {application.applicationId.slice(-6)}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                          <span className="text-white font-medium text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">{application.courseInterested}</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {application.category}
                        </div>
                      </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4">
                        <div className="text-xs sm:text-sm text-white">
                          <div className="truncate max-w-[120px] sm:max-w-none">Father: {application.fatherName}</div>
                          <div className="truncate max-w-[120px] sm:max-w-none">Mother: {application.motherName}</div>
                          <div className="text-slate-400">{application.annualIncome}</div>
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
                          <div className="text-xs text-slate-400 mt-1">
                            ₹{(application.payment.amount / 100).toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4">
                        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-300">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{new Date(application.createdAt).toLocaleDateString()}</span>
                        </div>
                        {application.sourceCode && (
                          <div className="text-xs text-slate-500 mt-1">
                            {application.sourceCode}
                          </div>
                        )}
                      </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4">
                        <button
                          onClick={() => setSelectedApplication(application)}
                          className="p-1.5 sm:p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all"
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
            <div className="px-3 sm:px-6 py-3 sm:py-4 bg-slate-800/30 border-t border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-slate-400">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-1 sm:gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-slate-700 text-white rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-slate-700 text-white rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Application Detail Modal - Smaller Height */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-800 p-3 sm:p-6 max-w-5xl w-full h-[85vh] sm:h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-3 sm:mb-6 sticky top-0 bg-slate-900 pb-2 border-b border-slate-700">
                <h2 className="text-lg sm:text-xl font-bold text-white">Application Details</h2>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6 text-xs sm:text-sm">
                {/* Personal Information */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                    <div>
                      <label className="text-xs text-slate-400">Application ID</label>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <p className="text-white font-medium text-xs sm:text-sm">{selectedApplication.applicationId}</p>
                        <button
                          onClick={() => copyToClipboard(selectedApplication.applicationId)}
                          className="text-slate-400 hover:text-white p-1"
                        >
                          <Copy className="w-2 h-2 sm:w-3 sm:h-3" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Student Name</label>
                      <p className="text-white font-medium text-xs sm:text-sm">{selectedApplication.applicantName}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Email</label>
                      <p className="text-white font-medium text-xs sm:text-sm truncate">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Mobile</label>
                      <p className="text-white font-medium text-xs sm:text-sm">{selectedApplication.mobile}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Course</label>
                      <p className="text-white font-medium text-xs sm:text-sm">{selectedApplication.courseInterested}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Category</label>
                      <p className="text-white font-medium text-xs sm:text-sm">{selectedApplication.category}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Date of Birth</label>
                      <p className="text-white font-medium text-xs sm:text-sm">{new Date(selectedApplication.dob).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Gender</label>
                      <p className="text-white font-medium text-xs sm:text-sm">{selectedApplication.gender}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Blood Group</label>
                      <p className="text-white font-medium text-xs sm:text-sm">{selectedApplication.bloodGroup}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Aadhaar Number</label>
                      <p className="text-white font-medium text-xs sm:text-sm">{selectedApplication.aadhaar}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Nationality</label>
                      <p className="text-white font-medium text-xs sm:text-sm">{selectedApplication.nationality}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">PIN Code</label>
                      <p className="text-white font-medium text-xs sm:text-sm">{selectedApplication.pin}</p>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-4">
                    <label className="text-xs text-slate-400">Address</label>
                    <p className="text-white font-medium text-xs sm:text-sm">{selectedApplication.address}</p>
                  </div>
                </div>

                {/* Family Information */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                    Family Information
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                    <div>
                      <label className="text-xs text-slate-400">Father&apos;s Name</label>
                      <p className="text-white font-medium text-xs sm:text-sm">{selectedApplication.fatherName}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Father&apos;s Occupation</label>
                      <p className="text-white font-medium text-xs sm:text-sm">{selectedApplication.fatherOccupation}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Father&apos;s Education</label>
                      <p className="text-white font-medium text-xs sm:text-sm">{selectedApplication.fatherQualification}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Father&apos;s Mobile</label>
                      <p className="text-white font-medium text-xs sm:text-sm">{selectedApplication.fatherMobile}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Mother&apos;s Name</label>
                      <p className="text-white font-medium text-xs sm:text-sm">{selectedApplication.motherName}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Mother&apos;s Education</label>
                      <p className="text-white font-medium text-xs sm:text-sm">{selectedApplication.motherQualification}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Mother&apos;s Occupation</label>
                      <p className="text-white font-medium text-xs sm:text-sm">{selectedApplication.motherOccupation}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Annual Income</label>
                      <p className="text-white font-medium text-xs sm:text-sm">{selectedApplication.annualIncome}</p>
                    </div>
                    {selectedApplication.localGuardian && (
                      <div>
                        <label className="text-xs text-slate-400">Local Guardian</label>
                        <p className="text-white font-medium text-xs sm:text-sm">{selectedApplication.localGuardian}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Documents Section */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                    Uploaded Documents
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
                    {/* Photo */}
                    <div className="bg-slate-800/50 rounded-lg p-2 sm:p-4">
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <h4 className="text-xs font-medium text-white">Photo</h4>
                        <div className="flex gap-1">
                          {selectedApplication.photo && (
                            <>
                              <button
                                onClick={() => viewDocument(selectedApplication.photo!, 'Photo')}
                                className="p-0.5 text-slate-400 hover:text-blue-400 rounded"
                                title="View Photo"
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => downloadDocument(selectedApplication.photo!, 'Photo')}
                                className="p-0.5 text-slate-400 hover:text-green-400 rounded"
                                title="Download Photo"
                              >
                                <Download className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      {selectedApplication.photo ? (
                        <div className="flex items-center gap-1 text-xs text-green-400">
                          <ImageIcon className="w-3 h-3" />
                          <span>Uploaded</span>
                        </div>
                      ) : (
                        <div className="text-xs text-red-400">Not uploaded</div>
                      )}
                    </div>

                    {/* 10th Marks Card */}
                    <div className="bg-slate-800/50 rounded-lg p-2 sm:p-4">
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <h4 className="text-xs font-medium text-white">10th Card</h4>
                        <div className="flex gap-1">
                          {selectedApplication.sslcMarksCard && (
                            <>
                              <button
                                onClick={() => viewDocument(selectedApplication.sslcMarksCard!, '10th_MarksCard')}
                                className="p-0.5 text-slate-400 hover:text-blue-400 rounded"
                                title="View Document"
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => downloadDocument(selectedApplication.sslcMarksCard!, '10th_MarksCard')}
                                className="p-0.5 text-slate-400 hover:text-green-400 rounded"
                                title="Download Document"
                              >
                                <Download className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      {selectedApplication.sslcMarksCard ? (
                        <div className="flex items-center gap-1 text-xs text-green-400">
                          <FileText className="w-3 h-3" />
                          <span>Uploaded</span>
                        </div>
                      ) : (
                        <div className="text-xs text-red-400">Not uploaded</div>
                      )}
                    </div>

                    {/* 12th Marks Card */}
                    <div className="bg-slate-800/50 rounded-lg p-2 sm:p-4">
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <h4 className="text-xs font-medium text-white">12th Card</h4>
                        <div className="flex gap-1">
                          {selectedApplication.hscMarksCard && (
                            <>
                              <button
                                onClick={() => viewDocument(selectedApplication.hscMarksCard!, '12th_MarksCard')}
                                className="p-0.5 text-slate-400 hover:text-blue-400 rounded"
                                title="View Document"
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => downloadDocument(selectedApplication.hscMarksCard!, '12th_MarksCard')}
                                className="p-0.5 text-slate-400 hover:text-green-400 rounded"
                                title="Download Document"
                              >
                                <Download className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      {selectedApplication.hscMarksCard ? (
                        <div className="flex items-center gap-1 text-xs text-green-400">
                          <FileText className="w-3 h-3" />
                          <span>Uploaded</span>
                        </div>
                      ) : (
                        <div className="text-xs text-red-400">Not uploaded</div>
                      )}
                    </div>

                    {/* Aadhaar Card */}
                    <div className="bg-slate-800/50 rounded-lg p-2 sm:p-4">
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <h4 className="text-xs font-medium text-white">Aadhaar</h4>
                        <div className="flex gap-1">
                          {selectedApplication.aadhaarCard && (
                            <>
                              <button
                                onClick={() => viewDocument(selectedApplication.aadhaarCard!, 'Aadhaar_Card')}
                                className="p-0.5 text-slate-400 hover:text-blue-400 rounded"
                                title="View Document"
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => downloadDocument(selectedApplication.aadhaarCard!, 'Aadhaar_Card')}
                                className="p-0.5 text-slate-400 hover:text-green-400 rounded"
                                title="Download Document"
                              >
                                <Download className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      {selectedApplication.aadhaarCard ? (
                        <div className="flex items-center gap-1 text-xs text-green-400">
                          <FileText className="w-3 h-3" />
                          <span>Uploaded</span>
                        </div>
                      ) : (
                        <div className="text-xs text-red-400">Not uploaded</div>
                      )}
                    </div>

                    {/* Transfer Certificate */}
                    <div className="bg-slate-800/50 rounded-lg p-2 sm:p-4">
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <h4 className="text-xs font-medium text-white">TC</h4>
                        <div className="flex gap-1">
                          {selectedApplication.transferCertificate && (
                            <>
                              <button
                                onClick={() => viewDocument(selectedApplication.transferCertificate!, 'Transfer_Certificate')}
                                className="p-0.5 text-slate-400 hover:text-blue-400 rounded"
                                title="View Document"
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => downloadDocument(selectedApplication.transferCertificate!, 'Transfer_Certificate')}
                                className="p-0.5 text-slate-400 hover:text-green-400 rounded"
                                title="Download Document"
                              >
                                <Download className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      {selectedApplication.transferCertificate ? (
                        <div className="flex items-center gap-1 text-xs text-green-400">
                          <FileText className="w-3 h-3" />
                          <span>Uploaded</span>
                        </div>
                      ) : (
                        <div className="text-xs text-red-400">Not uploaded</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                {selectedApplication.payment && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-4 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                      Payment Information
                    </h3>
                    <div className="bg-slate-800/50 rounded-lg p-2 sm:p-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                        <div>
                          <label className="text-xs text-slate-400">Payment Status</label>
                          <span className={`inline-flex px-1.5 py-0.5 text-xs rounded-full border ${getPaymentStatusColor(selectedApplication.paymentStatus)}`}>
                            {formatPaymentStatus(selectedApplication.paymentStatus)}
                          </span>
                        </div>
                        <div>
                          <label className="text-xs text-slate-400">Amount</label>
                          <p className="text-white font-medium text-xs sm:text-sm">
                            ₹{selectedApplication.payment.amount ? (selectedApplication.payment.amount / 100).toFixed(2) : '0.00'}
                          </p>
                        </div>
                        {selectedApplication.payment.orderId && (
                          <div>
                            <label className="text-xs text-slate-400">Order ID</label>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <p className="text-white font-mono text-xs truncate max-w-[100px] sm:max-w-none">{selectedApplication.payment.orderId}</p>
                              <button
                                onClick={() => copyToClipboard(selectedApplication.payment!.orderId!)}
                                className="text-slate-400 hover:text-white p-1"
                              >
                                <Copy className="w-2 h-2 sm:w-3 sm:h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                        {selectedApplication.payment.paymentId && (
                          <div>
                            <label className="text-xs text-slate-400">Payment ID</label>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <p className="text-white font-mono text-xs truncate max-w-[100px] sm:max-w-none">{selectedApplication.payment.paymentId}</p>
                              <button
                                onClick={() => copyToClipboard(selectedApplication.payment!.paymentId!)}
                                className="text-slate-400 hover:text-white p-1"
                              >
                                <Copy className="w-2 h-2 sm:w-3 sm:h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                        {selectedApplication.payment.method && (
                          <div>
                            <label className="text-xs text-slate-400">Payment Method</label>
                            <p className="text-white font-medium text-xs sm:text-sm">{selectedApplication.payment.method}</p>
                          </div>
                        )}
                        {selectedApplication.payment.verifiedAt && (
                          <div>
                            <label className="text-xs text-slate-400">Verified At</label>
                            <p className="text-white font-medium text-xs sm:text-sm">
                              {new Date(selectedApplication.payment.verifiedAt).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Information */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                    Status Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    <div>
                      <label className="text-xs text-slate-400">Application Status</label>
                      <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full border ${getStatusColor(selectedApplication.status)}`}>
                        {selectedApplication.status}
                      </span>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Submitted</label>
                      <p className="text-white text-xs sm:text-sm">{new Date(selectedApplication.createdAt).toLocaleString()}</p>
                    </div>
                    {selectedApplication.reviewedAt && (
                      <div>
                        <label className="text-xs text-slate-400">Last Reviewed</label>
                        <p className="text-white text-xs sm:text-sm">{new Date(selectedApplication.reviewedAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  {selectedApplication.adminNotes && (
                    <div className="mt-2 sm:mt-4">
                      <label className="text-xs text-slate-400">Admin Notes</label>
                      <p className="text-white whitespace-pre-wrap text-xs sm:text-sm">{selectedApplication.adminNotes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 sm:pt-4 border-t border-slate-700 gap-3 sm:gap-0">
                  <div>
                    <label className="text-xs text-slate-400">Update Status</label>
                  </div>
                  <div className="flex gap-1 sm:gap-2 flex-wrap">
                    <button
                      onClick={() => updateStatus(selectedApplication._id, 'Processing')}
                      className="px-2 py-1 sm:px-3 sm:py-1 text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30 transition-all"
                    >
                      Processing
                    </button>
                    <button
                      onClick={() => updateStatus(selectedApplication._id, 'Approved')}
                      className="px-2 py-1 sm:px-3 sm:py-1 text-xs bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(selectedApplication._id, 'Rejected')}
                      className="px-2 py-1 sm:px-3 sm:py-1 text-xs bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

       {/* Document Viewer Modal - SIMPLE VERSION */}
{viewingDocument && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-60 flex items-center justify-center p-2 sm:p-4">
    <div className="bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-800 p-3 sm:p-6 max-w-4xl w-full h-[80vh] sm:h-[75vh] overflow-auto">
      <div className="flex justify-between items-center mb-2 sm:mb-4">
        <h3 className="text-base sm:text-lg font-bold text-white">{viewingDocument.type}</h3>
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={() => window.open(viewingDocument.url, '_blank')}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-blue-400 rounded-lg transition-all"
            title="Open in new tab"
          >
            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => setViewingDocument(null)}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-lg transition-all"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg p-2 sm:p-4 flex justify-center items-center min-h-[300px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={viewingDocument.url}
          alt={`${viewingDocument.type} document preview`}
          className="w-full h-auto max-h-[60vh] object-contain border-0 rounded"
        />
      </div>
    </div>
  </div>
)}



      </div>
    </AdminLayout>
  );
};

export default ScholarshipManagementPage;
