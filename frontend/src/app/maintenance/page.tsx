'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Clock, 
  Mail, 
  Phone, 
  Sparkles, 
  GraduationCap,
  Instagram,
  Facebook,
  Linkedin,
  Calendar,
  Zap,
  Target,
  Globe
} from 'lucide-react';

interface CountdownProps {
  targetDate: string;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="relative mb-8 sm:mb-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
        {[
          { 
            label: 'Days', 
            value: timeLeft.days, 
            icon: Calendar,
            gradient: 'from-rose-400 via-pink-500 to-red-500',
            shadow: 'shadow-pink-200',
            ring: 'ring-pink-200/50'
          },
          { 
            label: 'Hours', 
            value: timeLeft.hours, 
            icon: Clock,
            gradient: 'from-blue-400 via-blue-500 to-indigo-500',
            shadow: 'shadow-blue-200',
            ring: 'ring-blue-200/50'
          },
          { 
            label: 'Minutes', 
            value: timeLeft.minutes, 
            icon: Zap,
            gradient: 'from-emerald-400 via-green-500 to-teal-500',
            shadow: 'shadow-green-200',
            ring: 'ring-green-200/50'
          },
          { 
            label: 'Seconds', 
            value: timeLeft.seconds, 
            icon: Target,
            gradient: 'from-amber-400 via-orange-500 to-red-500',
            shadow: 'shadow-orange-200',
            ring: 'ring-orange-200/50'
          }
        ].map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div 
              key={index} 
              className={`relative group bg-white rounded-2xl border-2 ${item.ring} ${item.shadow} shadow-xl p-4 sm:p-6 text-center transform transition-all duration-500 hover:scale-110 hover:-rotate-2 animate-bounce`}
              style={{
                animationDelay: `${index * 200}ms`,
                animationDuration: '2s',
                animationIterationCount: 'infinite'
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
              
              <div className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${item.gradient} rounded-xl mb-2 shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              
              <div className="relative">
                <div className={`text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-br ${item.gradient} bg-clip-text text-transparent mb-1 transform group-hover:scale-125 transition-transform duration-300`}>
                  {item.value.toString().padStart(2, '0')}
                </div>
                
                <div className={`h-0.5 bg-gradient-to-r ${item.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
              </div>
              
              <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-widest font-bold">
                {item.label}
              </div>
              
              <div className="absolute -top-2 -right-2 w-2 h-2 bg-gradient-to-r from-white to-gray-200 rounded-full animate-ping"></div>
            </div>
          );
        })}
      </div>
      
      <div className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-30"></div>
    </div>
  );
};

const ComingSoonPage: React.FC = () => {
  const launchDate = "2025-10-15T00:00:00";
  
  // ✅ FIX: Generate particles only on client side to avoid hydration mismatch
  const [particles, setParticles] = useState<Array<{left: string, top: string, delay: string, duration: string}>>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // ✅ Generate particles after component mounts on client
    const generateParticles = () => {
      return Array.from({ length: 12 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 4}s`,
        duration: `${2 + Math.random() * 3}s`
      }));
    };

