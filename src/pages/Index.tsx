import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Route66Map from "../components/Route66Map";
import ComprehensiveListings from "../components/ComprehensiveListings";
import NavigationBar from "../components/NavigationBar";
import Route66Countdown from "../components/Route66Countdown";
import Route66FunFacts from "../components/Route66Countdown/Route66FunFacts";
import MapLegend from "../components/Route66Countdown/MapLegend";
import NostalgicRoute66Banner from "../components/Route66Map/components/NostalgicRoute66Banner";
import { Link } from "react-router-dom";

const Index = () => {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "nl">("en");
  
  console.log("🏠 Index page: Rendering with AUTHENTIC vintage travel poster theme and enhanced scroll experience");

  return (
    <div className="min-h-screen bg-gradient-to-br from-route66-cream via-route66-tan to-route66-vintage-beige vintage-paper-texture">
      {/* Navigation Bar */}
      <NavigationBar language={language} setLanguage={setLanguage} />
      
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/lovable-uploads/a51e8034-fdbf-4f32-8be1-f184bcc4f908.png" alt="Route 66 road" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="w-full px-3 sm:px-6 text-center">
            <h1 className="font-route66 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-4 animate-fade-in text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] mt-8">
              THE MOTHER ROAD AWAITS
            </h1>
            <p className="font-travel text-xl md:text-2xl mb-6 text-white drop-shadow-lg animate-fade-in leading-relaxed max-w-3xl mx-auto" style={{ animationDelay: "0.2s" }}>
              From Chicago's Skyline to Santa Monica's Sunset • The Ultimate American Road Trip Experience
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="bg-route66-vintage-yellow text-black px-6 py-2 font-bold text-sm rounded-full border-2 border-black shadow-lg animate-slow-pulse">
                <div className="font-americana">EST. 1926</div>
              </div>
              <div className="bg-route66-orange text-white px-6 py-2 font-bold text-sm rounded-full border-2 border-black shadow-lg animate-slow-pulse" style={{ animationDelay: "0.5s" }}>
                <div className="font-vintage">8 STATES</div>
              </div>
              <div className="bg-route66-vintage-turquoise text-white px-6 py-2 font-bold text-sm rounded-full border-2 border-black shadow-lg animate-slow-pulse" style={{ animationDelay: "1s" }}>
                <div className="font-americana">ENDLESS ADVENTURE</div>
              </div>
            </div>
            <div className="mt-8">
              <Link to="/trip-calculator" className="inline-block vintage-button px-8 py-3 text-lg font-bold">
                PLAN YOUR TRIP
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="h-2 bg-route66-vintage-yellow opacity-80"></div>
          <div className="h-1 bg-white opacity-60"></div>
        </div>
      </div>

      {/* Interactive Map Section */}
      <div className="w-full px-2 sm:px-3 py-3" id="map">
        <div className="relative w-full route66-authentic">
          <div className="absolute -inset-2 bg-gradient-to-r from-route66-vintage-brown via-route66-rust to-route66-vintage-brown rounded-xl opacity-80 vintage-paper-texture"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-route66-vintage-yellow via-route66-cream to-route66-vintage-yellow rounded-lg opacity-60"></div>
          <div className="relative bg-route66-cream rounded-lg p-2 border-4 border-route66-vintage-brown shadow-postcard vintage-paper-texture">
            <NostalgicRoute66Banner />
            <Route66Map />
            <div className="mt-2 bg-route66-vintage-beige rounded-lg p-3 border-2 border-route66-vintage-brown vintage-paper-texture">
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
                  <span className="font-travel text-route66-vintage-brown">Ctrl + scroll to zoom map</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            
            {/* Right Column - Map Legend */}
            <div className="lg:col-span-3">
              <MapLegend />
            </div>
          </div>

          {/* Mobile/Tablet Stacked Layout */}
          <div className="lg:hidden space-y-6">
            {/* Countdown First on Mobile */}
            <div>
              <Route66Countdown />
            </div>
            
            {/* Two-column grid for Fun Facts and Map Legend on tablets */}
            <div className="grid md:grid-cols-2 gap-6">
              <Route66FunFacts />
              <MapLegend />
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Listings Section */}
      <ComprehensiveListings />
    </div>
  );
};

export default Index;
