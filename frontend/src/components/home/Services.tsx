'use client';
import React, { useState } from 'react';
import { Users, ArrowRight, Zap, Target, Shield, Brain, Sparkles } from 'lucide-react';
import EnquiryModal from '../EnquiryModal'; // Import the modal

const Services = () => {
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);

  const services = [
    {
      icon: <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-[#173974]" />,
      title: "AI-Powered Matching",
      description: "Smart recommendations based on your profile and preferences",
      color: "from-[#173974] to-blue-600",
      bgColor: "bg-gradient-to-r from-[#173974]/10 to-blue-500/10",
      borderColor: "border-[#173974]/20"
    },
    {
      icon: <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />,
      title: "Expert Counseling",
      description: "1-on-1 guidance from experienced education consultants",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-gradient-to-r from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-200"
    },
    {
      icon: <Target className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />,
      title: "Career Planning",
      description: "Strategic roadmap aligned with your future goals",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-gradient-to-r from-emerald-500/10 to-teal-500/10",
      borderColor: "border-emerald-200"
    },
    {
      icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />,
      title: "Guaranteed Support",
      description: "24/7 assistance throughout your educational journey",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-gradient-to-r from-orange-500/10 to-red-500/10",
      borderColor: "border-orange-200"
    }
  ];

  // Handle consultation button click
  const handleConsultationClick = () => {
    setModalOpen(true);
  };

  return (
    <>
      <section className="py-6 sm:py-8 lg:py-10 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Premium Background Effects */}
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

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Compact Section Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#173974]/10 to-purple-500/10 border border-[#173974]/20 backdrop-blur-sm mb-3 group hover:scale-105 transition-transform">
              <Sparkles className="w-3 h-3 text-[#173974] animate-pulse" />
              <span className="text-[9px] sm:text-xs font-bold text-[#173974] uppercase tracking-wider">Our Services</span>
              <Zap className="w-3 h-3 text-purple-600 animate-pulse" />
            </div>
            
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
              Everything You Need to
              <span className="bg-gradient-to-r from-[#173974] via-blue-600 to-purple-600 bg-clip-text text-transparent ml-2 relative">
                Succeed
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#173974] to-purple-600 animate-pulse"></div>
              </span>
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
              Comprehensive support system designed to maximize your chances of getting into your dream college
            </p>
          </div>

          {/* Compact Services List */}
          <div className="space-y-4 sm:space-y-5 mb-8 sm:mb-10">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative p-3 sm:p-4 rounded-xl hover:bg-white/50 backdrop-blur-sm transition-all duration-500 border border-transparent hover:border-gray-200/50"
              >
                {/* Compact Icon + Title Row */}
                <div className="flex items-center gap-3 mb-2">
                  {/* Smaller Static Icon */}
                  <div className="flex-shrink-0">
                    <div className={`inline-flex p-2 sm:p-2.5 rounded-lg ${service.bgColor} border ${service.borderColor} shadow-md group-hover:scale-105 transition-all duration-300`}>
                      {service.icon}
                    </div>
                  </div>

                  {/* Compact Title */}
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-[#173974] group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                    {service.title}
                  </h3>

                  {/* Smaller Service Number */}
                  <div className="hidden sm:flex flex-shrink-0 items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 font-bold text-xs group-hover:from-[#173974] group-hover:to-blue-600 group-hover:text-white transition-all duration-500 ml-auto">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* Compact Description */}
                <div className="pl-0 sm:pl-12">
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-2">
                    {service.description}
                  </p>
                  
                  {/* Smaller Learn More Link */}
                  <div className="flex items-center text-xs font-semibold group/link cursor-pointer">
                    <span className={`bg-gradient-to-r ${service.color} bg-clip-text text-transparent group-hover/link:opacity-80 transition-opacity`}>
                      Learn more about this service
                    </span>
                    <ArrowRight className="w-3 h-3 ml-1.5 text-gray-400 group-hover/link:text-[#173974] group-hover/link:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Compact CTA Section */}
          <div className="text-center bg-gradient-to-r from-[#173974]/5 via-purple-600/5 to-pink-600/5 rounded-xl p-4 sm:p-6 border border-[#173974]/10">
            <div className="mb-3">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                Ready to Transform Your Educational Journey?
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-1">
                Get personalized guidance from our expert counselors
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500">
                Free consultation • No hidden charges • 100% personalized advice
              </p>
            </div>
            
            {/* UPDATED BUTTON - Opens Modal */}
            <button 
              onClick={handleConsultationClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-[#173974] via-blue-600 to-purple-600 text-white rounded-lg font-bold text-xs sm:text-sm hover:shadow-xl hover:shadow-blue-500/25 transition-all transform hover:scale-[1.02] group border border-blue-500/20 relative overflow-hidden"
            >
              <span className="relative z-10">Book Free Consultation</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform relative z-10" />
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>
          </div>
        </div>
      </section>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        collegeName="LearnScape Education Services"
        collegeId="general-consultation"
      />
    </>
  );
};

export default Services;
