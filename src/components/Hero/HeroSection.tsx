
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
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
      {/* Full-width hero image with text overlay */}
      <section className="relative w-full overflow-hidden" style={{ height: 'clamp(320px, 50vh, 500px)' }}>
        <img 
          src="/images/big-bo-hero.png"
          alt="Big Bo Ramble - Route 66 Mascot standing on Route 66"
          className="absolute inset-0 w-full h-full object-cover object-top lcp-hero-image"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50"></div>

        {/* Text overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-between py-6 px-4">
          {/* Top: Brand + tagline */}
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-route66 font-bold uppercase tracking-wider text-white drop-shadow-lg mb-1">
              RAMBLE 66
            </h1>
            <p className="text-lg lg:text-xl xl:text-2xl font-highway font-bold text-route66-accent-gold drop-shadow-lg">
              Your Guide to the Mother Road
            </p>
          </div>

          {/* Bottom: CTA + countdown */}
          <div className="flex flex-col items-center gap-3">
            <Button 
              onClick={scrollToInteractiveMap} 
              size="lg" 
              className="font-bold py-4 px-10 text-lg rounded-sm border-2 border-route66-border shadow-[4px_4px_0_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0_rgba(0,0,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-300 bg-route66-accent-red text-white hover:bg-route66-accent-red/90 group"
            >
              Start Exploring
              <ArrowDown className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:animate-bounce" />
            </Button>

            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border-2 border-route66-border rounded-sm px-4 py-1.5 shadow-[2px_2px_0_rgba(0,0,0,0.2)] text-sm">
              <span className="font-bold text-route66-accent-red text-lg">
                {mounted ? timeLeft.days : '---'}
              </span>
              <span className="text-route66-text-secondary">
                days to the Centennial
              </span>
              {celebrationsStarted && (
                <>
                  <span className="mx-1 text-route66-border">•</span>
                  <span className="inline-block w-2 h-2 bg-route66-primary rounded-full animate-pulse"></span>
                  <span className="text-route66-primary font-semibold text-xs">
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
