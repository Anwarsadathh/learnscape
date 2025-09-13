'use client';
import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  GraduationCap, 
  X,
  Loader2,
  TrendingUp,
  Bookmark,
  Grid3X3,
  List,
  ArrowUpDown,
  Sparkles,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import EnquiryModal from '@/components/EnquiryModal';

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

// Loading component for Suspense fallback
function CollegesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-slate-700 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-blue-500 rounded-full animate-spin border-t-transparent absolute top-0"></div>
        </div>
        <p className="mt-4 text-slate-400 font-medium">Loading colleges...</p>
      </div>
    </div>
  );
}

// Main component content
function CollegesContent() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [availableStreams, setAvailableStreams] = useState<string[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedCollege, setSelectedCollege] = useState<{id: string, name: string} | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'ranking' | 'rating'>('ranking');
  const [savedColleges, setSavedColleges] = useState<Set<string>>(new Set());
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalColleges, setTotalColleges] = useState<number>(0);
  const pageSize = 12;

  const searchParams = useSearchParams();

  // Enhanced fetch colleges with pagination
  const fetchColleges = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://learnscapeedu.com/api/api';
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString()
      });

      if (searchQuery) params.set('search', searchQuery);
      if (selectedStreams.length > 0) params.set('stream', selectedStreams.join(','));
      if (selectedLocations.length > 0) params.set('location', selectedLocations.join(','));
      if (sortBy) params.set('sort', sortBy);

      const response = await fetch(`${API_URL}/colleges?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setColleges(data.data || []);
        setCurrentPage(page);
        setTotalPages(data.pagination?.totalPages || Math.ceil(data.total / pageSize) || 1);
        setTotalColleges(data.pagination?.total || data.total || data.data?.length || 0);
        
        // Set available filters on first load
        if (page === 1) {
          const allStreams = data.data?.flatMap((college: College) => college.streams || []) || [];
          const allLocations = data.data?.flatMap((college: College) => college.locations || []) || [];
          
          const streams = Array.from(new Set(allStreams)) as string[];
          const locations = Array.from(new Set(allLocations)) as string[];
          
          setAvailableStreams(streams);
          setAvailableLocations(locations);
        }
      }
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedStreams, selectedLocations, sortBy]);

  // Initial fetch
  useEffect(() => {
    fetchColleges(1);
  }, [fetchColleges]);

  // Initialize from URL params
  useEffect(() => {
    const streamParam = searchParams.get('stream');
    const locationParam = searchParams.get('location');
    const queryParam = searchParams.get('q');
    const pageParam = searchParams.get('page');

    if (streamParam) setSelectedStreams(streamParam.split(','));
    if (locationParam) setSelectedLocations(locationParam.split(','));
    if (queryParam) setSearchQuery(queryParam);
    if (pageParam) setCurrentPage(parseInt(pageParam) || 1);
  }, [searchParams]);

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchColleges(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchColleges(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    fetchColleges(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handleStreamChange = (stream: string, checked: boolean) => {
    if (checked) {
      setSelectedStreams([...selectedStreams, stream]);
    } else {
      setSelectedStreams(selectedStreams.filter(s => s !== stream));
    }
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleLocationChange = (location: string, checked: boolean) => {
    if (checked) {
      setSelectedLocations([...selectedLocations, location]);
    } else {
      setSelectedLocations(selectedLocations.filter(l => l !== location));
    }
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearAllFilters = () => {
    setSelectedStreams([]);
    setSelectedLocations([]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleApplyClick = (collegeId: string, collegeName: string) => {
    setSelectedCollege({ id: collegeId, name: collegeName });
    setModalOpen(true);
  };

  const toggleSaveCollege = (collegeId: string) => {
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

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Animated Background Elements - Same as Hero */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse delay-1000"></div>
      </div>

      {/* Grid Pattern Overlay - Same as Hero */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='white' stroke-width='0.5' opacity='0.05'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 w-full">
        
        {/* Enhanced Hero-Style Header */}
        <div className="text-center mb-12">
          {/* Premium Badge - Same as Hero */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider">Premier Colleges Platform</span>
          </div>

          {/* Main Heading - Same Size as Hero */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
            <span className="block text-white mb-2">Explore Top</span>
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-2xl opacity-50"></span>
              <span className="relative bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Colleges &amp; Universities
              </span>
            </span>
          </h1>

          {/* Subtitle with pagination info */}
          <p className="text-base sm:text-lg text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover {totalColleges}+ premier institutions across India
          </p>

          {/* Enhanced Search Bar - Same as Hero */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-2">
                <div className="flex items-center gap-3">
                  <div className="pl-4 flex items-center gap-2 text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search colleges, courses, locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none py-3"
                  />
                  <button 
                    onClick={() => fetchColleges(1)}
                    className="px-3 sm:px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4 sm:hidden" />
                    <span className="hidden sm:inline">Search</span>
                    <Search className="w-4 h-4 hidden sm:inline" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Search Tags - Same as Hero */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['Engineering', 'Medical', 'MBA', 'Design', 'Law'].map((stream) => (
                <button
                  key={stream}
                  onClick={() => handleStreamChange(stream, !selectedStreams.includes(stream))}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    selectedStreams.includes(stream)
                      ? 'text-white bg-slate-700/50 border border-slate-600'
                      : 'text-slate-300 bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:bg-slate-700/50 hover:text-white hover:border-slate-600'
                  }`}
                >
                  {stream}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Toolbar with Dark Theme */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-4 mb-8">
          <div className="flex items-center justify-between">
            {/* Results Count */}
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-white">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    <span className="text-slate-300">Loading...</span>
                  </span>
                ) : (
                  <span className="text-white">
                    {colleges.length} <span className="text-slate-400">of {totalColleges} Colleges</span>
                  </span>
                )}
              </h2>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="hidden sm:flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as 'name' | 'ranking' | 'rating');
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 bg-slate-800/50 border border-slate-700 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ranking">By Ranking</option>
                  <option value="name">By Name</option>
                  <option value="rating">By Rating</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center bg-slate-800/50 rounded-lg p-1 border border-slate-700">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                <Filter className="w-4 h-4" />
                Filters
                {(selectedStreams.length + selectedLocations.length) > 0 && (
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {selectedStreams.length + selectedLocations.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Enhanced Desktop Sidebar with Dark Theme */}
          <div className="hidden lg:block lg:w-72">
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-4 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-400" />
                  Filters
                </h3>
                {(selectedStreams.length > 0 || selectedLocations.length > 0) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Clear
                  </button>
                )}
              </div>

              {/* Stream Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-300 mb-3 flex items-center gap-2 text-sm">
                  <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <GraduationCap className="w-3 h-3 text-white" />
                  </div>
                  Streams
                </h4>
                <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
                  {availableStreams.map((stream) => (
                    <label key={stream} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedStreams.includes(stream)}
                        onChange={(e) => handleStreamChange(stream, e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                      />
                      <span className="text-xs text-slate-400 group-hover:text-blue-400 transition-colors">
                        {stream}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <h4 className="font-semibold text-slate-300 mb-3 flex items-center gap-2 text-sm">
                  <div className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <MapPin className="w-3 h-3 text-white" />
                  </div>
                  Locations
                </h4>
                <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
                  {availableLocations.map((location) => (
                    <label key={location} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(location)}
                        onChange={(e) => handleLocationChange(location, e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-slate-600 bg-slate-800 text-green-600 focus:ring-green-500 focus:ring-offset-0"
                      />
                      <span className="text-xs text-slate-400 group-hover:text-green-400 transition-colors">
                        {location}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stats Widget */}
              <div className="mt-6 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-slate-400">Total Colleges</span>
                  <span className="text-sm font-bold text-blue-400">{totalColleges}</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-slate-400">Current Page</span>
                  <span className="text-sm font-bold text-purple-400">{currentPage}/{totalPages}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Showing</span>
                  <span className="text-sm font-bold text-green-400">{colleges.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Active Filters Display */}
            {(selectedStreams.length > 0 || selectedLocations.length > 0 || searchQuery) && (
              <div className="mb-6 p-4 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-slate-300">Active Filters:</h4>
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-red-400 hover:text-red-300 font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 backdrop-blur-sm rounded-full text-sm font-medium text-slate-300 border border-slate-700">
                      <Search className="w-3 h-3" />
                      &ldquo;{searchQuery}&rdquo;
                      <button onClick={() => setSearchQuery('')}>
                        <X className="w-3 h-3 hover:text-red-400" />
                      </button>
                    </span>
                  )}
                  {selectedStreams.map((stream) => (
                    <span key={stream} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full text-sm font-medium text-blue-300 border border-blue-500/30">
                      <GraduationCap className="w-3 h-3" />
                      {stream}
                      <button onClick={() => handleStreamChange(stream, false)}>
                        <X className="w-3 h-3 hover:text-red-400" />
                      </button>
                    </span>
                  ))}
                  {selectedLocations.map((location) => (
                    <span key={location} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full text-sm font-medium text-green-300 border border-green-500/30">
                      <MapPin className="w-3 h-3" />
                      {location}
                      <button onClick={() => handleLocationChange(location, false)}>
                        <X className="w-3 h-3 hover:text-red-400" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-slate-700 rounded-full"></div>
                  <div className="w-20 h-20 border-4 border-blue-500 rounded-full animate-spin border-t-transparent absolute top-0"></div>
                </div>
                <p className="mt-4 text-slate-400 font-medium">Loading colleges...</p>
              </div>
            )}

            {/* College Cards - Enhanced Dark Theme */}
            {!loading && viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {colleges.map((college) => (
                  <div key={college._id} className="group relative bg-slate-900/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden border border-slate-800 hover:border-slate-700">
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden">
                      {college.image ? (
                        <Image
                          src={`https://learnscapeedu.com/api${college.image}`}
                          alt={college.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
                          <GraduationCap className="w-16 h-16 text-white/80" />
                        </div>
                      )}
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <div className="px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs font-bold shadow-lg">
                          <TrendingUp className="w-3 h-3 inline mr-1" />
                          #{college.positions}
                        </div>
                      </div>

                      {/* Save Button */}
                      <button
                        onClick={() => toggleSaveCollege(college._id)}
                        className="absolute top-3 right-3 p-2 bg-slate-900/80 backdrop-blur-sm rounded-full hover:bg-slate-800 transition-all shadow-lg"
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 transition-colors ${
                            savedColleges.has(college._id)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-slate-400 hover:text-yellow-400'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Content Section */}
                    <div className="p-4">
                      <h3 className="font-bold text-sm text-slate-200 mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {college.name}
                      </h3>

                      {/* Location and Rating */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1 text-slate-400">
                          <MapPin className="w-3 h-3 text-blue-400" />
                          <span className="text-xs">{college.locations[0]}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-bold text-slate-200">{college.rating || '4.5'}</span>
                        </div>
                      </div>

                      {/* Stream Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {college.streams.slice(0, 2).map((stream, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800/50 text-blue-300 rounded-full border border-slate-700"
                          >
                            {stream.length > 12 ? stream.substring(0, 12) + '...' : stream}
                          </span>
                        ))}
                        {college.streams.length > 2 && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-400 rounded-full">
                            +{college.streams.length - 2}
                          </span>
                        )}
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-purple-400" />
                          <span>{college.courses?.length || 0} Courses</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-green-400" />
                          <span>Apply Now</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link
                          href={`/colleges/${college._id}`}
                          className="flex-1 px-3 py-2 text-center text-xs font-semibold bg-slate-800/50 text-slate-300 rounded-lg border border-slate-700 hover:bg-slate-700/50 hover:text-white transition-all"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleApplyClick(college._id, college.name)}
                          className="flex-1 px-3 py-2 text-center text-xs font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Enhanced Pagination Component */}
            {!loading && colleges.length > 0 && totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center gap-6">
                {/* Pagination Info */}
                <div className="text-center">
                  <p className="text-sm text-slate-400">
                    Showing <span className="font-semibold text-white">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                    <span className="font-semibold text-white">
                      {Math.min(currentPage * pageSize, totalColleges)}
                    </span>{' '}
                    of <span className="font-semibold text-white">{totalColleges}</span> colleges
                  </p>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-700/50 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-800/50 disabled:hover:text-slate-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                      <React.Fragment key={index}>
                        {page === '...' ? (
                          <span className="px-3 py-2 text-slate-400">...</span>
                        ) : (
                          <button
                            onClick={() => handlePageClick(page as number)}
                            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                              currentPage === page
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                : 'bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:text-white'
                            }`}
                          >
                            {page}
                          </button>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-700/50 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-800/50 disabled:hover:text-slate-300"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Jump to Page */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400">Jump to page:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        handlePageClick(page);
                      }
                    }}
                    className="w-16 px-2 py-1 bg-slate-800/50 border border-slate-700 text-white rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-slate-400">of {totalPages}</span>
                </div>
              </div>
            )}

            {/* No Results State */}
            {!loading && colleges.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800">
                <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-700 rounded-full mb-6">
                  <GraduationCap className="w-20 h-20 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No colleges found</h3>
                <p className="text-slate-400 mb-6 text-center max-w-md">
                  We couldn&apos;t find any colleges matching your criteria. Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden">
          <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-slate-900 shadow-2xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </h3>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Filter Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
                {/* Sort Options - Mobile */}
                <div className="mb-6">
                  <h4 className="font-bold text-slate-300 mb-3 flex items-center gap-2 text-sm">
                    <ArrowUpDown className="w-4 h-4 text-slate-400" />
                    Sort By
                  </h4>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value as 'name' | 'ranking' | 'rating');
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="ranking">By Ranking</option>
                    <option value="name">By Name</option>
                    <option value="rating">By Rating</option>
                  </select>
                </div>

                {/* Mobile Stream Filter */}
                <div className="mb-6">
                  <h4 className="font-bold text-slate-300 mb-3 flex items-center gap-2 text-sm">
                    <GraduationCap className="w-4 h-4 text-blue-400" />
                    Streams
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                    {availableStreams.map((stream) => (
                      <label key={stream} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedStreams.includes(stream)}
                          onChange={(e) => handleStreamChange(stream, e.target.checked)}
                          className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600"
                        />
                        <span className="text-xs text-slate-400">{stream}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mobile Location Filter */}
                <div className="mb-6">
                  <h4 className="font-bold text-slate-300 mb-3 flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-green-400" />
                    Locations
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                    {availableLocations.map((location) => (
                      <label key={location} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedLocations.includes(location)}
                          onChange={(e) => handleLocationChange(location, e.target.checked)}
                          className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-green-600"
                        />
                        <span className="text-xs text-slate-400">{location}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-slate-800 bg-slate-800">
                <div className="flex gap-3">
                  <button
                    onClick={clearAllFilters}
                    className="flex-1 px-4 py-3 border border-slate-600 text-slate-300 rounded-xl font-semibold hover:bg-slate-700 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
}

// Main exported component with Suspense wrapper
export default function CollegesPage() {
  return (
    <Suspense fallback={<CollegesLoading />}>
      <CollegesContent />
    </Suspense>
  );
}
