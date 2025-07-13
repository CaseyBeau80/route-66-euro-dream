import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const HeroSectionMinimal: React.FC = () => {
  console.log('✅ HeroSectionMinimal: Rendering minimal hero');

  const scrollToMap = () => {
    const mapSection = document.getElementById('interactive-map');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
          Route 66 Planner
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Plan your perfect Route 66 adventure with our interactive tools and comprehensive guides.
        </p>
        <Button 
          onClick={scrollToMap}
          size="lg"
          className="font-semibold py-4 px-8 text-lg"
        >
          Start Planning
          <ArrowDown className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
};

export default HeroSectionMinimal;