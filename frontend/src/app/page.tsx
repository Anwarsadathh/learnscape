'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Hero from '@/components/home/Hero';
import Services from '@/components/home/Services';
import FeaturedColleges from '@/components/home/FeaturedColleges';
import Statistics from '@/components/home/Statistics';
import Testimonials from '@/components/home/Testimonials';
import LanguageAcademy from '@/components/home/LanguageAcademy'; // New component
import CallToAction from '@/components/home/CallToAction';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkMaintenance() {
      try {
        // Use the backend URL from environment variable
        const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'https://learnscapeedu.com';
        const response = await fetch(`${backendUrl}/api/admin/settings/maintenance`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.maintenanceMode === true) {
            router.push('/maintenance');
            return;
          }
        }
      } catch (error) {
        console.error('Maintenance check error:', error);
      } finally {
        setLoading(false);
      }
    }

    checkMaintenance();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading LearnScape...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Hero />
      <Statistics />
      <FeaturedColleges />
      <Services />
      <LanguageAcademy /> {/* New Language Academy Section */}
      <Testimonials />
      <CallToAction />
    </div>
  );
}