'use client';

import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  Send,
  MessageSquare,
  Sparkles,
  User,
  Building,
  CheckCircle,
  AlertCircle,
  Headphones,
  Users,
  Instagram,
  Facebook
} from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    queryType: 'general'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.name || formData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Please provide a valid email address');
    }
    
    if (!formData.subject || formData.subject.trim().length < 5) {
      errors.push('Subject must be at least 5 characters long');
    }
    
    if (!formData.message || formData.message.trim().length < 10) {
      errors.push('Message must be at least 10 characters long');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      console.log('Validation errors:', validationErrors);
      setSubmitStatus('error');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://learnscapeedu.com/api';
      
      const response = await fetch(`${API_URL}/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      if (data.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          queryType: 'general'
        });
        
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 5000);
      } else {
        throw new Error(data.message || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactReasons = [
    { icon: <Users className="w-4 h-4" />, title: 'Admission Enquiry', desc: 'Get help with college admissions' },
    { icon: <Headphones className="w-4 h-4" />, title: 'Student Support', desc: '24/7 assistance for students' },
    { icon: <MessageSquare className="w-4 h-4" />, title: 'General Query', desc: 'Any other questions' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse delay-700"></div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-16 sm:pt-20 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm mb-4 sm:mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider">Get In Touch</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="block text-white mb-1 sm:mb-2">We&apos;re Here to</span>
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-2xl opacity-50"></span>
              <span className="relative bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Help You Succeed
              </span>
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Have questions about admissions, courses, or partnerships? Our team is ready to assist you 24/7.
          </p>
        </div>
      </div>

      {/* Contact Reasons Cards */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {contactReasons.map((reason, index) => (
            <div key={index} className="group bg-slate-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1">
              <div className="flex items-center sm:items-start gap-3 sm:gap-4">
                <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg text-blue-400 flex-shrink-0">
                  {reason.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm mb-1">{reason.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{reason.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Contact Section - Updated Layout */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Contact Form - Full width on mobile */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                <p className="text-sm text-gray-600">Fill out the form below and we&apos;ll get back to you within 24 hours.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                  {/* Name Field */}
                  <div>
                    <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
                      <User className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2.5 sm:py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
                      <Mail className="w-3.5 h-3.5 mr-1.5 text-purple-500" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2.5 sm:py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                  {/* Phone Field */}
                  <div>
                    <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
                      <Phone className="w-3.5 h-3.5 mr-1.5 text-green-500" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 sm:py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  {/* Query Type */}
                  <div>
                    <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
                      <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                      Query Type *
                    </label>
                    <select
                      name="queryType"
                      value={formData.queryType}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2.5 sm:py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all bg-white"
                    >
                      <option value="general">General Query</option>
                      <option value="admission">Admission Enquiry</option>
                      <option value="partnership">Partnership</option>
                      <option value="support">Student Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Subject Field */}
                <div>
                  <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
                    <Building className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    minLength={5}
                    className="w-full px-3 py-2.5 sm:py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Brief subject of your query (minimum 5 characters)"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
                    <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    minLength={10}
                    rows={4}
                    className="w-full px-3 py-2.5 sm:py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                    placeholder="Tell us more about your query (minimum 10 characters)..."
                  />
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <p className="text-green-700 text-xs font-medium">
                      Message sent successfully! We&apos;ll get back to you soon.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="text-red-700 text-xs font-medium">
                      Failed to send message. Please try again.
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] group"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Send Message</span>
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-4">Quick Contact</h3>
              
              <div className="space-y-4">
                {/* Phone Numbers */}
                <div>
                  <p className="text-xs text-slate-400 mb-2">Call Us</p>
                  <div className="space-y-2">
                    <a href="tel:+918606004306" className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-all group">
                      <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-400">Admission</p>
                        <p className="text-sm font-semibold text-white">860 6004 306</p>
                      </div>
                    </a>
                    <a href="tel:+917994086809" className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-all group">
                      <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-400">Head Office</p>
                        <p className="text-sm font-semibold text-white">799 4086 809</p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <p className="text-xs text-slate-400 mb-2">Email Us</p>
                  <a href="mailto:learnscapeinfo@gmail.com" className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-all">
                    <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white break-all">learnscapeinfo@gmail.com</p>
                    </div>
                  </a>
                </div>

                {/* Social Media */}
                <div>
                  <p className="text-xs text-slate-400 mb-3">Follow Us</p>
                  <div className="grid grid-cols-1 gap-2">
                    <a 
                      href="https://instagram.com/learnscape_official" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-500/20 transition-all"
                    >
                      <Instagram className="w-4 h-4 text-pink-400 group-hover:text-pink-300 transition-colors flex-shrink-0" />
                      <span className="text-xs text-slate-300 group-hover:text-white">Instagram</span>
                    </a>

                    <a 
                      href="https://wa.me/918606004306" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg hover:bg-gradient-to-r hover:from-green-500/20 hover:to-emerald-500/20 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-400 group-hover:text-green-300 transition-colors flex-shrink-0">
                        <path d="M17.472 14.382c-.297-.149-1.758-.868-2.031-.967-.273-.099-.472-.148-.672.15-.198.297-.768.967-.941 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.133.297-.347.446-.523.149-.176.198-.298.297-.495.099-.198.05-.37-.025-.52-.075-.149-.672-1.611-.921-2.206-.242-.579-.487-.5-.672-.51-.173-.008-.371-.01-.568-.01-.198 0-.52.074-.792.372-.273.297-.927.905-.927 2.208 0 1.303.951 2.563 1.084 2.74.134.178 1.88 2.87 4.554 4.028.637.277 1.134.441 1.52.565.639.227 1.219.195 1.678.118.512-.084 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.891 3.488"/>
                      </svg>
                      <span className="text-xs text-slate-300 group-hover:text-white">WhatsApp</span>
                    </a>

                    <a 
                      href="https://facebook.com/learnscape.official" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-blue-600/20 transition-all"
                    >
                      <Facebook className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors flex-shrink-0" />
                      <span className="text-xs text-slate-300 group-hover:text-white">Facebook</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Quick Contact Section - Below Form */}
        <div className="lg:hidden mt-6">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4 text-center">Quick Contact</h3>
            
            <div className="space-y-4">
              {/* Phone Numbers - Mobile Layout */}
              <div>
                <p className="text-xs text-slate-400 mb-3 text-center">Call Us Directly</p>
                <div className="grid grid-cols-1 gap-2">
                  <a href="tel:+918606004306" className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-all active:scale-95">
                    <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-400">Admission Helpline</p>
                      <p className="text-sm font-semibold text-white">+91 860 6004 306</p>
                    </div>
                  </a>
                  <a href="tel:+917994086809" className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-all active:scale-95">
                    <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-400">Head Office</p>
                      <p className="text-sm font-semibold text-white">+91 799 4086 809</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Email - Mobile */}
              <div>
                <p className="text-xs text-slate-400 mb-3 text-center">Email Us</p>
                <a href="mailto:learnscapeinfo@gmail.com" className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-all active:scale-95">
                  <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">learnscapeinfo@gmail.com</p>
                    <p className="text-xs text-slate-400">We reply within 2 hours</p>
                  </div>
                </a>
              </div>

              {/* Social Media - Mobile Grid */}
              <div>
                <p className="text-xs text-slate-400 mb-3 text-center">Connect With Us</p>
                <div className="grid grid-cols-3 gap-2">
                  <a 
                    href="https://instagram.com/learnscape_official" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2 p-3 bg-slate-800/50 rounded-lg hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-500/20 transition-all active:scale-95"
                  >
                    <Instagram className="w-5 h-5 text-pink-400 group-hover:text-pink-300 transition-colors" />
                    <span className="text-[10px] text-slate-300 group-hover:text-white">Instagram</span>
                  </a>

                  <a 
                    href="https://wa.me/918606004306" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2 p-3 bg-slate-800/50 rounded-lg hover:bg-gradient-to-r hover:from-green-500/20 hover:to-emerald-500/20 transition-all active:scale-95"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-400 group-hover:text-green-300 transition-colors">
                      <path d="M17.472 14.382c-.297-.149-1.758-.868-2.031-.967-.273-.099-.472-.148-.672.15-.198.297-.768.967-.941 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.133.297-.347.446-.523.149-.176.198-.298.297-.495.099-.198.05-.37-.025-.52-.075-.149-.672-1.611-.921-2.206-.242-.579-.487-.5-.672-.51-.173-.008-.371-.01-.568-.01-.198 0-.52.074-.792.372-.273.297-.927.905-.927 2.208 0 1.303.951 2.563 1.084 2.74.134.178 1.88 2.87 4.554 4.028.637.277 1.134.441 1.52.565.639.227 1.219.195 1.678.118.512-.084 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.891 3.488"/>
                    </svg>
                    <span className="text-[10px] text-slate-300 group-hover:text-white">WhatsApp</span>
                  </a>

                  <a 
                    href="https://facebook.com/learnscape.official" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2 p-3 bg-slate-800/50 rounded-lg hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-blue-600/20 transition-all active:scale-95"
                  >
                    <Facebook className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                    <span className="text-[10px] text-slate-300 group-hover:text-white">Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
