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
  LucideIcon,
  Zap
} from 'lucide-react';

interface Program {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  animation: string;
}

const LanguageAcademy = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const programs: Program[] = [
    {
      title: "Spoken English",
      description: "Master fluency & confidence in communication",
      icon: MessageCircle,
      color: "from-[#173974] to-blue-600",
      bgColor: "bg-gradient-to-r from-[#173974]/10 to-blue-500/10",
      borderColor: "border-[#173974]/20",
      animation: "animate-pulse"
    },
    {
      title: "IELTS Preparation",
      description: "Achieve your target band score with expert guidance",
      icon: Award,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-gradient-to-r from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-200",
      animation: "animate-bounce"
    },
    {
      title: "OET Training",
      description: "Healthcare professionals' pathway to success",
      icon: BookOpen,
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-gradient-to-r from-emerald-500/10 to-teal-500/10",
      borderColor: "border-emerald-200",
      animation: "animate-ping"
    },
    {
      title: "German Language",
      description: "From A1 to C2 proficiency levels",
      icon: Globe,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-gradient-to-r from-orange-500/10 to-red-500/10",
      borderColor: "border-orange-200",
      animation: "animate-spin"
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
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, programs.length]);

  const goToSlide = (index: number) => {
    setIsPlaying(false);
    setActiveIndex(index);
    
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
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Premium Background Effects - Matching Other Sections */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-40 h-40 bg-[#173974]/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-purple-500/8 rounded-full blur-3xl animate-pulse delay-700"></div>
        
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, #173974 0px, transparent 1px, transparent 99px, #173974 100px),
                             repeating-linear-gradient(90deg, #173974 0px, transparent 1px, transparent 99px, #173974 100px)`
          }}
        ></div>
        
        <div className="absolute top-32 right-1/4 w-2 h-2 bg-[#173974]/30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-purple-500/30 rounded-full animate-pulse delay-300"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium Section Header - Matching Style */}
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-yellow-100/80 to-orange-100/80 border border-yellow-300/50 backdrop-blur-sm mb-3 sm:mb-4 group hover:scale-105 transition-transform">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold text-yellow-700 uppercase tracking-wider">Coming Soon</span>
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600 animate-pulse" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
            LearnScape
            <span className="bg-gradient-to-r from-[#173974] via-blue-600 to-purple-600 bg-clip-text text-transparent ml-2 relative">
              Language Academy
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#173974] to-purple-600 animate-pulse"></div>
            </span>
          </h2>
          
          <p className="text-sm sm:text-lg lg:text-xl text-blue-600 font-semibold mb-2">
            & Abroad Studies Program
          </p>
          
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Master global languages and unlock international opportunities with our comprehensive training programs
          </p>
        </div>

        {/* Programs - Desktop Grid / Mobile Carousel */}
        <div className="mb-8 sm:mb-10">
          {/* Desktop Grid */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {programs.map((program, index) => {
              const Icon = program.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl border-2 border-gray-100 hover:border-[#173974]/30 shadow-xl hover:shadow-2xl p-5 sm:p-6 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 overflow-hidden"
                >
                  {/* Animated gradient glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#173974] via-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 pointer-events-none"></div>
                  
                  <div className="relative">
                    {/* Icon with Continuous Animation */}
                    <div className="mb-4">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${program.bgColor} border ${program.borderColor} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg relative`}>
                        <div className={`${program.animation}`} style={{
                          animationDuration: index === 0 ? '2s' : 
                                           index === 1 ? '1.5s' : 
                                           index === 2 ? '1s' : 
                                           '3s'
                        }}>
                          <Icon className="w-5 h-5 text-gray-700" />
                        </div>
                        
                        {/* Orbiting dot */}
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping" style={{
                          animationDelay: `${index * 0.5}s`
                        }}></div>
                      </div>
                    </div>
                    
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:bg-gradient-to-r group-hover:from-[#173974] group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                      {program.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {program.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Carousel */}
          <div className="sm:hidden relative max-w-sm mx-auto">
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-700 ease-in-out" 
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {programs.map((program, index) => {
                  const Icon = program.icon;
                  return (
                    <div key={index} className="w-full flex-shrink-0 px-1">
                      <div className="relative bg-white rounded-2xl border-2 border-gray-100 shadow-xl p-5 max-w-sm mx-auto overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#173974]/5 via-purple-600/5 to-pink-600/5 blur-2xl"></div>
                        
                        <div className="text-center relative">
                          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${program.bgColor} border ${program.borderColor} mb-3 relative shadow-lg`}>
                            <div className={`${program.animation}`} style={{
                              animationDuration: index === 0 ? '2s' : 
                                               index === 1 ? '1.5s' : 
                                               index === 2 ? '1s' : 
                                               '3s'
                            }}>
                              <Icon className="w-5 h-5 text-gray-700" />
                            </div>
                            
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping"></div>
                          </div>
                          
                          <h3 className="text-base font-bold text-gray-900 mb-2">
                            {program.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {program.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Premium Progress Indicators */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {programs.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`relative transition-all duration-500 ${
                    index === activeIndex 
                      ? 'h-2 w-10 bg-gradient-to-r from-[#173974] to-purple-600 rounded-full shadow-lg' 
                      : 'h-2 w-2 bg-gray-300 hover:bg-gray-400 rounded-full'
                  }`}
                >
                  {index === activeIndex && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#173974] to-purple-600 rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
              
              <div className="ml-3 text-xs text-gray-500 font-mono font-bold">
                {String(activeIndex + 1).padStart(2, '0')}/{String(programs.length).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>

        {/* Premium Features Section */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 sm:p-6 lg:p-8 mb-8 sm:mb-10 shadow-xl relative overflow-hidden">
          {/* Animated gradient glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#173974]/5 via-purple-600/5 to-pink-600/5 blur-2xl"></div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="p-2.5 bg-gradient-to-r from-[#173974]/10 to-blue-500/10 rounded-xl border border-[#173974]/20">
                <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-[#173974] animate-pulse" />
              </div>
              <h3 className="text-base sm:text-xl font-bold text-gray-900">Why Choose Our Academy?</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 group cursor-pointer">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-700 text-sm group-hover:text-[#173974] transition-colors">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Premium Launch Timeline */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-2xl border-2 border-blue-200/50 shadow-lg">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 animate-pulse" />
            <span className="text-gray-900 font-bold text-sm sm:text-base">Launching Soon!</span>
            <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Premium CTA Section */}
        <div className="text-center">
          <div className="mb-6">
            <p className="text-gray-600 mb-3 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Be among the first to enroll! Get exclusive early-bird discounts and priority batch selection.
            </p>
            <p className="text-xs text-gray-500">
              Limited seats available • Certified trainers • Proven success record
            </p>
          </div>
          
          {/* Premium WhatsApp Button */}
          <button
            onClick={handleWhatsAppClick}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-bold text-base hover:shadow-2xl hover:shadow-green-500/25 transition-all transform hover:scale-[1.02] group border border-green-500/20 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              <svg 
                className="w-5 h-5" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>Enquire on WhatsApp</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default LanguageAcademy;
