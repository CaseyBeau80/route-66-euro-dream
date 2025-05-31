
import { useEffect } from 'react';
import { route66StateIds } from '../config/MapConfig';

interface StateHighlightingProps {
  map: google.maps.Map;
}

const StateHighlighting = ({ map }: StateHighlightingProps) => {
  useEffect(() => {
    if (!map) return;
    
    // Create a new data layer for enhanced Route 66 state highlighting
    const highlightLayer = new google.maps.Data();
    
    const loadStateHighlighting = async () => {
      try {
        // Load US states GeoJSON
        const response = await fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json');
        const statesData = await response.json();
        
        // Add GeoJSON to the data layer
        highlightLayer.addGeoJson(statesData);
        
        console.log('🗺️ Enhanced Route 66 states for highlighting:', route66StateIds);
        
        // Set enhanced styling for Route 66 states including Arkansas
        highlightLayer.setStyle((feature) => {
          const stateProperty = feature.getProperty('name');
          const stateName = typeof stateProperty === 'string' ? stateProperty : '';
          
          // Check if this is a Route 66 state (including Arkansas)
          const isRoute66State = route66StateIds.includes(stateName);
          
          if (isRoute66State) {
            return {
              fillColor: '#f97316', // Enhanced orange color (orange-500)
              fillOpacity: 0.12, // Increased opacity for better visibility
              strokeColor: '#ea580c', // Darker orange border (orange-600)
              strokeOpacity: 0.9, // High opacity for clear borders
              strokeWeight: 3, // Increased border weight for prominence
              visible: true
            };
          } else {
            // Subtly style non-Route 66 states
            return {
              fillColor: '#e5e7eb', // Light gray
              fillOpacity: 0.05, // Very subtle
              strokeColor: '#d1d5db', // Light gray border
              strokeOpacity: 0.3,
              strokeWeight: 1,
              visible: true
            };
          }
        });
        
        // Add the highlighting layer to the map
        highlightLayer.setMap(map);
        
        console.log('✅ Enhanced Route 66 state highlighting added with Arkansas included');
      } catch (error) {
        console.error('❌ Error loading enhanced state highlighting data:', error);
      }
    };
    
    loadStateHighlighting();
    
    // Cleanup function
    return () => {
      highlightLayer.setMap(null);
    };
  }, [map]);
  
  return null; // This is a non-visual component
};

export default StateHighlighting;
