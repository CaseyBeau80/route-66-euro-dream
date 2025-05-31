
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

    console.log(`🛡️ Creating WOODEN POST marker for ${destination.name} at ${destination.latitude}, ${destination.longitude}`);

    const cityName = destination.name.split(',')[0].split(' - ')[0].trim();
    const position = { lat: destination.latitude, lng: destination.longitude };

    try {
      // Try to create AdvancedMarkerElement first if available
      if (window.google.maps.marker?.AdvancedMarkerElement) {
        console.log(`✅ Creating AdvancedMarkerElement with WOODEN POST for ${destination.name}`);
        
        return this.createAdvancedMarker(cityName, position, destination.name, map);
      } else {
        console.log(`⚠️ AdvancedMarkerElement not available, using regular Marker with WOODEN POST for ${destination.name}`);
        
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
      
      console.log(`🪵 Created wooden post icon data for ${destinationName}:`, iconData);
      
      // Create marker element
      const markerElement = document.createElement('div');
      markerElement.innerHTML = `
        <div style="
          width: 60px;
          height: 70px;
          background-image: url('${iconData.url}');
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          cursor: pointer;
          transition: transform 0.2s ease;
          filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
        " data-destination="${destinationName}"></div>
      `;
      
      const imgElement = markerElement.firstElementChild as HTMLElement;
      
      // Add hover effects to the wooden post
      imgElement.addEventListener('mouseenter', () => {
        console.log(`🪵 WOODEN POST hover effect for ${destinationName}`);
        imgElement.style.transform = 'scale(1.1)';
      });
      
      imgElement.addEventListener('mouseleave', () => {
        console.log(`🪵 WOODEN POST hover effect end for ${destinationName}`);
        imgElement.style.transform = 'scale(1)';
      });

      const advancedMarker = new window.google.maps.marker.AdvancedMarkerElement({
        map,
        position,
        content: markerElement,
        title: destinationName,
        zIndex: 30000
      });

      console.log(`✅ WOODEN POST AdvancedMarkerElement created for ${destinationName}`);
      return advancedMarker;
    } catch (error) {
      console.error(`❌ Error creating wooden post AdvancedMarkerElement for ${destinationName}:`, error);
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
      
      console.log(`🪵 Created wooden post icon for regular marker ${destinationName}:`, iconData);
      
      const regularMarker = new window.google.maps.Marker({
        position,
        map,
        title: destinationName,
        icon: iconData,
        zIndex: 30000
      });

      console.log(`✅ WOODEN POST regular Marker created for ${destinationName}`);
      return regularMarker;
    } catch (error) {
      console.error(`❌ Error creating wooden post regular Marker for ${destinationName}:`, error);
      return null;
    }
  }

  static cleanupMarker(marker: google.maps.marker.AdvancedMarkerElement | google.maps.Marker | null, destinationName: string): void {
    if (!marker) return;

    console.log(`🧹 Cleaning up wooden post marker: ${destinationName}`);
    
    try {
      // Safe cleanup with proper API checks
      if (window.google?.maps?.marker?.AdvancedMarkerElement && 
          marker instanceof window.google.maps.marker.AdvancedMarkerElement) {
        marker.map = null;
        console.log(`🧹 Cleaned up AdvancedMarkerElement for ${destinationName}`);
      } else if (window.google?.maps?.Marker && 
                 marker instanceof window.google.maps.Marker) {
        marker.setMap(null);
        console.log(`🧹 Cleaned up regular Marker for ${destinationName}`);
      }
    } catch (cleanupError) {
      console.warn(`⚠️ Error during marker cleanup for ${destinationName}:`, cleanupError);
    }
  }
}
