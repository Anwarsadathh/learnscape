'use client';

import React, { useState, useEffect } from 'react';
import { Building, Award, Users, TrendingUp, Target } from 'lucide-react';

const Statistics = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    {
      icon: <Building className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />,
      number: "1000",
      suffix: "+",
      label: "Partner Colleges",
      description: "Top institutions",
      colorText: "text-blue-500",
      bgColor: "bg-blue-50",
      delay: "delay-0"
    },
    {
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />,
      number: "50",
      suffix: "K+",
      label: "Happy Students",
      description: "Success stories",
      colorText: "text-purple-500",
      bgColor: "bg-purple-50",
      delay: "delay-100"
    },
    {
      icon: <Target className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />,
      number: "95",
      suffix: "%",
      label: "Success Rate",
      description: "Placement achieved",
      colorText: "text-green-500",
      bgColor: "bg-green-50",
      delay: "delay-200"
    },
    {
      icon: <Award className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />,
      number: "50",
      suffix: "+",
      label: "Expert Counselors",
      description: "Industry veterans",
      colorText: "text-orange-500",
      bgColor: "bg-orange-50",
      delay: "delay-300"
    }
  ];

  return (
    <section className="py-12 sm:py-18 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 border border-blue-200 mb-3 sm:mb-4">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Our Impact</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Numbers That <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Speak</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Join the largest education ecosystem in India
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`group relative transform transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              } ${stat.delay}`}
            >
              <div className="relative bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                
                {/* Icon */}
                <div className={`inline-flex p-2 sm:p-3 rounded-lg sm:rounded-xl ${stat.bgColor} mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>

                {/* Number */}
                <div className="mb-2">
                  <span className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${stat.colorText}`}>
                    {stat.number}
                  </span>
                  <span className={`text-xl sm:text-2xl lg:text-3xl font-bold ${stat.colorText}`}>
                    {stat.suffix}
                  </span>
                </div>

                {/* Label */}
                <div className="text-gray-900 font-semibold text-sm sm:text-base mb-1">
                  {stat.label}
                </div>

                {/* Description */}
                <div className="text-gray-500 text-xs sm:text-sm">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
