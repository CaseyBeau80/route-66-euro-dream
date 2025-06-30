
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

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    console.log('🗺️ GoogleMapsRoute66: Map loaded successfully');
    mapRef.current = map;
    setIsMapReady(true);
  }, []);

  const handleMapClick = useCallback(() => {
    console.log('🗺️ GoogleMapsRoute66: Map clicked - clearing selection');
    onClearSelection();
  }, [onClearSelection]);

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
        {/* Route Rendering - SINGLE route system */}
        {mapRef.current && isMapReady && (
          <>
            <NuclearRouteManager map={mapRef.current} isMapReady={isMapReady} />
            
            {/* Markers and Interactive Elements */}
            <DestinationCitiesContainer map={mapRef.current} />
            <AttractionsContainer map={mapRef.current} />
            <HiddenGemsContainer map={mapRef.current} />
            <DriveInsContainer map={mapRef.current} />
            
            {/* Debug Panel and Map Legend are now COMPLETELY DISABLED */}
          </>
        )}
      </InteractiveGoogleMap>
    </div>
  );
};

export default GoogleMapsRoute66;
