
import { useEffect, useState } from 'react';
import { route66StateIds } from '../config/MapConfig';

interface MapOverlaysProps {
  map: google.maps.Map;
}

// Route 66 waypoints defining key historic locations along the route
// These are ordered from Chicago to Los Angeles (east to west)
const route66Waypoints = [
  // Illinois
  {location: new google.maps.LatLng(41.8781, -87.6298), stopover: true}, // Chicago, IL - Start of Route 66
  {location: new google.maps.LatLng(41.5250, -88.0817), stopover: true}, // Joliet, IL
  {location: new google.maps.LatLng(41.1306, -88.8290), stopover: true}, // Pontiac, IL
  {location: new google.maps.LatLng(39.8003, -89.6437), stopover: true}, // Springfield, IL
  
  // Missouri
  {location: new google.maps.LatLng(38.7067, -90.3990), stopover: true}, // St. Louis, MO
  {location: new google.maps.LatLng(37.2090, -93.2923), stopover: true}, // Springfield, MO
  {location: new google.maps.LatLng(37.0842, -94.5133), stopover: true}, // Joplin, MO
  
  // Oklahoma
  {location: new google.maps.LatLng(36.1540, -95.9928), stopover: true}, // Tulsa, OK
  {location: new google.maps.LatLng(35.4676, -97.5164), stopover: true}, // Oklahoma City, OK
  {location: new google.maps.LatLng(35.5089, -98.9680), stopover: true}, // Elk City, OK
  
  // Texas
  {location: new google.maps.LatLng(35.2220, -101.8313), stopover: true}, // Amarillo, TX
  
  // New Mexico
  {location: new google.maps.LatLng(35.1245, -103.7207), stopover: true}, // Tucumcari, NM
  {location: new google.maps.LatLng(35.0844, -106.6504), stopover: true}, // Albuquerque, NM
  {location: new google.maps.LatLng(35.0820, -108.7426), stopover: true}, // Gallup, NM
  
  // Arizona
  {location: new google.maps.LatLng(35.0819, -110.0298), stopover: true}, // Holbrook, AZ
  {location: new google.maps.LatLng(35.1983, -111.6513), stopover: true}, // Flagstaff, AZ
  {location: new google.maps.LatLng(35.2262, -112.8871), stopover: true}, // Seligman, AZ
  {location: new google.maps.LatLng(35.0222, -114.3716), stopover: true}, // Kingman, AZ
  
  // California
  {location: new google.maps.LatLng(34.8409, -114.6160), stopover: true}, // Needles, CA
  {location: new google.maps.LatLng(34.8987, -117.0178), stopover: true}, // Barstow, CA
  {location: new google.maps.LatLng(34.1066, -117.5931), stopover: true}, // San Bernardino, CA
  {location: new google.maps.LatLng(34.0825, -118.0732), stopover: true}, // Pasadena, CA
  {location: new google.maps.LatLng(34.0522, -118.2437), stopover: true}, // Los Angeles, CA
  {location: new google.maps.LatLng(34.0195, -118.4912), stopover: true}, // Santa Monica, CA - End of Route 66
];

