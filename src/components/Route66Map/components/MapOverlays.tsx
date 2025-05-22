
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
      new google.maps.LatLng(32.5, -122.0),  // SW - Southern California
      new google.maps.LatLng(42.5, -87.0)    // NE - Chicago area
    );
    
    // Apply bounds restrictions
    map.setOptions({
      restriction: {
        latLngBounds: route66Corridor,
        strictBounds: false  // Allow some overflow but restrict excessive panning
      }
    });

    // Create a semi-transparent overlay for non-Route 66 areas
    const nonRouteOverlay = new google.maps.Rectangle({
      bounds: {
        north: 85,  // Far north (covers the entire map height)
        south: -85, // Far south
        east: 180,  // Far east (covers the entire map width)
        west: -180  // Far west
      },
      strokeOpacity: 0,
      fillColor: "#CCCCCC",
      fillOpacity: 0.35,
      map: map,
      zIndex: -1  // Place behind other elements
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
          const stateId = typeof stateProperty === 'string' 
            ? stateProperty.toLowerCase().substring(0, 2) 
            : '';
          
          const isRoute66State = route66StateIds.includes(stateId);
          
          return {
            fillColor: isRoute66State ? '#f97316' : '#d1d5db',
            fillOpacity: isRoute66State ? 0.2 : 0.1,
            strokeColor: isRoute66State ? '#c2410c' : '#9ca3af',
            strokeWeight: isRoute66State ? 1.5 : 0.5
          };
        });
        
        // Add the layer to the map
        statesLayer.setMap(map);
      } catch (error) {
        console.error('Error loading states data:', error);
      }
    };
    
    // Call function to set state styles
    setStateStyles();
    
    // Return cleanup function
    return () => {
      nonRouteOverlay.setMap(null);
    };
  }, [map]);
  
  return null; // This is a non-visual component
};

export default MapOverlays;
