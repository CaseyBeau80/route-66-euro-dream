
import React from 'react';
import { Button } from '@/components/ui/button';
import { InteractiveGoogleMap } from '@/components/InteractiveGoogleMap';
import RouteMarkers from '../../Route66Map/components/RouteMarkers';
import DestinationCitiesContainer from '../../Route66Map/components/DestinationCitiesContainer';
import AttractionsContainer from '../../Route66Map/components/AttractionsContainer';
import HiddenGemsContainer from '../../Route66Map/components/HiddenGemsContainer';
import NuclearRouteManager from '../../Route66Map/components/NuclearRouteManager';
import { useSupabaseRoute66 } from '../../Route66Map/hooks/useSupabaseRoute66';

interface InteractiveMapDisplayProps {
  isMapExpanded: boolean;
  onToggleExpanded: () => void;
}

const InteractiveMapDisplay: React.FC<InteractiveMapDisplayProps> = ({
  isMapExpanded,
  onToggleExpanded
}) => {
  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  const { waypoints } = useSupabaseRoute66();

  // Route 66 path center point
  const route66Center = {
    lat: 35.0,
    lng: -98.0
  };

  const handleMapLoad = (loadedMap: google.maps.Map) => {
    console.log('🗺️ Interactive Route 66 map loaded with full content');
    setMap(loadedMap);
  };

  const handleDestinationClick = (destination: any) => {
    console.log('🏛️ Destination clicked:', destination.name);
  };

  const handleAttractionClick = (attraction: any) => {
    console.log('🎯 Attraction clicked:', attraction.name);
  };

  return (
    <div className="relative">
      <div 
        className={`
          transition-all duration-700 ease-in-out overflow-hidden rounded-2xl
          ${isMapExpanded ? 'h-[700px]' : 'h-[500px]'}
        `}
      >
        <div className="relative h-full bg-white rounded-2xl border-2 border-route66-border shadow-2xl overflow-hidden">
          {/* Use InteractiveGoogleMap as base with Route 66 content */}
          <InteractiveGoogleMap
            center={route66Center}
            zoom={5}
            className="w-full h-full"
            onMapLoad={handleMapLoad}
            onMapClick={() => {
              console.log('🗺️ Interactive Route 66 map clicked');
            }}
          >
            {/* Add Route 66 content when map is loaded */}
            {map && (
              <>
                {/* Route 66 polyline */}
                <NuclearRouteManager map={map} isMapReady={true} />
                
                {/* Destination cities */}
                <DestinationCitiesContainer
                  map={map}
                  waypoints={waypoints}
                  onDestinationClick={handleDestinationClick}
                />
                
                {/* Attractions */}
                <AttractionsContainer 
                  map={map} 
                  waypoints={waypoints}
                  onAttractionClick={handleAttractionClick}
                />
                
                {/* Hidden gems */}
                <HiddenGemsContainer map={map} />
              </>
            )}
          </InteractiveGoogleMap>
        </div>
      </div>
      
      {/* Map Controls */}
      <div className="mt-8 flex justify-center">
        <Button
          onClick={onToggleExpanded}
          className="bg-route66-primary hover:bg-route66-primary-dark text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300"
        >
          {isMapExpanded ? 'Compact View' : 'Expand Map'}
        </Button>
      </div>
    </div>
  );
};

export default InteractiveMapDisplay;
