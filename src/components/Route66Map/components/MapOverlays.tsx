
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
        
        // More detailed and accurate Route 66 path with key points along the actual highway
        const route66DetailedCoordinates = [
          // Los Angeles, CA to San Bernardino
          {lat: 34.0522, lng: -118.2437},  // Los Angeles, CA
          {lat: 34.0825, lng: -117.8711},  // Pasadena, CA
          {lat: 34.1066, lng: -117.5931},  // San Bernardino, CA
          
          // Through Arizona
          {lat: 34.4854, lng: -114.3477},  // Needles, CA
          {lat: 35.0222, lng: -114.3716},  // Kingman, AZ
          {lat: 35.2262, lng: -112.8871},  // Seligman, AZ
          {lat: 35.2153, lng: -111.6494},  // Flagstaff, AZ
          {lat: 35.0731, lng: -110.9559},  // Winslow, AZ
          {lat: 35.0819, lng: -110.0298},  // Holbrook, AZ
          
          // Through New Mexico
          {lat: 35.3106, lng: -107.8692},  // Grants, NM
          {lat: 35.0844, lng: -106.6504},  // Albuquerque, NM
          {lat: 35.0678, lng: -106.0470},  // Moriarty, NM
          {lat: 35.0606, lng: -105.2678},  // Santa Rosa, NM
          {lat: 35.1245, lng: -103.7207},  // Tucumcari, NM
          
          // Through Texas
          {lat: 35.2220, lng: -101.8313},  // Amarillo, TX
          
          // Through Oklahoma
          {lat: 35.5089, lng: -98.9680},   // Elk City, OK
          {lat: 35.4676, lng: -97.5164},   // Oklahoma City, OK
          {lat: 36.1540, lng: -95.9928},   // Tulsa, OK
          
          // Through Missouri
          {lat: 37.0842, lng: -94.5133},   // Joplin, MO
          {lat: 37.2090, lng: -93.2923},   // Springfield, MO
          {lat: 38.7067, lng: -90.3990},   // St. Louis, MO
          
          // Through Illinois
          {lat: 39.0473, lng: -89.5104},   // Litchfield, IL
          {lat: 39.8106, lng: -89.6436},   // Springfield, IL
          {lat: 41.1306, lng: -88.8290},   // Pontiac, IL
          {lat: 41.5250, lng: -88.0817},   // Joliet, IL
          {lat: 41.8781, lng: -87.6298}    // Chicago, IL - End of Route 66
        ];
        
        // Add a polyline to represent Route 66 with more detailed styling
        const route66Path = new google.maps.Polyline({
          path: route66DetailedCoordinates,
          geodesic: true,
          strokeColor: '#B91C1C',  // Deep red color
          strokeOpacity: 0.8,
          strokeWeight: 3,
          icons: [{ 
            icon: {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 1.5,
              strokeColor: '#B91C1C',
              strokeWeight: 1.5
            },
            offset: '50px',
            repeat: '150px'  // Repeat arrows along the path
          }]
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
