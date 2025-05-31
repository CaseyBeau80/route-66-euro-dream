
import React, { useEffect, useState } from 'react';
import type { Route66Waypoint } from '../../types/supabaseTypes';
import { ClusterIconGenerator } from '../../services/clustering/ClusterIconGenerator';

interface ClusterMarkerProps {
  center: { lat: number; lng: number };
  markers: Route66Waypoint[];
  map: google.maps.Map;
  onClusterClick: (markers: Route66Waypoint[]) => void;
}

const ClusterMarker: React.FC<ClusterMarkerProps> = ({
  center,
  markers,
  map,
  onClusterClick
}) => {
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    const clusterMarker = new google.maps.Marker({
      position: center,
      map: map,
      icon: ClusterIconGenerator.getClusterIcon(markers.length),
      title: `Cluster of ${markers.length} locations`,
      zIndex: 5000, // Below destination cities but above individual markers
    });

    // Add click handler
    clusterMarker.addListener('click', () => {
      console.log(`🎯 Cluster clicked with ${markers.length} markers`);
      onClusterClick(markers);
      
      // Zoom to cluster bounds
      const bounds = new google.maps.LatLngBounds();
      markers.forEach(m => {
        bounds.extend(new google.maps.LatLng(m.latitude, m.longitude));
      });
      map.fitBounds(bounds);
    });

    setMarker(clusterMarker);

    return () => {
      clusterMarker.setMap(null);
    };
  }, [center, markers, map, onClusterClick]);

  return null;
};

export default ClusterMarker;
