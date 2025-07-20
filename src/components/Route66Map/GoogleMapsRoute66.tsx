
import React, { useCallback, useRef, useEffect, useState } from 'react';
import { useGlobalGoogleMapsContext } from '../providers/GlobalGoogleMapsProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import MapLoadingStates from './components/MapLoadingStates';
import InteractiveGoogleMap from '../InteractiveGoogleMap/InteractiveGoogleMap';
import InteractiveMapLegend from '../InteractiveMap/components/InteractiveMapLegend';
import GoogleMapsZoomControls from '../InteractiveMap/components/GoogleMapsZoomControls';
import SingleRouteRenderer from './components/SingleRouteRenderer';
import DestinationCitiesContainer from './components/DestinationCitiesContainer';
import AttractionsContainer from './components/AttractionsContainer';
import HiddenGemsContainer from './components/HiddenGemsContainer';
import DriveInsContainer from './components/DriveIns/DriveInsContainer';
import StateStyling from './components/StateStyling';

interface GoogleMapsRoute66Props {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
  onClearSelection: () => void;
}

const GoogleMapsRoute66: React.FC<GoogleMapsRoute66Props> = ({
  selectedState,
  onStateClick,
  onClearSelection
}) => {
  const { isLoaded, loadError } = useGlobalGoogleMapsContext(); // Fixed import
  const isMobile = useIsMobile();
  const mapRef = useRef<google.maps.Map | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  console.log('🗺️ GoogleMapsRoute66 render state:', {
    isLoaded,
    hasLoadError: !!loadError,
    errorMessage: loadError?.message,
    isMapReady,
    selectedState
  });

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    
    // Ensure map is fully ready before setting state
    setTimeout(() => {
      setIsMapReady(true);
    }, 500);
  }, []);

  const handleMapClick = useCallback(() => {
    onClearSelection();
  }, [onClearSelection]);

  if (loadError) {
    return <MapLoadingStates loadError={loadError} isLoaded={false} />;
  }

  if (!isLoaded) {
    return <MapLoadingStates loadError={undefined} isLoaded={false} />;
  }

  return (
    <div className="relative w-full h-full bg-gray-100" style={{ minHeight: '750px', height: '750px' }}>
      <InteractiveGoogleMap
        onMapLoad={handleMapLoad}
        onMapClick={handleMapClick}
        center={{ lat: 35.0, lng: -98.0 }}
        zoom={isMobile ? 4 : 5}
        className="w-full h-full"
        showDefaultZoomControls={false}
      >
        {/* Route 66 Content - Only render when map is ready */}
        {mapRef.current && isMapReady && (
          <>
            {/* State Styling - Highlight Route 66 states */}
            <StateStyling map={mapRef.current} />
            
            {/* SINGLE Route Renderer - This replaces all other route systems */}
            <SingleRouteRenderer map={mapRef.current} isMapReady={true} />
            
            {/* Destination Cities - Route 66 shield markers */}
            <DestinationCitiesContainer 
              map={mapRef.current}
              onDestinationClick={(destination) => {
                console.log('🏛️ Destination clicked:', destination.name);
              }}
            />
            
            {/* Attractions - Red pin markers */}
            <AttractionsContainer 
              map={mapRef.current}
              onAttractionClick={(attraction) => {
                console.log('🎯 Attraction clicked:', attraction.name);
              }}
            />
            
            {/* Hidden Gems - Diamond markers */}
            <HiddenGemsContainer 
              map={mapRef.current}
              onGemClick={(gem) => {
                console.log('💎 Hidden gem clicked:', gem.title);
              }}
            />
            
            {/* Drive-In Theaters - Movie markers */}
            <DriveInsContainer 
              map={mapRef.current}
              onDriveInClick={(driveIn) => {
                console.log('🎬 Drive-in clicked:', driveIn.name);
              }}
            />
          </>
        )}
      </InteractiveGoogleMap>

      {/* Map Legend - positioned to avoid conflicts */}
      <InteractiveMapLegend />

      {/* Custom Zoom Controls - positioned bottom-right */}
      <GoogleMapsZoomControls 
        map={mapRef.current} 
        isMapReady={isMapReady} 
      />
    </div>
  );
};

export default GoogleMapsRoute66;
