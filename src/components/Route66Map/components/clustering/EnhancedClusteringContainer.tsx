
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

  // Create clusters and unclustered markers
  const { clusters, unclustered } = useMemo(() => {
    if (!mapBounds) {
      return { clusters: [], unclustered: waypoints };
    }

    // Always show individual markers at high zoom levels
    if (EnhancedClusteringManager.shouldShowIndividualMarkers(currentZoom)) {
      return { clusters: [], unclustered: waypoints };
    }

    return EnhancedClusteringManager.createClusters(waypoints, currentZoom, mapBounds);
  }, [waypoints, currentZoom, mapBounds]);

  const handleClusterClick = useCallback((clusterMarkers: Route66Waypoint[]) => {
    console.log(`🎯 Cluster clicked, showing ${clusterMarkers.length} markers`);
    // Optionally show a popup with cluster contents or zoom in
  }, []);

  // Separate destination cities and other markers for rendering
  const destinationCities = unclustered.filter(wp => wp.is_major_stop === true);
  const otherMarkers = unclustered.filter(wp => wp.is_major_stop !== true);

  console.log(`🎯 Enhanced clustering render:`, {
    zoom: currentZoom,
    clusters: clusters.length,
    unclustered: unclustered.length,
    destinationCities: destinationCities.length,
    otherMarkers: otherMarkers.length
  });

  return (
    <>
      {/* Always render destination cities with highest priority */}
      <DestinationCitiesContainer
        map={map}
        waypoints={destinationCities}
        onDestinationClick={onMarkerClick}
      />

      {/* Render clusters when zoom is low */}
      {clusters.map((cluster) => (
        <ClusterMarker
          key={cluster.id}
          center={cluster.center}
          markers={cluster.markers}
          map={map}
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
