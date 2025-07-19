
import React, { useState } from 'react';
import { GoogleMapsProvider } from './components/GoogleMapsProvider';
import { MapErrorHandler } from './components/MapErrorHandler';
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
    <div className="w-full h-full">
      <GoogleMapsProvider>
        <MapErrorHandler>
          <MapDisplay
            selectedState={selectedState}
            onStateClick={handleStateClick}
            onClearSelection={handleClearSelection}
          />
        </MapErrorHandler>
      </GoogleMapsProvider>
    </div>
  );
};

export default Route66Map;
