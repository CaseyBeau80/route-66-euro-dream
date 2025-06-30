
import React, { useCallback, useRef, useEffect, useState } from 'react';
import { useGoogleMaps } from './hooks/useGoogleMaps';
import { useIsMobile } from '@/hooks/use-mobile';
import MapLoadingStates from './components/MapLoadingStates';
import InteractiveGoogleMap from '../InteractiveGoogleMap/InteractiveGoogleMap';
import NuclearRouteManager from './components/NuclearRouteManager';
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
  const { isLoaded, loadError } = useGoogleMaps();
  const isMobile = useIsMobile();
  const mapRef = useRef<google.maps.Map | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [contentRendered, setContentRendered] = useState(false);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    console.log('🗺️ GoogleMapsRoute66: Map loaded successfully');
    mapRef.current = map;
    
    // Ensure map is fully ready before setting state
    setTimeout(() => {
      console.log('🗺️ GoogleMapsRoute66: Setting map ready state');
      setIsMapReady(true);
      
      // Force content rendering after a short delay
      setTimeout(() => {
        console.log('🗺️ GoogleMapsRoute66: Triggering content render');
        setContentRendered(true);
      }, 500);
    }, 100);
  }, []);

  const handleMapClick = useCallback(() => {
    console.log('🗺️ GoogleMapsRoute66: Map clicked - clearing selection');
    onClearSelection();
  }, [onClearSelection]);

  // Debug logging
  useEffect(() => {
    console.log('🗺️ GoogleMapsRoute66: Component state:', {
      isLoaded,
      loadError: !!loadError,
      isMapReady,
      contentRendered,
      hasMapRef: !!mapRef.current
    });
  }, [isLoaded, loadError, isMapReady, contentRendered]);

  // Force re-render of content if map is ready but content isn't showing
  useEffect(() => {
    if (isMapReady && mapRef.current && !contentRendered) {
      console.log('🔄 Forcing content render...');
      const timer = setTimeout(() => {
        setContentRendered(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isMapReady, contentRendered]);

  if (loadError) {
    return <MapLoadingStates loadError={loadError} isLoaded={false} />;
  }

  if (!isLoaded) {
    return <MapLoadingStates loadError={undefined} isLoaded={false} />;
  }

  return (
    <div className="relative w-full h-full">
      <InteractiveGoogleMap
        onMapLoad={handleMapLoad}
        onMapClick={handleMapClick}
        center={{ lat: 35.0, lng: -98.0 }}
        zoom={isMobile ? 4 : 5}
        className="w-full h-full"
      >
        {/* Route 66 Content - Only render when both map and content are ready */}
        {mapRef.current && isMapReady && contentRendered && (
          <>
            {/* State Styling - Highlight Route 66 states */}
            <StateStyling map={mapRef.current} />
            
            {/* Route Rendering - SINGLE route system */}
            <NuclearRouteManager map={mapRef.current} isMapReady={true} />
            
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
      
      {/* Enhanced debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-3 py-2 rounded shadow-lg">
          <div>Map Ready: {isMapReady ? '✅' : '❌'}</div>
          <div>Content Ready: {contentRendered ? '✅' : '❌'}</div>
          <div>Map Ref: {mapRef.current ? '✅' : '❌'}</div>
          <div>All Systems: {mapRef.current && isMapReady && contentRendered ? '🟢 GO' : '🔴 WAIT'}</div>
        </div>
      )}
    </div>
  );
};

export default GoogleMapsRoute66;
