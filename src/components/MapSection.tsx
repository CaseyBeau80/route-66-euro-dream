
import { useState } from 'react';
import Route66Map from "./Route66Map";
import Route66FunFacts from "./Route66Countdown/Route66FunFacts";
import MapLegend from "./Route66Countdown/MapLegend";
import NostalgicRoute66Banner from "./Route66Map/components/NostalgicRoute66Banner";
import { MapPin } from "lucide-react";

interface MapSectionProps {
  isMapOpen: boolean;
  setIsMapOpen: (open: boolean) => void;
}

const MapSection = ({ isMapOpen, setIsMapOpen }: MapSectionProps) => {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-route66-background via-route66-background-alt to-route66-background-section">
      <div className="max-w-7xl mx-auto">
        {/* Clean Map Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-route66-primary/10 text-route66-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
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
        
        {/* Map Container with improved design */}
        <div className="relative">
          {/* Map Display with smooth animations */}
          <div 
            className={`
              transition-all duration-700 ease-in-out overflow-hidden
              ${isMapOpen ? 'h-[500px] md:h-[600px] lg:h-[700px] opacity-100' : 'h-0 opacity-0'}
            `}
          >
            <div className="relative h-full">
              <div className="absolute -inset-4 bg-gradient-to-r from-route66-primary/5 via-route66-primary-light/10 to-route66-primary/5 rounded-3xl blur-2xl"></div>
              <div className="relative bg-route66-background rounded-2xl border border-route66-border shadow-2xl h-full overflow-hidden">
                <NostalgicRoute66Banner />
                <Route66Map />
              </div>
            </div>
          </div>
          
          {/* Map Legend - positioned better */}
          {isMapOpen && (
            <div className="absolute bottom-8 right-8 w-80 z-20 hidden xl:block">
              <div className="bg-route66-background/95 backdrop-blur-lg rounded-2xl shadow-xl border border-route66-border/50">
                <MapLegend />
              </div>
            </div>
          )}
        </div>
        
        {/* Map Controls - cleaner design */}
        {isMapOpen && (
          <div className="mt-12 bg-route66-background rounded-2xl p-8 border border-route66-border shadow-lg">
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-route66-accent-red rounded-full shadow-sm border-2 border-white"></div>
                <span className="text-route66-text-secondary font-semibold">Historic Towns</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-2 bg-route66-primary rounded-sm shadow-sm"></div>
                <span className="text-route66-text-secondary font-semibold">Route 66 Path</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-route66-accent-orange rounded-full shadow-sm border-2 border-white"></div>
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
  );
};

export default MapSection;
