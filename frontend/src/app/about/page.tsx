'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { 
  Sparkles,
  Eye,
  ChevronRight,
  Users,
  Building,
  Trophy,
  ChevronUp,
  ChevronDown,
  GraduationCap,
  Briefcase,
  Heart,
  Rocket,
  Award,
  CheckCircle,
  Target,
  Globe,
  BookOpen,
  Lightbulb,
  Shield,
  Mail
} from 'lucide-react';

// ✅ FIXED - Added proper TypeScript interfaces
interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
  featured: boolean;
}

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Truncate description for mobile (first 60 characters for 2-card layout)
  const shortDescription = member.description.length > 60 
    ? member.description.substring(0, 60) + '...' 
    : member.description;

  return (
    <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-5 text-center hover:shadow-xl transition-all group">
      {/* Member Image - Smaller on mobile for 2-card layout */}
      <div className="relative mb-2 sm:mb-4">
        <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 p-0.5 sm:p-1">
          <div className="w-full h-full rounded-full overflow-hidden bg-white relative">
            <Image 
              src={member.image}
              alt={`${member.name} - ${member.role}`}
              width={112}
              height={112}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                const fallback = target.parentElement?.querySelector('.fallback-placeholder') as HTMLElement;
                if (target && fallback) {
                  target.style.display = 'none';
                  fallback.style.display = 'flex';
                }
              }}
            />
            <div className="fallback-placeholder absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100 hidden">
              <Users className="w-6 h-6 sm:w-10 sm:h-10 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Member Info - Smaller text for mobile */}
      <h3 className="text-xs sm:text-base font-bold text-gray-900 mb-1 leading-tight">
        {member.name}
      </h3>
      <p className="text-[10px] sm:text-sm text-blue-600 font-semibold mb-2 sm:mb-3">
        {member.role}
      </p>
      
      {/* Description with Read More */}
      <div className="mb-2 sm:mb-4">
        <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed">
          {isExpanded ? member.description : shortDescription}
        </p>
        
        {/* Read More/Less Button */}
        {member.description.length > 60 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 mt-1 sm:mt-2 text-[10px] sm:text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {isExpanded ? (
              <>
                <span>Less</span>
                <ChevronUp className="w-2 h-2 sm:w-3 sm:h-3" />
              </>
            ) : (
              <>
                <span>More</span>
                <ChevronDown className="w-2 h-2 sm:w-3 sm:h-3" />
              </>
            )}
          </button>
        )}
      </div>
      
      {/* Contact Button - Smaller on mobile */}
      <button className="inline-flex items-center gap-1 px-2 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-blue-700 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium hover:shadow-md transition-all group-hover:scale-105 border border-blue-100">
        <Mail className="w-2 h-2 sm:w-3 sm:h-3" />
        <span>Contact</span>
      </button>
    </div>
  );
};


// ✅ ADDED - More TypeScript interfaces for better type safety
interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface StatItem {
  number: string;
  label: string;
  icon: React.ReactNode;
}

interface ValueItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface CountUpState {
  colleges: number;
  courses: number;
  admissions: number;
  placements: number;
}

