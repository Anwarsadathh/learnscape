'use client';

import React, { useEffect, useState } from 'react';
import {
  Mail,
  Phone,
  Calendar,
  Eye,

  X,
  Search,
  Filter,
} from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  queryType: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  submittedAt: string;
}

const ContactsManagementPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchContacts = async (page = 1, search = '', status = '') => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(status && { status })
      });

      const response = await fetch(`/api/contact/all?${queryParams}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate'
        }
      });

      const data = await response.json();

      if (data.success) {
        setContacts(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
        setCurrentPage(page);
      } else {
        setError('Failed to load contacts');
      }
    } catch {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(currentPage, searchTerm, statusFilter);
  }, [currentPage, searchTerm, statusFilter]);

  const updateStatus = async (contactId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/contact/${contactId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchContacts(currentPage, searchTerm, statusFilter);
        setSelectedContact(null);
      } else {
        alert('Failed to update status');
      }
    } catch {
      alert('Error updating status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'read': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'replied': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'closed': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const getQueryTypeColor = (type: string) => {
    switch (type) {
      case 'general': return 'bg-purple-500/20 text-purple-300';
      case 'admission': return 'bg-green-500/20 text-green-300';
      case 'partnership': return 'bg-orange-500/20 text-orange-300';
      case 'support': return 'bg-red-500/20 text-red-300';
      default: return 'bg-slate-500/20 text-slate-300';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Contact Management
          </h1>
          <p className="text-slate-400">Manage and respond to contact form submissions</p>
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
                  placeholder="Search contacts..."
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
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Subject</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                      Loading contacts...
                    </td>
                  </tr>
                ) : contacts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                      No contacts found
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact) => (
                    <tr key={contact._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <h3 className="text-white font-semibold">{contact.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                            <Mail className="w-3 h-3" />
                            <span>{contact.email}</span>
                          </div>
                          {contact.phone && (
                            <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                              <Phone className="w-3 h-3" />
                              <span>{contact.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{contact.subject}</p>
                        <p className="text-sm text-slate-400 truncate max-w-xs">
                          {contact.message}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getQueryTypeColor(contact.queryType)}`}>
                          {contact.queryType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(contact.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedContact(contact)}
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

        {/* Contact Detail Modal */}
        {selectedContact && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Contact Details</h2>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400">Name</label>
                    <p className="text-white font-medium">{selectedContact.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Email</label>
                    <p className="text-white font-medium">{selectedContact.email}</p>
                  </div>
                  {selectedContact.phone && (
                    <div>
                      <label className="text-sm text-slate-400">Phone</label>
                      <p className="text-white font-medium">{selectedContact.phone}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-slate-400">Query Type</label>
                    <p className="text-white font-medium">{selectedContact.queryType}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-400">Subject</label>
                  <p className="text-white font-medium">{selectedContact.subject}</p>
                </div>

                <div>
                  <label className="text-sm text-slate-400">Message</label>
                  <p className="text-white whitespace-pre-wrap">{selectedContact.message}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div>
                    <label className="text-sm text-slate-400">Current Status</label>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full border ${getStatusColor(selectedContact.status)}`}>
                      {selectedContact.status}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(selectedContact._id, 'read')}
                      className="px-3 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30 transition-all"
                    >
                      Mark as Read
                    </button>
                    <button
                      onClick={() => updateStatus(selectedContact._id, 'replied')}
                      className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all"
                    >
                      Mark as Replied
                    </button>
                    <button
                      onClick={() => updateStatus(selectedContact._id, 'closed')}
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

export default ContactsManagementPage;
