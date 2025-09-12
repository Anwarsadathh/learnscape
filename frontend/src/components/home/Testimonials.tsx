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
      avatar: "/Testimonials/mehru.jpeg", // Replace with actual image path
      rating: 5,
      text: "As a new student at colleges in Bangalore, LearnScape gave me convincing advice on choosing the right course and university. As a third-year student, I encourage all students to choose LearnScape for their excellent future.",
      
    },
    {
      name: "Don Mathew",
      course: "BSc Nursing",
      college: "Shusruthy College of Nursing", 
      avatar: "/Testimonials/don.jpeg", // Your existing image
      rating: 5,
      text: "I highly recommend LearnScape for anyone seeking guidance and support in their academic journey. The team was incredibly knowledgeable and provided me with personalized advice that helped me achieve my educational goals.",
    },
    {
      name: "Gouri Vijayakumar",
      course: "1st Year Fashion Designing",
      college: "BGS & SJB Group of Institutions",
      avatar: "/Testimonials/g.jpeg", // Replace with actual image path
      rating: 5,
      text: "When I had no clue about Bangalore and the colleges in Bangalore, that's when I came to know about LearnScape. After I contacted them, I got advice on the courses and colleges in Bangalore.",
    },
    {
      name: "Rohith",
      course: "BSc Psychology",
      college: "Christ Deemed to be University",
      avatar: "/Testimonials/ro.jpeg", // Replace with actual image path
      rating: 5,
      text: "I had a wonderful experience with LearnScape. The team provided me with personalized guidance for my study plans and made the entire process seamless.",
    }
  ];

  // Auto-advance functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Auto advance every 5 seconds

    return () => clearInterval(interval);
  }, [isPlaying, testimonials.length]);

  const goToSlide = (index: number) => {
    setIsPlaying(false);
    setActiveIndex(index);
    
    // Resume autoplay after 10 seconds of no interaction
    setTimeout(() => {
      setIsPlaying(true);
    }, 10000);
  };

  return (
    <section className="py-12 sm:py-16 bg-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Mobile Optimized */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm mb-4">
            <Star className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Success Stories</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
            What Our <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Students Say</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Real stories from students who transformed their dreams into reality
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-2 gap-6 mb-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-r rounded-2xl blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="relative bg-slate-950/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-6 hover:border-slate-700 transition-all duration-300 h-full">
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-purple-500/20">
                  <Quote className="w-5 h-5 text-purple-400" />
                </div>

                <div className="flex items-start gap-4 mb-4">
                  {/* Image Avatar - Desktop */}
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-2 ring-slate-700 flex-shrink-0">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 48px) 100vw, 48px"
                    />
                    {/* Gradient overlay for better text contrast */}
                    <div className={`absolute inset-0 bg-gradient-to-r  opacity-20`}></div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-base mb-1">{testimonial.name}</h3>
                    <p className="text-sm text-blue-400 font-medium">{testimonial.course}</p>
                    <p className="text-xs text-slate-500">{testimonial.college}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>

                <p className="text-slate-300 text-sm leading-relaxed italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Carousel - Single Card */}
        <div className="lg:hidden relative max-w-md mx-auto">
          {/* Carousel Container */}
          <div className="overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-700 ease-in-out" 
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-2">
                  <div className="relative bg-slate-950/50 backdrop-blur-sm rounded-xl border border-slate-800 p-4 max-w-sm mx-auto">
                    {/* Fixed Quote Icon Size - Made Larger */}
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-purple-500/20">
                      <Quote className="w-5 h-5 text-purple-400" />
                    </div>

                    <div className="flex items-start gap-3 mb-3">
                      {/* Image Avatar - Mobile */}
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden ring-2 ring-slate-700 flex-shrink-0">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 40px) 100vw, 40px"
                        />
                        {/* Gradient overlay for better contrast */}
                        <div className={`absolute inset-0 bg-gradient-to-r  opacity-20`}></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">{testimonial.name}</h3>
                        <p className="text-xs text-blue-400 font-medium line-clamp-1">{testimonial.course}</p>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{testimonial.college}</p>
                      </div>
                    </div>

                    <div className="flex gap-0.5 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed italic line-clamp-6">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'w-8 bg-gradient-to-r from-purple-400 to-pink-400' 
                    : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
