
import { useEffect } from 'react';

interface StateStylingProps {
  map: google.maps.Map;
}

const StateStyling = ({ map }: StateStylingProps) => {
  useEffect(() => {
    if (!map) return;
    
    console.log('🎨 StateStyling: Adding subtle Route 66 state highlighting');
    
    // Create a new data layer for US states
    const statesLayer = new google.maps.Data();
    
    const loadStatesData = async () => {
      try {
        // Load US states GeoJSON
        const response = await fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json');
        const statesData = await response.json();
        
        // Add GeoJSON to the data layer
        statesLayer.addGeoJson(statesData);
        
        // Set subtle style for Route 66 states
        statesLayer.setStyle((feature) => {
          const stateProperty = feature.getProperty('name');
          const stateName = typeof stateProperty === 'string' ? stateProperty : '';
          
          // Route 66 states to highlight
          const route66States = [
            'California', 'Arizona', 'New Mexico', 'Texas', 
            'Oklahoma', 'Kansas', 'Missouri', 'Illinois'
          ];
          
          const isRoute66State = route66States.includes(stateName);
          
          return {
            fillColor: isRoute66State ? '#ffd60a' : '#e5e7eb',
            fillOpacity: isRoute66State ? 0.1 : 0.05, // Much more subtle
            strokeColor: isRoute66State ? '#f59e0b' : '#9ca3af',
            strokeWeight: isRoute66State ? 1.5 : 0.5,
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
        
        console.log('✅ StateStyling: Subtle Route 66 states highlighted successfully');
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
