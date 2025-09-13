'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Building, Award, Users, TrendingUp, Target, Sparkles, Zap } from 'lucide-react';

const Statistics = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    colleges: 0,
    students: 0,
    success: 0,
    counselors: 0
  });
  
  const sectionRef = useRef<HTMLDivElement>(null);

  // Wrap stats in useMemo to prevent recreation on every render
  const stats = useMemo(() => [
    {
      icon: <Building className="w-5 h-5 sm:w-6 sm:h-6 text-[#173974]" />,
      number: "1000",
      suffix: "+",
      label: "Partner Colleges",
      description: "Top institutions across India",
      color: "from-[#173974] to-blue-600",
      bgColor: "bg-gradient-to-r from-[#173974]/10 to-blue-500/10",
      borderColor: "border-[#173974]/20",
      key: 'colleges',
      target: 1000,
      animation: "animate-float",
      delay: "delay-0"
    },
    {
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />,
      number: "50",
      suffix: "K+",
      label: "Happy Students",
      description: "Success stories nationwide",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-gradient-to-r from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-200",
      key: 'students',
      target: 50,
      animation: "animate-wiggle",
      delay: "delay-100"
    },
    {
      icon: <Target className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />,
      number: "95",
      suffix: "%",
      label: "Success Rate",
      description: "Placement achieved consistently",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-gradient-to-r from-emerald-500/10 to-teal-500/10",
      borderColor: "border-emerald-200",
      key: 'success',
      target: 95,
      animation: "animate-heartbeat",
      delay: "delay-200"
    },
    {
      icon: <Award className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />,
      number: "50",
      suffix: "+",
      label: "Expert Counselors",
      description: "Industry veterans guiding you",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-gradient-to-r from-orange-500/10 to-red-500/10",
      borderColor: "border-orange-200",
      key: 'counselors',
      target: 50,
      animation: "animate-swing",
      delay: "delay-300"
    }
  ], []);

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    // Animated counter function moved inside useEffect
    const animateCounters = () => {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;

      stats.forEach((stat, index) => {
        let currentCount = 0;
        const increment = stat.target / steps;
        
        const timer = setTimeout(() => {
          const counter = setInterval(() => {
            currentCount += increment;
            if (currentCount >= stat.target) {
              currentCount = stat.target;
              clearInterval(counter);
            }
            
            setCounters(prev => ({
              ...prev,
              [stat.key]: Math.floor(currentCount)
            }));
          }, interval);
        }, index * 200);

        return () => clearTimeout(timer);
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible, stats]);

  // Remove the duplicate animateCounters function that was outside useEffect

  return (
    <>
      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(2deg); }
          50% { transform: translateY(-4px) rotate(0deg); }
          75% { transform: translateY(-12px) rotate(-1deg); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(5deg) scale(1.05); }
          50% { transform: rotate(-3deg) scale(1.02); }
          75% { transform: rotate(4deg) scale(1.08); }
        }
        
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.15); }
          50% { transform: scale(1.05); }
          75% { transform: scale(1.25); }
        }
        
        @keyframes swing {
          0%, 100% { transform: rotate(0deg) translateX(0px); }
          25% { transform: rotate(10deg) translateX(2px); }
          50% { transform: rotate(0deg) translateX(0px); }
          75% { transform: rotate(-8deg) translateX(-2px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }
        
        .animate-heartbeat {
          animation: heartbeat 1.5s ease-in-out infinite;
        }
        
        .animate-swing {
          animation: swing 2.5s ease-in-out infinite;
        }
      `}</style>

      <section 
        ref={sectionRef}
        className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden"
      >
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
          {/* Premium Section Header */}
          <div className="text-center mb-6 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-blue-100/80 to-purple-100/80 border border-blue-300/50 backdrop-blur-sm mb-3 sm:mb-4 group hover:scale-105 transition-transform">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold text-blue-700 uppercase tracking-wider">Our Impact</span>
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 animate-pulse" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
              Numbers That
              <span className="bg-gradient-to-r from-[#173974] via-blue-600 to-purple-600 bg-clip-text text-transparent ml-2 relative">
                Speak
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#173974] to-purple-600 animate-pulse"></div>
              </span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Join the largest education ecosystem in India with proven success metrics
            </p>
          </div>

          {/* Enhanced Statistics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`group relative transform transition-all duration-700 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                } ${stat.delay}`}
              >
                {/* Premium Card Design */}
                <div className="relative bg-white rounded-2xl border-2 border-gray-100 hover:border-[#173974]/30 p-4 sm:p-6 text-center shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 overflow-hidden">
                  
                  {/* Animated gradient glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#173974] via-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 pointer-events-none"></div>
                  
                  <div className="relative">
                    {/* Premium Icon with Unique Custom Animation */}
                    <div className="mb-4">
                      <div className={`inline-flex p-3 sm:p-4 rounded-xl ${stat.bgColor} border ${stat.borderColor} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg relative`}>
                        <div className={`${stat.animation}`}>
                          {stat.icon}
                        </div>
                        
                        {/* Orbiting dot with unique delays */}
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping" style={{
                          animationDelay: `${index * 0.5}s`
                        }}></div>
                        
                        {/* Additional floating ring for more visual interest */}
                        <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    </div>

                    {/* Animated Number Counter */}
                    <div className="mb-3">
                      <span className={`text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                        {counters[stat.key as keyof typeof counters]}
                      </span>
                      <span className={`text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                        {stat.suffix}
                      </span>
                    </div>

                    {/* Enhanced Labels */}
                    <div className="text-gray-900 font-bold text-sm sm:text-base mb-2 group-hover:bg-gradient-to-r group-hover:from-[#173974] group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                      {stat.label}
                    </div>

                    <div className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      {stat.description}
                    </div>

                    {/* Multiple floating accent elements */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-[#173974] to-purple-600 rounded-full animate-pulse"></div>
                    </div>
                    <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="w-1 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Premium Trust Section */}
          <div className="mt-10 sm:mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-lg">
              <Zap className="w-4 h-4 text-[#173974] animate-pulse" />
              <span className="text-sm font-semibold text-gray-700">Trusted by 1000+ institutions nationwide</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Statistics;
