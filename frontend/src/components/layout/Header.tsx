'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Phone,Globe, Sparkles } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle stream filter navigation
  const handleStreamFilter = (stream: string) => {
    const params = new URLSearchParams({ stream });
    router.push(`/colleges?${params.toString()}`);
    setIsMenuOpen(false);
  };

  // Check if path is active
  const isActivePath = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200/50' 
          : 'bg-slate-900/20 backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            
            {/* Enhanced Logo */}
            <Link href="/" className="flex items-center group relative">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="LearnScape Logo"
                  width={130}
                  height={42}
                  className="object-contain group-hover:scale-105 transition-all duration-300"
                  priority
                
                />
                {!isScrolled && (
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </div>
            </Link>

            {/* Desktop Navigation - Enhanced with Active States */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link href="/" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                isActivePath('/')
                  ? isScrolled 
                    ? 'text-[#173974] bg-blue-50 border border-blue-200' 
                    : 'text-blue-300 bg-white/20 backdrop-blur-sm border border-white/30'
                  : isScrolled 
                    ? 'text-gray-700 hover:text-[#173974] hover:bg-blue-50' 
                    : 'text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm'
              }`}>
                Home
              </Link>
              
              {/* Enhanced Colleges Dropdown */}
              <div className="relative group">
                <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center hover:scale-105 ${
                  isActivePath('/colleges')
                    ? isScrolled 
                      ? 'text-[#173974] bg-blue-50 border border-blue-200' 
                      : 'text-blue-300 bg-white/20 backdrop-blur-sm border border-white/30'
                    : isScrolled 
                      ? 'text-gray-700 hover:text-[#173974] hover:bg-blue-50' 
                      : 'text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                }`}>
                  Colleges 
                  <ChevronDown className="w-4 h-4 ml-1 group-hover:rotate-180 transition-transform duration-300" />
                </button>
                
                {/* Enhanced Dropdown */}
                <div className="absolute top-full left-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 min-w-64 z-50 transform group-hover:translate-y-0 translate-y-2">
                  <Link 
                    href="/colleges" 
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-[#173974] rounded-xl transition-all duration-300 font-medium"
                  >
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    All Colleges & Universities
                  </Link>
                  
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2"></div>
                  
                  {['Engineering', 'Medical', 'Management', 'MBA', 'Design', 'Law', 'Arts'].map((stream) => (
                    <button 
                      key={stream}
                      onClick={() => handleStreamFilter(stream)}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-[#173974] rounded-lg transition-all duration-300 font-medium"
                    >
                      {stream}
                    </button>
                  ))}
                </div>
              </div>
              
              <Link href="/about" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                isActivePath('/about')
                  ? isScrolled 
                    ? 'text-[#173974] bg-blue-50 border border-blue-200' 
                    : 'text-blue-300 bg-white/20 backdrop-blur-sm border border-white/30'
                  : isScrolled 
                    ? 'text-gray-700 hover:text-[#173974] hover:bg-blue-50' 
                    : 'text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm'
              }`}>
                About
              </Link>
              
              <Link href="/contact" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                isActivePath('/contact')
                  ? isScrolled 
                    ? 'text-[#173974] bg-blue-50 border border-blue-200' 
                    : 'text-blue-300 bg-white/20 backdrop-blur-sm border border-white/30'
                  : isScrolled 
                    ? 'text-gray-700 hover:text-[#173974] hover:bg-blue-50' 
                    : 'text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm'
              }`}>
                Contact
              </Link>
              
              <Link href="/scholarships" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                isActivePath('/scholarships')
                  ? isScrolled 
                    ? 'text-[#173974] bg-blue-50 border border-blue-200' 
                    : 'text-blue-300 bg-white/20 backdrop-blur-sm border border-white/30'
                  : isScrolled 
                    ? 'text-gray-700 hover:text-[#173974] hover:bg-blue-50' 
                    : 'text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm'
              }`}>
                Scholarships
              </Link>
<Link href="/language-academy" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
  isActivePath('/language-academy')
    ? isScrolled 
      ? 'text-[#173974] bg-blue-50' 
      : 'text-blue-300 bg-white/20'
    : isScrolled 
      ? 'text-gray-700 hover:text-[#173974] hover:bg-blue-50' 
      : 'text-white/90 hover:text-white hover:bg-white/10'
}`}>
  Language Academy