    setParticles(generateParticles());
    setMounted(true);
  }, []);
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Mesh Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div 
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            animation: 'float 20s ease-in-out infinite'
          }}
        ></div>
        
        {/* Static geometric shapes (no random values) */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-400 rounded rotate-45 animate-spin" style={{animationDuration: '8s'}}></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-6 h-1 bg-purple-400 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-20 w-5 h-5 border-2 border-green-400 rounded animate-spin" style={{animationDuration: '6s', animationDelay: '3s'}}></div>
        
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-xl animate-pulse transform" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-pink-200/30 to-orange-200/30 rounded-full blur-xl animate-pulse transform" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
      </div>

      {/* ✅ FIXED: Floating particles only render after mount */}
      {mounted && (
        <div className="absolute inset-0">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce"
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.delay,
                animationDuration: particle.duration
              }}
            ></div>
          ))}
        </div>
      )}

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Animated Logo Container */}
          <div className="mb-8 sm:mb-12 relative">
            <div className="inline-block relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 scale-150"></div>
              
              <div className="relative bg-white rounded-2xl p-4 shadow-2xl border-2 border-gray-100 group-hover:border-blue-200 transition-all duration-500 transform group-hover:scale-110 group-hover:-rotate-1">
                <Image
                  src="/logo.png"
                  alt="LearnScape Logo"
                  width={180}
                  height={54}
                  className="sm:w-[220px] sm:h-[66px] transition-all duration-500"
                  style={{ filter: 'brightness(0.1)' }}
                />
              </div>
              
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-ping"></div>
              <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Status Badge with Animation */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 via-blue-50 to-purple-100 border-2 border-emerald-200 mb-8 shadow-lg hover:shadow-xl transition-all duration-500 group transform hover:scale-105">
            <div className="relative">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" style={{animationDuration: '3s'}} />
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur animate-pulse opacity-50"></div>
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-wider">
              🚀 Launch Sequence Initiated
            </span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>

          {/* Main Title with Typewriter Effect */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 leading-tight">
              <div className="block text-gray-900 mb-2 transform hover:scale-105 transition-transform duration-300">
                The Future of
              </div>
              <div className="relative inline-block">
                <span className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                  Education
                </span>
                <span className="absolute -right-1 top-0 w-1 h-full bg-gradient-to-b from-blue-600 to-purple-600 animate-pulse"></span>
              </div>
            </h1>
            
            <div className="flex items-center justify-center gap-2 text-lg sm:text-xl font-semibold text-gray-600">
              <span>Arrives in</span>
              <Clock className="w-5 h-5 animate-spin text-blue-600" style={{animationDuration: '2s'}} />
            </div>
          </div>

          {/* Subtitle with Reveal Animation */}
          <p className="text-base sm:text-xl text-gray-700 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
            Experience India&lsquo;s most innovative educational ecosystem. 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold"> AI-powered guidance</span>, 
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold"> 500+ premium colleges</span>, 
            and <span className="bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent font-bold">personalized career mapping</span> 
            all in one revolutionary platform.
          </p>

          {/* Countdown Timer */}
          <Countdown targetDate={launchDate} />

          {/* Enhanced Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-16">
            {[
              {
                icon: GraduationCap,
                title: "500+ Elite Colleges",
                description: "Premium institutions nationwide",
                gradient: "from-blue-500 via-blue-600 to-indigo-600",
                bgGradient: "from-blue-50 to-indigo-50"
              },
              {
                icon: Sparkles,
                title: "AI-Powered Matching",
                description: "Smart career recommendations",
                gradient: "from-purple-500 via-purple-600 to-pink-600",
                bgGradient: "from-purple-50 to-pink-50"
              },
              {
                icon: Globe,
                title: "Global Opportunities",
                description: "International partnerships",
                gradient: "from-emerald-500 via-green-600 to-teal-600",
                bgGradient: "from-emerald-50 to-teal-50"
              },
              {
                icon: Target,
                title: "100% Success Rate",
                description: "Guaranteed admissions",
                gradient: "from-orange-500 via-red-500 to-pink-600",
                bgGradient: "from-orange-50 to-pink-50"
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={index} 
                  className={`group relative bg-gradient-to-br ${feature.bgGradient} rounded-2xl border-2 border-gray-200 p-6 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2`}
                  style={{
                    animationDelay: `${index * 150}ms`
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  <div className={`relative inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-4 shadow-lg transform group-hover:rotate-12 transition-all duration-500`}>
                    <IconComponent className="w-7 h-7 text-white" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl animate-ping opacity-20`}></div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl`}></div>
                </div>
              );
            })}
          </div>

          {/* Contact & Social Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-200 p-6 sm:p-8 shadow-2xl mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <a 
                href="tel:8606004306"
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-lg group-hover:rotate-12 transition-transform duration-300">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-blue-600 uppercase">Admission Helpline</div>
                  <div className="text-lg font-bold text-gray-900">860 600 4306</div>
                </div>
              </a>
              
              <a 
                href="mailto:learnscapeinfo@gmail.com"
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg group-hover:rotate-12 transition-transform duration-300">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-purple-600 uppercase">Email Support</div>
                  <div className="text-sm font-bold text-gray-900">learnscapeinfo@gmail.com</div>
                </div>
              </a>
            </div>

            <div className="flex items-center justify-center gap-4">
              <span className="text-sm font-semibold text-gray-600">Connect with us:</span>
              
              {[
                { icon: Instagram, href: "https://www.instagram.com/learn_scape_?igsh=b2I1YWpnbm5zYjk=", gradient: "from-pink-500 to-purple-600", label: "Instagram" },
                { icon: Facebook, href: "#", gradient: "from-blue-500 to-blue-600", label: "Facebook" },
                { icon: Linkedin, href: "#", gradient: "from-blue-600 to-blue-700", label: "LinkedIn" }
              ].map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 bg-gradient-to-br ${social.gradient} text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-125 hover:-rotate-6 group`}
                    aria-label={social.label}
                  >
                    <IconComponent className="w-5 h-5 group-hover:animate-bounce" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-900">🚀 Launch Progress</span>
                <span className="text-2xl font-black bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">75%</span>
              </div>
              
              <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden border border-gray-300">
                <div 
                  className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 h-full rounded-full shadow-lg relative overflow-hidden transition-all duration-1000 ease-out"
                  style={{width: '75%'}}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                  <div className="absolute top-0 left-0 w-4 h-full bg-white/30 animate-bounce"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-gray-600">Systems ready • Final checks in progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default ComingSoonPage;
