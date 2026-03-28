
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTimer } from "@/components/CentennialCardsSection/hooks/useTimer";
import { smoothScrollToSection } from "@/utils/smoothScroll";
import HeroFeatures from "./HeroFeatures";

const HeroSection: React.FC = () => {
  const { timeLeft, mounted } = useTimer();
  
  const celebrationsStartDate = new Date('2026-01-03');
  const now = new Date();
  const celebrationsStarted = now >= celebrationsStartDate;

  const scrollToInteractiveMap = () => {
    const mapSection = document.getElementById('interactive-map');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="relative w-full overflow-hidden" style={{ height: 'clamp(420px, 60vh, 600px)' }}>
        {/* Background video */}
        <video 
          src="/videos/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* All content overlaid */}
        <div className="relative z-10 flex flex-col items-center justify-between h-full py-8 px-4">
          {/* Brand + tagline */}
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-playfair font-bold tracking-wide text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)] mb-1">
              Ramble 66
            </h1>
            <p className="text-xl lg:text-2xl xl:text-3xl font-highway font-bold tracking-wide text-[#E8C27A] drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)]">
              Your Guide to the Mother Road
            </p>
          </div>

          {/* CTA + countdown */}
          <div className="flex flex-col items-center gap-3">
            <Button 
              onClick={scrollToInteractiveMap} 
              size="lg" 
              className="font-bold py-3 px-8 text-lg rounded-full bg-route66-primary text-white hover:bg-route66-primary/90 hover:scale-105 transition-transform duration-300 group"
            >
              Start Exploring
              <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>

            <div className="inline-flex items-center gap-2 bg-route66-primary border-2 border-white/20 rounded-sm px-5 py-2 shadow-[2px_2px_0_rgba(0,0,0,0.2)] text-base">
              <span className="font-bold text-white text-lg">
                {mounted ? timeLeft.days : '---'}
              </span>
              <span className="text-white/90">
                days to the Centennial
              </span>
              {celebrationsStarted && (
                <>
                  <span className="mx-1 text-white/40">•</span>
                  <span className="inline-block w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                  <span className="text-amber-400 font-semibold text-sm">
                    Celebrations underway!
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Route 66 shield badge */}
        <div className="absolute bottom-6 left-6 z-20 drop-shadow-[2px_2px_6px_rgba(0,0,0,0.7)]">
          <svg width="72" height="72" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* Shield shape */}
            <path 
              d="M50 2 C65 2, 78 4, 90 10 C95 13, 98 18, 98 24 L98 55 C98 65, 92 78, 80 87 L50 98 L20 87 C8 78, 2 65, 2 55 L2 24 C2 18, 5 13, 10 10 C22 4, 35 2, 50 2Z" 
              fill="white" stroke="#3D2B1F" strokeWidth="3"
            />
            <path 
              d="M50 8 C63 8, 74 10, 84 15 C88 17, 90 20, 90 24 L90 53 C90 62, 85 73, 75 81 L50 90 L25 81 C15 73, 10 62, 10 53 L10 24 C10 20, 12 17, 16 15 C26 10, 37 8, 50 8Z" 
              fill="white" stroke="#3D2B1F" strokeWidth="1.5"
            />
            {/* Text */}
            <text x="50" y="32" textAnchor="middle" fill="#3D2B1F" fontSize="14" fontWeight="bold" fontFamily="sans-serif">US</text>
            <text x="50" y="62" textAnchor="middle" fill="#3D2B1F" fontSize="34" fontWeight="900" fontFamily="sans-serif">66</text>
            <text x="50" y="78" textAnchor="middle" fill="#3D2B1F" fontSize="12" fontWeight="bold" fontFamily="sans-serif">ROUTE</text>
          </svg>
        </div>
      </section>

      {/* Scroll-reveal feature cards */}
      <HeroFeatures />
    </>
  );
};

export default HeroSection;
