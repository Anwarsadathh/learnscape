'use client';

import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  BookOpen, 
  Award, 
  Plane, 
  Clock, 
  MessageCircle,
  Sparkles,
  ArrowRight,
  CheckCircle,
  LucideIcon
} from 'lucide-react';

interface Program {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
}

const LanguageAcademy = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const programs: Program[] = [
    {
      title: "Spoken English",
      description: "Master fluency & confidence",
      icon: MessageCircle,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30"
    },
    {
      title: "IELTS Preparation",
      description: "Achieve your target band score",
      icon: Award,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30"
    },
    {
      title: "OET Training",
      description: "Healthcare professionals' pathway",
      icon: BookOpen,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30"
    },
    {
      title: "German Language",
      description: "From A1 to C2 proficiency",
      icon: Globe,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30"
    }
  ];

  const features = [
    "Expert Native Trainers",
    "Flexible Batch Timings",
    "Mock Tests & Assessments",
    "Study Abroad Guidance",
    "Visa Assistance",
    "100% Placement Support"
  ];

  // Auto-advance functionality for mobile carousel
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % programs.length);
    }, 4000); // Auto advance every 4 seconds

    return () => clearInterval(interval);
  }, [isPlaying, programs.length]);

  const goToSlide = (index: number) => {
    setIsPlaying(false);
    setActiveIndex(index);
    
    // Resume autoplay after 8 seconds of no interaction
    setTimeout(() => {
      setIsPlaying(true);
    }, 8000);
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = "919876543210";
    const message = encodeURIComponent("Hi! I'm interested in LearnScape Language Academy courses. Please share more details.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - ✅ SMALLER Mobile Fonts */}
        <div className="text-center mb-6 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 backdrop-blur-sm mb-3 sm:mb-4 animate-pulse">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
            <span className="text-[9px] sm:text-xs font-bold text-yellow-300 uppercase tracking-wider">Coming Soon</span>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
          </div>
          
          {/* ✅ SMALLER Mobile Fonts */}
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4 leading-tight">
            LearnScape <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Language Academy</span>
          </h2>
          
          <p className="text-sm sm:text-lg lg:text-xl text-blue-300 font-semibold mb-2">
            & Abroad Studies Program
          </p>
          
          <p className="text-slate-400 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            Master global languages and unlock international opportunities with our comprehensive training programs
          </p>
        </div>

        {/* Programs - Desktop Grid / Mobile Carousel */}
        <div className="mb-8 sm:mb-10">
          {/* Desktop Grid */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
            {programs.map((program, index) => {
              const Icon = program.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-5 hover:bg-slate-800/70 hover:border-slate-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                  
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${program.bgColor} border ${program.borderColor} mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-white font-bold text-base mb-1">
                    {program.title}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {program.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ✅ NEW - Mobile Carousel */}
          <div className="sm:hidden relative max-w-xs mx-auto">
            <div className="overflow-hidden rounded-xl">
              <div 
                className="flex transition-transform duration-700 ease-in-out" 
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {programs.map((program, index) => {
                  const Icon = program.icon;
                  return (
                    <div key={index} className="w-full flex-shrink-0 px-1">
                      <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-4 max-w-xs mx-auto">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl" />
                        
                        <div className="text-center">
                          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${program.bgColor} border ${program.borderColor} mb-3`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          
                          <h3 className="text-white font-bold text-sm mb-1">
                            {program.title}
                          </h3>
                          <p className="text-slate-400 text-xs">
                            {program.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ✅ Modern Slash/Line Indicators */}
            <div className="flex items-center justify-center gap-1 mt-4">
              {programs.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`relative h-0.5 transition-all duration-500 overflow-hidden ${
                    index === activeIndex 
                      ? 'w-6 bg-gradient-to-r from-blue-400 to-purple-400 shadow-lg shadow-blue-400/30' 
                      : 'w-3 bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  {/* Animated shimmer effect for active indicator */}
                  {index === activeIndex && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] animate-pulse"></div>
                  )}
                </button>
              ))}
              
              {/* Counter Display */}
              <div className="ml-2 text-[10px] text-slate-400 font-mono">
                {String(activeIndex + 1).padStart(2, '0')}/{String(programs.length).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section - ✅ SMALLER Mobile Fonts */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-700 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-10">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            <h3 className="text-base sm:text-xl font-bold text-white">Why Choose Our Academy?</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                <span className="text-slate-300 text-xs sm:text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Launch Timeline - ✅ SMALLER Mobile Fonts */}
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-full border border-blue-500/30">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 animate-pulse" />
            <span className="text-white font-semibold text-xs sm:text-base">Launching Soon!</span>
          </div>
        </div>

        {/* CTA Section - ✅ SMALLER Mobile Fonts */}
        <div className="text-center">
          <p className="text-slate-400 mb-4 sm:mb-6 text-xs sm:text-base leading-relaxed max-w-md sm:max-w-2xl mx-auto">
            Be among the first to enroll! Get exclusive early-bird discounts and priority batch selection.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            {/* WhatsApp Button - ✅ SMALLER Mobile Size */}
            <button
              onClick={handleWhatsAppClick}
              className="group relative w-full max-w-xs sm:w-auto px-4 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-xs sm:text-base overflow-hidden transition-all hover:shadow-2xl hover:shadow-green-500/30 transform hover:scale-[1.02]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg 
                  className="w-4 h-4 sm:w-5 sm:h-5" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>Enquire on WhatsApp</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            </button>
          </div>
        </div>

        {/* Bottom Info - ✅ SMALLER Mobile Fonts */}
        <div className="mt-6 sm:mt-10 text-center">
          <p className="text-[9px] sm:text-xs text-slate-500">
            Limited seats available • Certified trainers • Proven success record
          </p>
        </div>
      </div>
    </section>
  );
};

export default LanguageAcademy;
