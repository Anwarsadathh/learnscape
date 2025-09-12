'use client';

import React from 'react';
import Link from 'next/link';
import {  ArrowRight, Sparkles, Calendar, MessageCircle } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Premium Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-100 border border-yellow-300 mb-4 sm:mb-6">
          <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
          <span className="text-xs font-semibold text-yellow-700 uppercase tracking-wider">Limited Time Offer</span>
        </div>

        {/* Main Heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
          Ready to Shape Your
          <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Future Career?
          </span>
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
          Join 500,000+ students who transformed their dreams into reality with our expert guidance
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 px-2">
          {['Free Counseling',  'Expert Guidance', '24/7 Support'].map((feature) => (
            <div key={feature} className="px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm">
              <span className="text-xs font-medium text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4">
          <Link
            href="/consultation"
            className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-sm sm:text-base overflow-hidden transition-all hover:shadow-xl transform hover:scale-[1.02]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              Book Free Consultation
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 rounded-xl font-semibold text-sm sm:text-base border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all">
            <span className="flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Chat with Expert
            </span>
          </button>
        </div>

      
        {/* Trust Text */}
        <p className="text-xs text-gray-500 leading-relaxed px-4">
          Trusted by leading institutions • 95% success rate • No hidden charges
        </p>
      </div>
    </section>
  );
};

export default CallToAction;
