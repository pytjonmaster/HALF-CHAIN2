import React from 'react';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import CTASection from '@/components/CTASection';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1729] via-[#121032] via-[#162138] via-[#1A2847] to-[#21325A]">
      <HeroSection />
      
      <div className="bg-gradient-to-br from-[#0F1729] via-[#121032] via-[#162138] via-[#1A2847] to-[#21325A]">
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </div>
    </div>
  );
};

export default HomePage;
