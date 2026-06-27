'use client';

import React, { useEffect, useState } from 'react';
import {
  Mail, Phone, Calendar, MessageSquare, Eye, X,
  Search, Filter, GraduationCap, Download, BookOpen, Users,
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
  downloadType?: 'brochure' | 'fee-structure' | null;
  status: string;
  source: string;
  createdAt: string;
}

/* ── Badge helpers ─────────────────────────────────────────── */
function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
    case 'new':       return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'contacted': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    case 'converted': return 'bg-green-500/20 text-green-300 border-green-500/30';
    case 'closed':    return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    default:          return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  }
}

function ActionBadge({ type, downloadType }: { type: string; downloadType?: string | null }) {
  if (type === 'brochure_download' || downloadType === 'brochure') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/25">
        <Download className="w-3 h-3" />
        Brochure
      </div>
    );
  }
  if (type === 'fee-structure_download' || downloadType === 'fee-structure') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/25">
        <BookOpen className="w-3 h-3" />
        Fee Structure
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/25">
      <Users className="w-3 h-3" />
      Counselling
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────── */
const EnquiriesManagementPage = () => {
  const [enquiries, setEnquiries]         = useState<Enquiry[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [searchTerm, setSearchTerm]       = useState('');
  const [statusFilter, setStatusFilter]   = useState('');
  const [typeFilter, setTypeFilter]       = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [currentPage, setCurrentPage]     = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const [totalCount, setTotalCount]       = useState(0);

  const fetchEnquiries = async (page = 1, search = '', status = '', type = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(status && { status }),
        ...(type   && { type }),
      });

      const res  = await fetch(`/api/enquiries?${params}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await res.json();

      if (data.success) {
        setEnquiries(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.total || data.data.length);
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
    fetchEnquiries(currentPage, searchTerm, statusFilter, typeFilter);
  }, [currentPage, searchTerm, statusFilter, typeFilter]);

  const updateStatus = async (enquiryId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/enquiries/${enquiryId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchEnquiries(currentPage, searchTerm, statusFilter, typeFilter);
        setSelectedEnquiry(null);
      } else {
        alert('Failed to update status');
      }
    } catch {
      alert('Error updating status');
    }
  };

  /* ── Derived counts for stat cards ── */
  const counts = enquiries.reduce(
    (acc, e) => {
      if (e.type === 'brochure_download' || e.downloadType === 'brochure') acc.brochure++;
      else if (e.type === 'fee-structure_download' || e.downloadType === 'fee-structure') acc.fee++;
      else acc.counselling++;
      if (e.status === 'new') acc.pending++;
      return acc;
    },
    { brochure: 0, fee: 0, counselling: 0, pending: 0 },
  );

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-1">Enquiries</h1>
          <p className="text-slate-400 text-sm">All leads — counselling requests, brochure & fee structure downloads</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <span className="text-red-400 font-bold">!</span>
              <span className="text-red-400">{error}</span>
              <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total',       value: totalCount,        icon: <MessageSquare className="w-5 h-5 text-blue-400" />,   bg: 'bg-blue-500/15',   border: 'border-blue-500/20'   },
            { label: 'Pending',     value: counts.pending,    icon: <Filter className="w-5 h-5 text-yellow-400" />,        bg: 'bg-yellow-500/15', border: 'border-yellow-500/20' },
            { label: 'Brochure DL', value: counts.brochure,   icon: <Download className="w-5 h-5 text-amber-400" />,       bg: 'bg-amber-500/15',  border: 'border-amber-500/20'  },
            { label: 'Fee DL',      value: counts.fee,        icon: <BookOpen className="w-5 h-5 text-purple-400" />,      bg: 'bg-purple-500/15', border: 'border-purple-500/20' },
          ].map(c => (
            <div key={c.label} className={`bg-slate-900/50 backdrop-blur-xl rounded-xl border ${c.border} p-4`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${c.bg} rounded-lg flex items-center justify-center`}>{c.icon}</div>
                <div>
                  <p className="text-xs text-slate-400">{c.label}</p>
                  <p className="text-xl font-bold text-white">{c.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-5">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search name, email, college…"
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* Status filter */}
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>

            {/* Type filter — show what they did */}
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Types</option>
              <option value="collegeenquiry">Counselling</option>
              <option value="brochure_download">Brochure Download</option>
              <option value="fee-structure_download">Fee Structure Download</option>
            </select>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Student</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">College</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">What They Did</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Course</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-slate-400 text-sm">
                      Loading…
                    </td>
                  </tr>
                ) : enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-slate-400 text-sm">
                      No enquiries found
                    </td>
                  </tr>
                ) : enquiries.map(enq => (
                  <tr key={enq._id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Student */}
                    <td className="px-5 py-4">
                      <p className="text-white font-semibold text-[13px]">{enq.name}</p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <Mail className="w-3 h-3" />{enq.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <Phone className="w-3 h-3" />{enq.mobile}
                      </div>
                    </td>

                    {/* College */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <span className="text-white text-[13px] font-medium">{enq.collegeName || '—'}</span>
                      </div>
                    </td>

                    {/* ── What They Did ── */}
                    <td className="px-5 py-4">
                      <ActionBadge type={enq.type} downloadType={enq.downloadType} />
                    </td>

                    {/* Course */}
                    <td className="px-5 py-4">
                      <span className="text-slate-300 text-[12.5px]">{enq.courseName || '—'}</span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border ${getStatusColor(enq.status)}`}>
                        {enq.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-[11.5px] text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(enq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </div>
                    </td>

                    {/* View */}
                    <td className="px-5 py-4">
                      <button onClick={() => setSelectedEnquiry(enq)}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/15 rounded-lg transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-4 bg-slate-800/30 border-t border-slate-700 flex items-center justify-between">
              <span className="text-sm text-slate-400">Page {currentPage} of {totalPages}</span>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="px-3 py-1.5 bg-slate-700 text-white text-sm rounded-lg disabled:opacity-40 hover:bg-slate-600 transition-colors">
                  ← Prev
                </button>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="px-3 py-1.5 bg-slate-700 text-white text-sm rounded-lg disabled:opacity-40 hover:bg-slate-600 transition-colors">
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Detail Modal ── */}
        {selectedEnquiry && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[18px] font-bold text-white">Enquiry Details</h2>
                <button onClick={() => setSelectedEnquiry(null)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Student info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Student Name', value: selectedEnquiry.name },
                    { label: 'Email',        value: selectedEnquiry.email },
                    { label: 'Mobile',       value: selectedEnquiry.mobile },
                    { label: 'Status', value: (
                      <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border ${getStatusColor(selectedEnquiry.status)}`}>
                        {selectedEnquiry.status}
                      </span>
                    )},
                  ].map(f => (
                    <div key={f.label}>
                      <p className="text-[11px] text-slate-500 mb-0.5 uppercase tracking-wider">{f.label}</p>
                      <div className="text-white font-medium text-[13.5px]">{f.value}</div>
                    </div>
                  ))}
                </div>

                {/* College + Course */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-slate-500 mb-0.5 uppercase tracking-wider">College</p>
                    <p className="text-white font-medium text-[13.5px]">{selectedEnquiry.collegeName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 mb-0.5 uppercase tracking-wider">Course</p>
                    <p className="text-white font-medium text-[13.5px]">{selectedEnquiry.courseName || '—'}</p>
                  </div>
                </div>

                {/* ── What they did ── */}
                <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
                  <p className="text-[11px] text-slate-500 mb-2 uppercase tracking-wider">Action / Intent</p>
                  <div className="flex items-center gap-3">
                    <ActionBadge type={selectedEnquiry.type} downloadType={selectedEnquiry.downloadType} />
                    <span className="text-slate-400 text-[12px]">{selectedEnquiry.source}</span>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <p className="text-[11px] text-slate-500 mb-0.5 uppercase tracking-wider">Message</p>
                  <p className="text-slate-300 text-[13px] leading-relaxed">
                    {selectedEnquiry.message || 'No message provided'}
                  </p>
                </div>

                {/* Date */}
                <div>
                  <p className="text-[11px] text-slate-500 mb-0.5 uppercase tracking-wider">Submitted</p>
                  <p className="text-white text-[13px]">
                    {new Date(selectedEnquiry.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Status update */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <span className="text-[12px] text-slate-400">Update Status</span>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { s: 'contacted', label: 'Contacted', cls: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30' },
                      { s: 'converted', label: 'Converted', cls: 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30' },
                      { s: 'closed',    label: 'Closed',    cls: 'bg-gray-500/20 text-gray-300 border-gray-500/30 hover:bg-gray-500/30'     },
                    ].map(b => (
                      <button key={b.s} onClick={() => updateStatus(selectedEnquiry._id, b.s)}
                        className={`px-3 py-1.5 text-[12px] font-semibold border rounded-lg transition-all ${b.cls}`}>
                        {b.label}
                      </button>
                    ))}
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