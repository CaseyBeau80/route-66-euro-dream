
import React, { useState, useEffect, useRef } from 'react';
import { ClusterIconCreator } from './ClusterIconCreator';
import SingleMarkerRenderer from './SingleMarkerRenderer';
import ExpandedMarkersRenderer from './ExpandedMarkersRenderer';
import { ClusterMarkerProps } from './types';

const ClusterMarker: React.FC<ClusterMarkerProps> = ({
  cluster,
  map,
  onExpand,
  onMarkerClick
}) => {
  const [clusterMarker, setClusterMarker] = useState<google.maps.Marker | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!map) return;

    // If cluster has only one marker, don't create cluster marker
    if (cluster.markers.length === 1) {
      if (clusterMarker) {
        clusterMarker.setMap(null);
        setClusterMarker(null);
      }
      return;
    }

    // Create cluster marker for multiple markers
    const marker = new google.maps.Marker({
      position: { lat: cluster.centerLat, lng: cluster.centerLng },
      map: map,
      icon: ClusterIconCreator.createClusterIcon(cluster.markers),
      title: `${cluster.markers.length} items`,
      zIndex: 50000
    });

    // Add click listener with delay
    marker.addListener('click', () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        console.log(`📍 Expanding cluster with ${cluster.markers.length} markers`);
        onExpand(cluster.id);
      }, 200);
    });

    // Add hover listeners
    marker.addListener('mouseover', () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        console.log(`🔍 Hovering over cluster with ${cluster.markers.length} markers`);
      }, 400);
    });

    marker.addListener('mouseout', () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    });

    setClusterMarker(marker);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      marker.setMap(null);
    };
  }, [map, cluster, onExpand]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Render single marker if cluster has only one item */}
      {cluster.markers.length === 1 && (
        <SingleMarkerRenderer
          cluster={cluster}
          map={map}
          onMarkerClick={onMarkerClick}
        />
      )}

      {/* Render expanded markers when cluster is expanded */}
      {cluster.markers.length > 1 && (
        <ExpandedMarkersRenderer
          cluster={cluster}
          map={map}
          clusterMarker={clusterMarker}
          onMarkerClick={onMarkerClick}
        />
      )}
    </>
  );
};

export default ClusterMarker;
