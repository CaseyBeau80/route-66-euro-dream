
import React, { useState } from 'react';
import MapDisplay from './MapDisplay';
import MapLoadingIndicator from './components/MapLoading';
import MapLoadError from './components/MapLoadError';
import { useGlobalGoogleMapsContext } from '../providers/GlobalGoogleMapsProvider';

const Route66Map: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const { apiKeyLoading, loadError } = useGlobalGoogleMapsContext();

  const handleStateClick = (stateId: string, stateName: string) => {
    console.log(`🗺️ State clicked: ${stateName} (${stateId})`);
    setSelectedState(stateId);
  };

  const handleClearSelection = () => {
    console.log('🗺️ Clearing state selection');
    setSelectedState(null);
  };

  // Show loading while API key is being fetched
  if (apiKeyLoading) {
    return <MapLoadingIndicator />;
  }

  // Show error if API key failed to load
  if (loadError) {
    return <MapLoadError error={loadError.message} />;
  }

  console.log('✅ Route66Map: Rendering with global provider');

  return (
    <div className="w-full h-full">
      <MapDisplay
        selectedState={selectedState}
        onStateClick={handleStateClick}
        onClearSelection={handleClearSelection}
      />
    </div>
  );
};

export default Route66Map;
