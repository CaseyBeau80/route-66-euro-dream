
import React, { useState } from 'react';
import { GoogleMapsProvider } from './components/GoogleMapsProvider';
import MapDisplay from './MapDisplay';

const Route66Map: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleStateClick = (stateId: string, stateName: string) => {
    console.log(`🗺️ State clicked: ${stateName} (${stateId})`);
    setSelectedState(stateId);
  };

  const handleClearSelection = () => {
    console.log('🗺️ Clearing state selection');
    setSelectedState(null);
  };

  return (
    <GoogleMapsProvider>
      <div className="w-full h-full">
        <MapDisplay
          selectedState={selectedState}
          onStateClick={handleStateClick}
          onClearSelection={handleClearSelection}
        />
      </div>
    </GoogleMapsProvider>
  );
};

export default Route66Map;
