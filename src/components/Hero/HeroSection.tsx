
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>

        {/* All content overlaid */}
        <div className="relative z-10 flex flex-col items-center justify-between h-full py-8 px-4">
          {/* Brand + tagline */}
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-route66 font-bold uppercase tracking-wider text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)] mb-1">
              RAMBLE 66
            </h1>
            <p className="text-lg lg:text-xl xl:text-2xl font-highway font-bold text-route66-accent-gold drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)]">
              Your Guide to the Mother Road
            </p>
          </div>

          {/* CTA + countdown */}
          <div className="flex flex-col items-center gap-3">
            <Button 
              onClick={scrollToInteractiveMap} 
              size="lg" 
              className="font-bold py-4 px-10 text-lg rounded-sm border-2 border-white/30 shadow-[4px_4px_0_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0_rgba(0,0,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-300 bg-route66-primary text-white hover:bg-route66-primary/90 group"
            >
              Start Exploring
              <ArrowDown className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:animate-bounce" />
            </Button>

            <div className="inline-flex items-center gap-2 bg-black/50 backdrop-blur-sm border-2 border-white/20 rounded-sm px-4 py-1.5 shadow-[2px_2px_0_rgba(0,0,0,0.2)] text-sm">
              <span className="font-bold text-route66-accent-gold text-lg">
                {mounted ? timeLeft.days : '---'}
              </span>
              <span className="text-white/80">
                days to the Centennial
              </span>
              {celebrationsStarted && (
                <>
                  <span className="mx-1 text-white/40">•</span>
                  <span className="inline-block w-2 h-2 bg-route66-accent-gold rounded-full animate-pulse"></span>
                  <span className="text-route66-accent-gold font-semibold text-xs">
                    Celebrations underway!
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Scroll-reveal feature cards */}
      <HeroFeatures />
    </>
  );
};

export default HeroSection;
