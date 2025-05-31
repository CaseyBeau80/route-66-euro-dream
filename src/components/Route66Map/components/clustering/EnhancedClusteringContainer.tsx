
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Route66Waypoint } from '../../types/supabaseTypes';
import { EnhancedClusteringManager } from '../../services/EnhancedClusteringManager';
import { DestinationCityProtectionService } from '../../services/DestinationCityProtectionService';
import ClusterMarker from './ClusterMarker';
import DestinationCitiesContainer from '../DestinationCitiesContainer';
import AttractionsContainer from '../AttractionsContainer';

interface EnhancedClusteringContainerProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
  onMarkerClick: (waypoint: Route66Waypoint) => void;
}

const EnhancedClusteringContainer: React.FC<EnhancedClusteringContainerProps> = ({
  map,
  waypoints,
  onMarkerClick
}) => {
  const [currentZoom, setCurrentZoom] = useState<number>(6);
  const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds | null>(null);

  // Update zoom and bounds when map changes
  useEffect(() => {
    if (!map) return;

    const updateMapState = () => {
      const zoom = map.getZoom() || 6;
      const bounds = map.getBounds();
      setCurrentZoom(zoom);
      setMapBounds(bounds || null);
      
      console.log(`🔍 Map state updated - Zoom: ${zoom.toFixed(1)}, Bounds: ${bounds ? 'available' : 'unavailable'}`);
    };

    // Initial state
    updateMapState();

    const zoomListener = map.addListener('zoom_changed', updateMapState);
    const boundsListener = map.addListener('bounds_changed', updateMapState);

    return () => {
      google.maps.event.removeListener(zoomListener);
      google.maps.event.removeListener(boundsListener);
    };
  }, [map]);

  // Get visibility settings based on current zoom
  const visibilitySettings = useMemo(() => {
    return EnhancedClusteringManager.getVisibilitySettings(currentZoom);
  }, [currentZoom]);

  // Create clusters and unclustered markers with enhanced zoom-responsive logic
  const { clusters, unclustered } = useMemo(() => {
    if (!mapBounds) {
      return { clusters: [], unclustered: waypoints };
    }

    // Always show individual markers at high zoom levels
    if (visibilitySettings.showIndividual && !visibilitySettings.showClusters) {
      console.log(`👁️ High zoom (${currentZoom.toFixed(1)}) - showing all individual markers`);
      return { clusters: [], unclustered: waypoints };
    }

    const result = EnhancedClusteringManager.createClusters(waypoints, currentZoom, mapBounds);
    
    console.log(`🎯 Zoom-responsive clustering result:`, {
      zoom: currentZoom.toFixed(1),
      clusterLevel: visibilitySettings.clusterLevel,
      clusters: result.clusters.length,
      unclustered: result.unclustered.length,
      showClusters: visibilitySettings.showClusters,
      showIndividual: visibilitySettings.showIndividual
    });
    
    return result;
  }, [waypoints, currentZoom, mapBounds, visibilitySettings]);

  const handleClusterClick = useCallback((clusterMarkers: Route66Waypoint[]) => {
    console.log(`🎯 Enhanced cluster clicked, revealing ${clusterMarkers.length} markers`);
    
    // Show a toast or popup with cluster contents
    const locationNames = clusterMarkers.slice(0, 5).map(m => m.name).join(', ');
    const additionalCount = clusterMarkers.length > 5 ? ` and ${clusterMarkers.length - 5} more` : '';
    console.log(`📍 Cluster contains: ${locationNames}${additionalCount}`);
  }, []);

  // Separate destination cities and other markers for rendering
  const destinationCities = unclustered.filter(wp => wp.is_major_stop === true);
  const otherMarkers = unclustered.filter(wp => wp.is_major_stop !== true);

  console.log(`🎯 Enhanced clustering render:`, {
    zoom: currentZoom.toFixed(1),
    clusterLevel: visibilitySettings.clusterLevel,
    clusters: clusters.length,
    unclustered: unclustered.length,
    destinationCities: destinationCities.length,
    otherMarkers: otherMarkers.length,
    visibility: visibilitySettings
  });

  return (
    <>
      {/* Always render destination cities with highest priority */}
      <DestinationCitiesContainer
        map={map}
        waypoints={destinationCities}
        onDestinationClick={onMarkerClick}
      />

      {/* Render enhanced zoom-responsive clusters */}
      {visibilitySettings.showClusters && clusters.map((cluster) => (
        <ClusterMarker
          key={cluster.id}
          center={cluster.center}
          markers={cluster.markers}
          map={map}
          clusterLevel={cluster.clusterLevel}
          onClusterClick={handleClusterClick}
        />
      ))}

      {/* Render individual attractions that aren't clustered */}
      {otherMarkers.length > 0 && (
        <AttractionsContainer
          map={map}
          waypoints={otherMarkers}
          onAttractionClick={onMarkerClick}
        />
      )}
    </>
  );
};

export default EnhancedClusteringContainer;
