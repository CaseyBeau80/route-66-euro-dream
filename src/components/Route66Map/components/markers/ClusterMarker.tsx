
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

    // If cluster has only one marker, show individual marker directly
    if (cluster.markers.length === 1) {
      const singleMarker = cluster.markers[0];
      const marker = new google.maps.Marker({
        position: { lat: cluster.centerLat, lng: cluster.centerLng },
        map: map,
        icon: createIndividualMarkerIcon(singleMarker.type),
        title: getMarkerTitle(singleMarker),
        zIndex: 45000
      });

      marker.addListener('click', () => {
        console.log(`🎯 Single marker clicked: ${singleMarker.id}`);
        onMarkerClick(singleMarker.data, singleMarker.type);
      });

      setClusterMarker(marker);
      return () => marker.setMap(null);
    }

    // Create cluster marker for multiple markers
    const marker = new google.maps.Marker({
      position: { lat: cluster.centerLat, lng: cluster.centerLng },
      map: map,
      icon: createClusterIcon(cluster.markers),
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
  }, [map, cluster, onExpand, onMarkerClick]);

  useEffect(() => {
    if (!map || !cluster.isExpanded || cluster.markers.length <= 1) {
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

function createClusterIcon(markers: Array<{ type: string }>): google.maps.Icon {
  const count = markers.length;
  const size = Math.min(40 + (count * 2), 60);
  
  // Determine cluster type based on majority marker type
  const typeCounts = markers.reduce((acc, marker) => {
    acc[marker.type] = (acc[marker.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const dominantType = Object.entries(typeCounts).reduce((a, b) => 
    typeCounts[a[0]] > typeCounts[b[0]] ? a : b
  )[0];

  const colors = {
    gem: '#8B5CF6',
    attraction: '#EF4444', 
    destination: '#3B82F6'
  };
  
  const color = colors[dominantType as keyof typeof colors] || '#6B7280';
  
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
  
  // Create distinctive icons based on type
  if (type === 'gem') {
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="1" dy="2" stdDeviation="1" flood-color="#000000" flood-opacity="0.3"/>
            </filter>
          </defs>
          <polygon points="15,3 21,9 21,18 15,27 9,18 9,9" fill="${color}" stroke="#fff" stroke-width="2" filter="url(#shadow)"/>
          <polygon points="15,7 18,10 18,16 15,21 12,16 12,10" fill="#fff" opacity="0.8"/>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(30, 30),
      anchor: new google.maps.Point(15, 27)
    };
  }
  
  if (type === 'destination') {
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="1" dy="2" stdDeviation="1" flood-color="#000000" flood-opacity="0.3"/>
            </filter>
          </defs>
          <circle cx="14" cy="14" r="12" fill="${color}" stroke="#fff" stroke-width="2" filter="url(#shadow)"/>
          <circle cx="14" cy="14" r="6" fill="#fff"/>
          <rect x="11" y="8" width="6" height="12" fill="${color}"/>
          <rect x="8" y="11" width="12" height="6" fill="${color}"/>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(28, 28),
      anchor: new google.maps.Point(14, 14)
    };
  }
  
  // Default attraction icon
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="1" flood-color="#000000" flood-opacity="0.3"/>
          </filter>
        </defs>
        <circle cx="13" cy="13" r="11" fill="${color}" stroke="#fff" stroke-width="2" filter="url(#shadow)"/>
        <circle cx="13" cy="13" r="5" fill="#fff"/>
      </svg>
    `)}`,
    scaledSize: new google.maps.Size(26, 26),
    anchor: new google.maps.Point(13, 13)
  };
}

function getMarkerTitle(markerData: any): string {
  if (markerData.type === 'gem') return `Hidden Gem: ${markerData.data.title || 'Unknown'}`;
  if (markerData.type === 'destination') return `Destination: ${markerData.data.name || 'Unknown'}`;
  if (markerData.type === 'attraction') return `Attraction: ${markerData.data.name || 'Unknown'}`;
  return 'Unknown marker';
}

export default ClusterMarker;
