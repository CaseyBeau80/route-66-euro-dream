
import React, { useEffect, useState } from 'react';
import { InfoWindow } from '@react-google-maps/api';

interface GeoJSONRoute66MapProps {
  map: google.maps.Map;
}

interface RouteSegment {
  name: string;
  description: string;
  highway: string;
}

// Type for GeoJSON feature properties
interface GeoJSONProperties {
  name?: string;
  description?: string;
  highway?: string;
}

const GeoJSONRoute66Map: React.FC<GeoJSONRoute66MapProps> = ({ map }) => {
  const [selectedSegment, setSelectedSegment] = useState<RouteSegment | null>(null);
  const [clickPosition, setClickPosition] = useState<{ lat: number, lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGeoJSONRoute = async () => {
      try {
        setIsLoading(true);
        
        // Load the GeoJSON data from the public folder
        const response = await fetch('/route66.geojson');
        if (!response.ok) {
          throw new Error(`Failed to load Route 66 data: ${response.status}`);
        }
        
        const geoJsonData = await response.json();
        console.log('🗺️ Route 66 GeoJSON data loaded:', geoJsonData);

        // Add the GeoJSON layer to the map
        const dataLayer = new google.maps.Data();
        dataLayer.addGeoJson(geoJsonData);

        // Style the Route 66 path
        dataLayer.setStyle({
          strokeColor: '#D92121', // Classic Route 66 red
          strokeWeight: 4,
          strokeOpacity: 0.8,
          clickable: true,
          zIndex: 10
        });

        // Add the data layer to the map
        dataLayer.setMap(map);

        // Handle clicks on the route
        dataLayer.addListener('click', (event: google.maps.Data.MouseEvent) => {
          if (event.latLng) {
            const feature = event.feature;
            
            // Safely extract properties with proper type checking
            const rawProperties = feature.getProperty('properties');
            const properties: GeoJSONProperties = typeof rawProperties === 'object' && rawProperties !== null 
              ? rawProperties as GeoJSONProperties 
              : {};
            
            setClickPosition({
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            });
            
            setSelectedSegment({
              name: properties.name || 'Route 66',
              description: properties.description || 'Historic Route 66 - The Mother Road',
              highway: properties.highway || 'US-66'
            });
          }
        });

        setIsLoading(false);
        console.log('✅ Route 66 GeoJSON layer added to map');

        // Cleanup function
        return () => {
          dataLayer.setMap(null);
        };
        
      } catch (err) {
        console.error('❌ Error loading Route 66 GeoJSON:', err);
        setError(err instanceof Error ? err.message : 'Failed to load route data');
        setIsLoading(false);
      }
    };

    if (map) {
      loadGeoJSONRoute();
    }
  }, [map]);

  const handleCloseInfoWindow = () => {
    setSelectedSegment(null);
    setClickPosition(null);
  };

  // Show loading or error states
  if (isLoading) {
    console.log('🔄 Loading Route 66 GeoJSON data...');
  }
  
  if (error) {
    console.warn('⚠️ Route 66 GeoJSON error:', error);
  }

  return (
    <>
      {/* Info window for clicked route segments */}
      {selectedSegment && clickPosition && (
        <InfoWindow
          position={clickPosition}
          onCloseClick={handleCloseInfoWindow}
        >
          <div className="p-2 max-w-xs">
            <h3 className="font-bold text-sm text-red-600 mb-1">
              {selectedSegment.name}
            </h3>
            <p className="text-xs text-gray-600 mb-1">
              Highway: {selectedSegment.highway}
            </p>
            <p className="text-xs text-gray-700">
              {selectedSegment.description}
            </p>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default GeoJSONRoute66Map;