</Link>

            </nav>

            {/* Enhanced Desktop CTA Button */}
            <div className="hidden lg:flex items-center">
              <a 
                href="tel:+918606004306"
                className="group relative px-5 py-2.5 bg-gradient-to-r from-[#173974] via-blue-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="hidden xl:inline">Admission:</span>
                  <span>860 600 4306</span>
                </span>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </a>
            </div>

            {/* Enhanced Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-blue-50' 
                  : 'text-white hover:bg-white/10 backdrop-blur-sm'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu - NO STREAMS, WITH ACTIVE STATES */}
          {isMenuOpen && (
            <div className="lg:hidden">
              <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl mt-4 p-6 border border-slate-700/50 mx-2 animate-in slide-in-from-top duration-300">
                <nav className="space-y-1">
                  <Link 
  href="/" 
  onClick={() => setIsMenuOpen(false)} 
  className={`flex items-center gap-3 font-medium py-3 px-4 rounded-xl transition-all duration-300 group ${
    isActivePath('/') 
      ? 'text-blue-300 bg-white/20 border border-white/30' 
      : 'text-white hover:text-blue-300 hover:bg-white/10'
  }`}
>
  <div className={`w-2 h-2 rounded-full group-hover:scale-150 transition-transform ${
    isActivePath('/') ? 'bg-blue-400 scale-150' : 'bg-blue-400'
  }`}></div>
  Home
</Link>

<Link 
  href="/colleges" 
  onClick={() => setIsMenuOpen(false)} 
  className={`flex items-center gap-3 font-medium py-3 px-4 rounded-xl transition-all duration-300 group ${
    isActivePath('/colleges') 
      ? 'text-blue-300 bg-white/20 border border-white/30' 
      : 'text-white hover:text-blue-300 hover:bg-white/10'
  }`}
>
  <Sparkles className={`w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform ${
    isActivePath('/colleges') ? 'rotate-12' : ''
  }`} />
  All Colleges & Universities
</Link>

{/* Language Academy Link - Added Here */}
<Link 
  href="/language-academy" 
  onClick={() => setIsMenuOpen(false)} 
  className={`flex items-center gap-3 font-medium py-3 px-4 rounded-xl transition-all duration-300 group ${
    isActivePath('/language-academy') 
      ? 'text-blue-300 bg-white/20 border border-white/30' 
      : 'text-white hover:text-blue-300 hover:bg-white/10'
  }`}
>
  <Globe className={`w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform ${
    isActivePath('/language-academy') ? 'rotate-12' : ''
  }`} />
  Language Academy
</Link>

<Link 
  href="/about" 
  onClick={() => setIsMenuOpen(false)} 
  className={`flex items-center gap-3 font-medium py-3 px-4 rounded-xl transition-all duration-300 group ${
    isActivePath('/about') 
      ? 'text-blue-300 bg-white/20 border border-white/30' 
      : 'text-white hover:text-blue-300 hover:bg-white/10'
  }`}
>
  <div className={`w-2 h-2 rounded-full group-hover:scale-150 transition-transform ${
    isActivePath('/about') ? 'bg-green-400 scale-150' : 'bg-green-400'
  }`}></div>
  About
</Link>

<Link 
  href="/contact" 
  onClick={() => setIsMenuOpen(false)} 
  className={`flex items-center gap-3 font-medium py-3 px-4 rounded-xl transition-all duration-300 group ${
    isActivePath('/contact') 
      ? 'text-blue-300 bg-white/20 border border-white/30' 
      : 'text-white hover:text-blue-300 hover:bg-white/10'
  }`}
>
  <div className={`w-2 h-2 rounded-full group-hover:scale-150 transition-transform ${
    isActivePath('/contact') ? 'bg-yellow-400 scale-150' : 'bg-yellow-400'
  }`}></div>
  Contact
</Link>

<Link 
  href="/scholarships" 
  onClick={() => setIsMenuOpen(false)} 
  className={`flex items-center gap-3 font-medium py-3 px-4 rounded-xl transition-all duration-300 group ${
    isActivePath('/scholarships') 
      ? 'text-blue-300 bg-white/20 border border-white/30' 
      : 'text-white hover:text-blue-300 hover:bg-white/10'
  }`}
>
  <div className={`w-2 h-2 rounded-full group-hover:scale-150 transition-transform ${
    isActivePath('/scholarships') ? 'bg-orange-400 scale-150' : 'bg-orange-400'
  }`}></div>
  Scholarships
</Link>

<Link 
  href="/terms" 
  onClick={() => setIsMenuOpen(false)} 
  className={`flex items-center gap-3 font-medium py-3 px-4 rounded-xl transition-all duration-300 group ${
    isActivePath('/terms') 
      ? 'text-blue-300 bg-white/20 border border-white/30' 
      : 'text-white hover:text-blue-300 hover:bg-white/10'
  }`}
>
  <div className={`w-2 h-2 rounded-full group-hover:scale-150 transition-transform ${
    isActivePath('/terms') ? 'bg-red-400 scale-150' : 'bg-red-400'
  }`}></div>
  Terms & Conditions
</Link>

                  
                  {/* Enhanced Mobile CTA */}
                  <div className="pt-4 border-t border-slate-600/50">
                    <a 
                      href="tel:+918606004306"
                      className="group relative flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#173974] via-blue-600 to-purple-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Admission: 860 600 4306
                      </span>
                      
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    </a>
                  </div>
                </nav>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Spacer to prevent content overlap */}
      <div className="h-16 lg:h-18"></div>
    </>
  );
}
