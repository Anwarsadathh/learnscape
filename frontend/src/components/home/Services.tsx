'use client';

import React from 'react';
import { Users, ArrowRight, Zap, Target, Shield, Brain } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />,
      title: "AI-Powered Matching",
      description: "Smart recommendations based on your profile",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />,
      title: "Expert Counseling",
      description: "1-on-1 guidance from industry veterans",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: <Target className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />,
      title: "Career Planning",
      description: "Strategic roadmap for your future",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />,
      title: "Guaranteed Support",
      description: "24/7 assistance throughout your journey",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <section className="py-12 sm:py-18 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 border border-green-200 mb-4">
            <Zap className="w-4 h-4 text-green-600" />
            <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">Our Services</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Everything You Need to <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Succeed</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Comprehensive support system designed to maximize your chances of getting into your dream college
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative"
            >
              <div className="relative h-full bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                
                {/* Icon + Heading in horizontal layout */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`inline-flex p-2 sm:p-2.5 rounded-lg ${service.bgColor} group-hover:scale-105 transition-transform duration-300`}>
                    {service.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                    {service.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>

                {/* Learn More Link */}
                <div className="flex items-center text-xs sm:text-sm font-medium">
                  <span className={`bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
                    Learn more
                  </span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 text-gray-400 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10 sm:mt-12">
          <p className="text-gray-600 text-sm sm:text-base mb-4">
            Need personalized guidance?
          </p>
          <button className="px-6 sm:px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-sm sm:text-base hover:shadow-lg transition-all transform hover:scale-[1.02]">
            Book Free Consultation
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
