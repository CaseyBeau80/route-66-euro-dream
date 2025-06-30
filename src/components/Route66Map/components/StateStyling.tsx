
import { useEffect } from 'react';

interface StateStylingProps {
  map: google.maps.Map;
}

const StateStyling = ({ map }: StateStylingProps) => {
  useEffect(() => {
    if (!map) return;
    
    console.log('🎨 StateStyling: Adding Route 66 state highlighting');
    
    // Create a new data layer for US states
    const statesLayer = new google.maps.Data();
    
    const loadStatesData = async () => {
      try {
        // Load US states GeoJSON
        const response = await fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json');
        const statesData = await response.json();
        
        // Add GeoJSON to the data layer
        statesLayer.addGeoJson(statesData);
        
        // Set style based on whether state is on Route 66
        statesLayer.setStyle((feature) => {
          const stateProperty = feature.getProperty('name');
          const stateName = typeof stateProperty === 'string' ? stateProperty : '';
          
          // Route 66 states to highlight
          const route66States = [
            'California', 'Arizona', 'New Mexico', 'Texas', 
            'Oklahoma', 'Kansas', 'Missouri', 'Illinois'
          ];
          
          const isRoute66State = route66States.includes(stateName);
          
          console.log(`🎨 Styling state: ${stateName} - Route 66: ${isRoute66State}`);
          
          return {
            fillColor: isRoute66State ? '#f97316' : '#d1d5db',
            fillOpacity: isRoute66State ? 0.15 : 0.05,
            strokeColor: isRoute66State ? '#c2410c' : '#9ca3af',
            strokeWeight: isRoute66State ? 2 : 0.5,
            visible: true
          };
        });
        
        // Add click events to states
        statesLayer.addListener('click', (event) => {
          const stateName = event.feature.getProperty('name');
          console.log(`🎨 State clicked: ${stateName}`);
        });
        
        // Add the layer to the map
        statesLayer.setMap(map);
        
        console.log('✅ StateStyling: Route 66 states highlighted successfully');
      } catch (error) {
        console.error('❌ StateStyling: Error loading states data:', error);
      }
    };
    
    loadStatesData();
    
    // Cleanup function
    return () => {
      console.log('🧹 StateStyling: Cleaning up states layer');
      statesLayer.setMap(null);
    };
  }, [map]);
  
  return null; // This is a non-visual component
};

export default StateStyling;
