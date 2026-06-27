'use client';

import React, { useState, useEffect } from 'react';
import {
  X, Phone, Mail, User, MessageSquare, GraduationCap,
  CheckCircle, AlertCircle, Sparkles, ArrowRight,
  Clock, Shield, Star,
} from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  collegeName: string;
  collegeId: string;
  onSuccess?: () => void;
  downloadType?: 'brochure' | 'fee-structure'; // if set, shows download-specific UI
}

const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen, onClose, collegeName, collegeId, onSuccess, downloadType,
}) => {
  const isDownload = !!downloadType;
  const downloadLabel = downloadType === 'brochure' ? 'Brochure' : downloadType === 'fee-structure' ? 'Fee Structure' : '';
  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', message: '', courseName: '',
    type: isDownload ? `${downloadType}_download` : 'collegeenquiry',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const res = await fetch('/api/submit-expert-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, collegeName, collegeId }),
      });
      const result = await res.json();
      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', mobile: '', message: '', courseName: '', type: 'collegeenquiry' });
        onSuccess?.();
        setTimeout(() => { onClose(); setSubmitStatus('idle'); }, 1800);
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    /* z-[90] sits above CompareModal (z-[70]) */
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-0 sm:p-4">
      {/* Scrim */}
      <div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal card — white background */}
      <div className="relative z-10 w-full h-full sm:h-auto sm:max-w-[440px] bg-white sm:rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation: 'fadeUp .3s cubic-bezier(0.4,0,0.2,1)' }}>
        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

        {/* ── Header ── */}
        <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4 border-b border-gray-100">
          <button onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/60 transition-all">
            <X className="w-4 h-4 text-gray-500 hover:text-gray-800" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 border border-blue-200 mb-2">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider">
              {isDownload ? `Free Download` : 'Quick Apply'}
            </span>
          </div>

          <h3 className="text-[16px] font-bold text-gray-900 mb-0.5">
            {isDownload ? `Download ${downloadLabel}` : 'Start Your Journey'}
          </h3>
          <p className="text-[12px] text-gray-500 pr-8">
            {isDownload
              ? <>Fill a quick form to get instant access to <span className="text-blue-600 font-semibold">{collegeName}</span>&apos;s {downloadLabel.toLowerCase()}</>
              : <>Apply to <span className="text-blue-600 font-semibold">{collegeName}</span></>
            }
          </p>

          <div className="flex items-center gap-3 mt-2.5">
            {[
              { icon: <Clock className="w-3 h-3 text-emerald-500" />, label: '24hr Response' },
              { icon: <Shield className="w-3 h-3 text-blue-500" />,   label: '100% Secure' },
              { icon: <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />, label: '4.8 Rating' },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-1">
                {b.icon}
                <span className="text-[10px] text-gray-500">{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Form ── */}
        <div className="overflow-y-auto h-[calc(100vh-180px)] sm:h-auto sm:max-h-[62vh] bg-white">
          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">

            {/* Full Name */}
            <div>
              <label className="flex items-center text-[11.5px] font-semibold text-gray-700 mb-1.5 gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-500" /> Full Name *
              </label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required
                placeholder="Enter your full name"
                className="w-full px-3 py-2.5 text-[13px] text-gray-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400/25 focus:border-blue-400 outline-none transition-all placeholder:text-gray-400" />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center text-[11.5px] font-semibold text-gray-700 mb-1.5 gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-500" /> Email Address *
              </label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required
                placeholder="your@email.com"
                className="w-full px-3 py-2.5 text-[13px] text-gray-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400/25 focus:border-purple-400 outline-none transition-all placeholder:text-gray-400" />
            </div>

            {/* Mobile */}
            <div>
              <label className="flex items-center text-[11.5px] font-semibold text-gray-700 mb-1.5 gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-500" /> Mobile Number *
              </label>
              <div className="flex gap-2">
                <div className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-[13px] font-medium flex-shrink-0">
                  +91
                </div>
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required
                  pattern="[6-9][0-9]{9}" placeholder="10-digit mobile number"
                  className="flex-1 px-3 py-2.5 text-[13px] text-gray-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400/25 focus:border-emerald-400 outline-none transition-all placeholder:text-gray-400" />
              </div>
            </div>

            {/* Course */}
            <div>
              <label className="flex items-center text-[11.5px] font-semibold text-gray-700 mb-1.5 gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-amber-500" /> Course Interested In
              </label>
              <input type="text" name="courseName" value={formData.courseName} onChange={handleChange}
                placeholder="e.g., B.Tech Computer Science, MBA, MBBS"
                className="w-full px-3 py-2.5 text-[13px] text-gray-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/25 focus:border-amber-400 outline-none transition-all placeholder:text-gray-400" />
              <p className="mt-1 text-[10px] text-gray-400">Popular: B.Tech, MBA, MBBS, BBA, B.Com</p>
            </div>

            {/* Message */}
            <div>
              <label className="flex items-center text-[11.5px] font-semibold text-gray-700 mb-1.5 gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-500" /> Message (Optional)
              </label>
              <textarea name="message" value={formData.message} onChange={handleChange} rows={2}
                placeholder="Any specific questions or requirements..."
                className="w-full px-3 py-2.5 text-[13px] text-gray-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400/25 focus:border-indigo-400 outline-none transition-all resize-none placeholder:text-gray-400" />
            </div>

            {/* Success */}
            {submitStatus === 'success' && (
              <div className="flex items-center gap-2.5 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-[12px] font-semibold text-emerald-700">Application Submitted Successfully!</p>
                  <p className="text-[10.5px] text-emerald-600 mt-0.5">Our counselor will contact you within 24 hours.</p>
                </div>
              </div>
            )}

            {/* Error */}
            {submitStatus === 'error' && (
              <div className="flex items-center gap-2.5 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-[12px] font-semibold text-red-700">Submission Failed</p>
                  <p className="text-[10.5px] text-red-600 mt-0.5">Please check your connection and try again.</p>
                </div>
              </div>
            )}

            {/* ── Submit button — blue-400 matching site CTA ── */}
            <button type="submit" disabled={isSubmitting}
              className="relative overflow-hidden w-full mt-2 py-3 px-4 rounded-[11px] font-bold text-[13px] text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-blue-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{ background: '#60a5fa', boxShadow: '0 4px 14px rgba(96,165,250,0.35)' }}>
              {/* Shimmer */}
              <span className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.4) 50%,transparent 65%)', animation: 'shimmerBtn 3s ease-in-out infinite' }} />
              <style>{`@keyframes shimmerBtn{0%{transform:translateX(-130%) skewX(-15deg)}100%{transform:translateX(220%) skewX(-15deg)}}`}</style>
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2 relative z-10">
                  <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  <span>Submitting...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5 relative z-10">
                  <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
                  <span>{isDownload ? `Get ${downloadLabel}` : 'Submit Application'}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>

            {/* Security note */}
            <div className="flex items-center justify-center gap-1.5 py-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10.5px] text-gray-400">Your information is 100% secure and encrypted</span>
            </div>

          </form>
        </div>

        {/* ── Footer ── */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-3 bg-gradient-to-t from-white via-white/95 to-transparent border-t border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-gray-400">By submitting, you agree to our privacy policy</p>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 border-2 border-white" />
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 border-2 border-white" />
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-white" />
              </div>
              <span className="text-[10px] text-gray-400">500+ Applied Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryModal;