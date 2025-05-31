
import React, { useEffect, useState } from 'react';
import { createVintageRoute66Icon } from '../HiddenGems/VintageRoute66Icon';
import { IconCreator } from '../RouteMarkers/IconCreator';
import { MarkerCluster } from './types';

interface SingleMarkerRendererProps {
  cluster: MarkerCluster;
  map: google.maps.Map;
  onMarkerClick: (marker: any, type: string) => void;
}

const SingleMarkerRenderer: React.FC<SingleMarkerRendererProps> = ({
  cluster,
  map,
  onMarkerClick
}) => {
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!map || cluster.markers.length !== 1) {
      if (marker) {
        marker.setMap(null);
        setMarker(null);
      }
      return;
    }

    const singleMarker = cluster.markers[0];
    const googleMarker = new google.maps.Marker({
      position: { lat: cluster.centerLat, lng: cluster.centerLng },
      map: map,
      icon: createDetailedMarkerIcon(singleMarker.type, singleMarker.data),
      title: getMarkerTitle(singleMarker),
      zIndex: 45000
    });

    googleMarker.addListener('click', () => {
      console.log(`🎯 Single marker clicked: ${singleMarker.id}`);
      onMarkerClick(singleMarker.data, singleMarker.type);
    });

    setMarker(googleMarker);

    return () => {
      googleMarker.setMap(null);
    };
  }, [map, cluster, onMarkerClick]);

  return null;
};

function createDetailedMarkerIcon(type: string, markerData: any): google.maps.Icon {
  console.log(`🎨 Creating detailed icon for type: ${type}`);
  
  if (type === 'gem') {
    // Use the vintage Route 66 icon for hidden gems
    return createVintageRoute66Icon();
  }
  
  if (type === 'destination') {
    // Use the detailed destination city icon
    const cityName = markerData.name || 'City';
    return IconCreator.createDestinationCityIcon(cityName);
  }
  
  if (type === 'attraction') {
    // Use the detailed regular stop icon for attractions
    return IconCreator.createRegularStopIcon(true); // true for detailed version
  }
  
  // Fallback to vintage Route 66 icon
  return createVintageRoute66Icon();
}

function getMarkerTitle(markerData: any): string {
  if (markerData.type === 'gem') return `Hidden Gem: ${markerData.data.title || 'Unknown'}`;
  if (markerData.type === 'destination') return `Destination: ${markerData.data.name || 'Unknown'}`;
  if (markerData.type === 'attraction') return `Attraction: ${markerData.data.name || 'Unknown'}`;
  return 'Unknown marker';
}

export default SingleMarkerRenderer;
