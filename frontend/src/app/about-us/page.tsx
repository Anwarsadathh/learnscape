'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles,
  Target,
  Eye,
  Users,
  Building,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Award,
  CheckCircle,
  Heart,
  Rocket,
  Globe,
  BookOpen,
  Lightbulb,
  Shield,
  ChevronRight
} from 'lucide-react';

const AboutPage = () => {
  const [activeYear, setActiveYear] = useState(2025);
  const [countUp, setCountUp] = useState({
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
    
    const targets = {
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

  const timeline = [
    {
      year: 2022,
      title: 'The Beginning',
      description: 'Started with nothing but vision and courage. People doubted - "too young, too early." But we believed.',
      icon: <Heart className="w-5 h-5" />,
      color: 'from-pink-500 to-red-500'
    },
    {
      year: 2024,
      title: 'Dream to Reality',
      description: 'Launch of Learn Scape with experienced counsellors, strong management, and digital transformation.',
      icon: <Rocket className="w-5 h-5" />,
      color: 'from-blue-500 to-purple-500'
    },
    {
      year: 2025,
      title: 'Standing Tall',
      description: '500+ colleges, 1000+ courses, 5000+ admissions, and India\'s fastest-growing education ecosystem.',
      icon: <Award className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500'
    }
  ];

 
  const stats = [
    { number: countUp.colleges + '+', label: 'College Partners', icon: <Building className="w-6 h-6" /> },
    { number: countUp.courses + '+', label: 'Courses Available', icon: <BookOpen className="w-6 h-6" /> },
    { number: countUp.admissions + '+', label: 'Successful Admissions', icon: <GraduationCap className="w-6 h-6" /> },
    { number: countUp.placements + '+', label: 'Students Placed', icon: <Briefcase className="w-6 h-6" /> }
  ];

  const values = [
    {
      icon: <Heart className="w-5 h-5" />,
      title: 'Student First',
      description: 'Every decision prioritizes student success and career growth'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Trust & Integrity',
      description: 'Building lifelong relationships through transparent guidance'
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: 'Innovation',
      description: 'AI-driven solutions for smarter education choices'
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: 'Global Vision',
      description: 'Connecting Indian students to worldwide opportunities'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse delay-700"></div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider">Our Story</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
              <span className="block text-white mb-2">From Zero to</span>
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-2xl opacity-50"></span>
                <span className="relative bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Education Ecosystem
                </span>
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              We started as dreamers. Today, we are India&apos;s fastest-growing education ecosystem. 
              Tomorrow, we will be unstoppable.
            </p>
          </div>
        </div>
      </div>

      {/* Live Stats Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800 hover:border-slate-700 transition-all group">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.number}</h3>
                <p className="text-xs sm:text-sm text-slate-400">{stat.label}</p>
              </div>
            </div>
          ))}
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

      {/* Founder & CEO Section - Special Highlight */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Visionary Behind Learn Scape</h2>
        </div>

        {/* Founder & CEO Big Card */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-purple-500/30 hover:border-purple-500/50 transition-all">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Profile Image */}
              <div className="md:col-span-1 flex justify-center">
                <div className="relative">
                  <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-2xl">
                    <div className="w-36 h-36 sm:w-44 sm:h-44 bg-slate-900 rounded-full flex items-center justify-center">
                      <Users className="w-20 h-20 text-white" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                    <p className="text-xs font-bold text-white">Founder & CEO</p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="md:col-span-2 text-center md:text-left">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Rajesh Kumar</h3>
                <p className="text-slate-300 leading-relaxed mb-6">
                  From a vision in 2022 to building India&apos;s fastest-growing education ecosystem, 
                  our founder has transformed the way students discover their educational journey. 
                  Breaking age barriers and industry skepticism, proving that passion and persistence 
                  can rewrite the rules of education.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                    <p className="text-xs text-slate-400">Since</p>
                    <p className="text-lg font-bold text-white">2022</p>
                  </div>
                  <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                    <p className="text-xs text-slate-400">Students Impacted</p>
                    <p className="text-lg font-bold text-white">5000+</p>
                  </div>
                  <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                    <p className="text-xs text-slate-400">Vision</p>
                    <p className="text-lg font-bold text-white">10M by 2030</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of Leadership Team - Smaller Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 text-center hover:shadow-xl transition-all group">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mx-auto mb-3 flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <p className="text-xs text-green-600 font-bold">Managing Director</p>
            <p className="text-[10px] text-gray-600 mt-1">Strategic Operations</p>
          </div>

          <div className="bg-white rounded-xl p-4 text-center hover:shadow-xl transition-all group">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-3 flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
            <p className="text-xs text-purple-600 font-bold">Director</p>
            <p className="text-[10px] text-gray-600 mt-1">Innovation & Growth</p>
          </div>

          <div className="bg-white rounded-xl p-4 text-center hover:shadow-xl transition-all group">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mx-auto mb-3 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <p className="text-xs text-blue-600 font-bold">Digital Marketing Head</p>
            <p className="text-[10px] text-gray-600 mt-1">Brand & Digital Presence</p>
          </div>

          <div className="bg-white rounded-xl p-4 text-center hover:shadow-xl transition-all group">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-400 rounded-full mx-auto mb-3 flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <p className="text-xs text-orange-600 font-bold">Senior Sales Manager</p>
            <p className="text-[10px] text-gray-600 mt-1">Partnerships & Revenue</p>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Our Values</h2>
          <p className="text-slate-400">Principles that guide every decision</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div key={index} className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all group">
              <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl text-blue-400 mb-4 inline-block group-hover:scale-110 transition-transform">
                {value.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
              <p className="text-sm text-slate-400">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Join India&apos;s Education Revolution
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Be part of the ecosystem that&apos;s transforming education and creating success stories every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-lg transition-all">
              Explore Colleges
            </button>
            <button className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/30 hover:bg-white/30 transition-all">
              Partner With Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;