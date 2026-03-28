
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTimer } from "@/components/CentennialCardsSection/hooks/useTimer";
import { smoothScrollToSection } from "@/utils/smoothScroll";
import HeroFeatures from "./HeroFeatures";
import heroRoute66Shield from '@/assets/hero-route66-shield.png';

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
        <div className="absolute bottom-6 left-6 z-20">
          <img
            src={heroRoute66Shield}
            alt="Historic Oklahoma Route 66 sign"
            className="w-16 md:w-[72px] h-auto opacity-95"
            loading="lazy"
          />
        </div>
      </section>

      {/* Scroll-reveal feature cards */}
      <HeroFeatures />
    </>
  );
};

export default HeroSection;
