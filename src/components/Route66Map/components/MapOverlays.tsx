
import { useEffect, useState } from 'react';
import { route66StateIds } from '../config/MapConfig';

interface MapOverlaysProps {
  map: google.maps.Map;
}

// Route 66 waypoints defining key historic locations along the route
// These are ordered from Chicago to Los Angeles (east to west)
const route66Waypoints = [
  // Illinois
  {location: {lat: 41.8781, lng: -87.6298}, stopover: true}, // Chicago, IL - Start of Route 66
  {location: {lat: 41.5250, lng: -88.0817}, stopover: true}, // Joliet, IL
  {location: {lat: 41.1306, lng: -88.8290}, stopover: true}, // Pontiac, IL
  {location: {lat: 39.8003, lng: -89.6437}, stopover: true}, // Springfield, IL
  
  // Missouri
  {location: {lat: 38.7067, lng: -90.3990}, stopover: true}, // St. Louis, MO
  {location: {lat: 37.2090, lng: -93.2923}, stopover: true}, // Springfield, MO
  {location: {lat: 37.0842, lng: -94.5133}, stopover: true}, // Joplin, MO
  
  // Oklahoma
  {location: {lat: 36.1540, lng: -95.9928}, stopover: true}, // Tulsa, OK
  {location: {lat: 35.4676, lng: -97.5164}, stopover: true}, // Oklahoma City, OK
  {location: {lat: 35.5089, lng: -98.9680}, stopover: true}, // Elk City, OK
  
  // Texas
  {location: {lat: 35.2220, lng: -101.8313}, stopover: true}, // Amarillo, TX
  
  // New Mexico
  {location: {lat: 35.1245, lng: -103.7207}, stopover: true}, // Tucumcari, NM
  {location: {lat: 35.0844, lng: -106.6504}, stopover: true}, // Albuquerque, NM
  {location: {lat: 35.0820, lng: -108.7426}, stopover: true}, // Gallup, NM
  
  // Arizona
  {location: {lat: 35.0819, lng: -110.0298}, stopover: true}, // Holbrook, AZ
  {location: {lat: 35.1983, lng: -111.6513}, stopover: true}, // Flagstaff, AZ
  {location: {lat: 35.2262, lng: -112.8871}, stopover: true}, // Seligman, AZ
  {location: {lat: 35.0222, lng: -114.3716}, stopover: true}, // Kingman, AZ
  
  // California
  {location: {lat: 34.8409, lng: -114.6160}, stopover: true}, // Needles, CA
  {location: {lat: 34.8987, lng: -117.0178}, stopover: true}, // Barstow, CA
  {location: {lat: 34.1066, lng: -117.5931}, stopover: true}, // San Bernardino, CA
  {location: {lat: 34.0825, lng: -118.0732}, stopover: true}, // Pasadena, CA
  {location: {lat: 34.0522, lng: -118.2437}, stopover: true}, // Los Angeles, CA
  {location: {lat: 34.0195, lng: -118.4912}, stopover: true}, // Santa Monica, CA - End of Route 66
];

const MapOverlays = ({ map }: MapOverlaysProps) => {
  const [isRouteRendered, setIsRouteRendered] = useState(false);

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
        const directionsRenderer = new google.maps.DirectionsRenderer({
          suppressMarkers: true,
          preserveViewport: true,
          polylineOptions: {
            strokeColor: '#B91C1C', // Deep red color
            strokeOpacity: 0.8,
            strokeWeight: 4,
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
        directionsRenderer.setMap(map);
        
        // Use waypoints in batches to avoid exceeding the API limit
        // Google Maps Directions API allows a maximum of 25 waypoints per request
        const renderRoute = async () => {
          try {
            // Create request with origin (Chicago) and destination (Santa Monica)
            const request = {
              origin: route66Waypoints[0].location,
              destination: route66Waypoints[route66Waypoints.length - 1].location,
              waypoints: route66Waypoints.slice(1, -1),
              travelMode: google.maps.TravelMode.DRIVING,
              optimizeWaypoints: false, // Don't reorder waypoints - we want the historic route
              drivingOptions: {
                departureTime: new Date(), // Use current date/time
                trafficModel: google.maps.TrafficModel.OPTIMISTIC
              },
              avoidHighways: false, // We want to follow the actual historic route, which used highways
              avoidTolls: false
            };
            
            // Request directions
            directionsService.route(request, (result, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                console.log('Route calculated successfully');
                directionsRenderer.setDirections(result);
                setIsRouteRendered(true);
              } else {
                console.error(`Error fetching directions: ${status}`);
                
                // Fallback to simple polyline if directions API fails
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
          console.log('Creating backup route with simple polyline');
          
          // Extract location points from waypoints
          const route66Coordinates = route66Waypoints.map(waypoint => 
            waypoint.location as google.maps.LatLng
          );
          
          // Create a polyline with these coordinates
          const route66Path = new google.maps.Polyline({
            path: route66Coordinates,
            geodesic: true,
            strokeColor: '#B91C1C',
            strokeOpacity: 0.8,
            strokeWeight: 4,
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
        };
        
        // Calculate and display the route
        renderRoute();
        
      } catch (error) {
        console.error('Error loading states data:', error);
      }
    };
    
    // Call function to set state styles
    setStateStyles();
    
    // Cleanup function
    return () => {
      // Clean up resources if needed
    };
  }, [map]);
  
  return null; // This is a non-visual component
};

export default MapOverlays;
