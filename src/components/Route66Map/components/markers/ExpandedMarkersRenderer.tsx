
import React, { useEffect, useState } from 'react';
import { createVintageRoute66Icon } from '../HiddenGems/VintageRoute66Icon';
import { IconCreator } from '../RouteMarkers/IconCreator';
import { MarkerCluster } from './types';

interface ExpandedMarkersRendererProps {
  cluster: MarkerCluster;
  map: google.maps.Map;
  clusterMarker: google.maps.Marker | null;
  onMarkerClick: (marker: any, type: string) => void;
}

const ExpandedMarkersRenderer: React.FC<ExpandedMarkersRendererProps> = ({
  cluster,
  map,
  clusterMarker,
  onMarkerClick
}) => {
  const [expandedMarkers, setExpandedMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!map || !cluster.isExpanded || cluster.markers.length <= 1) {
      // Clean up expanded markers
      expandedMarkers.forEach(marker => marker.setMap(null));
      setExpandedMarkers([]);
      if (clusterMarker) {
        clusterMarker.setVisible(true);
      }
      return;
    }

    // Create expanded markers with detailed icons
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
        icon: createDetailedMarkerIcon(markerData.type, markerData.data),
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

function createDetailedMarkerIcon(type: string, markerData: any): google.maps.Icon {
  console.log(`🎨 Creating detailed icon for type: ${type}`);
  
  if (type === 'gem') {
    return createVintageRoute66Icon();
  }
  
  if (type === 'destination') {
    const cityName = markerData.name || 'City';
    return IconCreator.createDestinationCityIcon(cityName);
  }
  
  if (type === 'attraction') {
    return IconCreator.createRegularStopIcon(true);
  }
  
  return createVintageRoute66Icon();
}

function getMarkerTitle(markerData: any): string {
  if (markerData.type === 'gem') return `Hidden Gem: ${markerData.data.title || 'Unknown'}`;
  if (markerData.type === 'destination') return `Destination: ${markerData.data.name || 'Unknown'}`;
  if (markerData.type === 'attraction') return `Attraction: ${markerData.data.name || 'Unknown'}`;
  return 'Unknown marker';
}

export default ExpandedMarkersRenderer;
