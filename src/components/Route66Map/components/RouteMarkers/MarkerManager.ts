
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
