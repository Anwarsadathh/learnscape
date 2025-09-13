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
  Linkedin
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds }
      ].map((item, index) => (
        <div key={index} className="bg-slate-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-slate-800 p-2 sm:p-4 text-center hover:bg-slate-800/50 transition-colors duration-300">
          <div className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-1">
            {item.value.toString().padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-sm text-slate-400 uppercase tracking-wider">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

const ComingSoonPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger animations on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Set launch date (adjust as needed)
  const launchDate = "2025-10-15T00:00:00";
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden relative py-8 sm:py-16">
      {/* Simplified Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='white' stroke-width='0.5' opacity='0.05'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
        }}
      ></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Logo */}
          <div className={`mb-4 sm:mb-8 transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="inline-flex items-center">
              <Image
                src="/logo.png"
                alt="LearnScape Logo"
                width={150}
                height={45}
                className="sm:w-[200px] sm:h-[60px] hover:scale-105 transition-transform duration-300"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
          </div>

          {/* Premium Badge */}
          <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm mb-4 sm:mb-8 transform transition-all duration-500 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
            <span className="text-[10px] sm:text-sm font-semibold text-blue-300 uppercase tracking-wider">
              Something Amazing Is Coming
            </span>
          </div>

          {/* Main Heading */}
          <h1 className={`text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight transform transition-all duration-500 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <span className="block text-white mb-1 sm:mb-2">We&apos;re Launching</span>
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-2xl opacity-50"></span>
              <span className="relative bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Very Soon
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-sm sm:text-lg lg:text-xl text-slate-400 mb-6 sm:mb-12 max-w-3xl mx-auto leading-relaxed transform transition-all duration-500 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            Get ready for India&apos;s most comprehensive educational platform. 
            Discover top colleges, expert guidance, and scholarship opportunities all in one place.
          </p>

          {/* Countdown Timer */}
          <div className={`transform transition-all duration-500 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <Countdown targetDate={launchDate} />
          </div>

          {/* Features Preview */}
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-12 max-w-4xl mx-auto transform transition-all duration-500 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {[
              {
                icon: GraduationCap,
                title: "500+ Top Colleges",
                description: "Comprehensive database of premier institutions across India"
              },
              {
                icon: Sparkles,
                title: "Expert Guidance",
                description: "Personalized counseling and admission support"
              },
              {
                icon: Clock,
                title: "Real-time Updates",
                description: "Latest admission notifications and deadlines"
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-slate-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-slate-800 p-3 sm:p-6 hover:border-slate-700 hover:bg-slate-800/50 transition-all duration-300">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-2 sm:mb-4 mx-auto">
                    <IconComponent className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-bold text-white mb-1 sm:mb-2">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Contact Information */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8 transform transition-all duration-500 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
              <span className="text-xs sm:text-sm">
                <strong className="text-white">Admission:</strong> 860 600 4306
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
              <span className="text-xs sm:text-sm">
                <strong className="text-white">Email:</strong> learnscapeinfo@gmail.com
              </span>
            </div>
          </div>

          {/* Social Links */}
          <div className={`flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 transform transition-all duration-500 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <a
              href="https://www.instagram.com/learn_scape_?igsh=b2I1YWpnbm5zYjk="
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-3 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-pink-600 hover:border-transparent transition-all hover:scale-105"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <a
              href="#"
              className="p-2 sm:p-3 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-blue-600 hover:border-transparent transition-all hover:scale-105"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <a
              href="#"
              className="p-2 sm:p-3 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-blue-700 hover:border-transparent transition-all hover:scale-105"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>

          {/* Progress Bar */}
          <div className={`max-w-xs sm:max-w-md mx-auto transform transition-all duration-500 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex justify-between text-xs sm:text-sm text-slate-400 mb-2">
              <span>Launch Progress</span>
              <span>75%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 sm:h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-1000" style={{width: '75%'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
