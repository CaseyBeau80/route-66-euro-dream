
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
    console.log(`📍 Creating ${destinationCities.length} destination markers`);
    
    destinationCities.forEach((waypoint) => {
      const cityName = waypoint.name.split(',')[0].split(' - ')[0].trim();
      
      const marker = new google.maps.Marker({
        position: { lat: waypoint.latitude, lng: waypoint.longitude },
        map: map,
        icon: IconCreator.createDestinationCityIcon(cityName),
        title: `${waypoint.name} - ${waypoint.state} (Destination)`,
        zIndex: 30000,
        visible: true // Ensure visibility
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
    
    console.log(`✅ Created ${destinationCities.length} destination markers successfully`);
  }

  static createRegularStopMarkers(
    regularStops: Route66Waypoint[], 
    map: google.maps.Map, 
    markerRefs: MarkerRefs
  ): void {
    // Reduce filtering - show every 2nd stop instead of every 3rd for better coverage
    const filteredStops = regularStops.filter((_, index) => index % 2 === 0);
    
    console.log(`📍 Creating regular stop markers: ${regularStops.length} → ${filteredStops.length} (showing every 2nd stop)`);

    filteredStops.forEach((waypoint, index) => {
      const marker = new google.maps.Marker({
        position: { lat: waypoint.latitude, lng: waypoint.longitude },
        map: map,
        icon: IconCreator.createRegularStopIcon(false), // Start with simple dots
        title: `${waypoint.name} - ${waypoint.state}`,
        zIndex: 20000,
        visible: true // Start visible
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

      // Simplified zoom-based icon switching
      const updateIconBasedOnZoom = () => {
        const currentZoom = map.getZoom() || 5;
        const isCloseZoom = currentZoom >= 8; // Show detailed icons at zoom 8+
        const shouldBeVisible = currentZoom >= 5; // Show at zoom 5+ instead of 6+
        
        if (shouldBeVisible) {
          marker.setIcon(IconCreator.createRegularStopIcon(isCloseZoom));
          marker.setVisible(true);
        } else {
          marker.setVisible(false);
        }
      };

      // Set up zoom listener - but don't overdo it
      const zoomListener = map.addListener('zoom_changed', updateIconBasedOnZoom);
      
      // Store listener for cleanup
      (marker as any)._zoomListener = zoomListener;
      
      // Set initial visibility based on current zoom
      const currentZoom = map.getZoom() || 5;
      if (currentZoom >= 5) {
        marker.setVisible(true);
      } else {
        marker.setVisible(false);
      }

      markerRefs.infoWindowsRef.current.set(marker, infoWindow);
      markerRefs.markersRef.current.push(marker);
    });
    
    console.log(`✅ Created ${filteredStops.length} regular stop markers successfully`);
  }

  static cleanupMarkers(markerRefs: MarkerRefs): void {
    console.log(`🧹 Cleaning up ${markerRefs.markersRef.current.length} markers`);
    
    markerRefs.markersRef.current.forEach(marker => {
      const infoWindow = markerRefs.infoWindowsRef.current.get(marker);
      if (infoWindow) {
        infoWindow.close();
      }
      
      // Clean up zoom listener if it exists
      if ((marker as any)._zoomListener) {
        google.maps.event.removeListener((marker as any)._zoomListener);
      }
      
      google.maps.event.clearInstanceListeners(marker);
      marker.setMap(null);
    });
    
    markerRefs.markersRef.current = [];
    markerRefs.infoWindowsRef.current = new WeakMap();
    
    console.log('✅ Marker cleanup completed');
  }
}
