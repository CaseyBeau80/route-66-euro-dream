
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
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Route, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Index = () => {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "nl">("en");
  const [isMapOpen, setIsMapOpen] = useState(false);
  
  console.log("🏠 Index page: Rendering with restructured layout and collapsible map");

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <NavigationBar language={language} setLanguage={setLanguage} />
      
      {/* Hero Section - Doormat Design */}
      <div className="relative pt-16">
        {/* Doormat Container */}
        <div className="w-full px-4 py-12 bg-gradient-to-br from-route66-vintage-brown via-route66-rust to-route66-vintage-brown">
          <div className="max-w-6xl mx-auto">
            {/* Doormat Frame */}
            <div 
              className="relative p-8 md:p-12 lg:p-16 rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-300"
              style={{
                background: `
                  linear-gradient(145deg, #F5F5DC 0%, #F0E68C  30%, #F5F5DC 70%, #DDBF94 100%),
                  repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 4px,
                    rgba(139, 69, 19, 0.1) 4px,
                    rgba(139, 69, 19, 0.1) 8px
                  )
                `,
                border: '8px solid #8B4513',
                boxShadow: `
                  inset 0 0 30px rgba(139, 69, 19, 0.2),
                  0 20px 40px rgba(0, 0, 0, 0.3),
                  0 0 60px rgba(139, 69, 19, 0.2)
                `
              }}
            >
              {/* Decorative Border Pattern */}
              <div className="absolute inset-4 border-4 border-route66-vintage-brown rounded-lg opacity-60"></div>
              <div className="absolute inset-6 border-2 border-route66-rust rounded-lg opacity-40"></div>
              
              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Vintage Route 66 Shield */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="w-24 h-32 md:w-32 md:h-40 bg-route66-vintage-beige rounded-xl border-4 border-black shadow-xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
                      <div className="absolute inset-2 border-2 border-black rounded-lg"></div>
                      <div className="relative z-10 flex flex-col items-center justify-center h-full">
                        <div className="text-black text-sm md:text-lg font-bold font-americana tracking-wider">ROUTE</div>
                        <div className="text-black text-3xl md:text-5xl font-black leading-none font-route66">66</div>
                        <div className="text-black text-xs font-travel">AMERICA'S HIGHWAY</div>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-xl bg-route66-yellow opacity-20 blur-lg animate-pulse"></div>
                  </div>
                </div>

                {/* Welcome Message */}
                <h1 className="font-route66 text-3xl md:text-5xl lg:text-6xl leading-tight mb-6 text-route66-red drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
                  WELCOME TO THE MOTHER ROAD
                </h1>
                
                {/* Slogan */}
                <p className="font-vintage text-lg md:text-xl lg:text-2xl mb-8 text-route66-vintage-brown leading-relaxed max-w-4xl mx-auto">
                  From Chicago's Skyline to Santa Monica's Sunset • 2,448 Miles of Pure American Adventure
                </p>
                
                {/* Status Badges */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <div className="bg-route66-vintage-yellow text-black px-6 py-2 font-bold text-sm rounded-full border-2 border-black shadow-lg">
                    <Route className="inline mr-2" size={16} />
                    EST. 1926
                  </div>
                  <div className="bg-route66-orange text-white px-6 py-2 font-bold text-sm rounded-full border-2 border-black shadow-lg">
                    <MapPin className="inline mr-2" size={16} />
                    8 STATES
                  </div>
                  <div className="bg-route66-vintage-turquoise text-white px-6 py-2 font-bold text-sm rounded-full border-2 border-black shadow-lg">
                    <span className="inline mr-2">🗺️</span>
                    ENDLESS ADVENTURE
                  </div>
                </div>
                
                {/* CTA Button */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link to="/trip-calculator">
                    <Button 
                      size="lg" 
                      className="vintage-button text-lg py-6 px-12 transform hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      PLAN YOUR TRIP
                      <ArrowRight className="ml-3" size={20} />
                    </Button>
                  </Link>
                  <button 
                    onClick={() => setIsMapOpen(!isMapOpen)}
                    className="inline-flex items-center gap-2 text-route66-vintage-brown font-semibold hover:text-route66-red transition-colors duration-200"
                  >
                    <span>Explore Interactive Map</span>
                    {isMapOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>
              
              {/* Corner Decorations */}
              <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-route66-vintage-brown rounded-tl-lg"></div>
              <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-route66-vintage-brown rounded-tr-lg"></div>
              <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-route66-vintage-brown rounded-bl-lg"></div>
              <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-route66-vintage-brown rounded-br-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Interactive Map Section */}
      <Collapsible open={isMapOpen} onOpenChange={setIsMapOpen} className="w-full">
        <CollapsibleContent className="animate-accordion-down">
          <div className="w-full px-2 sm:px-3 py-6 bg-gradient-to-br from-route66-cream via-route66-tan to-route66-vintage-beige" id="map">
            <div className="max-w-7xl mx-auto">
              {/* Map Header */}
              <div className="text-center mb-6">
                <h2 className="font-route66 text-2xl md:text-3xl text-route66-red mb-2">
                  INTERACTIVE ROUTE 66 MAP
                </h2>
                <p className="font-travel text-route66-gray">
                  Click on states to explore historic towns and hidden gems along the Mother Road
                </p>
              </div>
              
              {/* Map Container with Draggable Legend */}
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Map */}
                <div className="flex-1 relative route66-authentic">
                  <div className="absolute -inset-2 bg-gradient-to-r from-route66-vintage-brown via-route66-rust to-route66-vintage-brown rounded-xl opacity-80"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-route66-vintage-yellow via-route66-cream to-route66-vintage-yellow rounded-lg opacity-60"></div>
                  <div className="relative bg-route66-cream rounded-lg p-2 border-4 border-route66-vintage-brown shadow-postcard">
                    <NostalgicRoute66Banner />
                    <Route66Map />
                  </div>
                </div>
                
                {/* Draggable Legend Sidebar */}
                <div className="lg:w-80 xl:w-96">
                  <div className="sticky top-20">
                    <MapLegend />
                  </div>
                </div>
              </div>
              
              {/* Map Controls */}
              <div className="mt-4 bg-route66-vintage-beige rounded-lg p-3 border-2 border-route66-vintage-brown">
                <div className="flex flex-wrap justify-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-route66-vintage-red rounded-full"></div>
                    <span className="font-travel text-route66-vintage-brown">Historic Towns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-route66-orange rounded"></div>
                    <span className="font-travel text-route66-vintage-brown">Route 66 Path</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-route66-vintage-turquoise rounded-full"></div>
                    <span className="font-travel text-route66-vintage-brown">Hidden Gems</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-route66-vintage-yellow">⌨️</span>
                    <span className="font-travel text-route66-vintage-brown">Ctrl + scroll to zoom</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Three-Column Countdown Section */}
      <div className="w-full px-4 py-8 bg-gradient-to-r from-route66-vintage-brown via-route66-rust to-route66-vintage-brown">
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
            
            {/* Right Column - Map Legend (Hidden since it's now in the map section) */}
            <div className="lg:col-span-3">
              <div className="p-6 rounded-lg bg-gradient-to-br from-route66-cream via-route66-tan to-route66-vintage-beige border-4 border-route66-vintage-brown">
                <h3 className="font-route66 text-xl text-route66-red mb-4 text-center">
                  TRIP PLANNING
                </h3>
                <div className="space-y-4 text-center">
                  <p className="font-travel text-route66-vintage-brown">
                    Ready to hit the road? Use our trip calculator to plan your perfect Route 66 adventure.
                  </p>
                  <Link to="/trip-calculator">
                    <Button className="w-full vintage-button">
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
              <div className="p-6 rounded-lg bg-gradient-to-br from-route66-cream via-route66-tan to-route66-vintage-beige border-4 border-route66-vintage-brown">
                <h3 className="font-route66 text-xl text-route66-red mb-4 text-center">
                  TRIP PLANNING
                </h3>
                <div className="space-y-4 text-center">
                  <p className="font-travel text-route66-vintage-brown">
                    Ready to hit the road? Use our trip calculator to plan your perfect Route 66 adventure.
                  </p>
                  <Link to="/trip-calculator">
                    <Button className="w-full vintage-button">
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