const AboutPage: React.FC = () => {
  const [activeYear, setActiveYear] = useState<number>(2025);
  const [countUp, setCountUp] = useState<CountUpState>({
    colleges: 0,
    courses: 0,
    admissions: 0,
    placements: 0
  });

  // Counter animation effect
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    const targets: CountUpState = {
      colleges: 500,
      courses: 1000,
      admissions: 5000,
      placements: 1000
    };
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCountUp({
        colleges: Math.floor(targets.colleges * progress),
        courses: Math.floor(targets.courses * progress),
        admissions: Math.floor(targets.admissions * progress),
        placements: Math.floor(targets.placements * progress)
      });
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);
    return () => clearInterval(timer);
  }, []);

  const timeline: TimelineEvent[] = [
    {
      year: 2022,
      title: 'The Beginning',
      description: 'Started with nothing but vision and courage. People doubted - "too young, too early." But we believed.',
      icon: <Heart className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: 'from-pink-500 to-red-500'
    },
    {
      year: 2024,
      title: 'Dream to Reality',
      description: 'Launch of Learn Scape with experienced counsellors, strong management, and digital transformation.',
      icon: <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: 'from-blue-500 to-purple-500'
    },
    {
      year: 2025,
      title: 'Standing Tall',
      description: '500+ colleges, 1000+ courses, 5000+ admissions, and India\'s fastest-growing education ecosystem.',
      icon: <Award className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const stats: StatItem[] = [
    { number: countUp.colleges + '+', label: 'College Partners', icon: <Building className="w-4 h-4 sm:w-6 sm:h-6" /> },
    { number: countUp.courses + '+', label: 'Courses Available', icon: <BookOpen className="w-4 h-4 sm:w-6 sm:h-6" /> },
    { number: countUp.admissions + '+', label: 'Successful Admissions', icon: <GraduationCap className="w-4 h-4 sm:w-6 sm:h-6" /> },
    { number: countUp.placements + '+', label: 'Students Placed', icon: <Briefcase className="w-4 h-4 sm:w-6 sm:h-6" /> }
  ];

  const values: ValueItem[] = [
    {
      icon: <Heart className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: 'Student First',
      description: 'Every decision prioritizes student success and career growth'
    },
    {
      icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: 'Trust & Integrity',
      description: 'Building lifelong relationships through transparent guidance'
    },
    {
      icon: <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: 'Innovation',
      description: 'AI-driven solutions for smarter education choices'
    },
    {
      icon: <Globe className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: 'Global Vision',
      description: 'Connecting Indian students to worldwide opportunities'
    }
  ];

  // ✅ FIXED - Added proper typing for team members
  const teamMembers: TeamMember[] = [
    {
      name: 'Shibin Chacko Abraham',
      role: 'Managing Director',
      image: '/about/Shibin.JPG',
      description: 'A dedicated professional with a strong career in the education sector. Consistently delivers excellence with passion and commitment. Plays a key role in driving Learn Scape\'s growth and success. Known for his performance, dedication, and strategic support. Contributes to shaping a stronger future for the organization.',
      featured: false
    },
    {
  name: 'Anurag Prasad',
  role: 'Marketing Director',
  image: '/about/anu.jpg',
  description: 'A passionate marketing professional with 4 years of experience in the education industry. Specializes in developing innovative strategies that drive growth and visibility. Brings creativity and dedication to every campaign and initiative. Focused on strengthening Learn Scape\'s brand and market presence. Plays a vital role in shaping the company\'s success story.',
  featured: true
},
    {
      name: 'Lakshmi rajesh',
      role: 'Senior Sales Manager',
      image: '/about/lak.jpg',
      description: 'A passionate professional with expertise in sales and client relations.Contributes innovative and strategic ideas to drive company growth.Dedicated to developing strong sales channels and opportunities.Known for his commitment, energy, and results-driven approach.Plays a vital role in expanding Learn Scape’s reach and success.',
      featured: false
    },
   {
      name: 'Mohammad Rishad',
      role: 'Digital Marketing Executive',
      image: '/about/Rishad.jpg',
      description: 'An experienced professional in digital marketing. Specializes in designing and managing social media platforms. Brings creativity and precision to every campaign. Supports Learn Scape\'s growth through digital engagement. Plays a key role in strengthening the brand\'s online presence.',
      featured: false
    }

  ];
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse delay-700"></div>
      </div>

      {/* Hero Section - Our Story - IMPROVED MOBILE ALIGNMENT */}
      <div className="relative pt-16 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-10 border border-blue-500/20 text-center">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm mb-4 sm:mb-6">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400" />
              <span className="text-[10px] sm:text-xs font-semibold text-blue-300 uppercase tracking-wider">Our Story</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              <span className="block text-white mb-1 sm:mb-2">From Zero to</span>
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-xl sm:blur-2xl opacity-50"></span>
                <span className="relative bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Education Ecosystem
                </span>
              </span>
            </h1>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                In 2022, we started with nothing but a vision and courage. People laughed, they doubted — <em>&quot;too young, too early.&quot;</em> But we believed. Step by step, we built trust, structure, and a name in the industry.
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed mb-6 sm:mb-8">
                By 2024, the midnight dream turned into reality — the launch of Learn Scape. With experienced counsellors, strong management, and digital transformation, we broke barriers and set new standards in education.
              </p>
              
              {/* IMPROVED MOBILE STATS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 my-6 sm:my-8">
                <div className="flex flex-col items-center">
                  <div className="text-sm sm:text-lg lg:text-xl font-bold text-blue-400">500+</div>
                  <div className="text-[10px] sm:text-xs text-slate-400 text-center">College Partners</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-sm sm:text-lg lg:text-xl font-bold text-purple-400">1000+</div>
                  <div className="text-[10px] sm:text-xs text-slate-400 text-center">Courses</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-sm sm:text-lg lg:text-xl font-bold text-green-400">5000+</div>
                  <div className="text-[10px] sm:text-xs text-slate-400 text-center">Admissions</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-sm sm:text-lg lg:text-xl font-bold text-yellow-400">1000+</div>
                  <div className="text-[10px] sm:text-xs text-slate-400 text-center">Students Placed</div>
                </div>
                <div className="flex flex-col items-center col-span-2 sm:col-span-1">
                  <div className="text-sm sm:text-lg lg:text-xl font-bold text-pink-400">10+</div>
                  <div className="text-[10px] sm:text-xs text-slate-400 text-center">Sub-offices in Kerala</div>
                </div>
              </div>
              
              <blockquote className="text-sm sm:text-base lg:text-lg xl:text-xl font-medium text-white/90 italic border-l-2 sm:border-l-4 border-blue-500 bg-blue-500/10 p-3 sm:p-4 lg:p-6 rounded-lg">
                &quot;We started as dreamers. Today, we are India&apos;s fastest-growing education ecosystem. Tomorrow, we will be unstoppable.&quot;
              </blockquote>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Our Mission</h2>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-300">Guide students with AI-driven career mapping, ensuring education aligns with passion and purpose</p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-300">Deliver continuously updated, industry-relevant courses for lifelong employability</p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-300">Bridge global opportunities through language academies and advanced learning pathways</p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-300">Empower millions by making education smarter, accessible, and transformative</p>
              </li>
            </ul>
          </div>

          {/* Vision */}
          <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Our Vision</h2>
            </div>
            <p className="text-slate-300 leading-relaxed mb-6">
              To become India&apos;s largest and most trusted education ecosystem, offering admissions, 
              updated courses, and lifelong learning opportunities that transform lives and careers.
            </p>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
              <p className="text-xs text-slate-400 mb-2">By 2030, we aim to:</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <ChevronRight className="w-4 h-4 text-purple-400" />
                  Impact 10 million+ students
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <ChevronRight className="w-4 h-4 text-purple-400" />
                  Partner with 5000+ institutions
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <ChevronRight className="w-4 h-4 text-purple-400" />
                  Create 1 million+ career success stories
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Founder & CEO Highlight Card - Dark Glass */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-slate-700/50">
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-800/30 to-transparent rounded-2xl sm:rounded-3xl"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
            {/* CEO Image */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 relative rounded-full overflow-hidden border-2 border-purple-400/50 shadow-xl bg-gradient-to-br from-purple-600 to-blue-600">
                <Image 
                  src="/about/ceo.JPG"
                  alt="Kevin C Philipose - Founder & CEO"
                  width={192}
                  height={192}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  priority
                />
                {/* Fallback overlay in case image doesn't load */}
                <div className="absolute inset-1 sm:inset-2 bg-slate-900/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-purple-400/30 opacity-0 hover:opacity-100 transition-opacity">
                  <Users className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-purple-200" />
                </div>
              </div>
              {/* Professional badge */}
              <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-lg">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
            
            {/* CEO Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 drop-shadow-lg">
                Kevin C Philipose
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-purple-300 font-semibold mb-3 sm:mb-4">
                Founder &amp; CEO – Learn Scape
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-slate-300 mb-4 sm:mb-6 leading-relaxed">
                Kevin C Philipose is a visionary leader with deep expertise in the education sector. As the Founder &amp; CEO of Learn Scape, he pioneered India&apos;s first integrated education ecosystem, dedicated to empowering students and enabling strong, sustainable careers.
              </p>
              <p className="text-sm sm:text-base text-slate-400 mb-4 sm:mb-6 leading-relaxed">
                With his strategic leadership and visionary approach, he continues to drive innovation, growth, and long-term impact in the education industry.
              </p>
              
              {/* CEO Achievements */}
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-xs sm:text-sm font-medium border border-purple-500/30">
                  <Rocket className="w-3 h-3" />
                  Innovation Leader
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-xs sm:text-sm font-medium border border-blue-500/30">
                  <Target className="w-3 h-3" />
                  Strategic Visionary
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-green-500/20 text-green-300 rounded-full text-xs sm:text-sm font-medium border border-green-500/30">
                  <GraduationCap className="w-3 h-3" />
                  Education Pioneer
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
{/* Team Section - UPDATED for mobile 2 cards per row */}
<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
  <div className="text-center mb-8 sm:mb-12">
    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Our Leadership Team</h2>
    <p className="text-slate-400 text-sm sm:text-base lg:text-lg">Experienced professionals driving our mission</p>
  </div>
  
  {/* ✅ UPDATED - Changed from grid-cols-1 to grid-cols-2 for mobile */}
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
    {teamMembers.map((member, index) => (
      <TeamMemberCard 
        key={index}
        member={member}
      />
    ))}
  </div>
</div>


{/* Awards & Recognition Section - IMPROVED DESIGN */}
<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
  <div className="text-center mb-8 sm:mb-12">
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 backdrop-blur-sm mb-4 sm:mb-6">
      <Award className="w-4 h-4 text-yellow-400" />
      <span className="text-xs font-semibold text-yellow-300 uppercase tracking-wider">Awards & Recognition</span>
    </div>
    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Industry Recognition</h2>
    <p className="text-slate-400 text-sm sm:text-base lg:text-lg">Honored for excellence in education consultancy</p>
  </div>
  
  {/* Clean Award Card */}
  <div className="max-w-5xl mx-auto">
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
      
      {/* Award Header */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-6 sm:p-8 border-b border-yellow-500/20">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
              Best Education Consultancy Award 2025
            </h3>
            <p className="text-lg sm:text-xl font-semibold text-yellow-300">Business Insight Magazine</p>
          </div>
        </div>
      </div>

      {/* Award Content */}
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Award Description */}
          <div className="space-y-6">
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Recognized by Business Insight Magazine as the <strong className="text-yellow-300">Best Education Consultancy</strong> for our innovative approach, exceptional student guidance, and transformative impact on India&apos;s education landscape.
            </p>
           

            {/* Key Highlights */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white mb-3">Recognition Highlights:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm text-slate-300">Excellence in Educational Consultancy Services</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-sm text-slate-300">Innovation in AI-Driven Career Mapping</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span className="text-sm text-slate-300">Outstanding Student Success Stories</span>
                </div>
              </div>
            </div>
          </div>

          {/* Award Ceremony Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
              <Image 
                src="/about/award-ceremony.jpg"
                alt="Business Insight Best Education Consultancy Award 2025 Ceremony"
                width={500}
                height={400}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                priority
              />
              
              {/* Simple overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent"></div>
              
              {/* Award label */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <p className="text-sm font-semibold text-gray-900 text-center">Award Ceremony 2025</p>
                </div>
              </div>
            </div>
            
            {/* Decorative badge */}
            <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <div className="bg-slate-800/30 rounded-xl p-4 sm:p-6 text-center">
            <div className="text-4xl text-yellow-400 mb-2">&ldquo;</div>
            <p className="text-sm sm:text-base text-slate-300 italic max-w-3xl mx-auto">
              Learn Scape has set new benchmarks in education consultancy through their student-first approach, 
              innovative solutions, and remarkable track record of successful career transformations.
            </p>
            <p className="text-xs sm:text-sm text-yellow-300 font-semibold mt-3">— Business Insight Editorial Team</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Journey Timeline */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Our Journey</h2>
          <p className="text-slate-400">From humble beginnings to industry leadership</p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full hidden lg:block"></div>

          {/* Timeline Events */}
          <div className="space-y-12">
            {timeline.map((event, index) => (
              <div key={index} className={`flex flex-col lg:flex-row items-center gap-8 ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <div className={`bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800 hover:border-slate-700 transition-all ${index % 2 === 0 ? 'lg:text-right' : ''}`}>
                    <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? 'lg:justify-end' : ''}`}>
                      <div className={`p-2 bg-gradient-to-r ${event.color} rounded-lg text-white`}>
                        {event.icon}
                      </div>
                      <span className="text-2xl font-bold text-white">{event.year}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
                    <p className="text-sm text-slate-400">{event.description}</p>
                  </div>
                </div>

                {/* Center Circle */}
                <div className="relative">
                  <button
                    onClick={() => setActiveYear(event.year)}
                    className={`w-12 h-12 rounded-full bg-gradient-to-r ${event.color} flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform ${activeYear === event.year ? 'scale-125' : ''}`}
                  >
                    {event.year.toString().slice(-2)}
                  </button>
                </div>

                <div className="flex-1 hidden lg:block"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Stats Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Our Impact</h2>
          <p className="text-slate-400 text-sm sm:text-base lg:text-lg">Numbers that define our success story</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-800 hover:border-slate-700 transition-all group text-center">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl text-blue-400 mb-3 sm:mb-4 inline-block group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">{stat.number}</h3>
              <p className="text-xs sm:text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Core Values */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Our Values</h2>
          <p className="text-slate-400 text-sm sm:text-base lg:text-lg">Principles that guide every decision</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {values.map((value, index) => (
            <div key={index} className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700 hover:border-blue-500/50 transition-all group">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl text-blue-400 mb-3 sm:mb-4 inline-block group-hover:scale-110 transition-transform">
                {value.icon}
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">{value.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
<div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 text-center">
    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
      Join India&apos;s Education Revolution
    </h2>
    <p className="text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
      Be part of the ecosystem that&apos;s transforming education and creating success stories every day.
    </p>
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
      <Link 
        href="/colleges"
        className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-xl font-semibold text-sm sm:text-base hover:shadow-lg transition-all"
      >
        Explore Colleges
      </Link>
      <Link 
        href="/contact"
        className="px-6 sm:px-8 py-3 sm:py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/30 hover:bg-white/30 transition-all text-sm sm:text-base"
      >
        Partner With Us
      </Link>
    </div>
  </div>
</div>

    </div>
  );
};

export default AboutPage;
