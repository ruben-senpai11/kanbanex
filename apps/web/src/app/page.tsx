'use client';

import React from 'react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingHero } from '@/components/landing/LandingHero';
import { InteractiveDemoShowcase } from '@/components/landing/InteractiveDemoShowcase';
import { InteractiveBentoGrid } from '@/components/landing/InteractiveBentoGrid';
import { InteractivePricingSection } from '@/components/landing/InteractivePricingSection';
import { InteractiveFAQ } from '@/components/landing/InteractiveFAQ';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0D11] text-slate-100 selection:bg-orange-500 selection:text-white overflow-x-hidden relative">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-orange-600/10 blur-[140px] rounded-full" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-amber-600/5 blur-[160px] rounded-full" />
        <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-orange-500/5 blur-[160px] rounded-full" />
      </div>

      {/* 1. Floating Top Navbar */}
      <LandingNavbar />

      {/* 2. Impactful Hero Section */}
      <LandingHero />

      {/* 3. Live Interactive Demonstrative Showcase (ClickUp Style) */}
      <InteractiveDemoShowcase />

      {/* 4. Feature Bento Grid */}
      <InteractiveBentoGrid />

      {/* 5. Transparent Pricing with Annual Discount Switch */}
      <InteractivePricingSection />

      {/* 6. Expandable Interactive FAQ */}
      <InteractiveFAQ />

      {/* 7. Comprehensive Footer with Legal Links */}
      <LandingFooter />
    </div>
  );
}
