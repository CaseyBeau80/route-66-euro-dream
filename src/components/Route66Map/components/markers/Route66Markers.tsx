
import { useEffect } from 'react';
import { MarkerCreator } from './MarkerCreator';
import { 
  enhancedHighwayMarkers, 
  majorStops, 
  basicHighwayMarkers 
} from './RouteDataManager';

interface Route66MarkersProps {
  map: google.maps.Map;
  enhanced?: boolean;
}

const Route66Markers = ({ map, enhanced = false }: Route66MarkersProps) => {
  useEffect(() => {
    if (!map || typeof google === 'undefined') return;
    
    console.log(`🏷️ Adding ${enhanced ? 'enhanced' : 'basic'} Route 66 reference markers WITHOUT info windows`);
    
    const markers: google.maps.Marker[] = [];
    
    if (enhanced) {
      // Create enhanced highway markers - NO INFO WINDOWS
      enhancedHighwayMarkers.forEach(markerData => {
        const marker = MarkerCreator.createHighwayMarker(markerData, map, true);
        markers.push(marker);
      });

      // Create major stop markers - NO INFO WINDOWS
      majorStops.forEach(stop => {
        const marker = MarkerCreator.createStopMarker(stop, map);
        markers.push(marker);
      });
    } else {
      // Create basic highway markers - NO INFO WINDOWS
      basicHighwayMarkers.forEach(markerData => {
        const marker = MarkerCreator.createHighwayMarker(markerData, map, false);
        markers.push(marker);
      });
    }
    
    console.log(`✅ ${enhanced ? 'Enhanced' : 'Basic'} highway reference markers added (${markers.length} total) - NO INFO WINDOWS`);
    
    return () => {
      markers.forEach(marker => {
        // Clean up all event listeners before removing
        google.maps.event.clearInstanceListeners(marker);
        marker.setMap(null);
      });
    };
  }, [map, enhanced]);

  return null;
};

export default Route66Markers;
