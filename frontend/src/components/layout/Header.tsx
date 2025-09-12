'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  
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
    setIsMenuOpen(false); // Close mobile menu if open
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Image with Conditional Filter */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo.png"
              alt="Company Logo"
              width={120}
              height={40}
              className="object-contain group-hover:scale-105 transition-transform duration-300"
              priority
              style={{ 
                filter: isScrolled ? 'none' : 'brightness(0) invert(1)'
              }} 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className={`text-sm font-medium transition-colors ${
              isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'
            }`}>
              Home
            </Link>
            
            <div className="relative group">
              <button className={`text-sm font-medium transition-colors flex items-center ${
                isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'
              }`}>
                Colleges <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              <div className="absolute top-full left-0 bg-white rounded-lg shadow-xl p-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 min-w-48 z-50">
                <Link href="/colleges" className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
                  All Colleges and Universities
                </Link>
                <button 
                  onClick={() => handleStreamFilter('Engineering')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
                >
                  Engineering
                </button>
                <button 
                  onClick={() => handleStreamFilter('Medical')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
                >
                  Medical
                </button>
                <button 
                  onClick={() => handleStreamFilter('Management')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
                >
                  Management
                </button>
                <button 
                  onClick={() => handleStreamFilter('MBA')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
                >
                  MBA
                </button>
                <button 
                  onClick={() => handleStreamFilter('Design')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
                >
                  Design
                </button>
                <button 
                  onClick={() => handleStreamFilter('Law')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
                >
                  Law
                </button>
                <button 
                  onClick={() => handleStreamFilter('Arts')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
                >
                  Arts
                </button>
              </div>
            </div>
            
            <Link href="/about" className={`text-sm font-medium transition-colors ${
              isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'
            }`}>
              About
            </Link>
            
            <Link href="/contact" className={`text-sm font-medium transition-colors ${
              isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'
            }`}>
              Contact
            </Link>
              <Link href="/scholarships" className={`text-sm font-medium transition-colors ${
              isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'
            }`}>
              Scholarship Form
            </Link>


           
          </nav>

          {/* Desktop Admission Phone */}
          <div className="hidden lg:flex items-center">
            <a 
              href="tel:+918606004306"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Admission: 860 600 4306
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 rounded-lg ${isScrolled ? 'text-gray-700' : 'text-white'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Enhanced Mobile Menu with Glass Effect */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl mt-4 p-6 border border-slate-700/50 mx-2">
              <nav className="space-y-2">
                <Link 
                  href="/" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="block text-white hover:text-blue-300 hover:bg-white/10 font-medium py-3 px-4 rounded-xl transition-all duration-300"
                >
                  Home
                </Link>
                
                <Link 
                  href="/colleges" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="block text-white hover:text-blue-300 hover:bg-white/10 font-medium py-3 px-4 rounded-xl transition-all duration-300"
                >
                  All Colleges and Universities
                </Link>
                
                <Link 
                  href="/courses" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="block text-white hover:text-blue-300 hover:bg-white/10 font-medium py-3 px-4 rounded-xl transition-all duration-300"
                >
                  Courses
                </Link>
                
                <Link 
                  href="/about" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="block text-white hover:text-blue-300 hover:bg-white/10 font-medium py-3 px-4 rounded-xl transition-all duration-300"
                >
                  About
                </Link>
                
                <Link 
                  href="/contact" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="block text-white hover:text-blue-300 hover:bg-white/10 font-medium py-3 px-4 rounded-xl transition-all duration-300"
                >
                  Contact
                </Link>
  
                <Link 
                  href="/scholarships" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="block text-white hover:text-blue-300 hover:bg-white/10 font-medium py-3 px-4 rounded-xl transition-all duration-300"
                >
                  Scholarship Form
                </Link>
              
                <Link 
                  href="/terms" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="block text-white hover:text-blue-300 hover:bg-white/10 font-medium py-3 px-4 rounded-xl transition-all duration-300"
                >
                  Terms & Conditions
                </Link>
                
               
                
                {/* Mobile Admission Phone - Enhanced */}
                <div className="pt-4 border-t border-slate-600/50">
                  <a 
                    href="tel:+918606004306"
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <Phone className="w-4 h-4" />
                    Admission: 860 600 4306
                  </a>
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
