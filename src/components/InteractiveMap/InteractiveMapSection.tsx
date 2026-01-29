
import React, { useState } from 'react';
import InteractiveMapDisplay from './components/InteractiveMapDisplay';

const InteractiveMapSection: React.FC = () => {
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  return (
    <section className="py-12 bg-route66-background-section">
      <div className="container mx-auto px-4">
        {/* SEO-Friendly Section Header */}
        <div className="text-center mb-12">
          <div className="bg-route66-background rounded-xl p-6 border-4 border-route66-primary shadow-xl max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-route66 text-route66-primary font-bold uppercase mb-4 tracking-wide">
              Interactive Route 66 Google Map
            </h2>
            <p className="text-lg text-route66-text-secondary max-w-2xl mx-auto leading-relaxed">
              Explore attractions, destinations, and hidden gems with interactive filtering
            </p>
          </div>
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
          
        </div>
      </div>
    </section>
  );
};

export default InteractiveMapSection;
