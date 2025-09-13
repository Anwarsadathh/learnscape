import React, { useState, useEffect } from 'react';
import { Building, Award, Users, TrendingUp, Target,  ArrowUp } from 'lucide-react';

const Statistics = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    colleges: 0,
    students: 0,
    success: 0,
    counselors: 0
  });

  useEffect(() => {
    setIsVisible(true);
    
    // Animated counting effect
    const duration = 2000;
    const steps = 50;
    const interval = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounts({
        colleges: Math.floor(1000 * progress),
        students: Math.floor(50 * progress),
        success: Math.floor(95 * progress),
        counselors: Math.floor(50 * progress)
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      icon: Building,
      number: counts.colleges,
      suffix: "+",
      label: "Partner Colleges",
      description: "Elite institutions",
      gradient: "from-[#173974] to-blue-600",
      shadowColor: "shadow-blue-500/30",
      delay: "delay-0",
      rotation: "rotate-3"
    },
    {
      icon: Users,
      number: counts.students,
      suffix: "K+",
      label: "Happy Students",
      description: "Success stories",
      gradient: "from-purple-600 to-pink-600",
      shadowColor: "shadow-purple-500/30",
      delay: "delay-100",
      rotation: "-rotate-3"
    },
    {
      icon: Target,
      number: counts.success,
      suffix: "%",
      label: "Success Rate",
      description: "Placement achieved",
      gradient: "from-emerald-600 to-teal-600",
      shadowColor: "shadow-emerald-500/30",
      delay: "delay-200",
      rotation: "rotate-2"
    },
    {
      icon: Award,
      number: counts.counselors,
      suffix: "+",
      label: "Expert Counselors",
      description: "Industry veterans",
      gradient: "from-orange-600 to-red-600",
      shadowColor: "shadow-orange-500/30",
      delay: "delay-300",
      rotation: "-rotate-2"
    }
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating orbs */}
        <div className="absolute top-10 left-10 w-20 h-20 sm:w-32 sm:h-32 bg-[#173974]/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 sm:w-40 sm:h-40 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-r from-[#173974]/5 to-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, #173974 0px, transparent 1px, transparent 99px, #173974 100px),
                             repeating-linear-gradient(90deg, #173974 0px, transparent 1px, transparent 99px, #173974 100px)`
          }}
        ></div>
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#173974] rounded-full opacity-20 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Ultra Modern */}
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gradient-to-r from-[#173974]/10 to-blue-600/10 border border-[#173974]/20 backdrop-blur-sm mb-3 sm:mb-4 group hover:scale-105 transition-transform">
            <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#173974] animate-pulse" />
            <span className="text-[9px] sm:text-[10px] font-black text-[#173974] uppercase tracking-[0.15em]">Our Impact</span>
            <div className="w-1 h-1 bg-[#173974] rounded-full animate-ping"></div>
          </div>
          
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 mb-1.5 sm:mb-2 leading-tight">
            Numbers That
            <span className="block sm:inline bg-gradient-to-r from-[#173974] via-blue-600 to-purple-600 bg-clip-text text-transparent ml-0 sm:ml-2 animate-pulse">
              Speak Louder
            </span>
          </h2>
          <p className="text-gray-600 text-[11px] sm:text-xs max-w-xl mx-auto leading-relaxed">
            Join India&apos;s fastest-growing education revolution
          </p>
        </div>

        {/* Stats Grid - Extreme Card Design */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`group relative transform transition-all duration-700 hover:scale-110 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                } ${stat.delay}`}
              >
                {/* Card with extreme styling */}
                <div className={`relative bg-white rounded-2xl border-2 border-gray-100 p-3 sm:p-4 text-center shadow-xl ${stat.shadowColor} hover:shadow-2xl transition-all duration-500 ${stat.rotation} hover:rotate-0 overflow-hidden`}>
                  
                  {/* Animated gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Animated corner accent */}
                  <div className={`absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse`}></div>
                  
                  {/* Icon with extreme effects */}
                  <div className="relative mb-2 sm:mb-3">
                    <div className={`inline-flex p-2 sm:p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-125 group-hover:rotate-12 transition-all duration-500`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    
                    {/* Orbiting dot */}
                    <div className="absolute top-0 right-1/2 translate-x-1/2">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping"></div>
                    </div>
                  </div>

                  {/* Animated Number Counter */}
                  <div className="mb-1 relative">
                    <div className="flex items-center justify-center gap-0.5">
                      <span className={`text-2xl sm:text-3xl font-black bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent drop-shadow-sm`}>
                        {stat.number}
                      </span>
                      <span className={`text-lg sm:text-xl font-black bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}>
                        {stat.suffix}
                      </span>
                    </div>
                    
                    {/* Animated underline */}
                    <div className={`h-0.5 bg-gradient-to-r ${stat.gradient} w-12 mx-auto mt-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                  </div>

                  {/* Label with animation */}
                  <div className="text-gray-900 font-bold text-[11px] sm:text-xs mb-0.5 group-hover:text-[#173974] transition-colors duration-300">
                    {stat.label}
                  </div>

                  {/* Description */}
                  <div className="text-gray-500 text-[9px] sm:text-[10px] font-medium">
                    {stat.description}
                  </div>
                  
                  {/* Rising arrow animation on hover */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <ArrowUp className={`w-3 h-3 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom accent line */}
        <div className="mt-8 sm:mt-10 flex justify-center">
          <div className="h-1 w-20 sm:w-32 bg-gradient-to-r from-transparent via-[#173974] to-transparent rounded-full opacity-20"></div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;