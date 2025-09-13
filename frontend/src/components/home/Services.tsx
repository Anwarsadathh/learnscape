'use client';
import React from 'react';
import { Users, ArrowRight, Zap, Target, Shield, Brain, Sparkles } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Brain className="w-4 h-4 text-[#173974]" />,
      title: "AI-Powered Matching",
      description: "Smart recommendations based on your profile and preferences",
      color: "from-[#173974] to-blue-600",
      bgColor: "bg-gradient-to-r from-[#173974]/10 to-blue-500/10",
      borderColor: "border-[#173974]/20",
      animation: "animate-pulse" // Brain thinking animation
    },
    {
      icon: <Users className="w-4 h-4 text-purple-600" />,
      title: "Expert Counseling",
      description: "1-on-1 guidance from experienced education consultants",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-gradient-to-r from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-200",
      animation: "animate-bounce" // People connecting animation
    },
    {
      icon: <Target className="w-4 h-4 text-emerald-600" />,
      title: "Career Planning",
      description: "Strategic roadmap aligned with your future goals",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-gradient-to-r from-emerald-500/10 to-teal-500/10",
      borderColor: "border-emerald-200",
      animation: "animate-ping" // Target focusing animation
    },
    {
      icon: <Shield className="w-4 h-4 text-orange-600" />,
      title: "Guaranteed Support",
      description: "24/7 assistance throughout your educational journey",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-gradient-to-r from-orange-500/10 to-red-500/10",
      borderColor: "border-orange-200",
      animation: "animate-spin" // Shield rotating protection
    }
  ];

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-[#173974]/10 to-purple-500/10 border border-[#173974]/20 backdrop-blur-sm mb-3 sm:mb-4 group hover:scale-105 transition-transform">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#173974] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold text-[#173974] uppercase tracking-wider">Our Services</span>
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 animate-pulse" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
            Everything You Need to
            <span className="bg-gradient-to-r from-[#173974] via-blue-600 to-purple-600 bg-clip-text text-transparent ml-2 relative">
              Succeed
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#173974] to-purple-600 animate-pulse"></div>
            </span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Comprehensive support system designed to maximize your chances of getting into your dream college
          </p>
        </div>

        {/* Services Grid - Enhanced Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative"
            >
              {/* Premium Card Design */}
              <div className="relative h-full bg-white rounded-2xl border-2 border-gray-100 hover:border-[#173974]/30 p-5 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 overflow-hidden">
                
                {/* Animated gradient glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#173974] via-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 pointer-events-none"></div>
                
                {/* Card content */}
                <div className="relative">
                  {/* Icon with Continuous Animation + Premium Styling */}
                  <div className="mb-4">
                    <div className={`inline-flex p-3 rounded-xl ${service.bgColor} border ${service.borderColor} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg relative`}>
                      {/* Animated icon with continuous motion */}
                      <div className={`${service.animation}`} style={{
                        animationDuration: index === 0 ? '2s' : 
                                         index === 1 ? '1.5s' : 
                                         index === 2 ? '1s' : 
                                         '3s' // Different speeds for variety
                      }}>
                        {service.icon}
                      </div>
                      
                      {/* Floating pulse ring around icon */}
                      <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Orbiting dot */}
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping" style={{
                        animationDelay: `${index * 0.5}s` // Staggered delay
                      }}></div>
                    </div>
                  </div>

                  {/* Title with Gradient Hover Effect */}
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 leading-tight group-hover:bg-gradient-to-r group-hover:from-[#173974] group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Learn More Link with Animation */}
                  <div className="flex items-center text-sm font-semibold group/link cursor-pointer">
                    <span className={`bg-gradient-to-r ${service.color} bg-clip-text text-transparent group-hover/link:opacity-80 transition-opacity`}>
                      Learn more
                    </span>
                    <ArrowRight className="w-4 h-4 ml-1.5 text-gray-400 group-hover/link:text-[#173974] group-hover/link:translate-x-1 transition-all duration-300" />
                  </div>

                  {/* Floating accent dot with continuous animation */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-2 h-2 bg-gradient-to-r from-[#173974] to-purple-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium CTA Section */}
        <div className="text-center mt-10 sm:mt-12">
          <div className="mb-4">
            <p className="text-gray-600 text-sm sm:text-base mb-2">
              Need personalized guidance for your educational journey?
            </p>
            <p className="text-xs text-gray-500">
              Book a free consultation with our expert counselors
            </p>
          </div>
          
          <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#173974] via-blue-600 to-purple-600 text-white rounded-2xl font-bold text-base hover:shadow-2xl hover:shadow-blue-500/25 transition-all transform hover:scale-[1.02] group border border-blue-500/20 relative overflow-hidden">
            <span className="relative z-10">Book Free Consultation</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>
        </div>
      </div>

      {/* Custom CSS for smooth icon animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        
        @keyframes gentle-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes gentle-bounce {
          0%, 100% { transform: scale(1) translateY(0px); }
          50% { transform: scale(1.05) translateY(-2px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-gentle-spin {
          animation: gentle-spin 8s linear infinite;
        }
        
        .animate-gentle-bounce {
          animation: gentle-bounce 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Services;
