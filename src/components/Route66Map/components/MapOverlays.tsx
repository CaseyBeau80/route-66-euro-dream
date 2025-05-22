
import { useEffect } from 'react';
import { route66StateIds } from '../config/MapConfig';

interface MapOverlaysProps {
  map: google.maps.Map;
}

const MapOverlays = ({ map }: MapOverlaysProps) => {
  useEffect(() => {
    if (!map) return;
    
    // Define the USA boundary with a buffer
    const usaBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(24.5, -125.0),  // SW - cover all continental US
      new google.maps.LatLng(50.0, -65.0)    // NE - cover all continental US
    );
    
    // Apply bounds restrictions
    map.setOptions({
      restriction: {
        latLngBounds: usaBounds,
        strictBounds: false  // Allow some overflow but restrict excessive panning
      }
    });
    
    // Style Route 66 states differently using Data Layers
    const setStateStyles = async () => {
      // Create a new data layer for US states
      const statesLayer = new google.maps.Data();
      
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
              fillOpacity: 0.05,
              strokeColor: '#9ca3af',
              strokeWeight: 0.5,
              visible: true
            };
          }
          
          // Check for Missouri specifically - this should be highlighted
          if (stateName === 'Missouri') {
            return {
              fillColor: '#f97316',
              fillOpacity: 0.3,
              strokeColor: '#c2410c',
              strokeWeight: 2,
              visible: true
            };
          }
          
          // Check for each Route 66 state by exact full name
          const isRoute66State = ['California', 'Arizona', 'New Mexico', 'Texas', 'Oklahoma', 'Kansas', 'Illinois'].includes(stateName);
          
          return {
            fillColor: isRoute66State ? '#f97316' : '#d1d5db',
            fillOpacity: isRoute66State ? 0.3 : 0.05,
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
        
        // Add a red polyline to represent Route 66
        const route66Coordinates = [
          {lat: 34.0522, lng: -118.2437}, // Los Angeles, CA
          {lat: 35.1983, lng: -111.6513}, // Flagstaff, AZ
          {lat: 35.0845, lng: -106.6511}, // Albuquerque, NM
          {lat: 35.2220, lng: -101.8313}, // Amarillo, TX
          {lat: 35.4676, lng: -97.5164},  // Oklahoma City, OK
          {lat: 37.2091, lng: -93.2923},  // Springfield, MO
          {lat: 38.6273, lng: -90.1979},  // St. Louis, MO
          {lat: 41.8781, lng: -87.6298}   // Chicago, IL
        ];
        
        const route66Path = new google.maps.Polyline({
          path: route66Coordinates,
          geodesic: true,
          strokeColor: '#B91C1C',
          strokeOpacity: 0.8,
          strokeWeight: 3
        });
        
        route66Path.setMap(map);
        
      } catch (error) {
        console.error('Error loading states data:', error);
      }
    };
    
    // Call function to set state styles
    setStateStyles();
    
  }, [map]);
  
  return null; // This is a non-visual component
};

export default MapOverlays;
