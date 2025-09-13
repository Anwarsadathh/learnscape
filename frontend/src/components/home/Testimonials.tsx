'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Quote} from 'lucide-react';

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
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 backdrop-blur-sm mb-4">
            <Star className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Success Stories</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            What Our <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Students Say</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Real stories from students who transformed their dreams into reality
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-2 gap-6 mb-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r rounded-2xl blur-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
              
              <div className="relative bg-white rounded-2xl border border-gray-200 shadow-lg p-6 hover:border-gray-300 hover:shadow-xl transition-all duration-300 h-full">
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center backdrop-blur-sm border border-purple-200">
                  <Quote className="w-5 h-5 text-purple-600" />
                </div>

                <div className="flex items-start gap-4 mb-4">
                  {/* Image Avatar - Desktop */}
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-2 ring-gray-200 flex-shrink-0">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 48px) 100vw, 48px"
                    />
                    {/* Light overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent opacity-10"></div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-semibold text-base mb-1">{testimonial.name}</h3>
                    <p className="text-sm text-blue-600 font-medium">{testimonial.course}</p>
                    <p className="text-xs text-gray-500">{testimonial.college}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>

                <p className="text-gray-700 text-sm leading-relaxed italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden relative max-w-md mx-auto">
          <div className="overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-700 ease-in-out" 
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-2">
                  <div className="relative bg-white rounded-xl border border-gray-200 shadow-lg p-4 max-w-sm mx-auto">
                    {/* Quote Icon */}
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center backdrop-blur-sm border border-purple-200">
                      <Quote className="w-5 h-5 text-purple-600" />
                    </div>

                    <div className="flex items-start gap-3 mb-3">
                      {/* Image Avatar - Mobile */}
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden ring-2 ring-gray-200 flex-shrink-0">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 40px) 100vw, 40px"
                        />
                        {/* Light overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent opacity-10"></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-gray-900 font-semibold text-sm mb-1 line-clamp-1">{testimonial.name}</h3>
                        <p className="text-xs text-blue-600 font-medium line-clamp-1">{testimonial.course}</p>
                        <p className="text-[10px] text-gray-500 line-clamp-1">{testimonial.college}</p>
                      </div>
                    </div>

                    <div className="flex gap-0.5 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>

                    <p className="text-gray-700 text-xs leading-relaxed italic line-clamp-6">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modern Slash/Line Design */}
          <div className="flex items-center justify-center gap-1 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative h-0.5 transition-all duration-500 overflow-hidden ${
                  index === activeIndex 
                    ? 'w-8 bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-600/30' 
                    : 'w-4 bg-gray-300 hover:bg-gray-400'
                }`}
              >
                {/* Animated shimmer effect for active indicator */}
                {index === activeIndex && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent translate-x-[-100%] animate-pulse"></div>
                )}
              </button>
            ))}
            
            {/* Counter Display */}
            <div className="ml-3 text-xs text-gray-500 font-mono">
              {String(activeIndex + 1).padStart(2, '0')}/{String(testimonials.length).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
