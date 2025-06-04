
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
  
  console.log("🏠 Index page: Rendering with new Route 66 color scheme and always-visible map");

  return (
    <div className="min-h-screen bg-route66-cream">
      {/* Navigation Bar with new color scheme */}
      <NavigationBar language={language} setLanguage={setLanguage} />
      
      {/* Hero Section with new design */}
      <div className="relative pt-16">
        <Hero 
          language={language}
          onExploreMap={() => setIsMapOpen(!isMapOpen)}
          isMapOpen={isMapOpen}
        />
      </div>

      {/* Always Visible Interactive Map Section with floating legend */}
      <div className="w-full px-2 sm:px-3 py-6 bg-gradient-to-br from-route66-vintage-white via-route66-cream to-route66-warm-white" id="map">
        <div className="max-w-7xl mx-auto">
          {/* Map Header */}
          <div className="text-center mb-6">
            <h2 className="font-route66 text-2xl md:text-3xl text-route66-neon-red mb-2">
              INTERACTIVE ROUTE 66 MAP
            </h2>
            <p className="font-travel text-route66-charcoal">
              Click on states to explore historic towns and hidden gems along the Mother Road
            </p>
          </div>
          
          {/* Map Container with Floating Legend */}
          <div className="relative">
            {/* Map with controlled height based on toggle */}
            <div 
              className={`
                transition-all duration-500 ease-in-out overflow-hidden
                ${isMapOpen ? 'h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] xl:h-[600px] opacity-100' : 'h-0 opacity-0'}
              `}
            >
              <div className="relative route66-authentic h-full">
                <div className="absolute -inset-2 bg-gradient-to-r from-route66-asphalt via-route66-charcoal to-route66-asphalt rounded-xl opacity-80"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-route66-sunshine-yellow via-route66-cream to-route66-sunshine-yellow rounded-lg opacity-60"></div>
                <div className="relative bg-route66-cream rounded-lg p-2 border-4 border-route66-asphalt shadow-postcard h-full">
                  <NostalgicRoute66Banner />
                  <Route66Map />
                </div>
              </div>
            </div>
            
            {/* Floating Legend - Bottom Right Corner */}
            {isMapOpen && (
              <div className="absolute bottom-4 right-4 w-80 z-20 hidden lg:block">
                <div className="bg-route66-vintage-white/95 backdrop-blur-sm rounded-lg shadow-xl border-2 border-route66-asphalt">
                  <MapLegend />
                </div>
              </div>
            )}
          </div>
          
          {/* Map Controls with new colors */}
          {isMapOpen && (
            <div className="mt-4 bg-route66-vintage-white rounded-lg p-3 border-2 border-route66-asphalt">
              <div className="flex flex-wrap justify-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-route66-neon-red rounded-full"></div>
                  <span className="font-travel text-route66-charcoal">Historic Towns</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-route66-sky-blue rounded"></div>
                  <span className="font-travel text-route66-charcoal">Route 66 Path</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-route66-vintage-turquoise rounded-full"></div>
                  <span className="font-travel text-route66-charcoal">Hidden Gems</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-route66-sunshine-yellow">⌨️</span>
                  <span className="font-travel text-route66-charcoal">Ctrl + scroll to zoom</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Mobile Legend - shown below map controls on mobile when map is open */}
          {isMapOpen && (
            <div className="mt-4 lg:hidden">
              <div className="bg-route66-vintage-white rounded-lg shadow-xl border-2 border-route66-asphalt">
                <MapLegend />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Three-Column Countdown Section with new color scheme */}
      <div className="w-full px-4 py-8 bg-gradient-to-r from-route66-asphalt via-route66-charcoal to-route66-asphalt">
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
              <div className="p-6 rounded-lg bg-gradient-to-br from-route66-cream via-route66-vintage-white to-route66-warm-white border-4 border-route66-asphalt">
                <h3 className="font-route66 text-xl text-route66-neon-red mb-4 text-center">
                  TRIP PLANNING
                </h3>
                <div className="space-y-4 text-center">
                  <p className="font-travel text-route66-charcoal">
                    Ready to hit the road? Use our trip calculator to plan your perfect Route 66 adventure.
                  </p>
                  <Link to="/trip-calculator">
                    <Button className="w-full bg-route66-neon-red hover:bg-route66-neon-red/90 text-route66-cream border-2 border-route66-dark font-bold">
                      Start Planning
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Stacked Layout */}
          <div className="lg:hidden space-y-6">
            {/* Countdown First on Mobile */}
            <div>
              <Route66Countdown />
            </div>
            
            {/* Two-column grid for Fun Facts and Trip Planning on tablets */}
            <div className="grid md:grid-cols-2 gap-6">
              <Route66FunFacts />
              <div className="p-6 rounded-lg bg-gradient-to-br from-route66-cream via-route66-vintage-white to-route66-warm-white border-4 border-route66-asphalt">
                <h3 className="font-route66 text-xl text-route66-neon-red mb-4 text-center">
                  TRIP PLANNING
                </h3>
                <div className="space-y-4 text-center">
                  <p className="font-travel text-route66-charcoal">
                    Ready to hit the road? Use our trip calculator to plan your perfect Route 66 adventure.
                  </p>
                  <Link to="/trip-calculator">
                    <Button className="w-full bg-route66-neon-red hover:bg-route66-neon-red/90 text-route66-cream border-2 border-route66-dark font-bold">
                      Start Planning
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
