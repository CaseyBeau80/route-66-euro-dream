
import React, { useState } from 'react';
import MapLoadingStates from './components/MapLoadingStates';
import GoogleMapsRoute66 from './GoogleMapsRoute66';
import ApiKeyInput from './components/ApiKeyInput';
import { useGoogleMapsContext } from './components/GoogleMapsProvider';

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
  
  const { isLoaded, loadError } = useGoogleMapsContext();
  
  // NEVER check hasApiKey - always assume it's available
  const hasApiKey = true; // FORCED to true
  
  console.log('🗺️ MapDisplay render state (NUCLEAR OVERRIDE):', { 
    isLoaded, 
    hasError: !!loadError, 
    hasApiKey: true, // Always forced to true
    hardcodedApiKey: hardcodedApiKey.substring(0, 10) + '...',
    errorMessage: loadError?.message,
    bypassValidation: true
  });

  // COMPLETELY REMOVED: Never show API key input
  // The following section is PERMANENTLY DISABLED:
  /*
  if (!hasApiKey) {
    console.log('🔑 No API key available, showing input form');
    return (
      <div className="w-full h-[750px] rounded-lg overflow-hidden shadow-lg">
        <ApiKeyInput onApiKeySet={handleApiKeySet} />
      </div>
    );
  }
  */

  // If there's a loading error, show error message instead of input form
  if (loadError) {
    console.error('❌ Google Maps API failed to load:', loadError);
    return (
      <div className="w-full h-[750px] rounded-lg overflow-hidden shadow-lg flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Map Loading Error</h3>
          <p className="text-gray-600 text-sm">
            Google Maps failed to load. Please refresh the page to try again.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Error: {loadError.message}
          </p>
        </div>
      </div>
    );
  }

  // Show loading state while Google Maps API is loading
  if (!isLoaded) {
    return (
      <div className="w-full h-[750px] rounded-lg overflow-hidden shadow-lg flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Route 66 Map</h3>
          <p className="text-gray-600 text-sm">Initializing Google Maps...</p>
        </div>
      </div>
    );
  }

  console.log('🎯 MapDisplay: Rendering GoogleMapsRoute66 successfully (NUCLEAR SUCCESS)');

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
