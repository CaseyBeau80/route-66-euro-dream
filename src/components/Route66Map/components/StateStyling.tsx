
import { useEffect } from 'react';
import { route66StateIds } from '../config/MapConfig';

interface StateStylingProps {
  map: google.maps.Map;
}

const StateStyling = ({ map }: StateStylingProps) => {
  useEffect(() => {
    if (!map) return;
    
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
          
          // Explicitly check if the state is Montana and ensure it's not highlighted
          if (stateName === 'Montana') {
            return {
              fillColor: '#d1d5db',
              fillOpacity: 0.1,
              strokeColor: '#9ca3af',
              strokeWeight: 0.5,
              visible: true
            };
          }
          
          // Check for Missouri specifically - this should be highlighted
          if (stateName === 'Missouri') {
            return {
              fillColor: '#f97316',
              fillOpacity: 0.1,
              strokeColor: '#c2410c',
              strokeWeight: 2,
              visible: true
            };
          }
          
          // Check for each Route 66 state by exact full name
          const isRoute66State = ['California', 'Arizona', 'New Mexico', 'Texas', 'Oklahoma', 'Kansas', 'Illinois'].includes(stateName);
          
          return {
            fillColor: isRoute66State ? '#f97316' : '#d1d5db',
            fillOpacity: 0.1,
            strokeColor: isRoute66State ? '#c2410c' : '#9ca3af',
            strokeWeight: isRoute66State ? 2 : 0.5,
            visible: true
          };
        });
        
        // Add click events to states
        statesLayer.addListener('click', (event) => {
          const stateName = event.feature.getProperty('name');
          console.log(`Clicked on state: ${stateName}`);
        });
        
        // Add the layer to the map
        statesLayer.setMap(map);
      } catch (error) {
        console.error('Error loading states data:', error);
      }
    };
    
    loadStatesData();
    
    // Cleanup function
    return () => {
      statesLayer.setMap(null);
    };
  }, [map]);
  
  return null; // This is a non-visual component
};

export default StateStyling;
