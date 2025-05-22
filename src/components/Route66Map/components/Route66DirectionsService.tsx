
import { useEffect, useState } from 'react';
import { route66Waypoints } from './Route66Waypoints';
import BackupRoute from './BackupRoute';

interface Route66DirectionsServiceProps {
  map: google.maps.Map;
}

const Route66DirectionsService = ({ map }: Route66DirectionsServiceProps) => {
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [isRouteRendered, setIsRouteRendered] = useState(false);

  useEffect(() => {
    if (!map) return;
    
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
    
    const backupRoute = BackupRoute({ map, directionsRenderer });
    
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
                  backupRoute.createBackupRoute();
                }
              });
            }
          } else {
            console.error(`Error fetching directions: ${status}`);
            backupRoute.createBackupRoute();
          }
        });
      } catch (error) {
        console.error('Error in route rendering:', error);
        backupRoute.createBackupRoute();
      }
    };
    
    // Calculate and display the route
    renderRouteInChunks();
    
    // Cleanup function
    return () => {
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }
    };
  }, [map, directionsRenderer]);
  
  return null; // This is a non-visual component
};

export default Route66DirectionsService;
