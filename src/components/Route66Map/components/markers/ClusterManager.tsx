
import React, { useState, useEffect, useMemo } from 'react';
import { MarkerClusteringService } from '../../utils/markerClustering';
import ClusterMarker from './ClusterMarker';
import { useSupabaseRoute66 } from '../../hooks/useSupabaseRoute66';

interface ClusterManagerProps {
  map: google.maps.Map;
  hiddenGems: any[];
  attractions: any[];
  destinations: any[];
  onGemClick: (gem: any) => void;
  onAttractionClick: (attraction: any) => void;
  onDestinationClick: (destination: any) => void;
}

const ClusterManager: React.FC<ClusterManagerProps> = ({
  map,
  hiddenGems,
  attractions,
  destinations,
  onGemClick,
  onAttractionClick,
  onDestinationClick
}) => {
  const [expandedClusters, setExpandedClusters] = useState<Set<string>>(new Set());

  // Combine all markers into a single array for clustering
  const allMarkers = useMemo(() => {
    const markers: any[] = [];

    // Add hidden gems
    hiddenGems.forEach(gem => {
      markers.push({
        id: `gem-${gem.id}`,
        latitude: Number(gem.latitude),
        longitude: Number(gem.longitude),
        type: 'gem',
        data: gem
      });
    });

    // Add attractions (non-major stops only to avoid duplicate destinations)
    attractions.filter(attr => !attr.is_major_stop).forEach(attraction => {
      markers.push({
        id: `attraction-${attraction.id}`,
        latitude: attraction.latitude,
        longitude: attraction.longitude,
        type: 'attraction',
        data: attraction
      });
    });

    // Add destinations (major stops only)
    destinations.filter(dest => dest.is_major_stop).forEach(destination => {
      markers.push({
        id: `destination-${destination.id}`,
        latitude: destination.latitude,
        longitude: destination.longitude,
        type: 'destination',
        data: destination
      });
    });

    return markers;
  }, [hiddenGems, attractions, destinations]);

  // Generate clusters
  const clusters = useMemo(() => {
    const clustered = MarkerClusteringService.clusterMarkers(allMarkers);
    
    // Mark expanded clusters
    return clustered.map(cluster => ({
      ...cluster,
      isExpanded: expandedClusters.has(cluster.id)
    }));
  }, [allMarkers, expandedClusters]);

  const handleExpandCluster = (clusterId: string) => {
    setExpandedClusters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(clusterId)) {
        newSet.delete(clusterId);
      } else {
        newSet.add(clusterId);
      }
      return newSet;
    });
  };

  const handleMarkerClick = (markerData: any, type: string) => {
    switch (type) {
      case 'gem':
        onGemClick(markerData);
        break;
      case 'attraction':
        onAttractionClick(markerData);
        break;
      case 'destination':
        onDestinationClick(markerData);
        break;
    }
  };

  console.log(`🗂️ ClusterManager: Generated ${clusters.length} clusters from ${allMarkers.length} markers`);
  clusters.forEach(cluster => {
    if (cluster.markers.length > 1) {
      console.log(`  📍 Cluster ${cluster.id}: ${cluster.markers.length} markers at ${cluster.centerLat.toFixed(4)}, ${cluster.centerLng.toFixed(4)}`);
    }
  });

  return (
    <>
      {clusters.map(cluster => (
        <ClusterMarker
          key={cluster.id}
          cluster={cluster}
          map={map}
          onExpand={handleExpandCluster}
          onMarkerClick={handleMarkerClick}
        />
      ))}
    </>
  );
};

export default ClusterManager;
