import type { Route66Waypoint } from '../../types/supabaseTypes';
import { IconCreator } from './IconCreator';
import { InfoWindowCreator } from './InfoWindowCreator';
import type { MarkerRefs } from './types';

export class MarkerManager {
  static createDestinationMarkers(
    destinationCities: Route66Waypoint[], 
    map: google.maps.Map, 
    markerRefs: MarkerRefs
  ): void {
    destinationCities.forEach((waypoint) => {
      const cityName = waypoint.name.split(',')[0].split(' - ')[0].trim();
      
      const marker = new google.maps.Marker({
        position: { lat: waypoint.latitude, lng: waypoint.longitude },
        map: map,
        icon: IconCreator.createDestinationCityIcon(cityName),
        title: `${waypoint.name} - ${waypoint.state} (Destination)`,
        zIndex: 30000 // Higher zIndex for destinations
      });

      const infoWindow = InfoWindowCreator.createDestinationInfoWindow(waypoint);

      marker.addListener('click', () => {
        // Close any other open info windows
        markerRefs.markersRef.current.forEach(m => {
          const infoWin = markerRefs.infoWindowsRef.current.get(m);
          if (infoWin) {
            infoWin.close();
          }
        });
        infoWindow.open(map, marker);
      });

      markerRefs.infoWindowsRef.current.set(marker, infoWindow);
      markerRefs.markersRef.current.push(marker);
    });
  }

  static createRegularStopMarkers(
    regularStops: Route66Waypoint[], 
    map: google.maps.Map, 
    markerRefs: MarkerRefs
  ): void {
    // Filter stops to reduce density - keep every 3rd stop for better spacing
    const filteredStops = regularStops.filter((_, index) => index % 3 === 0);
    
    console.log(`📍 Filtered regular stops: ${regularStops.length} → ${filteredStops.length} (reduced density)`);

    filteredStops.forEach((waypoint) => {
      const marker = new google.maps.Marker({
        position: { lat: waypoint.latitude, lng: waypoint.longitude },
        map: map,
        icon: IconCreator.createRegularStopIcon(false), // Start with simple dots
        title: `${waypoint.name} - ${waypoint.state}`,
        zIndex: 20000 // Lower zIndex for regular stops
      });

      const infoWindow = InfoWindowCreator.createRegularStopInfoWindow(waypoint);

      marker.addListener('click', () => {
        // Close any other open info windows
        markerRefs.markersRef.current.forEach(m => {
          const infoWin = markerRefs.infoWindowsRef.current.get(m);
          if (infoWin) {
            infoWin.close();
          }
        });
        infoWindow.open(map, marker);
      });

      // Add zoom-based icon switching
      const updateIconBasedOnZoom = () => {
        const currentZoom = map.getZoom() || 5;
        const isCloseZoom = currentZoom >= 8; // Show detailed icons at zoom 8+
        const shouldBeVisible = currentZoom >= 6; // Hide completely below zoom 6
        
        if (shouldBeVisible) {
          marker.setIcon(IconCreator.createRegularStopIcon(isCloseZoom));
          marker.setVisible(true);
        } else {
          marker.setVisible(false);
        }
      };

      // Set up zoom listener for this marker
      map.addListener('zoom_changed', updateIconBasedOnZoom);
      
      // Set initial visibility
      updateIconBasedOnZoom();

      markerRefs.infoWindowsRef.current.set(marker, infoWindow);
      markerRefs.markersRef.current.push(marker);
    });
  }

  static cleanupMarkers(markerRefs: MarkerRefs): void {
    markerRefs.markersRef.current.forEach(marker => {
      const infoWindow = markerRefs.infoWindowsRef.current.get(marker);
      if (infoWindow) {
        infoWindow.close();
      }
      google.maps.event.clearInstanceListeners(marker);
      marker.setMap(null);
    });
    markerRefs.markersRef.current = [];
    markerRefs.infoWindowsRef.current = new WeakMap();
  }
}
