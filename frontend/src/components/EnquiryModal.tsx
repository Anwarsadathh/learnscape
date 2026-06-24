'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  Mail,
  User,
  MessageSquare,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Clock,
  Shield,
  Star,
} from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  collegeName: string;
  collegeId: string;
  onSuccess?: () => void;
}

const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  collegeName,
  collegeId,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: '',
    courseName: '',
    type: 'collegeenquiry',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/submit-expert-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          collegeName,
          collegeId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');

        setFormData({
          name: '',
          email: '',
          mobile: '',
          message: '',
          courseName: '',
          type: 'collegeenquiry',
        });

        onSuccess?.();

        setTimeout(() => {
          onClose();
          setSubmitStatus('idle');
        }, 1200);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      <div className="relative w-full h-full sm:h-auto sm:max-w-md lg:max-w-lg bg-white sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
        <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 px-5 py-4 border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/50 transition-all group"
          >
            <X className="w-4 h-4 text-gray-600 group-hover:text-gray-900 transition-colors" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 mb-2">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider">
              Quick Apply
            </span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-0.5">Start Your Journey</h3>
          <p className="text-xs text-gray-600 pr-8">
            Apply to <span className="text-blue-600 font-semibold">{collegeName}</span>
          </p>

          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1 text-[10px] text-gray-500">
              <Clock className="w-3 h-3 text-green-500" />
              <span>24hr Response</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-500">
              <Shield className="w-3 h-3 text-blue-500" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-500">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span>4.8 Rating</span>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-180px)] sm:h-auto sm:max-h-[60vh] bg-white">
          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
            <div className="relative">
              <label className="flex items-center text-xs font-semibold text-gray-700 mb-1.5">
                <User className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="Enter your full name"
              />
            </div>

            <div className="relative">
              <label className="flex items-center text-xs font-semibold text-gray-700 mb-1.5">
                <Mail className="w-3.5 h-3.5 mr-1.5 text-purple-500" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="your@email.com"
              />
            </div>

            <div className="relative">
              <label className="flex items-center text-xs font-semibold text-gray-700 mb-1.5">
                <Phone className="w-3.5 h-3.5 mr-1.5 text-green-500" />
                Mobile Number *
              </label>
              <div className="flex gap-2">
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm">
                  +91
                </div>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  pattern="[6-9][0-9]{9}"
                  className="flex-1 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-gray-400"
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>

            <div className="relative">
              <label className="flex items-center text-xs font-semibold text-gray-700 mb-1.5">
                <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                Course Interested In
              </label>
              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="e.g., B.Tech Computer Science, MBA, MBBS"
              />
              <div className="mt-1 text-[10px] text-gray-500">
                Popular: B.Tech, MBA, MBBS, BBA, B.Com
              </div>
            </div>

            <div className="relative">
              <label className="flex items-center text-xs font-semibold text-gray-700 mb-1.5">
                <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-gray-400"
                placeholder="Any specific questions or requirements..."
              />
            </div>

            {submitStatus === 'success' && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-green-700 text-xs font-semibold">
                    Application Submitted Successfully!
                  </p>
                  <p className="text-green-600 text-[10px] mt-0.5">
                    Our counselor will contact you within 24 hours.
                  </p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-red-700 text-xs font-semibold">Submission Failed</p>
                  <p className="text-red-600 text-[10px] mt-0.5">
                    Please check your connection and try again.
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] group"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5">
                  <span>Submit Application</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>

            <div className="mt-3 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-600">
                <Shield className="w-3.5 h-3.5 text-green-500" />
                <span>Your information is 100% secure and encrypted</span>
              </div>
            </div>
          </form>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-5 py-3 bg-gradient-to-t from-white via-white/95 to-transparent border-t border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-gray-500">
              By submitting, you agree to our privacy policy
            </p>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 border-2 border-white" />
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-white" />
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-pink-400 to-red-400 border-2 border-white" />
              </div>
              <span className="text-[10px] text-gray-500">500+ Applied Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryModal;