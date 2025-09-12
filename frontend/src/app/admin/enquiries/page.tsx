'use client';

import React, { useEffect, useState } from 'react';
import {
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Eye,
  X,
  Search,
  Filter,
  GraduationCap,
} from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  message: string;
  courseName: string;
  collegeName: string;
  collegeId: string;
  type: string;
  status: string;
  source: string;
  createdAt: string;
}

const EnquiriesManagementPage = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEnquiries = async (page = 1, search = '', status = '') => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(status && { status })
      });

      const response = await fetch(`/api/enquiries?${queryParams}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate'
        }
      });

      const data = await response.json();

      if (data.success) {
        setEnquiries(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
        setCurrentPage(page);
        setError(null);
      } else {
        setError('Failed to load enquiries');
      }
    } catch {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries(currentPage, searchTerm, statusFilter);
  }, [currentPage, searchTerm, statusFilter]);

  const updateStatus = async (enquiryId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/enquiries/${enquiryId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchEnquiries(currentPage, searchTerm, statusFilter);
        setSelectedEnquiry(null);
        alert('Status updated successfully');
      } else {
        alert('Failed to update status');
      }
    } catch {
      alert('Error updating status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'contacted': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'converted': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'closed': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Enquiries Management
          </h1>
          <p className="text-slate-400">Manage college application enquiries and leads</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-red-400 text-xl font-bold">!</span>
              <span className="text-red-400">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search enquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Enquiries</p>
                <p className="text-xl font-bold text-white">{enquiries.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enquiries Table */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">College</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Course</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                      Loading enquiries...
                    </td>
                  </tr>
                ) : enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                      No enquiries found
                    </td>
                  </tr>
                ) : (
                  enquiries.map((enquiry) => (
                    <tr key={enquiry._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <h3 className="text-white font-semibold">{enquiry.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                            <Mail className="w-3 h-3" />
                            <span>{enquiry.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                            <Phone className="w-3 h-3" />
                            <span>{enquiry.mobile}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-blue-400" />
                          <span className="text-white font-medium">{enquiry.collegeName || 'Not specified'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white">{enquiry.courseName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(enquiry.status)}`}>
                          {enquiry.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(enquiry.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all"
                        >
                          <Eye className="w-4 h-4" />
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
            <div className="px-6 py-4 bg-slate-800/30 border-t border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-slate-700 text-white rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-slate-700 text-white rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enquiry Detail Modal */}
        {selectedEnquiry && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Enquiry Details</h2>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400">Student Name</label>
                    <p className="text-white font-medium">{selectedEnquiry.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Email</label>
                    <p className="text-white font-medium">{selectedEnquiry.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Mobile</label>
                    <p className="text-white font-medium">{selectedEnquiry.mobile}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Status</label>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full border ${getStatusColor(selectedEnquiry.status)}`}>
                      {selectedEnquiry.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400">College</label>
                    <p className="text-white font-medium">{selectedEnquiry.collegeName || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Course</label>
                    <p className="text-white font-medium">{selectedEnquiry.courseName}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-400">Message</label>
                  <p className="text-white whitespace-pre-wrap">{selectedEnquiry.message || 'No message provided'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400">Source</label>
                    <p className="text-white">{selectedEnquiry.source}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Submitted</label>
                    <p className="text-white">{new Date(selectedEnquiry.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div>
                    <label className="text-sm text-slate-400">Update Status</label>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(selectedEnquiry._id, 'contacted')}
                      className="px-3 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30 transition-all"
                    >
                      Contacted
                    </button>
                    <button
                      onClick={() => updateStatus(selectedEnquiry._id, 'converted')}
                      className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all"
                    >
                      Converted
                    </button>
                    <button
                      onClick={() => updateStatus(selectedEnquiry._id, 'closed')}
                      className="px-3 py-1 bg-gray-500/20 text-gray-300 border border-gray-500/30 rounded-lg hover:bg-gray-500/30 transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default EnquiriesManagementPage;
