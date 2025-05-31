
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
    console.log('🗺️ Map object:', map);
    console.log('🎯 Destination cities data:', destinationCities);
    
    if (!map) {
      console.error('❌ Map object is null or undefined');
      return;
    }

    if (!destinationCities || destinationCities.length === 0) {
      console.warn('⚠️ No destination cities provided');
      return;
    }
    
    destinationCities.forEach((waypoint, index) => {
      console.log(`📍 Creating destination marker ${index + 1}:`, {
        name: waypoint.name,
        lat: waypoint.latitude,
        lng: waypoint.longitude,
        state: waypoint.state
      });

      const cityName = waypoint.name.split(',')[0].split(' - ')[0].trim();
      
      try {
        const marker = new google.maps.Marker({
          position: { lat: waypoint.latitude, lng: waypoint.longitude },
          map: map,
          icon: IconCreator.createDestinationCityIcon(cityName),
          title: `${waypoint.name} - ${waypoint.state} (Destination)`,
          zIndex: 30000,
          visible: true
        });

        console.log(`✅ Destination marker created successfully:`, marker);

        const infoWindow = InfoWindowCreator.createDestinationInfoWindow(waypoint);

        marker.addListener('click', () => {
          console.log(`🎯 Destination marker clicked: ${waypoint.name}`);
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
        
        console.log(`✅ Destination marker ${index + 1} added to references`);
      } catch (error) {
        console.error(`❌ Error creating destination marker ${index + 1}:`, error);
      }
    });
    
    console.log(`✅ Created ${destinationCities.length} destination markers successfully`);
    console.log(`📊 Total markers in ref: ${markerRefs.markersRef.current.length}`);
  }

  static createRegularStopMarkers(
    regularStops: Route66Waypoint[], 
    map: google.maps.Map, 
    markerRefs: MarkerRefs
  ): void {
    console.log(`📍 Starting regular stop markers creation`);
    console.log(`🗺️ Map object:`, map);
    console.log(`📊 Regular stops data:`, {
      total: regularStops.length,
      sample: regularStops.slice(0, 3)
    });

    if (!map) {
      console.error('❌ Map object is null or undefined for regular stops');
      return;
    }

    if (!regularStops || regularStops.length === 0) {
      console.warn('⚠️ No regular stops provided');
      return;
    }

    // Show every 2nd stop for better coverage but not too cluttered
    const filteredStops = regularStops.filter((_, index) => index % 2 === 0);
    
    console.log(`📍 Creating regular stop markers: ${regularStops.length} → ${filteredStops.length} (showing every 2nd stop)`);

    filteredStops.forEach((waypoint, index) => {
      console.log(`📍 Creating regular stop marker ${index + 1}:`, {
        name: waypoint.name,
        lat: waypoint.latitude,
        lng: waypoint.longitude,
        state: waypoint.state
      });

      try {
        const marker = new google.maps.Marker({
          position: { lat: waypoint.latitude, lng: waypoint.longitude },
          map: map,
          icon: IconCreator.createRegularStopIcon(false), // Start with simple dots
          title: `${waypoint.name} - ${waypoint.state}`,
          zIndex: 20000,
          visible: true // Always start visible
        });

        console.log(`✅ Regular stop marker created:`, marker);

        const infoWindow = InfoWindowCreator.createRegularStopInfoWindow(waypoint);

        marker.addListener('click', () => {
          console.log(`🎯 Regular stop marker clicked: ${waypoint.name}`);
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
          try {
            const currentZoom = map.getZoom() || 5;
            const isCloseZoom = currentZoom >= 8; // Show detailed icons at zoom 8+
            const shouldBeVisible = currentZoom >= 4; // Show at zoom 4+ for better visibility
            
            console.log(`🔍 Zoom update for marker ${index + 1}: zoom=${currentZoom}, visible=${shouldBeVisible}, detailed=${isCloseZoom}`);
            
            if (shouldBeVisible) {
              marker.setIcon(IconCreator.createRegularStopIcon(isCloseZoom));
              marker.setVisible(true);
            } else {
              marker.setVisible(false);
            }
          } catch (zoomError) {
            console.error(`❌ Error updating zoom for marker ${index + 1}:`, zoomError);
          }
        };

        // Set up zoom listener
        const zoomListener = map.addListener('zoom_changed', updateIconBasedOnZoom);
        
        // Store listener for cleanup
        (marker as any)._zoomListener = zoomListener;
        
        // Set initial visibility - always visible to start
        marker.setVisible(true);
        console.log(`✅ Regular stop marker ${index + 1} set to visible`);

        markerRefs.infoWindowsRef.current.set(marker, infoWindow);
        markerRefs.markersRef.current.push(marker);
        
        console.log(`✅ Regular stop marker ${index + 1} added to references`);
      } catch (error) {
        console.error(`❌ Error creating regular stop marker ${index + 1}:`, error);
      }
    });
    
    console.log(`✅ Created ${filteredStops.length} regular stop markers successfully`);
    console.log(`📊 Total markers in ref after regular stops: ${markerRefs.markersRef.current.length}`);
  }

  static cleanupMarkers(markerRefs: MarkerRefs): void {
    console.log(`🧹 Cleaning up ${markerRefs.markersRef.current.length} markers`);
    
    markerRefs.markersRef.current.forEach((marker, index) => {
      try {
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
        console.log(`✅ Cleaned up marker ${index + 1}`);
      } catch (error) {
        console.error(`❌ Error cleaning up marker ${index + 1}:`, error);
      }
    });
    
    markerRefs.markersRef.current = [];
    markerRefs.infoWindowsRef.current = new WeakMap();
    
    console.log('✅ Marker cleanup completed');
  }
}