const MapOverlays = ({ map }: MapOverlaysProps) => {
  const [isRouteRendered, setIsRouteRendered] = useState(false);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

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
        
        // Create a DirectionsService object to use the Directions API
        const directionsService = new google.maps.DirectionsService();
        
        // Initialize a DirectionsRenderer with custom styling if it doesn't exist
        if (!directionsRenderer) {
          const renderer = new google.maps.DirectionsRenderer({
            suppressMarkers: false, // Show markers at major stops
            preserveViewport: true,
            polylineOptions: {
              strokeColor: '#B91C1C', // Deep red color for Route 66
              strokeOpacity: 0.8,
              strokeWeight: 3,
              icons: [{
                icon: {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale: 1.2,
                  strokeColor: '#B91C1C',
                  fillColor: '#B91C1C',
                  strokeWeight: 1
                },
                offset: '0',
                repeat: '100px'
              }]
            }
          });
          
          // Set the directions renderer to use our map
          renderer.setMap(map);
          setDirectionsRenderer(renderer);
        }
        
        // Function to render routes in chunks
        const renderRouteInChunks = async () => {
          try {
            console.log('Calculating Route 66 directions using actual roads...');
            
            // We need to break this into multiple requests due to Google Maps API limitations
            // Each request can have at most 25 waypoints (plus origin and destination)
            
            // First chunk: Chicago to Albuquerque
            const firstChunkRequest = {
              origin: route66Waypoints[0].location,
              destination: route66Waypoints[13].location, // Albuquerque
              waypoints: route66Waypoints.slice(1, 13),
              travelMode: google.maps.TravelMode.DRIVING,
              optimizeWaypoints: false, // Don't reorder - we want the historic route
              avoidHighways: false,
              avoidTolls: false
            };
            
            // Submit the first request
            directionsService.route(firstChunkRequest, (result, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                console.log('First chunk of Route 66 calculated successfully');
                
                if (directionsRenderer) {
                  directionsRenderer.setDirections(result);
                  
                  // Now calculate the second chunk: Albuquerque to Santa Monica
                  const secondChunkRequest = {
                    origin: route66Waypoints[13].location, // Albuquerque
                    destination: route66Waypoints[route66Waypoints.length - 1].location, // Santa Monica
                    waypoints: route66Waypoints.slice(14, -1),
                    travelMode: google.maps.TravelMode.DRIVING,
                    optimizeWaypoints: false,
                    avoidHighways: false,
                    avoidTolls: false
                  };
                  
                  // Create a second renderer for the second part of the route
                  const secondRenderer = new google.maps.DirectionsRenderer({
                    suppressMarkers: false,
                    preserveViewport: true,
                    polylineOptions: {
                      strokeColor: '#B91C1C',
                      strokeOpacity: 0.8,
                      strokeWeight: 3,
                      icons: [{
                        icon: {
                          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                          scale: 1.2,
                          strokeColor: '#B91C1C',
                          fillColor: '#B91C1C',
                          strokeWeight: 1
                        },
                        offset: '0',
                        repeat: '100px'
                      }]
                    }
                  });
                  
                  secondRenderer.setMap(map);
                  
                  // Submit the second request
                  directionsService.route(secondChunkRequest, (result2, status2) => {
                    if (status2 === google.maps.DirectionsStatus.OK) {
                      console.log('Second chunk of Route 66 calculated successfully');
                      secondRenderer.setDirections(result2);
                      setIsRouteRendered(true);
                    } else {
                      console.error(`Error fetching second chunk: ${status2}`);
                      createBackupRoute();
                    }
                  });
                }
              } else {
                console.error(`Error fetching directions: ${status}`);
                createBackupRoute();
              }
            });
          } catch (error) {
            console.error('Error in route rendering:', error);
            createBackupRoute();
          }
        };
        
        // Create a backup route with a simple polyline if the Directions API fails
        const createBackupRoute = () => {
          console.log('Creating backup route with polyline following historic Route 66 path');
          
          if (directionsRenderer) {
            directionsRenderer.setMap(null); // Remove existing renderer
          }
          
          // Create path coordinates for Route 66
          const route66Path = new google.maps.Polyline({
            path: route66Waypoints.map(wp => wp.location),
            geodesic: true,
            strokeColor: '#B91C1C',
            strokeOpacity: 0.8,
            strokeWeight: 3,
            icons: [{
              icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 1.2,
                strokeColor: '#B91C1C',
                strokeWeight: 1
              },
              offset: '0',
              repeat: '100px'
            }]
          });
          
          route66Path.setMap(map);
          setIsRouteRendered(true);
          
          // Also add markers for major cities
          for (let i = 0; i < route66Waypoints.length; i++) {
            if (i === 0 || i === route66Waypoints.length - 1 || i % 3 === 0) {
              const majorStopMarker = new google.maps.Marker({
                position: route66Waypoints[i].location,
                map: map,
                title: route66Waypoints[i].location.toString()
              });
            }
          }
        };
        
        // Calculate and display the route
        renderRouteInChunks();
        
      } catch (error) {
        console.error('Error loading states data:', error);
      }
    };
    
    // Call function to set state styles
    setStateStyles();
    
    // Cleanup function
    return () => {
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }
    };
  }, [map, directionsRenderer]);
  
  return null; // This is a non-visual component
};

export default MapOverlays;
