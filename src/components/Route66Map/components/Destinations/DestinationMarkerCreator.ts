
import { DestinationCityIconCreator } from '../RouteMarkers/DestinationCityIconCreator';
import type { Route66Waypoint } from '../../types/supabaseTypes';

export class DestinationMarkerCreator {
  static createMarker(
    destination: Route66Waypoint,
    map: google.maps.Map
  ): google.maps.marker.AdvancedMarkerElement | google.maps.Marker | null {
    if (!map || !destination) {
      console.log('⚠️ Missing map or destination data');
      return null;
    }

    // Check if Google Maps API is fully loaded
    if (!window.google?.maps) {
      console.log('⚠️ Google Maps API not loaded');
      return null;
    }

    console.log(`🛡️ Creating wooden post marker for ${destination.name} at ${destination.latitude}, ${destination.longitude}`);

    const cityName = destination.name.split(',')[0].split(' - ')[0].trim();
    const position = { lat: destination.latitude, lng: destination.longitude };

    try {
      // Try to create AdvancedMarkerElement first if available
      if (window.google.maps.marker?.AdvancedMarkerElement) {
        console.log(`✅ Creating AdvancedMarkerElement with wooden post for ${destination.name}`);
        
        return this.createAdvancedMarker(cityName, position, destination.name, map);
      } else {
        console.log(`⚠️ AdvancedMarkerElement not available, using regular Marker for ${destination.name}`);
        
        return this.createRegularMarker(cityName, position, destination.name, map);
      }
    } catch (error) {
      console.error(`❌ Error creating wooden post marker for ${destination.name}:`, error);
      return null;
    }
  }

  private static createAdvancedMarker(
    cityName: string,
    position: google.maps.LatLngLiteral,
    destinationName: string,
    map: google.maps.Map
  ): google.maps.marker.AdvancedMarkerElement | null {
    try {
      // Create the wooden post icon using the existing creator
      const iconData = DestinationCityIconCreator.createDestinationCityIcon(cityName);
      
      // Create marker element
      const markerElement = document.createElement('div');
      markerElement.innerHTML = `
        <div style="
          width: 50px;
          height: 60px;
          background-image: url('${iconData.url}');
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          cursor: pointer;
          transition: transform 0.2s ease;
        "></div>
      `;
      
      const imgElement = markerElement.firstElementChild as HTMLElement;
      
      // Add hover effects
      imgElement.addEventListener('mouseenter', () => {
        imgElement.style.transform = 'scale(1.1)';
      });
      
      imgElement.addEventListener('mouseleave', () => {
        imgElement.style.transform = 'scale(1)';
      });

      return new window.google.maps.marker.AdvancedMarkerElement({
        map,
        position,
        content: markerElement,
        title: destinationName,
        zIndex: 30000
      });
    } catch (error) {
      console.error('❌ Error creating AdvancedMarkerElement:', error);
      return null;
    }
  }

  private static createRegularMarker(
    cityName: string,
    position: google.maps.LatLngLiteral,
    destinationName: string,
    map: google.maps.Map
  ): google.maps.Marker | null {
    try {
      // Fallback to regular marker with wooden post icon
      const iconData = DestinationCityIconCreator.createDestinationCityIcon(cityName);
      
      return new window.google.maps.Marker({
        position,
        map,
        title: destinationName,
        icon: iconData,
        zIndex: 30000
      });
    } catch (error) {
      console.error('❌ Error creating regular Marker:', error);
      return null;
    }
  }

  static cleanupMarker(marker: google.maps.marker.AdvancedMarkerElement | google.maps.Marker | null, destinationName: string): void {
    if (!marker) return;

    console.log(`🧹 Cleaning up destination marker: ${destinationName}`);
    
    try {
      // Safe cleanup with proper API checks
      if (window.google?.maps?.marker?.AdvancedMarkerElement && 
          marker instanceof window.google.maps.marker.AdvancedMarkerElement) {
        marker.map = null;
      } else if (window.google?.maps?.Marker && 
                 marker instanceof window.google.maps.Marker) {
        marker.setMap(null);
      }
    } catch (cleanupError) {
      console.warn(`⚠️ Error during marker cleanup for ${destinationName}:`, cleanupError);
    }
  }
}
