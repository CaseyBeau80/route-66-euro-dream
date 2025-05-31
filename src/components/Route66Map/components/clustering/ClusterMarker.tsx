
import React, { useEffect, useState } from 'react';
import type { Route66Waypoint } from '../../types/supabaseTypes';
import { ClusterIconGenerator } from '../../services/clustering/ClusterIconGenerator';

interface ClusterMarkerProps {
  center: { lat: number; lng: number };
  markers: Route66Waypoint[];
  map: google.maps.Map;
  onClusterClick: (markers: Route66Waypoint[]) => void;
  clusterLevel?: 'ultra' | 'large' | 'medium' | 'small';
}

const ClusterMarker: React.FC<ClusterMarkerProps> = ({
  center,
  markers,
  map,
  onClusterClick,
  clusterLevel = 'medium'
}) => {
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    console.log(`🎯 Creating ${clusterLevel} cluster marker with ${markers.length} attractions`);

    const clusterMarker = new google.maps.Marker({
      position: center,
      map: map,
      icon: ClusterIconGenerator.getClusterIcon(markers.length, clusterLevel),
      title: `${clusterLevel} cluster of ${markers.length} locations`,
      zIndex: 5000 + (clusterLevel === 'ultra' ? 1000 : clusterLevel === 'large' ? 800 : clusterLevel === 'medium' ? 600 : 400),
      optimized: false // Better rendering for custom SVG icons
    });

    // Enhanced click handler with zoom-to-fit functionality
    clusterMarker.addListener('click', () => {
      console.log(`🎯 ${clusterLevel} cluster clicked with ${markers.length} markers`);
      onClusterClick(markers);
      
      // Calculate bounds for all markers in cluster
      const bounds = new google.maps.LatLngBounds();
      markers.forEach(m => {
        bounds.extend(new google.maps.LatLng(m.latitude, m.longitude));
      });
      
      // Add padding and zoom to fit - using correct Google Maps padding format
      map.fitBounds(bounds, { 
        top: 50, right: 50, bottom: 50, left: 50
      });
      
      // Ensure we don't zoom in too much
      setTimeout(() => {
        const currentZoom = map.getZoom();
        if (currentZoom && currentZoom > 12) {
          map.setZoom(12);
        }
      }, 500);
    });

    // Enhanced hover effects for better user feedback
    clusterMarker.addListener('mouseover', () => {
      console.log(`🎯 Hovering over ${clusterLevel} cluster with ${markers.length} markers`);
      // Could add hover effects here in the future
    });

    setMarker(clusterMarker);

    return () => {
      console.log(`🧹 Cleaning up ${clusterLevel} cluster marker`);
      clusterMarker.setMap(null);
    };
  }, [center, markers, map, onClusterClick, clusterLevel]);

  return null;
};

export default ClusterMarker;
