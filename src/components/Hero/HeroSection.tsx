
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
      <section className="relative bg-route66-background overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 pt-10 pb-8">
          {/* Centered layout */}
          <div className="flex flex-col items-center text-center">
            {/* Brand Name */}
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-route66 font-bold uppercase tracking-wider text-route66-primary mb-2">
              RAMBLE 66
            </h1>

            {/* Value Prop */}
            <p className="text-xl lg:text-2xl xl:text-3xl font-highway font-bold text-pink-600 mb-6">
              Your Guide to the Mother Road
            </p>

            {/* Big Bo - full width, centered */}
            <div className="w-full max-w-2xl mx-auto mb-6">
              <img 
                src="/lovable-uploads/8f23e082-56b6-4339-abeb-dc34f7a2c0c2.png"
                alt="Big Bo Ramble - Route 66 Mascot"
                className="w-full h-auto object-contain lcp-hero-image"
                width={588}
                height={803}
                loading="eager"
                fetchPriority="high"
                decoding="sync"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 672px"
                style={{ 
                  aspectRatio: '588/803',
                  contentVisibility: 'auto',
                  containIntrinsicSize: '588px 803px'
                }}
              />
            </div>

            {/* CTA Button */}
            <Button 
              onClick={scrollToInteractiveMap} 
              size="lg" 
              className="font-bold py-4 px-10 text-lg rounded-sm border-2 border-route66-border shadow-[4px_4px_0_hsl(var(--route66-border))] hover:shadow-[2px_2px_0_hsl(var(--route66-border))] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-300 bg-route66-primary text-white hover:bg-route66-primary-dark group mb-4"
            >
              Start Exploring
              <ArrowDown className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:animate-bounce" />
            </Button>

            {/* Countdown Badge */}
            <div className="inline-flex items-center gap-2 bg-route66-surface border-2 border-route66-border rounded-sm px-4 py-2 shadow-[2px_2px_0_hsl(var(--route66-border))] text-sm">
              <span className="font-bold text-pink-600 text-lg">
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
