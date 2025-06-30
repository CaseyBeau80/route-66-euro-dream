
import React, { useState } from 'react';
import InteractiveMapDisplay from './components/InteractiveMapDisplay';
import InteractiveMapLegend from './components/InteractiveMapLegend';

interface InteractiveMapSectionProps {
  language: string;
}

const InteractiveMapSection: React.FC<InteractiveMapSectionProps> = ({ language }) => {
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  return (
    <section className="py-20 bg-route66-background-section">
      <div className="container mx-auto px-4">
        {/* Map Legend - moved to top position */}
        <div className="mb-6">
          <InteractiveMapLegend />
        </div>

        {/* Interactive Map Display */}
        <div className="relative">
          <InteractiveMapDisplay
            isMapExpanded={isMapExpanded}
            onToggleExpanded={() => setIsMapExpanded(!isMapExpanded)}
          />
        </div>

        {/* Additional info section */}
        <div className="mt-8">
          <div className="bg-route66-background rounded-2xl p-6 border border-route66-border shadow-lg">
            <h3 className="text-xl font-bold text-route66-text-primary mb-4">
              Discover Route 66's Hidden Stories
            </h3>
            <div className="space-y-4 text-route66-text-secondary">
              <p className="leading-relaxed">
                Each marker on our interactive map tells a unique story of America's Mother Road. 
                From the iconic Route 66 shields marking historic cities to the hidden gems that 
                only locals know about.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-route66-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-route66-primary font-bold text-sm">2.4K</span>
                  </div>
                  <span className="text-sm">Miles of Adventure</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-route66-accent-red/10 rounded-full flex items-center justify-center">
                    <span className="text-route66-accent-red font-bold text-sm">8</span>
                  </div>
                  <span className="text-sm">States to Explore</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600/10 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">50+</span>
                  </div>
                  <span className="text-sm">Hidden Gems</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-route66-accent-orange/10 rounded-full flex items-center justify-center">
                    <span className="text-route66-accent-orange font-bold text-sm">100+</span>
                  </div>
                  <span className="text-sm">Historic Attractions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveMapSection;
