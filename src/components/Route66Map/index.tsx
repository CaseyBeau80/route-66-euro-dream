
import React, { useState, useEffect } from 'react';
import { GoogleMapsProvider } from './components/GoogleMapsProvider';
import MapDisplay from './MapDisplay';
import MapLoadingIndicator from './components/MapLoading';
import MapLoadError from './components/MapLoadError';
import { GoogleMapsIntegrationService } from '../TripCalculator/services/GoogleMapsIntegrationService';

const Route66Map: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyLoading, setApiKeyLoading] = useState<boolean>(true);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  // Load API key before rendering GoogleMapsProvider
  useEffect(() => {
    let mounted = true;
    
    const loadApiKey = async () => {
      try {
        console.log('🔑 Route66Map: Loading Google Maps API key...');
        setApiKeyLoading(true);
        setApiKeyError(null);
        
        const key = await GoogleMapsIntegrationService.getApiKey();
        
        if (!mounted) return;
        
        if (key && key.trim().length > 0) {
          setApiKey(key);
          console.log('✅ Route66Map: API key loaded successfully');
        } else {
          setApiKeyError('No API key available');
          console.log('❌ Route66Map: No API key available');
        }
      } catch (error) {
        if (!mounted) return;
        
        console.error('❌ Route66Map: Failed to load API key:', error);
        setApiKeyError(error instanceof Error ? error.message : 'Failed to load API key');
      } finally {
        if (mounted) {
          setApiKeyLoading(false);
        }
      }
    };

    loadApiKey();
    
    return () => {
      mounted = false;
    };
  }, []);

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
  if (apiKeyError) {
    return <MapLoadError error={apiKeyError} />;
  }

  // Only render GoogleMapsProvider when we have a valid API key
  // This prevents the loader from being called multiple times
  if (!apiKey) {
    return <MapLoadError error="No Google Maps API key configured" />;
  }

  console.log('✅ Route66Map: Rendering with valid API key');

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
