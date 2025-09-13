'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, ArrowRight, TrendingUp, MapPin,Globe, GraduationCap, X } from 'lucide-react';

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
    <section className="relative min-h-[80vh] sm:min-h-[85vh] lg:min-h-[85vh] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse delay-1000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='white' stroke-width='0.5' opacity='0.05'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
        }}
      ></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24 w-full">
        <div className="text-center">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm mb-4 sm:mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider">Premier Education Platform</span>
          </div>

        {/* Main Heading - Bigger on Mobile */}
<h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
  <span className="block text-white mb-1 sm:mb-2">Discover Your</span>
  <span className="relative inline-block">
    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-2xl opacity-50"></span>
    <span className="relative bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
      Perfect College
    </span>
  </span>
</h1>

          {/* Animated Tag Line - Smaller on Mobile */}
          <p className="text-sm sm:text-lg text-slate-400 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            Find your ideal path in
            <button 
              onClick={() => handleStreamClick(tags[activeTag])}
              className="inline-block ml-2 px-3 py-1 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-500/40 transition-all cursor-pointer"
            >
              <span className="font-semibold text-white">{tags[activeTag]}</span>
            </button>
            <span className="ml-2">and 500+ more programs</span>
          </p>

          {/* Enhanced Search Bar - Compact on Mobile */}
          <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
            <div className="relative">
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-2">
                  <div className="flex items-center gap-3">
                    <div className="pl-4 flex items-center gap-2 text-slate-400">
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
                      className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none py-2.5 sm:py-3"
                      autoComplete="off"
                    />
                    
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="p-1 text-slate-400 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button 
                      type="submit"
                      className="px-3 sm:px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      <Search className="w-4 h-4 sm:hidden" />
                      <span className="hidden sm:inline">Search</span>
                      <Search className="w-4 h-4 hidden sm:inline" />
                    </button>
                  </div>
                </div>
              </form>

              {/* Live Suggestions Dropdown */}
              {showSuggestions && (searchQuery.trim().length >= 2) && (
                <div 
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl max-h-80 overflow-y-auto z-50"
                >
                  {isLoadingSuggestions ? (
                    <div className="p-4 text-center">
                      <div className="inline-flex items-center gap-2 text-slate-400">
                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm">Searching...</span>
                      </div>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="py-2">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={suggestion.id}
                          onClick={() => handleSuggestionSelect(suggestion)}
                          className={`w-full px-4 py-3 text-left hover:bg-slate-800/50 transition-all flex items-center gap-3 ${
                            index === selectedSuggestionIndex ? 'bg-slate-800/50' : ''
                          }`}
                        >
                          <div className="flex-shrink-0">
                            {getSuggestionIcon(suggestion.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-white text-sm font-medium truncate">
                                {suggestion.name}
                              </span>
                              <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded-full flex-shrink-0">
                                {getSuggestionLabel(suggestion.type)}
                              </span>
                            </div>
                            {suggestion.metadata?.location && (
                              <div className="flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3 text-slate-500" />
                                <span className="text-xs text-slate-500">
                                  {suggestion.metadata.location}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {suggestion.metadata?.rating && (
                            <div className="flex items-center gap-1 text-yellow-400">
                              <span className="text-xs font-medium">
                                ★ {suggestion.metadata.rating}
                              </span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : searchQuery.trim().length >= 2 ? (
                    <div className="p-4 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-8 h-8 text-slate-600" />
                        <p className="text-sm">No suggestions found for &ldquo;{searchQuery}&rdquo;</p>
                        <button
                          onClick={handleSearch}
                          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Search anyway →
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Quick Search Tags */}
            <div className="flex flex-wrap justify-center gap-2 mt-3 sm:mt-4">
              {['IIT', 'AIIMS', 'IIM', 'NIT', 'NIFT'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagSearch(tag)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg hover:bg-slate-700/50 hover:text-white hover:border-slate-600 transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

      {/* CTA Buttons - Medium Size on Laptop */}
<div className="flex flex-col gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12">
  {/* Top Row - Main Actions */}
  <div className="flex flex-row gap-3 sm:gap-4 justify-center items-center w-full">
    <Link
      href="/colleges"
      className="group relative flex-1 max-w-[160px] sm:max-w-[180px] lg:max-w-[190px] px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 lg:py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-xs sm:text-sm lg:text-sm overflow-hidden transition-all hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-[1.02]"
    >
      <span className="relative z-10 flex items-center justify-center gap-1.5">
        Explore Colleges
        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-4 lg:h-4 group-hover:translate-x-1 transition-transform" />
      </span>
    </Link>
    
    <Link
      href="/language-academy"
      className="group relative flex-1 max-w-[160px] sm:max-w-[180px] lg:max-w-[190px] px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 lg:py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold text-xs sm:text-sm lg:text-sm overflow-hidden transition-all hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-[1.02]"
    >
      <span className="relative z-10 flex items-center justify-center gap-1.5">
        <Globe className="w-3 h-3 sm:w-4 sm:h-4 lg:w-4 lg:h-4 flex-shrink-0" />
        <span className="text-[10px] sm:text-sm lg:text-sm whitespace-nowrap leading-tight">
          Language Academy
        </span>
      </span>
    </Link>
  </div>

  {/* Bottom Row - Career Assessment */}
  <div className="flex justify-center w-full">
    <a
      href="https://skillprofile.in/"
      target="_blank"
      rel="noopener noreferrer"
      className="max-w-[320px] sm:max-w-[360px] lg:max-w-[380px] w-full px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 lg:py-3.5 bg-slate-800/50 backdrop-blur-sm text-white rounded-xl font-semibold text-xs sm:text-sm lg:text-sm border border-slate-700 hover:bg-slate-700/50 hover:border-slate-600 transition-all"
    >
      <span className="flex items-center justify-center gap-1.5">
        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-4 lg:h-4 text-slate-300 flex-shrink-0" />
        <span className="whitespace-nowrap">
          Career Assessment
        </span>
      </span>
    </a>
  </div>
</div>




          {/* Trust Badges - Compact on Mobile */}
          <div className="mt-6 sm:mt-12 flex flex-wrap justify-center items-center gap-4 sm:gap-6 opacity-50">
            <span className="text-xs text-slate-400 font-medium">Trusted by</span>
            {['AICTE', 'UGC', 'NAAC A+', 'NBA'].map((badge) => (
              <span key={badge} className="text-xs font-bold text-slate-500 uppercase tracking-wider">{badge}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
