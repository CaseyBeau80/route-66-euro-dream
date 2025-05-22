
import { useEffect } from 'react';
import { route66StateIds } from '../config/MapConfig';

interface MapOverlaysProps {
  map: google.maps.Map;
}

const MapOverlays = ({ map }: MapOverlaysProps) => {
  useEffect(() => {
    if (!map) return;
    
    // Define the Route 66 corridor with a buffer
    const route66Corridor = new google.maps.LatLngBounds(
      new google.maps.LatLng(28.0, -124.0),  // SW - extend to show more of west coast
      new google.maps.LatLng(44.0, -80.0)    // NE - extend to show Chicago area better
    );
    
    // Apply bounds restrictions
    map.setOptions({
      restriction: {
        latLngBounds: route66Corridor,
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
          const stateId = stateName.toLowerCase().substring(0, 2);
          
          const isRoute66State = route66StateIds.includes(stateId);
          
          return {
            fillColor: isRoute66State ? '#f97316' : '#d1d5db',
            fillOpacity: isRoute66State ? 0.18 : 0.05,
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
          {lat: 35.0845, lng: -106.6511}, // Albuquerque, NM
          {lat: 35.2220, lng: -101.8313}, // Amarillo, TX
          {lat: 35.4676, lng: -97.5164},  // Oklahoma City, OK
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
