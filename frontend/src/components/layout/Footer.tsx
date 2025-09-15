'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Mail, Phone, ArrowRight,
  Facebook,  Instagram, Linkedin,
  GraduationCap, Zap
} from 'lucide-react';

// TypeScript interface for college data
interface College {
  _id: string;
  name: string;
  locations?: string[];
  streams?: string[];
  courses?: Array<{
    id: string;
    name: string;
    duration: string;
    fees: string;
    level: string;
    description?: string;
  }>;
  brochure?: string;
  positions?: number;
  rating?: number;
  ranking?: number;
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  
  const quickLinks = [
    { name: 'Top University', href: '/colleges' },
    { name: 'Scholarship Form', href: '/scholarships' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  // Fetch colleges/universities dynamically
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://learnscapeedu.com/api';
        const response = await fetch(`${API_URL}/colleges`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          // Limit to first 6 colleges for footer display
          setColleges(data.data.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching colleges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
          }}
        />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section with Logo Only */}
          <div className="space-y-6">
            <Link href="/" className="block group">
              {/* Logo Only - No Text */}
              <div className="relative">
               <Image
  src="/logo.png"
  alt="Company Logo"
  width={120}
  height={40}
  style={{ filter: 'brightness(0) invert(1)' }}
  className="group-hover:scale-105 transition-transform duration-300"
  priority
/>

              </div>
            </Link>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Empowering students to make informed decisions about their educational journey with expert guidance.
            </p>
           
            {/* Social Links with Instagram */}
            <div className="flex gap-2">
              <a
                href="https://www.instagram.com/learn_scape_?igsh=b2I1YWpnbm5zYjk="
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-pink-600 hover:border-transparent transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-blue-600 hover:border-transparent transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
          
              <a
                href="#"
                className="p-2 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-blue-700 hover:border-transparent transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links - WITH ICON BEFORE HEADING */}
          <div className="space-y-4">
            {/* Heading with Icon */}
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" />
              Quick Links
            </h4>
            
            {/* List items WITHOUT icons */}
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dynamic Top Colleges & Universities */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              Top Institutions
            </h4>
            
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 bg-slate-800 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <ul className="space-y-2">
                {colleges.map((college) => (
                  <li key={college._id}>
                    <Link 
                      href={`/colleges/${college._id}`}
                      className="text-sm text-slate-400 hover:text-white transition-colors block"
                      title={college.name}
                    >
                      <span className="truncate">
                        {college.name.length > 25 ? `${college.name.substring(0, 25)}...` : college.name}
                      </span>
                    </Link>
                  </li>
                ))}
                
                {/* View All Link */}
                <li className="pt-2 border-t border-slate-800">
                  <Link 
                    href="/colleges"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 group font-medium"
                  >
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    <span>View All Colleges</span>
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-400" />
              Contact Info
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-500">Admission</p>
                  <p className="text-sm font-semibold text-white">860 6004 306</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-green-400" />
                <div>
                  <p className="text-xs text-slate-500">Head Office</p>
                  <p className="text-sm font-semibold text-white">799 4086 809</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-purple-400" />
                <div>
                  <p className="text-xs text-slate-500">Business</p>
                  <p className="text-sm font-semibold text-white">907 2102 121</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <a 
                    href="mailto:learnscapeinfo@gmail.com" 
                    className="text-sm font-semibold text-white hover:text-blue-400 transition-colors"
                  >
                    learnscapeinfo@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
         <div className="flex flex-col md:flex-row items-center justify-between gap-4">
  <p className="text-xs text-slate-500 text-center md:text-left">
    &copy; {currentYear} LearnScape Education. All rights reserved.
  </p>
  
  <div className="flex items-center gap-4 sm:gap-6">
    <Link href="/privacy" className="text-xs text-slate-500 hover:text-white transition-colors">
      Privacy Policy
    </Link>
    <Link href="/terms" className="text-xs text-slate-500 hover:text-white transition-colors">
      Terms of Service
    </Link>
  </div>
  
  <div className="text-xs text-slate-400">
    Powered By{' '}
    <Link 
      href="https://whatisnext.in" 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
    >
      WhatIsNext
    </Link>
  </div>
</div>

        </div>
      </div>
    </footer>
  );
}
