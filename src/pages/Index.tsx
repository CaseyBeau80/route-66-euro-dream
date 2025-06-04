
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Route66Map from "../components/Route66Map";
import ComprehensiveListings from "../components/ComprehensiveListings";
import NavigationBar from "../components/NavigationBar";
import Route66Countdown from "../components/Route66Countdown";
import Route66FunFacts from "../components/Route66Countdown/Route66FunFacts";
import MapLegend from "../components/Route66Countdown/MapLegend";
import NostalgicRoute66Banner from "../components/Route66Map/components/NostalgicRoute66Banner";
import SimpleInstagramCarousel from "../components/InstagramCarousel/components/SimpleInstagramCarousel";
import TravelResources from "../components/TravelResources";
import Hero from "../components/Hero";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Route, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Index = () => {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "nl">("en");
  const [isMapOpen, setIsMapOpen] = useState(true);
  
  console.log("🏠 Index page: Rendering with modern design system");

  return (
    <div className="min-h-screen bg-route66-background">
      {/* Navigation Bar with modern styling */}
      <NavigationBar language={language} setLanguage={setLanguage} />
      
      {/* Hero Section with modern design */}
      <div className="relative pt-16">
        <Hero 
          language={language}
          onExploreMap={() => setIsMapOpen(!isMapOpen)}
          isMapOpen={isMapOpen}
        />
      </div>

      {/* Modern Interactive Map Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-route66-background via-route66-background-alt to-route66-background-section" id="map">
        <div className="max-w-7xl mx-auto">
          {/* Modern Map Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-route66-primary/10 text-route66-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <MapPin className="w-4 h-4" />
              Interactive Experience
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-route66-text-primary mb-6">
              Explore Route 66
            </h2>
            <p className="text-xl text-route66-text-secondary max-w-3xl mx-auto leading-relaxed">
              Navigate America's most iconic highway with our interactive map featuring historic towns, attractions, and hidden gems along the Mother Road
            </p>
          </div>
          
          {/* Map Container with Modern Design */}
          <div className="relative">
            {/* Map Display with smooth animations */}
            <div 
              className={`
                transition-all duration-700 ease-in-out overflow-hidden
                ${isMapOpen ? 'h-[500px] md:h-[600px] lg:h-[700px] opacity-100' : 'h-0 opacity-0'}
              `}
            >
              <div className="relative h-full">
                <div className="absolute -inset-2 bg-gradient-to-r from-route66-primary/10 via-route66-primary-light/5 to-route66-primary/10 rounded-2xl blur-xl"></div>
                <div className="relative bg-route66-background rounded-2xl border border-route66-border shadow-2xl h-full overflow-hidden">
                  <NostalgicRoute66Banner />
                  <Route66Map />
                </div>
              </div>
            </div>
            
            {/* Modern Map Legend */}
            {isMapOpen && (
              <div className="absolute bottom-6 right-6 w-80 z-20 hidden xl:block">
                <div className="bg-route66-background/95 backdrop-blur-lg rounded-2xl shadow-xl border border-route66-border/50">
                  <MapLegend />
                </div>
              </div>
            )}
          </div>
          
          {/* Modern Map Controls */}
          {isMapOpen && (
            <div className="mt-8 bg-route66-background rounded-2xl p-6 border border-route66-border shadow-lg">
              <div className="flex flex-wrap justify-center gap-8 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-route66-accent-red rounded-full shadow-sm border border-white"></div>
                  <span className="text-route66-text-secondary font-semibold">Historic Towns</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-2 bg-route66-primary rounded-sm shadow-sm"></div>
                  <span className="text-route66-text-secondary font-semibold">Route 66 Path</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-route66-accent-orange rounded-full shadow-sm border border-white"></div>
                  <span className="text-route66-text-secondary font-semibold">Attractions</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-route66-primary text-lg">⌨️</span>
                  <span className="text-route66-text-muted font-medium">Ctrl + scroll to zoom</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Mobile Legend */}
          {isMapOpen && (
            <div className="mt-8 xl:hidden">
              <div className="bg-route66-background rounded-2xl shadow-xl border border-route66-border">
                <MapLegend />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modern Countdown & Quick Facts Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-route66-background-section via-route66-background-alt to-route66-background">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-route66-accent-orange/10 text-route66-accent-orange px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Route className="w-4 h-4" />
              Centennial Celebration
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-route66-text-primary mb-6">
              100 Years of Adventure
            </h2>
            <p className="text-xl text-route66-text-secondary max-w-3xl mx-auto leading-relaxed">
              Join us in celebrating a century of America's most beloved highway
            </p>
          </div>

          {/* Desktop Three-Column Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
            {/* Left Column - Fun Facts */}
            <div className="lg:col-span-3">
              <Route66FunFacts />
            </div>
            
            {/* Center Column - Countdown */}
            <div className="lg:col-span-6">
              <Route66Countdown />
            </div>
            
            {/* Right Column - Trip Planning */}
            <div className="lg:col-span-3">
              <div className="p-8 rounded-2xl bg-route66-background border border-route66-border shadow-xl">
                <h3 className="text-2xl font-bold text-route66-text-primary mb-6 text-center">
                  Plan Your Journey
                </h3>
                <div className="space-y-6 text-center">
                  <p className="text-route66-text-secondary leading-relaxed">
                    Ready to hit the road? Use our comprehensive trip calculator to plan your perfect Route 66 adventure.
                  </p>
                  <Link to="/trip-calculator">
                    <Button className="w-full bg-route66-primary hover:bg-route66-primary-dark text-white border-0 font-semibold py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                      Start Planning
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Responsive Layout */}
          <div className="lg:hidden space-y-12">
            {/* Countdown First on Mobile */}
            <div>
              <Route66Countdown />
            </div>
            
            {/* Two-column grid for Fun Facts and Trip Planning on tablets */}
            <div className="grid md:grid-cols-2 gap-8">
              <Route66FunFacts />
              <div className="p-8 rounded-2xl bg-route66-background border border-route66-border shadow-xl">
                <h3 className="text-2xl font-bold text-route66-text-primary mb-6 text-center">
                  Plan Your Journey
                </h3>
                <div className="space-y-6 text-center">
                  <p className="text-route66-text-secondary leading-relaxed">
                    Ready to hit the road? Use our comprehensive trip calculator to plan your perfect Route 66 adventure.
                  </p>
                  <Link to="/trip-calculator">
                    <Button className="w-full bg-route66-primary hover:bg-route66-primary-dark text-white border-0 font-semibold py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                      Start Planning
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Carousel Section */}
      <SimpleInstagramCarousel />

      {/* Travel Resources Section */}
      <TravelResources language={language} />

      {/* Comprehensive Listings Section */}
      <ComprehensiveListings />
    </div>
  );
};

export default Index;
