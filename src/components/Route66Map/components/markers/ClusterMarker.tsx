
import React, { useState, useEffect, useRef } from 'react';

interface MarkerCluster {
  id: string;
  centerLat: number;
  centerLng: number;
  markers: Array<{
    id: string;
    latitude: number;
    longitude: number;
    type: 'gem' | 'attraction' | 'destination';
    data: any;
  }>;
  isExpanded: boolean;
}

interface ClusterMarkerProps {
  cluster: MarkerCluster;
  map: google.maps.Map;
  onExpand: (clusterId: string) => void;
  onMarkerClick: (marker: any, type: string) => void;
}

const ClusterMarker: React.FC<ClusterMarkerProps> = ({
  cluster,
  map,
  onExpand,
  onMarkerClick
}) => {
  const [clusterMarker, setClusterMarker] = useState<google.maps.Marker | null>(null);
  const [expandedMarkers, setExpandedMarkers] = useState<google.maps.Marker[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!map) return;

    // Create cluster marker
    const marker = new google.maps.Marker({
      position: { lat: cluster.centerLat, lng: cluster.centerLng },
      map: map,
      icon: createClusterIcon(cluster.markers.length),
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
        // Could show a preview tooltip here
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

  useEffect(() => {
    if (!map || !cluster.isExpanded) {
      // Clean up expanded markers
      expandedMarkers.forEach(marker => marker.setMap(null));
      setExpandedMarkers([]);
      return;
    }

    // Create expanded markers
    const newExpandedMarkers: google.maps.Marker[] = [];
    const angleStep = (2 * Math.PI) / cluster.markers.length;
    const radius = 0.002; // Degrees

    cluster.markers.forEach((markerData, index) => {
      const angle = index * angleStep;
      const offsetLat = radius * Math.cos(angle);
      const offsetLng = radius * Math.sin(angle);

      const expandedMarker = new google.maps.Marker({
        position: {
          lat: cluster.centerLat + offsetLat,
          lng: cluster.centerLng + offsetLng
        },
        map: map,
        icon: createIndividualMarkerIcon(markerData.type),
        title: getMarkerTitle(markerData),
        zIndex: 45000
      });

      expandedMarker.addListener('click', () => {
        console.log(`🎯 Clicked individual marker: ${markerData.id}`);
        onMarkerClick(markerData.data, markerData.type);
      });

      newExpandedMarkers.push(expandedMarker);
    });

    setExpandedMarkers(newExpandedMarkers);

    // Hide cluster marker when expanded
    if (clusterMarker) {
      clusterMarker.setVisible(false);
    }

    return () => {
      newExpandedMarkers.forEach(marker => marker.setMap(null));
      if (clusterMarker) {
        clusterMarker.setVisible(true);
      }
    };
  }, [cluster.isExpanded, map, cluster.markers, clusterMarker, onMarkerClick]);

  return null;
};

function createClusterIcon(count: number): google.maps.Icon {
  const size = Math.min(40 + (count * 2), 60);
  const color = count > 5 ? '#DC2626' : count > 2 ? '#F59E0B' : '#059669';
  
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="${color}" stroke="#fff" stroke-width="3"/>
        <text x="${size/2}" y="${size/2 + 4}" text-anchor="middle" fill="white" font-family="Arial" font-size="${Math.max(12, size/4)}" font-weight="bold">${count}</text>
      </svg>
    `)}`,
    scaledSize: new google.maps.Size(size, size),
    anchor: new google.maps.Point(size/2, size/2)
  };
}

function createIndividualMarkerIcon(type: string): google.maps.Icon {
  const colors = {
    gem: '#8B5CF6',
    attraction: '#EF4444', 
    destination: '#3B82F6'
  };
  
  const color = colors[type as keyof typeof colors] || '#6B7280';
  
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="${color}" stroke="#fff" stroke-width="2"/>
        <circle cx="12" cy="12" r="4" fill="#fff"/>
      </svg>
    `)}`,
    scaledSize: new google.maps.Size(24, 24),
    anchor: new google.maps.Point(12, 12)
  };
}

function getMarkerTitle(markerData: any): string {
  if (markerData.type === 'gem') return `Hidden Gem: ${markerData.data.title}`;
  if (markerData.type === 'destination') return `Destination: ${markerData.data.name}`;
  if (markerData.type === 'attraction') return `Attraction: ${markerData.data.name}`;
  return 'Unknown marker';
}

export default ClusterMarker;
