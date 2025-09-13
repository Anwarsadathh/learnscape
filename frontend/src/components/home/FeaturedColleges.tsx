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
  Users,
  Award
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

const FeaturedColleges = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [savedColleges, setSavedColleges] = useState<Set<string>>(new Set());
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<{id: string, name: string} | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://learnscapeedu.com/api';

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch(`${API_URL}/colleges`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        if (data?.success && Array.isArray(data.data)) {
          setColleges(data.data.slice(0, 9));
        }
      } catch (error) {
        console.error('Error fetching colleges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, [API_URL]);

  const getCardsPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }
    return 3;
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
    }, 5000);

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
      'bg-blue-50 text-blue-700 border-blue-200',
      'bg-purple-50 text-purple-700 border-purple-200',
      'bg-green-50 text-green-700 border-green-200',
      'bg-orange-50 text-orange-700 border-orange-200',
      'bg-pink-50 text-pink-700 border-pink-200'
    ];
    return colors[index % colors.length];
  };

  // Handle apply button click
  const handleApplyClick = (collegeId: string, collegeName: string) => {
    setSelectedCollege({ id: collegeId, name: collegeName });
    setModalOpen(true);
  };

  return (
    <section className="py-10 sm:py-12 lg:py-16 bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ✅ Compact Section Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 mb-3 sm:mb-4">
  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
  <span className="text-[10px] sm:text-xs font-bold text-blue-600 uppercase tracking-wider">Colleges & Universities</span>
</div>

          <h2 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
            Featured <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Institutions</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Discover top-rated colleges handpicked by education experts for your success
          </p>
        </div>

        {loading ? (
          // ✅ Compact Loading State
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="animate-pulse">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 h-80 sm:h-[340px] lg:h-[320px]">
                  <div className="h-36 sm:h-40 lg:h-32 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                  <div className="p-4 space-y-2.5">
                    <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded-lg w-1/2"></div>
                    <div className="flex gap-1.5">
                      <div className="h-5 bg-gray-200 rounded-full w-14"></div>
                      <div className="h-5 bg-gray-200 rounded-full w-14"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative max-w-6xl mx-auto">
            {/* ✅ Compact Navigation Arrows */}
            {totalSlides > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="hidden lg:flex absolute -left-12 xl:-left-14 top-1/2 -translate-y-1/2 z-30 w-10 h-10 items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-gray-100 group"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                </button>
                <button
                  onClick={nextSlide}
                  className="hidden lg:flex absolute -right-12 xl:-right-14 top-1/2 -translate-y-1/2 z-30 w-10 h-10 items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-gray-100 group"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                </button>
              </>
            )}

            <div className="overflow-hidden rounded-xl">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ 
                  transform: `translateX(-${currentSlide * 100}%)` 
                }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className={`grid gap-4 sm:gap-5 ${
                      cardsPerSlide === 1 ? 'grid-cols-1 max-w-sm mx-auto' : 
                      cardsPerSlide === 2 ? 'grid-cols-2' : 'grid-cols-3'
                    }`}>
                      {colleges
                        .slice(slideIndex * cardsPerSlide, (slideIndex + 1) * cardsPerSlide)
                        .map((college) => (
                          <div key={college._id} className="group relative">
                            {/* ✅ MUCH SMALLER Card Design */}
                            <div className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1 flex flex-col h-80 sm:h-[340px] lg:h-[320px] xl:h-[300px]">
                              
                              {/* ✅ Smaller Badges */}
                              <div className="absolute top-2.5 left-2.5 z-20">
                                <div className="px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full text-white text-[9px] font-bold shadow-lg flex items-center gap-1">
                                  <Award className="w-2.5 h-2.5" />
                                  #{college.positions}
                                </div>
                              </div>
                              
                              <button 
                                onClick={() => toggleSave(college._id)}
                                className="absolute top-2.5 right-2.5 z-20 p-1.5 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-md hover:shadow-lg group/save"
                                aria-label="Save college"
                              >
                                <Bookmark 
                                  className={`w-3.5 h-3.5 transition-colors ${
                                    savedColleges.has(college._id) 
                                      ? 'text-yellow-500 fill-yellow-500' 
                                      : 'text-gray-500 group-hover/save:text-yellow-500'
                                  }`} 
                                />
                              </button>

                              {/* ✅ MUCH SMALLER Image Section */}
                              <div className="relative h-36 sm:h-40 lg:h-32 xl:h-28 overflow-hidden bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex-shrink-0">
                                {college.image ? (
                                  <Image
                                    src={`https://learnscapeedu.com${college.image}`}
                                    alt={college.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-white">
                                      <GraduationCap className="w-8 h-8 mx-auto mb-1 opacity-80" />
                                      <div className="text-[10px] font-medium opacity-90">Premium Institution</div>
                                    </div>
                                  </div>
                                )}
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                {/* Smaller student badge */}
                                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-white/95 backdrop-blur-sm rounded-full text-[9px] font-semibold text-gray-700 flex items-center gap-1 shadow-sm">
                                  <Users className="w-2.5 h-2.5" />
                                  {college.courses?.length || 0}+
                                </div>
                              </div>

                              {/* ✅ MUCH MORE COMPACT Content */}
                              <div className="p-3.5 sm:p-4 flex-1 flex flex-col">
                                {/* Smaller College Name */}
                                <h3 className="text-xs sm:text-sm lg:text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[2rem] sm:min-h-[2.25rem]">
                                  {college.name}
                                </h3>

                                {/* ✅ Compact Location and Rating */}
                                <div className="flex items-center justify-between mb-2.5">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-blue-500 flex-shrink-0" />
                                    <span className="text-[10px] sm:text-xs font-medium text-gray-600 truncate">
                                      {college.locations[0]}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-0.5 bg-yellow-50 px-1.5 py-0.5 rounded-lg border border-yellow-200">
                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                                    <span className="text-[10px] font-bold text-gray-900">
                                      {college.rating || '4.5'}
                                    </span>
                                  </div>
                                </div>

                                {/* ✅ Smaller Stream Tags */}
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {college.streams.slice(0, 2).map((stream, index) => (
                                    <span
                                      key={index}
                                      className={`px-1.5 py-0.5 text-[8px] sm:text-[9px] font-semibold rounded-full border ${getStreamColor(index)} transition-all`}
                                    >
                                      {stream.length > 8 ? stream.substring(0, 8) + '...' : stream}
                                    </span>
                                  ))}
                                  {college.streams.length > 2 && (
                                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[8px] sm:text-[9px] font-semibold rounded-full border border-gray-200">
                                      +{college.streams.length - 2}
                                    </span>
                                  )}
                                </div>

                                {/* ✅ SMALLER Action Buttons */}
                                <div className="flex gap-2 mt-auto">
                                  <Link
                                    href={`/colleges/${college._id}`}
                                    className="flex-1 px-2.5 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-300 rounded-lg font-semibold text-[10px] sm:text-xs text-center hover:from-gray-100 hover:to-gray-200 transition-all duration-300"
                                  >
                                    Details
                                  </Link>
                                  
                                  <button
                                    onClick={() => handleApplyClick(college._id, college.name)}
                                    className="flex-1 px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-[10px] sm:text-xs text-center hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-1"
                                  >
                                    <span>Apply</span>
                                    <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                  </button>
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

            {/* ✅ Smaller Progress Indicators */}
            {totalSlides > 1 && (
              <div className="flex justify-center items-center mt-6 gap-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`transition-all duration-300 ${
                      currentSlide === index 
                        ? 'h-2 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-sm' 
                        : 'h-2 w-2 bg-gray-300 hover:bg-gray-400 rounded-full'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
                
                <div className="ml-2 text-[10px] text-gray-500 font-mono">
                  {String(currentSlide + 1).padStart(2, '0')}/{String(totalSlides).padStart(2, '0')}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ✅ Smaller CTA */}
        <div className="text-center mt-8 sm:mt-10">
          <Link
            href="/colleges"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold text-sm hover:shadow-xl hover:shadow-blue-500/25 transition-all transform hover:scale-[1.02] group border border-blue-500/20"
          >
            <span>Explore All Colleges</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
