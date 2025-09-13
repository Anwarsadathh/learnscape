'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, ArrowRight, TrendingUp, MapPin, GraduationCap, X, Zap } from 'lucide-react';

interface SearchSuggestion {
  id: string;
  name: string;
  type: 'college' | 'stream' | 'location';
  metadata?: {
    location?: string;
    rating?: number;
  };
}

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState(0);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const tags = ['Engineering', 'Medical', 'MBA', 'Design', 'Law', 'Arts'];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTag((prev) => (prev + 1) % tags.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [tags.length]);

  // API fetch logic
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const delayedSearch = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://learnscapeedu.com/api';
        const response = await fetch(`${API_URL}/search/suggestions?q=${encodeURIComponent(searchQuery.trim())}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Received non-JSON response:', text);
          throw new Error('Server returned non-JSON response');
        }
        
        const data = await response.json();
        
        if (data.success && data.suggestions) {
          setSuggestions(data.suggestions);
          setShowSuggestions(true);
          setSelectedSuggestionIndex(-1);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  // Memoized functions
  const handleSearch = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    setShowSuggestions(false);
    
    if (searchQuery.trim()) {
      const params = new URLSearchParams({ q: searchQuery.trim() });
      router.push(`/colleges?${params.toString()}`);
    } else {
      router.push('/colleges');
    }
  }, [searchQuery, router]);

  const handleSuggestionSelect = useCallback((suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    
    const params = new URLSearchParams();
    
    switch (suggestion.type) {
      case 'college':
        params.set('q', suggestion.name);
        break;
      case 'stream':
        params.set('stream', suggestion.name);
        break;
      case 'location':
        params.set('location', suggestion.name);
        break;
      default:
        params.set('q', suggestion.name);
    }
    
    router.push(`/colleges?${params.toString()}`);
  }, [router]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showSuggestions || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedSuggestionIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedSuggestionIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedSuggestionIndex >= 0) {
            handleSuggestionSelect(suggestions[selectedSuggestionIndex]);
          } else {
            handleSearch();
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          setSelectedSuggestionIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSuggestions, suggestions, selectedSuggestionIndex, handleSearch, handleSuggestionSelect]);

  // Click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        !searchInputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && selectedSuggestionIndex === -1) {
      handleSearch();
    }
  }, [selectedSuggestionIndex, handleSearch]);

  const handleTagSearch = useCallback((tag: string) => {
    const params = new URLSearchParams({ stream: tag });
    router.push(`/colleges?${params.toString()}`);
  }, [router]);

  const handleStreamClick = useCallback((stream: string) => {
    const params = new URLSearchParams({ stream });
    router.push(`/colleges?${params.toString()}`);
  }, [router]);

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'college':
        return <GraduationCap className="w-4 h-4 text-blue-400" />;
      case 'stream':
        return <GraduationCap className="w-4 h-4 text-purple-400" />;
      case 'location':
        return <MapPin className="w-4 h-4 text-green-400" />;
      default:
        return <Search className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSuggestionLabel = (type: string) => {
    switch (type) {
      case 'college':
        return 'College';
      case 'stream':
        return 'Stream';
      case 'location':
        return 'Location';
      default:
        return '';
    }
  };

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  }, []);

  return (
    <section className="relative min-h-[100vh] lg:min-h-[85vh] bg-gradient-to-br from-[#173974] via-slate-900 to-[#173974] overflow-hidden flex items-center">
      {/* Premium Background Effects - Matching Other Sections */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#173974]/30 rounded-full blur-[128px] animate-pulse delay-1000"></div>
      </div>

      {/* Enhanced Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, white 0px, transparent 1px, transparent 99px, white 100px),
                           repeating-linear-gradient(90deg, white 0px, transparent 1px, transparent 99px, white 100px)`
        }}
      ></div>

      {/* Floating Elements - Brand Colors */}
      <div className="absolute top-32 right-1/4 w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-300"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 w-full">
        <div className="text-center">
          {/* Premium Badge - Matching Other Sections */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-sm mb-6 group hover:scale-105 transition-transform">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-300 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold text-blue-200 uppercase tracking-wider">Premier Education Platform</span>
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 animate-pulse" />
          </div>

          {/* Enhanced Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
            <span className="block text-white mb-2">Discover Your</span>
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 blur-2xl opacity-50"></span>
              <span className="relative bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Perfect College
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse"></div>
              </span>
            </span>
          </h1>

          {/* Enhanced Animated Tag Line */}
          <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Find your ideal path in
            <button 
              onClick={() => handleStreamClick(tags[activeTag])}
              className="inline-block ml-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/40 hover:from-blue-500/40 hover:to-purple-500/40 hover:border-blue-400/60 transition-all cursor-pointer group"
            >
              <span className="font-bold text-white group-hover:text-blue-200 transition-colors">{tags[activeTag]}</span>
            </button>
            <span className="ml-2">and 500+ more programs</span>
          </p>

          {/* Premium Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#173974] to-purple-600 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-2 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="pl-4 flex items-center gap-2 text-white/60">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search colleges, courses, locations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                      className="flex-1 bg-transparent text-white placeholder-white/50 text-sm focus:outline-none py-3"
                      autoComplete="off"
                    />
                    
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="p-1 text-white/60 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    
                    {/* Premium Search Button */}
                    <button 
                      type="submit"
                      className="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-[#173974] to-blue-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 border border-blue-500/20"
                    >
                      <Search className="w-4 h-4 sm:hidden" />
                      <span className="hidden sm:inline">Search</span>
                      <Search className="w-4 h-4 hidden sm:inline" />
                    </button>
                  </div>
                </div>
              </form>

              {/* Enhanced Suggestions Dropdown */}
              {showSuggestions && (searchQuery.trim().length >= 2) && (
                <div 
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-2xl max-h-80 overflow-y-auto z-50"
                >
                  {isLoadingSuggestions ? (
                    <div className="p-4 text-center">
                      <div className="inline-flex items-center gap-2 text-[#173974]">
                        <div className="w-4 h-4 border-2 border-[#173974] border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm">Searching...</span>
                      </div>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="py-2">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={suggestion.id}
                          onClick={() => handleSuggestionSelect(suggestion)}
                          className={`w-full px-4 py-3 text-left hover:bg-[#173974]/10 transition-all flex items-center gap-3 ${
                            index === selectedSuggestionIndex ? 'bg-[#173974]/10' : ''
                          }`}
                        >
                          <div className="flex-shrink-0">
                            {getSuggestionIcon(suggestion.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-900 text-sm font-medium truncate">
                                {suggestion.name}
                              </span>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">
                                {getSuggestionLabel(suggestion.type)}
                              </span>
                            </div>
                            {suggestion.metadata?.location && (
                              <div className="flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3 text-gray-500" />
                                <span className="text-xs text-gray-500">
                                  {suggestion.metadata.location}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {suggestion.metadata?.rating && (
                            <div className="flex items-center gap-1 text-yellow-600">
                              <span className="text-xs font-medium">
                                ★ {suggestion.metadata.rating}
                              </span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : searchQuery.trim().length >= 2 ? (
                    <div className="p-4 text-center text-gray-600">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-8 h-8 text-gray-400" />
                        <p className="text-sm">No suggestions found for &ldquo;{searchQuery}&rdquo;</p>
                        <button
                          onClick={handleSearch}
                          className="text-xs text-[#173974] hover:text-blue-600 transition-colors"
                        >
                          Search anyway →
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Premium Quick Search Tags */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['IIT', 'AIIMS', 'IIM', 'NIT', 'NIFT'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagSearch(tag)}
                  className="px-3 py-1.5 text-xs font-medium text-white/80 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 hover:text-white hover:border-white/30 transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

         {/* Premium CTA Buttons - Same Row on Mobile */}
<div className="flex flex-row gap-3 justify-center items-center mb-12">
  <Link
    href="/colleges"
    className="group relative flex-1 max-w-[180px] px-4 py-3 bg-gradient-to-r from-[#173974] via-blue-600 to-purple-600 text-white rounded-xl font-semibold text-xs sm:text-sm overflow-hidden transition-all hover:shadow-2xl hover:shadow-blue-500/30 transform hover:scale-[1.02] border border-blue-500/20"
  >
    <span className="relative z-10 flex items-center justify-center gap-1.5">
      Explore Colleges
      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
    </span>
    {/* Shimmer effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
  </Link>
  
  <a
    href="https://skillprofile.in/"
    target="_blank"
    rel="noopener noreferrer"
    className="flex-1 max-w-[180px] px-4 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-xs sm:text-sm border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all"
  >
    <span className="flex items-center justify-center gap-1.5">
      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
      Career Assessment
    </span>
  </a>
</div>


          {/* Enhanced Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 opacity-60">
            <span className="text-xs text-white/60 font-medium">Trusted by</span>
            {['AICTE', 'UGC', 'NAAC A+', 'NBA'].map((badge) => (
              <span key={badge} className="text-xs font-bold text-white/50 uppercase tracking-wider hover:text-white/70 transition-colors cursor-pointer">{badge}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
