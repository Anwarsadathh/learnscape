'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import EnquiryModal from '@/components/EnquiryModal'; // Add this import
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  GraduationCap, 
  Clock, 
  Award, 
  Download, 
  ExternalLink,
  Phone,
  Mail,
  Globe,
  BookOpen,
  CheckCircle,
  TrendingUp,
  Heart,
  Share2,
  DollarSign
} from 'lucide-react';

interface College {
  _id: string;
  name: string;
  image?: string;
  locations: string[];
  streams: string[];
  courses: Course[];
  rating?: number;
  positions: number;
  overview?: {
    heading: string;
    description: string;
    points: Array<{
      heading: string;
      description: string;
    }>;
  };
  brochure?: string;
  feeStructureDoc?: string;
  portalLink?: string;
}

interface Course {
  name: string;
  level: string;
  duration: string;
  fees: string;
}

const CollegeDetailPage = () => {
  const params = useParams();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false); // Add this state

  useEffect(() => {
    const fetchCollegeDetails = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://learnscapeedu.com/api/api';
        const response = await fetch(`${API_URL}/colleges/${params.id}`);
        const data = await response.json();
        
        if (data.success) {
          setCollege(data.data);
        }
      } catch (error) {
        console.error('Error fetching college details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCollegeDetails();
    }
  }, [params.id]);

  const handleDownload = (type: string, url: string) => {
    window.open(url, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: college?.name,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-slate-700 rounded-full"></div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-500 rounded-full animate-spin border-t-transparent absolute top-0"></div>
          </div>
          <p className="text-slate-400 font-medium text-sm sm:text-base">Loading college details...</p>
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-4">College Not Found</h1>
          <Link href="/colleges" className="text-blue-400 hover:text-blue-300 text-sm sm:text-base">
            ← Back to Colleges
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse delay-700"></div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[50vh] sm:h-[55vh] lg:h-[70vh] xl:h-[75vh] overflow-hidden">
        {college.image ? (
          <Image
            src={`https://learnscapeedu.com/api${college.image}`}
            alt={college.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"></div>
        
        <div className="relative z-10 h-full flex items-end">
          <div className="w-full px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-12 xl:pb-16">
            <div className="max-w-7xl mx-auto">
              <div className="mb-3 sm:mb-4 lg:mb-6">
                <Link 
                  href="/colleges" 
                  className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm sm:text-base"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Back to Colleges</span>
                </Link>
              </div>

              <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className="px-2 sm:px-3 py-1 bg-orange-500/20 backdrop-blur-sm rounded-full border border-orange-500/30">
                    <span className="text-orange-300 font-semibold text-xs sm:text-sm">
                      #{college.positions} Ranked
                    </span>
                  </div>
                  {college.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-white font-semibold text-sm sm:text-base">{college.rating}</span>
                    </div>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-4xl xl:text-6xl font-bold text-white leading-tight">
                  {college.name}
                </h1>

                <div className="flex items-center gap-2 text-blue-300">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="text-sm sm:text-base lg:text-lg">{college.locations.join(', ')}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 lg:gap-3">
                  {college.streams.slice(0, 3).map((stream, index) => (
                    <span 
                      key={index}
                      className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm border border-white/20"
                    >
                      {stream.length > 12 ? `${stream.substring(0, 12)}...` : stream}
                    </span>
                  ))}
                  {college.streams.length > 3 && (
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm border border-white/20">
                      +{college.streams.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex gap-2 sm:gap-3 mt-1 lg:mt-2">
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all ${
                      isBookmarked 
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                        : 'bg-white/10 text-white border border-white/20'
                    } backdrop-blur-sm hover:scale-105`}
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="p-2 sm:p-3 bg-white/10 text-white border border-white/20 rounded-lg sm:rounded-xl backdrop-blur-sm hover:scale-105 transition-all"
                  >
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Single Column Layout */}
      <div className="relative z-10 -mt-2 sm:-mt-4 lg:-mt-6">
        <div className="px-4 sm:px-6 lg:px-8 pb-20 sm:pb-8 lg:pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              
              {/* Main Content - Full Width on Mobile */}
              <div className="lg:col-span-3 order-1">
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-slate-800 overflow-hidden">
                  
                  {/* Tab Navigation */}
                  <div className="border-b border-slate-800">
                    <div className="flex overflow-x-auto scrollbar-hide">
                      {[
                        { id: 'overview', label: 'Overview', icon: <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" /> },
                        { id: 'courses', label: 'Courses', icon: <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" /> },
                        { id: 'features', label: 'Features', icon: <Award className="w-3 h-3 sm:w-4 sm:h-4" /> },
                        { id: 'links', label: 'Resources', icon: <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" /> }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-medium transition-all border-b-2 whitespace-nowrap text-sm sm:text-base ${
                            activeTab === tab.id
                              ? 'text-blue-400 border-blue-400 bg-blue-500/10'
                              : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-800/50'
                          }`}
                        >
                          {tab.icon}
                          <span className="hidden sm:inline">{tab.label}</span>
                          <span className="sm:hidden">{tab.label.slice(0, 8)}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="p-4 sm:p-6 lg:p-8">
                    {activeTab === 'overview' && (
                      <div className="space-y-4 sm:space-y-6">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                            {college.overview?.heading || 'About the College'}
                          </h2>
                          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                            {college.overview?.description || 'College description not available.'}
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'courses' && (
                      <div className="space-y-4 sm:space-y-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Courses & Fees</h2>
                        <div className="space-y-4">
                          {college.courses.map((course, index) => (
                            <div key={index} className="bg-slate-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-700">
                              <div className="flex flex-col gap-3 sm:gap-4">
                                <div className="flex-1">
                                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{course.name}</h3>
                                  <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs sm:text-sm border border-blue-500/30">
                                      <Clock className="w-3 h-3" />
                                      {course.duration}
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs sm:text-sm border border-purple-500/30">
                                      <Award className="w-3 h-3" />
                                      {course.level}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                                  <p className="text-xs sm:text-sm text-slate-400">Course Fee</p>
                                  <p className="text-lg sm:text-2xl font-bold text-white">₹{course.fees}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'features' && (
                      <div className="space-y-4 sm:space-y-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Key Features</h2>
                        <div className="space-y-4 sm:space-y-6">
                          {college.overview?.points?.map((point, index) => (
                            <div key={index} className="flex gap-3 sm:gap-4">
                              <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30 mt-1">
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">{point.heading}</h3>
                                <p className="text-slate-300 leading-relaxed text-sm sm:text-base">{point.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'links' && (
                      <div className="space-y-4 sm:space-y-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Resources & Links</h2>
                        <div className="space-y-4 sm:space-y-6">
                          {college.portalLink && (
                            <div className="bg-slate-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-700">
                              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg sm:rounded-xl flex items-center justify-center border border-blue-500/30 flex-shrink-0">
                                  <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                                </div>
                                <div className="flex-1 w-full">
                                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">College Portal</h3>
                                  <p className="text-slate-400 mb-3 sm:mb-4 text-sm sm:text-base">Access the official college portal</p>
                                  <a
                                    href={college.portalLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
                                  >
                                    <span>Visit Portal</span>
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}

                          {college.brochure && (
                            <div className="bg-slate-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-700">
                              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-lg sm:rounded-xl flex items-center justify-center border border-purple-500/30 flex-shrink-0">
                                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                                </div>
                                <div className="flex-1 w-full">
                                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">College Brochure</h3>
                                  <p className="text-slate-400 mb-3 sm:mb-4 text-sm sm:text-base">Download detailed information</p>
                                  <button
                                    onClick={() => handleDownload('brochure', college.brochure!)}
                                    className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
                                  >
                                    <Download className="w-4 h-4" />
                                    <span>Download</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {college.feeStructureDoc && (
                            <div className="bg-slate-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-700">
                              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg sm:rounded-xl flex items-center justify-center border border-green-500/30 flex-shrink-0">
                                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                                </div>
                                <div className="flex-1 w-full">
                                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">Fee Structure</h3>
                                  <p className="text-slate-400 mb-3 sm:mb-4 text-sm sm:text-base">Complete fee structure for all courses</p>
                                  <button
                                    onClick={() => handleDownload('fee', college.feeStructureDoc!)}
                                    className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
                                  >
                                    <Download className="w-4 h-4" />
                                    <span>Download</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Mobile: Available Streams & Contact Below Tabs */}
                <div className="lg:hidden mt-6 space-y-6">
                  {/* Available Streams */}
                  <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl p-4 border border-slate-800">
                    <h3 className="text-base font-bold text-white mb-3">Available Streams</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {college.streams.map((stream, index) => (
                        <div key={index} className="flex items-center justify-between py-2 px-3 bg-slate-800/50 rounded-lg">
                          <span className="text-slate-300 text-sm">{stream}</span>
                          <TrendingUp className="w-4 h-4 text-green-400 flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl p-4 border border-slate-800">
                    <h3 className="text-base font-bold text-white mb-3">Contact</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">+91 860 600 4306</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">info@college.edu</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Sidebar - Hidden on Mobile */}
              <div className="hidden lg:block lg:col-span-1 space-y-6 order-2">
                {/* Available Streams */}
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl p-6 border border-slate-800">
                  <h3 className="text-lg font-bold text-white mb-4">Available Streams</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                    {college.streams.map((stream, index) => (
                      <div key={index} className="flex items-center justify-between py-2 px-3 bg-slate-800/50 rounded-lg">
                        <span className="text-slate-300 text-sm">{stream}</span>
                        <TrendingUp className="w-4 h-4 text-green-400 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl p-6 border border-slate-800">
                  <h3 className="text-lg font-bold text-white mb-4">Contact</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-300">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span className="text-base">+91 860 600 4306</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="text-base">info@college.edu</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions - Desktop */}
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl p-6 border border-slate-800 sticky top-4">
                  <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setIsEnquiryOpen(true)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-base"
                    >
                      Apply Now
                    </button>
                    <button 
                      onClick={() => setIsEnquiryOpen(true)}
                      className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors text-base"
                    >
                      Request Info
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Buttons - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 p-4 lg:hidden z-40">
        <div className="flex gap-3 max-w-md mx-auto">
          <button 
            onClick={() => setIsEnquiryOpen(true)}
            className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors text-sm"
          >
            Request Info
          </button>
          <button 
            onClick={() => setIsEnquiryOpen(true)}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Mobile Bottom Padding */}
      <div className="h-20 lg:hidden"></div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        collegeName={college?.name || ''}
        collegeId={college?._id || ''}
      />
    </div>
  );
};

export default CollegeDetailPage;
