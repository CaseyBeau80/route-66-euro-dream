
import { useEffect } from 'react';
import { MarkerCreator } from './MarkerCreator';
import { InfoWindowManager } from './InfoWindowManager';
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
    
    console.log(`🏷️ Adding ${enhanced ? 'enhanced' : 'basic'} Route 66 reference markers`);
    
    const markers: google.maps.Marker[] = [];
    const infoWindowManager = InfoWindowManager.getInstance();
    
    if (enhanced) {
      // Create enhanced highway markers
      enhancedHighwayMarkers.forEach(markerData => {
        const marker = MarkerCreator.createHighwayMarker(markerData, map, true);
        
        const infoContent = InfoWindowManager.createHighwayInfoContent(
          markerData.text,
          markerData.state,
          markerData.description
        );
        
        infoWindowManager.createInfoWindow(infoContent, marker, map);
        markers.push(marker);
      });

      // Create major stop markers
      majorStops.forEach(stop => {
        const marker = MarkerCreator.createStopMarker(stop, map);
        
        const infoContent = InfoWindowManager.createStopInfoContent(
          stop.name,
          stop.description
        );
        
        infoWindowManager.createInfoWindow(infoContent, marker, map);
        markers.push(marker);
      });
    } else {
      // Create basic highway markers
      basicHighwayMarkers.forEach(markerData => {
        const marker = MarkerCreator.createHighwayMarker(markerData, map, false);
        
        const infoContent = InfoWindowManager.createHighwayInfoContent(
          markerData.text,
          markerData.state,
          markerData.description
        );
        
        infoWindowManager.createInfoWindow(infoContent, marker, map);
        markers.push(marker);
      });
    }
    
    console.log(`✅ ${enhanced ? 'Enhanced' : 'Basic'} highway reference markers added (${markers.length} total)`);
    
    return () => {
      markers.forEach(marker => marker.setMap(null));
      infoWindowManager.closeCurrentInfoWindow();
    };
  }, [map, enhanced]);

  return null;
};

export default Route66Markers;
