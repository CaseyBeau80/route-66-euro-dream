
import React, { useEffect } from 'react';
import StateHighlighting from './StateHighlighting';
import HiddenGemsContainer from './HiddenGemsContainer';
import EnhancedClusteringContainer from './clustering/EnhancedClusteringContainer';
import DestinationCitiesContainer from './DestinationCitiesContainer';
import { DestinationCitiesRouteRenderer } from '../services/DestinationCitiesRouteRenderer';
import { useDestinationCities } from '../hooks/useDestinationCities';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface MapLayersProps {
  map: google.maps.Map;
  isMapReady: boolean;
  visibleWaypoints: Route66Waypoint[];
  onDestinationClick: (destination: Route66Waypoint) => void;
  onAttractionClick: (waypoint: Route66Waypoint) => void;
}

const MapLayers: React.FC<MapLayersProps> = ({
  map,
  isMapReady,
  visibleWaypoints,
  onDestinationClick,
  onAttractionClick
}) => {
  const { destinationCities, isLoading } = useDestinationCities();

  useEffect(() => {
    if (!isMapReady || !map || isLoading || destinationCities.length === 0) {
      return;
    }

    console.log('🛣️ MapLayers: Creating Route 66 from destination cities (PRIMARY DATA SOURCE)');
    
    const routeRenderer = new DestinationCitiesRouteRenderer(map);
    
    // Create the flowing route from destination cities
    routeRenderer.createRoute66FromDestinations(destinationCities)
      .then(() => {
        console.log('✅ Route 66 created successfully from destination cities');
      })
      .catch((error) => {
        console.error('❌ Error creating Route 66 from destination cities:', error);
      });

    return () => {
      routeRenderer.cleanup();
    };
  }, [map, isMapReady, destinationCities, isLoading]);

  if (!isMapReady) return null;

  return (
    <>
      {/* Render Hidden Gems with hover cards */}
      <HiddenGemsContainer 
        map={map}
        onGemClick={(gem) => {
          console.log('✨ Hidden gem selected:', gem.title);
        }}
      />
      
      {/* Enhanced Clustering System for regular attractions (no yellow) */}
      <EnhancedClusteringContainer
        map={map}
        waypoints={visibleWaypoints.filter(w => !w.is_major_stop)}
        onMarkerClick={onAttractionClick}
      />
      
      {/* ONLY destination system - Route 66 shields with NO yellow circles */}
      <DestinationCitiesContainer
        map={map}
        waypoints={visibleWaypoints}
        onDestinationClick={onDestinationClick}
      />
    </>
  );
};

export default MapLayers;
