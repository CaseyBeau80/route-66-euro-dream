
import React, { useState } from 'react';
import MapLoadingStates from './components/MapLoadingStates';
import GoogleMapsRoute66 from './GoogleMapsRoute66';
import ApiKeyInput from './components/ApiKeyInput';
import { useGoogleMaps } from './hooks/useGoogleMaps';

interface MapDisplayProps {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
  onClearSelection: () => void;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ 
  selectedState, 
  onStateClick, 
  onClearSelection 
}) => {
  // FORCE the API key to always be available - bypass all validation
  const hardcodedApiKey = 'AIzaSyCj2hJjT8wA0G3gBmUaK7qmhKX8Uv3mDH8';
  
  // Store the API key if it's not already there
  if (!localStorage.getItem('google_maps_api_key')) {
    localStorage.setItem('google_maps_api_key', hardcodedApiKey);
  }
  
  const { isLoaded, loadError } = useGoogleMaps();
  const hasApiKey = true; // FORCE this to always be true

  const handleApiKeySet = (newApiKey: string) => {
    if (newApiKey && newApiKey.trim() !== '') {
      localStorage.setItem('google_maps_api_key', newApiKey.trim());
      console.log('🔑 API key saved to localStorage:', newApiKey.substring(0, 10) + '...');
      // Force a page reload to reinitialize the Google Maps loader with the new API key
      window.location.reload();
    }
  };

  console.log('🗺️ MapDisplay render state (FORCED):', { 
    isLoaded, 
    hasError: !!loadError, 
    hasApiKey: true, // Always true now
    hardcodedApiKey: hardcodedApiKey.substring(0, 10) + '...',
    errorMessage: loadError?.message 
  });

  // REMOVED: Never show API key input anymore
  // if (!hasApiKey) { ... }

  // If there's a loading error, show the input form to re-enter key
  if (loadError) {
    console.error('❌ Google Maps API failed to load:', loadError);
    return (
      <div className="w-full h-[750px] rounded-lg overflow-hidden shadow-lg">
        <ApiKeyInput 
          onApiKeySet={handleApiKeySet} 
          error={`Failed to load Google Maps: ${loadError.message}. Please check your API key and ensure it has the necessary permissions.`}
        />
      </div>
    );
  }

  // Show loading state while Google Maps API is loading
  if (!isLoaded) {
    return (
      <div className="w-full h-[750px] rounded-lg overflow-hidden shadow-lg">
        <MapLoadingStates loadError={undefined} isLoaded={false} />
      </div>
    );
  }

  console.log('🎯 MapDisplay: Rendering GoogleMapsRoute66 successfully');

  return (
    <div className="w-full h-[750px] rounded-lg overflow-hidden shadow-lg">
      <GoogleMapsRoute66
        selectedState={selectedState}
        onStateClick={onStateClick}
        onClearSelection={onClearSelection}
      />
    </div>
  );
};

export default MapDisplay;
