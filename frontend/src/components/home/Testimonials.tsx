'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Quote, Sparkles, Zap } from 'lucide-react';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const testimonials = [
    {
      name: "Mehar Ban K.R",
      course: "3rd Year BSc MIT",
      college: "East Point Medical College",
      avatar: "/Testimonials/mehru.jpeg",
      rating: 5,
      text: "As a new student at colleges in Bangalore, LearnScape gave me convincing advice on choosing the right course and university. As a third-year student, I encourage all students to choose LearnScape for their excellent future.",
    },
    {
      name: "Don Mathew",
      course: "BSc Nursing",
      college: "Shusruthy College of Nursing", 
      avatar: "/Testimonials/don.jpeg",
      rating: 5,
      text: "I highly recommend LearnScape for anyone seeking guidance and support in their academic journey. The team was incredibly knowledgeable and provided me with personalized advice that helped me achieve my educational goals.",
    },
    {
      name: "Gouri Vijayakumar",
      course: "1st Year Fashion Designing",
      college: "BGS & SJB Group of Institutions",
      avatar: "/Testimonials/g.jpeg",
      rating: 5,
      text: "When I had no clue about Bangalore and the colleges in Bangalore, that's when I came to know about LearnScape. After I contacted them, I got advice on the courses and colleges in Bangalore.",
    },
    {
      name: "Rohith",
      course: "BSc Psychology",
      college: "Christ Deemed to be University",
      avatar: "/Testimonials/ro.jpeg",
      rating: 5,
      text: "I had a wonderful experience with LearnScape. The team provided me with personalized guidance for my study plans and made the entire process seamless.",
    }
  ];

  // Auto-advance functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, testimonials.length]);

  const goToSlide = (index: number) => {
    setIsPlaying(false);
    setActiveIndex(index);
    
    setTimeout(() => {
      setIsPlaying(true);
    }, 10000);
  };

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-purple-100/80 to-pink-100/80 border border-purple-300/50 backdrop-blur-sm mb-3 sm:mb-4 group hover:scale-105 transition-transform">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold text-purple-700 uppercase tracking-wider">Success Stories</span>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-pink-600 animate-pulse" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
            What Our
            <span className="bg-gradient-to-r from-[#173974] via-purple-600 to-pink-600 bg-clip-text text-transparent ml-2 relative">
              Students Say
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse"></div>
            </span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Real stories from students who transformed their dreams into reality
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-2 gap-6 mb-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group relative">
              {/* Premium Card Design */}
              <div className="relative bg-white rounded-2xl border-2 border-gray-100 hover:border-[#173974]/30 shadow-xl hover:shadow-2xl p-6 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 h-full overflow-hidden">
                
                {/* Animated gradient glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#173974] via-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 pointer-events-none"></div>
                
                <div className="relative">
                  {/* Premium Quote Icon */}
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r from-purple-100/90 to-pink-100/90 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-purple-200/50 shadow-lg">
                    <Quote className="w-5 h-5 text-purple-600 animate-pulse" />
                  </div>

                  <div className="flex items-start gap-4 mb-4">
                    {/* Premium Image Avatar - Desktop */}
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden ring-2 ring-gray-200 hover:ring-[#173974]/30 transition-all duration-300 flex-shrink-0 shadow-lg">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 56px) 100vw, 56px"
                      />
                      {/* Subtle overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-bold text-base mb-1 group-hover:bg-gradient-to-r group-hover:from-[#173974] group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-blue-600 font-semibold">{testimonial.course}</p>
                      <p className="text-xs text-gray-500 mt-1">{testimonial.college}</p>
                    </div>
                  </div>

                  {/* Premium Star Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-4 h-4 text-yellow-500 fill-yellow-500 animate-pulse" 
                        style={{animationDelay: `${i * 0.1}s`}}
                      />
                    ))}
                  </div>

                  {/* Premium Quote Text */}
                  <p className="text-gray-700 text-sm leading-relaxed italic relative">
                    <span className="text-4xl text-purple-200 absolute -top-2 -left-1 font-serif">&quot;</span>
                    <span className="relative z-10">{testimonial.text}</span>
                    <span className="text-4xl text-purple-200 absolute -bottom-6 right-0 font-serif">&quot;</span>
                  </p>

                  {/* Floating accent dot */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-2 h-2 bg-gradient-to-r from-[#173974] to-purple-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden relative max-w-sm mx-auto">
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-700 ease-in-out" 
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-2">
                  <div className="relative bg-white rounded-2xl border-2 border-gray-100 shadow-xl p-5 max-w-sm mx-auto overflow-hidden">
                    {/* Premium background glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#173974]/5 via-purple-600/5 to-pink-600/5 blur-2xl"></div>
                    
                    <div className="relative">
                      {/* Quote Icon - Mobile */}
                      <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-purple-100/90 to-pink-100/90 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-purple-200/50 shadow-lg">
                        <Quote className="w-4 h-4 text-purple-600 animate-pulse" />
                      </div>

                      <div className="flex items-start gap-3 mb-4">
                        {/* Image Avatar - Mobile */}
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-2 ring-gray-200 flex-shrink-0 shadow-lg">
                          <Image
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 48px) 100vw, 48px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-gray-900 font-bold text-sm mb-1 line-clamp-1">{testimonial.name}</h3>
                          <p className="text-xs text-blue-600 font-semibold line-clamp-1">{testimonial.course}</p>
                          <p className="text-[10px] text-gray-500 line-clamp-1 mt-1">{testimonial.college}</p>
                        </div>
                      </div>

                      {/* Star Rating - Mobile */}
                      <div className="flex gap-0.5 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>

                      {/* Quote Text - Mobile */}
                      <p className="text-gray-700 text-xs leading-relaxed italic line-clamp-6 relative">
                        <span className="text-2xl text-purple-200 absolute -top-1 -left-1 font-serif">&quot;</span>
                        <span className="relative z-10 pl-3">{testimonial.text}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Progress Indicators */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative transition-all duration-500 ${
                  index === activeIndex 
                    ? 'h-2 w-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg' 
                    : 'h-2 w-2 bg-gray-300 hover:bg-gray-400 rounded-full'
                }`}
              >
                {/* Animated shimmer effect for active indicator */}
                {index === activeIndex && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
            
            {/* Counter Display */}
            <div className="ml-3 text-xs text-gray-500 font-mono font-bold">
              {String(activeIndex + 1).padStart(2, '0')}/{String(testimonials.length).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Premium Bottom Section */}
        <div className="text-center mt-10 sm:mt-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm rounded-2xl border-2 border-purple-200/50 shadow-lg">
            <Zap className="w-4 h-4 text-purple-600 animate-pulse" />
            <span className="text-gray-700 font-semibold text-sm">Join 1000+ successful students</span>
            <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
