
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

    // Enhanced debugging for Santa Monica specifically
    if (destination.name.toLowerCase().includes('santa monica')) {
      console.log(`🎯 CREATING SANTA MONICA MARKER:`, {
        name: destination.name,
        latitude: destination.latitude,
        longitude: destination.longitude,
        mapCenter: map.getCenter()?.toJSON(),
        mapZoom: map.getZoom(),
        mapBounds: map.getBounds()?.toJSON()
      });
    }

    const cityName = destination.name.split(',')[0].split(' - ')[0].trim();
    const position = { lat: destination.latitude, lng: destination.longitude };

    try {
      // Try to create AdvancedMarkerElement first if available
      if (window.google.maps.marker?.AdvancedMarkerElement) {
        console.log(`✅ Creating AdvancedMarkerElement with WOODEN POST for ${destination.name}`);
        
        const marker = this.createAdvancedMarker(cityName, position, destination.name, map);
        
        if (marker && destination.name.toLowerCase().includes('santa monica')) {
          console.log(`🎯 SANTA MONICA ADVANCED MARKER CREATED SUCCESSFULLY:`, {
            position: marker.position,
            map: !!marker.map,
            content: !!marker.content
          });
        }
        
        return marker;
      } else {
        console.log(`⚠️ AdvancedMarkerElement not available, using regular Marker with WOODEN POST for ${destination.name}`);
        
        const marker = this.createRegularMarker(cityName, position, destination.name, map);
        
        if (marker && destination.name.toLowerCase().includes('santa monica')) {
          console.log(`🎯 SANTA MONICA REGULAR MARKER CREATED SUCCESSFULLY:`, {
            position: marker.getPosition()?.toJSON(),
            map: !!marker.getMap(),
            visible: marker.getVisible()
          });
        }
        
        return marker;
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
      
      // Create marker element safely without innerHTML
      const markerElement = document.createElement('div');
      const imgElement = document.createElement('div');
      imgElement.style.width = '60px';
      imgElement.style.height = '70px';
      imgElement.style.backgroundImage = `url("${iconData.url}")`;
      imgElement.style.backgroundSize = 'contain';
      imgElement.style.backgroundRepeat = 'no-repeat';
      imgElement.style.backgroundPosition = 'center';
      imgElement.style.cursor = 'pointer';
      imgElement.style.transition = 'transform 0.2s ease';
      imgElement.style.filter = 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))';
      (imgElement as any).dataset.destination = destinationName;
      markerElement.appendChild(imgElement);

      
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
      
      // Enhanced verification for Santa Monica
      if (destinationName.toLowerCase().includes('santa monica')) {
        setTimeout(() => {
          console.log(`🔍 SANTA MONICA MARKER VERIFICATION:`, {
            markerExists: !!advancedMarker,
            hasMap: !!advancedMarker.map,
            position: advancedMarker.position,
            zIndex: advancedMarker.zIndex,
            isInMapBounds: map.getBounds()?.contains(new google.maps.LatLng(position.lat, position.lng))
          });
        }, 1000);
      }
      
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
      
      // Enhanced verification for Santa Monica
      if (destinationName.toLowerCase().includes('santa monica')) {
        setTimeout(() => {
          console.log(`🔍 SANTA MONICA REGULAR MARKER VERIFICATION:`, {
            markerExists: !!regularMarker,
            hasMap: !!regularMarker.getMap(),
            position: regularMarker.getPosition()?.toJSON(),
            visible: regularMarker.getVisible(),
            zIndex: regularMarker.getZIndex(),
            isInMapBounds: map.getBounds()?.contains(regularMarker.getPosition()!)
          });
        }, 1000);
      }
      
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
