import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import FeaturesSection from '../components/FeaturesSection';
import FaqSection from '../components/FaqSection';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <main className="grow">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;