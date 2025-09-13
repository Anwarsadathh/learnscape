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
  Zap,
  Users,
  Calendar,
  MapPin,
  GraduationCap
} from 'lucide-react';

interface Program {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  features: string[];
}

const LanguageAcademyPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const programs: Program[] = [
    {
      title: "Spoken English",
      description: "Master fluency & confidence in communication with interactive sessions",
      icon: MessageCircle,
      color: "from-[#173974] to-blue-600",
      bgColor: "bg-gradient-to-r from-[#173974]/10 to-blue-500/10",
      borderColor: "border-[#173974]/20",
      features: ["Interactive Sessions", "Real-time Feedback", "Public Speaking"]
    },
    {
      title: "IELTS Preparation",
      description: "Achieve your target band score with expert guidance and practice",
      icon: Award,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-gradient-to-r from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-200",
      features: ["Band 7+ Guarantee", "Mock Tests", "Writing Enhancement"]
    },
    {
      title: "OET Training",
      description: "Healthcare professionals' pathway to international success",
      icon: BookOpen,
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-gradient-to-r from-emerald-500/10 to-teal-500/10",
      borderColor: "border-emerald-200",
      features: ["Medical Focus", "Role-play Practice", "Grade A Success"]
    },
    {
      title: "German Language",
      description: "From A1 to C2 proficiency levels with native instructors",
      icon: Globe,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-gradient-to-r from-orange-500/10 to-red-500/10",
      borderColor: "border-orange-200",
      features: ["Native Teachers", "Cultural Immersion", "Job Assistance"]
    }
  ];

  const features = [
    { icon: Users, text: "Expert Native Trainers", desc: "Learn from certified native speakers" },
    { icon: Calendar, text: "Flexible Batch Timings", desc: "Morning, evening & weekend batches" }, 
    { icon: Award, text: "Mock Tests & Assessments", desc: "Regular evaluation & feedback" },
    { icon: Plane, text: "Study Abroad Guidance", desc: "Complete university application support" },
    { icon: MapPin, text: "Visa Assistance", desc: "End-to-end visa processing help" },
    { icon: GraduationCap, text: "100% Placement Support", desc: "Job placement & career guidance" }
  ];

  const stats = [
    { number: "5000+", label: "Students Trained", color: "text-white" },
    { number: "95%", label: "Success Rate", color: "text-white" },
    { number: "50+", label: "Countries Reached", color: "text-white" },
    { number: "10+", label: "Years Experience", color: "text-white" }
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
    const phoneNumber = "918606004306";
    const message = encodeURIComponent("Hi! I'm interested in LearnScape Language Academy courses. Please share more details.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Enhanced Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-[#173974] relative overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse delay-700"></div>
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl animate-pulse delay-300"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-100/20 to-orange-100/20 border border-yellow-300/30 backdrop-blur-sm mb-6 hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span className="text-xs font-bold text-yellow-300 uppercase tracking-wider">Launching Soon</span>
              <Zap className="w-4 h-4 text-orange-400 animate-pulse" />
            </div>
            
            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-white mb-2 block">LearnScape</span>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent relative">
                Language Academy
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"></div>
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-blue-300 font-semibold mb-4">
              & Abroad Studies Program
            </p>
            
            <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed mb-8">
              Transform your future with expert language training. From basic communication to advanced proficiency, 
              we guide you towards global opportunities and international success.
            </p>

            {/* Launch Timeline */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/15 transition-all">
              <Clock className="w-5 h-5 text-blue-400 animate-pulse" />
              <span className="text-white font-bold">Launching Very Soon!</span>
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <div className={`text-2xl sm:text-3xl font-bold ${stat.color} mb-1`}>{stat.number}</div>
                <div className="text-slate-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Programs Section */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-[#173974]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#173974]/10 to-purple-500/10 border border-[#173974]/20 backdrop-blur-sm mb-4">
              <GraduationCap className="w-4 h-4 text-[#173974]" />
              <span className="text-xs font-bold text-[#173974] uppercase tracking-wider">Our Programs</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Choose Your 
              <span className="bg-gradient-to-r from-[#173974] to-purple-600 bg-clip-text text-transparent"> Path</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Comprehensive language training programs designed to help you achieve your global aspirations with confidence and expertise
            </p>
          </div>

          {/* Enhanced Desktop Grid */}
          <div className="hidden sm:grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {programs.map((program, index) => {
              const Icon = program.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-3xl border border-gray-200 hover:border-[#173974]/30 shadow-xl hover:shadow-2xl p-8 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 relative overflow-hidden"
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#173974]/5 via-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative">
                    <div className="flex items-start gap-6 mb-6">
                      <div className={`p-4 rounded-2xl ${program.bgColor} border ${program.borderColor} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-gray-700" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:bg-gradient-to-r group-hover:from-[#173974] group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                          {program.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {program.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div className="grid grid-cols-3 gap-3">
                      {program.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group-hover:bg-white/80 transition-colors">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span className="text-xs font-medium text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced Mobile Carousel */}
          <div className="sm:hidden relative max-w-sm mx-auto mb-16">
            <div className="overflow-hidden rounded-3xl">
              <div 
                className="flex transition-transform duration-700 ease-in-out" 
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {programs.map((program, index) => {
                  const Icon = program.icon;
                  return (
                    <div key={index} className="w-full flex-shrink-0 px-2">
                      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#173974]/5 to-purple-600/5"></div>
                        
                        <div className="text-center relative">
                          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${program.bgColor} border ${program.borderColor} mb-4 shadow-lg`}>
                            <Icon className="w-8 h-8 text-gray-700" />
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 mb-3">
                            {program.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4">
                            {program.description}
                          </p>
                          
                          <div className="space-y-2">
                            {program.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                                <span className="text-xs font-medium text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Progress Indicators */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {programs.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 ${
                    index === activeIndex 
                      ? 'h-2 w-10 bg-gradient-to-r from-[#173974] to-purple-600 rounded-full' 
                      : 'h-2 w-2 bg-gray-300 hover:bg-gray-400 rounded-full'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Why Choose 
              <span className="bg-gradient-to-r from-[#173974] to-purple-600 bg-clip-text text-transparent"> Our Academy?</span>
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience world-class language training with comprehensive support for your international journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-100 hover:border-[#173974]/20 transition-all duration-300 hover:-translate-y-2">
                  <div className="mb-4">
                    <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-[#173974]/10 to-purple-500/10 border border-[#173974]/20 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-[#173974]" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#173974] transition-colors">
                    {feature.text}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[#173974] via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Future?
            </h3>
            <p className="text-blue-100 mb-4 text-lg max-w-2xl mx-auto leading-relaxed">
              Join thousands of successful students who achieved their dreams through our expert language training. 
              Your global journey starts here!
            </p>
            <p className="text-blue-200 text-sm mb-8">
              🎯 Limited seats available • 🏆 Certified trainers • ⭐ Proven success record
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleWhatsAppClick}
              className="group relative px-8 py-4 bg-white text-[#173974] rounded-2xl font-bold text-base hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>Get Started on WhatsApp</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <div className="text-white/80 text-sm">
              Or call us at <span className="font-bold text-white">860 600 4306</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LanguageAcademyPage;
