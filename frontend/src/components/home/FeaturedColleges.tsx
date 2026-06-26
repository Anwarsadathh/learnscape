'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import EnquiryModal from '../EnquiryModal';
import { 
  MapPin, 
  Star, 
  ArrowRight, 
  Bookmark, 
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  Zap,
  TrendingUp,
} from 'lucide-react';

interface Course {
  id: string;
  name: string;
  duration: string;
  fees: string;
  level: string;
  description?: string;
}

interface College {
  _id: string;
  name: string;
  image?: string;
  locations: string[];
  streams: string[];
  courses: Course[];
  brochure?: string;
  positions: number;
  rating?: number;
  ranking?: number;
}

// helper so we don’t hardcode domain
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://learnscapeedu.com/api';
const getAssetUrl = (image?: string) => {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return API_URL.replace(/\/api$/, '') + image;
};

const FeaturedColleges = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [savedColleges, setSavedColleges] = useState<Set<string>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch(`${API_URL}/colleges`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        if (data?.success && Array.isArray(data.data)) {
          setColleges(data.data.slice(0, 12));
        }
      } catch (error) {
        console.error('Error fetching colleges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  const getCardsPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return 1;      // Mobile: 1 card
      if (window.innerWidth < 1024) return 2;     // Tablet: 2 cards  
      if (window.innerWidth < 1280) return 3;     // Laptop: 3 cards
      return 4;                                   // Desktop: 4 cards
    }
    return 4;
  };

  const [cardsPerSlide, setCardsPerSlide] = useState(getCardsPerSlide());

  useEffect(() => {
    const handleResize = () => {
      setCardsPerSlide(getCardsPerSlide());
      setCurrentSlide(0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.ceil(colleges.length / cardsPerSlide);

  useEffect(() => {
    if (!isPlaying || totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev >= totalSlides - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, totalSlides]);

  const toggleSave = (collegeId: string) => {
    setSavedColleges(prev => {
      const newSet = new Set(prev);
      if (newSet.has(collegeId)) {
        newSet.delete(collegeId);
      } else {
        newSet.add(collegeId);
      }
      return newSet;
    });
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 8000);
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev >= totalSlides - 1 ? 0 : prev + 1));
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 8000);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev <= 0 ? totalSlides - 1 : prev - 1));
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 8000);
  };

  const getStreamColor = (index: number) => {
    const colors = [
      'bg-gradient-to-r from-[#173974]/10 to-blue-500/10 text-[#173974] border-[#173974]/20',
      'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 border-purple-200',
      'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 border-emerald-200',
      'bg-gradient-to-r from-orange-500/10 to-red-500/10 text-orange-700 border-orange-200',
      'bg-gradient-to-r from-indigo-500/10 to-blue-500/10 text-indigo-700 border-indigo-200'
    ];
    return colors[index % colors.length];
  };

  const handleApplyClick = (collegeId: string, collegeName: string) => {
    setSelectedCollege({ id: collegeId, name: collegeName });
    setModalOpen(true);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-40 h-40 bg-[#173974]/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-purple-500/8 rounded-full blur-3xl animate-pulse delay-700"></div>
        
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, #173974 0px, transparent 1px, transparent 99px, #173974 100px),
                             repeating-linear-gradient(90deg, #173974 0px, transparent 1px, transparent 99px, #173974 100px)`
          }}
        ></div>
        
        <div
          className="absolute top-32 right-1/4 w-2 h-2 bg-[#173974]/30 rounded-full animate-bounce"
          style={{ animationDelay: '1s' }}
        ></div>
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-purple-500/30 rounded-full animate-pulse delay-300"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium Section Header */}
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-[#173974]/10 to-purple-500/10 border border-[#173974]/20 backdrop-blur-sm mb-3 sm:mb-4 group hover:scale-105 transition-transform">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#173974] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold text-[#173974] uppercase tracking-wider">
              Premium Institutions
            </span>
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 animate-pulse" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
            Featured
            <span className="bg-gradient-to-r from-[#173974] via-blue-600 to-purple-600 bg-clip-text text-transparent ml-2 relative">
              Colleges
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#173974] to-purple-600 animate-pulse"></div>
            </span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Handpicked excellence • Expert vetted • Your future starts here
          </p>
        </div>

        {loading ? (
          // Loading State
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="animate-pulse">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 h-[420px]">
                  <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded-lg w-1/2"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    </div>
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            {/* Navigation Arrows */}
            {totalSlides > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="hidden lg:flex absolute -left-14 xl:-left-16 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center bg-white/95 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-110 border-2 border-[#173974]/20 group"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5 text-[#173974] group-hover:text-blue-600 transition-colors" />
                </button>
                <button
                  onClick={nextSlide}
                  className="hidden lg:flex absolute -right-14 xl:-right-16 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center bg-white/95 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-110 border-2 border-[#173974]/20 group"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5 text-[#173974] group-hover:text-blue-600 transition-colors" />
                </button>
              </>
            )}

            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div
                      className={`grid gap-4 sm:gap-6 ${
                        cardsPerSlide === 1
                          ? 'grid-cols-1 max-w-sm mx-auto'
                          : cardsPerSlide === 2
                          ? 'grid-cols-2'
                          : cardsPerSlide === 3
                          ? 'grid-cols-3'
                          : 'grid-cols-4'
                      }`}
                    >
                      {colleges
                        .slice(
                          slideIndex * cardsPerSlide,
                          (slideIndex + 1) * cardsPerSlide
                        )
                        .map((college, index) => (
                          <div
                            key={college._id}
                            className={`group relative transition-all duration-300 ${
                              hoveredCard === slideIndex * cardsPerSlide + index
                                ? 'z-10'
                                : 'z-0'
                            }`}
                            onMouseEnter={() =>
                              setHoveredCard(slideIndex * cardsPerSlide + index)
                            }
                            onMouseLeave={() => setHoveredCard(null)}
                          >
                            {/* Fixed Height Card - NO ROTATION */}
                            <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-[#173974]/30 transform hover:scale-[1.02] hover:-translate-y-1 flex flex-col h-[420px]">
                              
                              {/* Animated gradient glow on hover */}
                              <div className="absolute inset-0 bg-gradient-to-r from-[#173974] via-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 pointer-events-none"></div>
                              
                              {/* Card content container */}
                              <div className="relative bg-white rounded-2xl overflow-hidden flex flex-col h-full">
                                
                                {/* Premium Badges */}
                                <div className="absolute top-3 left-3 right-3 z-20 flex justify-between">
                                  <div className="px-3 py-1.5 bg-gradient-to-r from-[#173974] to-blue-600 rounded-full text-white text-xs font-bold shadow-lg flex items-center gap-1.5 animate-pulse">
                                    <Award className="w-3 h-3" />
                                    <span>#{college.positions}</span>
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                                  </div>
                                  
                                  <button 
                                    onClick={() => toggleSave(college._id)}
                                    className="p-2.5 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg hover:shadow-xl group/save hover:scale-110"
                                    aria-label="Save college"
                                  >
                                    <Bookmark 
                                      className={`w-4 h-4 transition-all ${
                                        savedColleges.has(college._id) 
                                          ? 'text-yellow-500 fill-yellow-500 scale-110' 
                                          : 'text-gray-500 group-hover/save:text-yellow-500'
                                      }`} 
                                    />
                                  </button>
                                </div>

                                {/* Fixed Height Image Section */}
                                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#173974] via-blue-600 to-purple-600 flex-shrink-0">
                                  {college.image ? (
                                    <Image
                                      src={getAssetUrl(college.image)}
                                      alt={college.name}
                                      fill
                                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                      unoptimized
                                    />
                                  ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="text-center text-white">
                                        <GraduationCap className="w-12 h-12 mx-auto mb-2 opacity-80 animate-pulse" />
                                        <div className="text-sm font-bold opacity-90">
                                          Premium Institution
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                  
                                  {/* Bottom badges */}
                                  <div className="absolute bottom-3 right-3">
                                    <div className="px-3 py-1.5 bg-yellow-400/95 backdrop-blur-sm rounded-full text-xs font-bold text-gray-900 flex items-center gap-1.5 shadow-md">
                                      <Star className="w-3 h-3" />
                                      <span>{college.rating || '4.5'}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Fixed Height Content Section */}
                                <div className="p-5 flex-1 flex flex-col">
                                  {/* College name with TRUNCATION */}
                                  <div className="mb-3">
                                    <h3 
                                      className="text-base font-bold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-[#173974] group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all leading-tight"
                                      title={college.name}
                                    >
                                      {truncateText(college.name, 40)}
                                    </h3>
                                  </div>
                                  
                                  {/* Location */}
                                  <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="w-4 h-4 text-[#173974] animate-pulse flex-shrink-0" />
                                    <span className="text-sm font-medium text-gray-600 truncate">
                                      {college.locations[0]}
                                      {college.locations.length > 1 && (
                                        <span className="text-xs text-gray-400 ml-1">
                                          +{college.locations.length - 1}
                                        </span>
                                      )}
                                    </span>
                                  </div>

                                  {/* Stream tags */}
                                  <div className="flex flex-wrap gap-2 mb-4 min-h-[60px] content-start">
                                    {college.streams.slice(0, 3).map((stream, idx) => (
                                      <span
                                        key={idx}
                                        className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all hover:scale-105 cursor-pointer ${getStreamColor(idx)}`}
                                        title={stream}
                                      >
                                        {truncateText(stream, 12)}
                                      </span>
                                    ))}
                                    {college.streams.length > 3 && (
                                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full border border-gray-200 animate-pulse">
                                        +{college.streams.length - 3}
                                      </span>
                                    )}
                                  </div>

                                  {/* Action buttons */}
                                  <div className="flex gap-2 mt-auto">
                                    <Link
                                      href={`/colleges/${college._id}`}
                                      className="flex-1 px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-2 border-gray-200 rounded-lg font-semibold text-xs text-center hover:from-gray-100 hover:to-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg group/btn"
                                    >
                                      <span className="flex items-center justify-center gap-1">
                                        Details
                                        <TrendingUp className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                      </span>
                                    </Link>
                                    
                                    <button
                                      onClick={() => handleApplyClick(college._id, college.name)}
                                      className="flex-1 px-3 py-2 bg-gradient-to-r from-[#173974] to-blue-600 text-white rounded-lg font-semibold text-xs text-center hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group/apply"
                                    >
                                      <span className="relative z-10 flex items-center justify-center gap-1">
                                        Apply Now
                                        <ArrowRight className="w-3 h-3 group-hover/apply:translate-x-1 transition-transform" />
                                      </span>
                                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/apply:translate-x-[100%] transition-transform duration-700"></div>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress indicators */}
            {totalSlides > 1 && (
              <div className="flex justify-center items-center mt-8 gap-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`relative transition-all duration-500 ${
                      currentSlide === index 
                        ? 'h-2 w-10 bg-blue-600 rounded-full shadow-lg'
                        : 'h-2 w-2 bg-gray-400 hover:bg-gray-500 rounded-full'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    {currentSlide === index && (
                      <div className="absolute inset-0 bg-gray-800 rounded-full animate-pulse"></div>
                    )}
                  </button>
                ))}
                
                <div className="ml-3 text-xs text-gray-600 font-mono font-bold">
                  {String(currentSlide + 1).padStart(2, '0')}/{String(totalSlides).padStart(2, '0')}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-10 sm:mt-12">
          <Link
            href="/colleges"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#173974] via-blue-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:shadow-xl hover:shadow-blue-500/25 transition-all transform hover:scale-[1.02] group border border-blue-500/20 relative overflow-hidden"
          >
            <span className="relative z-10">Explore All Colleges</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </Link>
        </div>
      </div>

      {/* Enquiry Modal */}
      {modalOpen && selectedCollege && (
        <EnquiryModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedCollege(null);
          }}
          collegeName={selectedCollege.name}
          collegeId={selectedCollege.id}
        />
      )}
    </section>
  );
};

export default FeaturedColleges;