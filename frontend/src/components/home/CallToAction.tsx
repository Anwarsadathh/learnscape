'use client';

import React, { useState } from 'react';
import { ArrowRight, Sparkles, Calendar, MessageCircle, Zap, Star } from 'lucide-react';
import EnquiryModal from '../EnquiryModal'; // Import the modal

const CallToAction = () => {
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);

  // Handle WhatsApp click
  const handleWhatsAppClick = () => {
    const phoneNumber = "918606004306";
    const message = encodeURIComponent("Hi! I'm interested in LearnScape services. Please share more details about your programs and guidance.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  // Handle consultation button click
  const handleConsultationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setModalOpen(true);
  };

  return (
    <>
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

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Premium Badge - Matching Other Sections */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-yellow-100/80 to-orange-100/80 border border-yellow-300/50 backdrop-blur-sm mb-4 sm:mb-6 group hover:scale-105 transition-transform">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold text-yellow-700 uppercase tracking-wider">Limited Time Offer</span>
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600 animate-pulse" />
          </div>

          {/* Premium Heading - Matching Typography */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
            Ready to Shape Your
            <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-[#173974] via-blue-600 to-purple-600 bg-clip-text text-transparent relative">
              Future Career?
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-[#173974] to-purple-600 animate-pulse"></div>
            </span>
          </h2>

          {/* Enhanced Description */}
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            Join <span className="font-bold text-[#173974]">500,000+</span> students who transformed their dreams into reality with our expert guidance
          </p>

          {/* Premium Feature Pills */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            {[
              { text: 'Free Counseling', icon: Star },
              { text: 'Expert Guidance', icon: Sparkles },
              { text: '24/7 Support', icon: MessageCircle }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={feature.text} className="group relative">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm hover:border-[#173974]/30 hover:shadow-md transition-all duration-300 hover:scale-105">
                    <Icon className="w-3 h-3 text-[#173974] animate-pulse" style={{animationDelay: `${index * 0.2}s`}} />
                    <span className="text-xs font-medium text-gray-700 group-hover:text-[#173974] transition-colors">{feature.text}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* UPDATED CTA Buttons - Modal Integration */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6 sm:mb-8">
            {/* Primary CTA - Opens Modal */}
            <button
              onClick={handleConsultationClick}
              className="group relative w-full max-w-xs sm:w-auto px-6 py-3 bg-gradient-to-r from-[#173974] via-blue-600 to-purple-600 text-white rounded-xl font-semibold text-sm overflow-hidden transition-all hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-[1.02] border border-blue-500/20"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                Book Free Consultation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>

            {/* Secondary CTA - Opens WhatsApp */}
            <button 
              onClick={handleWhatsAppClick}
              className="group relative w-full max-w-xs sm:w-auto px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold text-sm border border-gray-200 hover:border-[#173974]/30 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#173974]" />
                Chat with Expert
              </span>
              
              {/* Hover gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#173974]/5 via-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Compact Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <span className="text-xs font-medium text-gray-700">4.9/5</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-700">95% Success</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse delay-300"></div>
              <span className="text-xs font-medium text-gray-700">No Hidden Charges</span>
            </div>
          </div>

          {/* Enhanced Trust Text */}
          <p className="text-xs text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Trusted by leading institutions across India • Certified counselors with 10+ years experience
          </p>
        </div>
      </section>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        collegeName="LearnScape Career Consultation"
        collegeId="career-consultation"
      />
    </>
  );
};

export default CallToAction;
