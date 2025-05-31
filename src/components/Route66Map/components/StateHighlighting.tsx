
import { useEffect } from 'react';

interface StateHighlightingProps {
  map: google.maps.Map;
}

const StateHighlighting = ({ map }: StateHighlightingProps) => {
  useEffect(() => {
    if (!map) return;
    
    // Create a new data layer for Route 66 state highlighting
    const highlightLayer = new google.maps.Data();
    
    const loadStateHighlighting = async () => {
      try {
        // Load US states GeoJSON
        const response = await fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json');
        const statesData = await response.json();
        
        // Add GeoJSON to the data layer
        highlightLayer.addGeoJson(statesData);
        
        // Route 66 states to highlight
        const route66States = ['California', 'Arizona', 'New Mexico', 'Texas', 'Oklahoma', 'Kansas', 'Missouri', 'Illinois'];
        
        // Set style to highlight only Route 66 states with enhanced orange styling
        highlightLayer.setStyle((feature) => {
          const stateProperty = feature.getProperty('name');
          const stateName = typeof stateProperty === 'string' ? stateProperty : '';
          
          // Check if this is a Route 66 state
          const isRoute66State = route66States.includes(stateName);
          
          if (isRoute66State) {
            return {
              fillColor: '#ea580c', // Enhanced orange color (orange-600)
              fillOpacity: 0.08, // Slightly increased opacity for better visibility
              strokeColor: '#c2410c', // Darker orange border (orange-700)
              strokeOpacity: 0.8, // High opacity for clear borders
              strokeWeight: 2.5, // Increased border weight for better visibility
              visible: true
            };
          } else {
            // Hide non-Route 66 states from this highlighting layer
            return {
              visible: false
            };
          }
        });
        
        // Add the highlighting layer to the map
        highlightLayer.setMap(map);
        
        console.log('✅ Route 66 state highlighting added with enhanced orange styling');
      } catch (error) {
        console.error('Error loading state highlighting data:', error);
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
