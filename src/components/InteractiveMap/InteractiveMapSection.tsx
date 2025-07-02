
import React, { useState } from 'react';
import InteractiveMapDisplay from './components/InteractiveMapDisplay';

interface InteractiveMapSectionProps {
  language: string;
}

const InteractiveMapSection: React.FC<InteractiveMapSectionProps> = ({
  language
}) => {
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  return (
    <section className="py-12 bg-route66-background-section">
      <div className="container mx-auto px-4">
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
