
import React from 'react';
import StateHighlighting from './StateHighlighting';
import UltraSmoothRouteRenderer from '../services/UltraSmoothRouteRenderer';
import HiddenGemsContainer from './HiddenGemsContainer';
import EnhancedClusteringContainer from './clustering/EnhancedClusteringContainer';
import DestinationCitiesContainer from './DestinationCitiesContainer';
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
  if (!isMapReady) return null;

  return (
    <>
      {/* Render the ultra-smooth Route 66 with ~2000 interpolated points */}
      <UltraSmoothRouteRenderer 
        map={map}
        isMapReady={isMapReady}
      />
      
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
