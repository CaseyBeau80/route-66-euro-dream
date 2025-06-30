
import React, { useState } from 'react';
import { mapContent } from './data/mapContent';
import FeatureCardsGrid from './components/FeatureCardsGrid';
import InteractiveMapDisplay from './components/InteractiveMapDisplay';

interface InteractiveMapSectionProps {
  language: string;
}

const InteractiveMapSection: React.FC<InteractiveMapSectionProps> = ({ language }) => {
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const content = mapContent[language as keyof typeof mapContent] || mapContent.en;

  const scrollToInteractiveMap = () => {
    const mapSection = document.getElementById('interactive-map');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-route66-background-section">
      <div className="container mx-auto px-4">
        {/* Feature Cards Grid */}
        <FeatureCardsGrid features={content.features} />

        {/* Interactive Map Display */}
        <InteractiveMapDisplay
          isMapExpanded={isMapExpanded}
          onToggleExpanded={() => setIsMapExpanded(!isMapExpanded)}
        />
      </div>
    </section>
  );
};

export default InteractiveMapSection;
