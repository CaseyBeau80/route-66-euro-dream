
import React, { useCallback, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { useGoogleMaps } from './hooks/useGoogleMaps';
import { mapBounds, mapOptions } from './config/MapConfig';
import Route66StaticPolyline from './components/Route66StaticPolyline';
import StaticRoute66Path from './components/StaticRoute66Path';
import StaticRoute66Markers from './components/StaticRoute66Markers';

interface MapDisplayProps {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ selectedState, onStateClick }) => {
  const {
    isLoaded,
    loadError,
    currentZoom,
    setCurrentZoom,
    isDragging,
    setIsDragging,
    mapRef,
    checkMapBounds
  } = useGoogleMaps();

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    console.log("🗺️ Google Map loaded successfully");
    mapRef.current = map;
    setMap(map);
    
    // Set initial zoom and center
    map.setZoom(5);
    map.setCenter({ lat: 35.5, lng: -100 }); // Center of US for Route 66
    
    // Add event listeners
    map.addListener('zoom_changed', () => {
      const newZoom = map.getZoom() || 5;
      setCurrentZoom(newZoom);
    });
    
    map.addListener('dragstart', () => {
      setIsDragging(true);
    });
    
    map.addListener('dragend', () => {
      setIsDragging(false);
      checkMapBounds();
    });
    
    map.addListener('bounds_changed', checkMapBounds);
  }, [setCurrentZoom, setIsDragging, checkMapBounds]);

  const onUnmount = useCallback(() => {
    console.log("🗺️ Google Map unmounted");
    mapRef.current = null;
    setMap(null);
  }, []);

  if (loadError) {
    return (
      <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Map Loading Error
          </h3>
          <p className="text-gray-600 mb-4">
            Unable to load Google Maps. Please check your internet connection and try again.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Route 66 Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <GoogleMap
        mapContainerStyle={{
          width: '100%',
          height: '100%'
        }}
        center={{ lat: 35.5, lng: -100 }}
        zoom={5}
        options={{
          ...mapOptions,
          restriction: {
            latLngBounds: mapBounds,
            strictBounds: false,
          },
        }}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {map && (
          <>
            <Route66StaticPolyline map={map} />
            <StaticRoute66Path map={map} enhanced={false} />
            <StaticRoute66Markers map={map} />
          </>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapDisplay;
