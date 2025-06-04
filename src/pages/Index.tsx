
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
  const [isMapOpen, setIsMapOpen] = useState(true); // Map starts open by default
  
  console.log("🏠 Index page: Rendering with modern color scheme and enhanced map functionality");

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

      {/* Enhanced Interactive Map Section */}
      <div className="w-full px-2 sm:px-3 py-8 bg-gradient-to-br from-route66-background via-route66-background-alt to-route66-background-section" id="map">
        <div className="max-w-7xl mx-auto">
          {/* Modern Map Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-route66-text-primary mb-3">
              Interactive Route 66 Map
            </h2>
            <p className="text-lg text-route66-text-secondary max-w-2xl mx-auto">
              Explore the legendary highway with our interactive map featuring historic towns, attractions, and hidden gems along America's Mother Road
            </p>
          </div>
          
          {/* Map Container with Modern Styling */}
          <div className="relative">
            {/* Enhanced Map Display */}
            <div 
              className={`
                transition-all duration-500 ease-in-out overflow-hidden
                ${isMapOpen ? 'h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] xl:h-[600px] opacity-100' : 'h-0 opacity-0'}
              `}
            >
              <div className="relative h-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-route66-primary/20 via-route66-primary-light/10 to-route66-primary/20 rounded-xl blur-sm"></div>
                <div className="relative bg-route66-background rounded-lg border-2 border-route66-border shadow-xl h-full">
                  <NostalgicRoute66Banner />
                  <Route66Map />
                </div>
              </div>
            </div>
            
            {/* Modern Floating Legend */}
            {isMapOpen && (
              <div className="absolute bottom-4 right-4 w-80 z-20 hidden lg:block">
                <div className="bg-route66-background/95 backdrop-blur-sm rounded-lg shadow-lg border border-route66-border">
                  <MapLegend />
                </div>
              </div>
            )}
          </div>
          
          {/* Modern Map Controls */}
          {isMapOpen && (
            <div className="mt-6 bg-route66-background rounded-lg p-4 border border-route66-border shadow-sm">
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-route66-accent-red rounded-full shadow-sm"></div>
                  <span className="text-route66-text-secondary font-medium">Historic Towns</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-route66-primary rounded-sm shadow-sm"></div>
                  <span className="text-route66-text-secondary font-medium">Route 66 Path</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-route66-accent-orange rounded-full shadow-sm"></div>
                  <span className="text-route66-text-secondary font-medium">Attractions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-route66-primary text-sm">⌨️</span>
                  <span className="text-route66-text-muted font-medium">Ctrl + scroll to zoom</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Mobile Legend */}
          {isMapOpen && (
            <div className="mt-6 lg:hidden">
              <div className="bg-route66-background rounded-lg shadow-lg border border-route66-border">
                <MapLegend />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modern Three-Column Countdown Section */}
      <div className="w-full px-4 py-12 bg-gradient-to-br from-route66-background-section via-route66-background-alt to-route66-background">
        <div className="max-w-7xl mx-auto">
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
              <div className="p-6 rounded-xl bg-route66-background border border-route66-border shadow-lg">
                <h3 className="text-xl font-bold text-route66-text-primary mb-4 text-center">
                  Plan Your Journey
                </h3>
                <div className="space-y-4 text-center">
                  <p className="text-route66-text-secondary leading-relaxed">
                    Ready to hit the road? Use our comprehensive trip calculator to plan your perfect Route 66 adventure.
                  </p>
                  <Link to="/trip-calculator">
                    <Button className="w-full bg-route66-primary hover:bg-route66-primary-dark text-white border-0 font-semibold py-3 rounded-lg transition-colors duration-200">
                      Start Planning
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Stacked Layout */}
          <div className="lg:hidden space-y-8">
            {/* Countdown First on Mobile */}
            <div>
              <Route66Countdown />
            </div>
            
            {/* Two-column grid for Fun Facts and Trip Planning on tablets */}
            <div className="grid md:grid-cols-2 gap-6">
              <Route66FunFacts />
              <div className="p-6 rounded-xl bg-route66-background border border-route66-border shadow-lg">
                <h3 className="text-xl font-bold text-route66-text-primary mb-4 text-center">
                  Plan Your Journey
                </h3>
                <div className="space-y-4 text-center">
                  <p className="text-route66-text-secondary leading-relaxed">
                    Ready to hit the road? Use our comprehensive trip calculator to plan your perfect Route 66 adventure.
                  </p>
                  <Link to="/trip-calculator">
                    <Button className="w-full bg-route66-primary hover:bg-route66-primary-dark text-white border-0 font-semibold py-3 rounded-lg transition-colors duration-200">
                      Start Planning
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
