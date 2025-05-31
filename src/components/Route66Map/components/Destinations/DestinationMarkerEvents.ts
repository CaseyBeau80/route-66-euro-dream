
import { DestinationPositionCalculator } from './DestinationPositionCalculator';
import type { Route66Waypoint } from '../../types/supabaseTypes';

export class DestinationMarkerEvents {
  static attachEventListeners(
    marker: google.maps.marker.AdvancedMarkerElement | google.maps.Marker,
    destination: Route66Waypoint,
    map: google.maps.Map,
    handleMouseEnter: (destinationName?: string) => void,
    handleMouseLeave: (destinationName?: string) => void,
    updatePosition: (x: number, y: number) => void,
    onDestinationClick: (destination: Route66Waypoint) => void
  ): void {
    const handleMarkerMouseEnter = (event?: any) => {
      console.log(`🏛️ Mouse entered marker for ${destination.name}`);
      
      DestinationPositionCalculator.calculateHoverPosition(
        destination,
        map,
        updatePosition
      );
      
      handleMouseEnter(destination.name);
    };

    const handleMarkerMouseLeave = () => {
      console.log(`🏛️ Mouse left marker for ${destination.name}`);
      handleMouseLeave(destination.name);
    };

    const handleMarkerClick = () => {
      console.log(`🏛️ Destination marker clicked: ${destination.name}`);
      onDestinationClick(destination);
    };

    // Check if Google Maps API is available and marker type safely
    const isAdvancedMarker = window.google?.maps?.marker?.AdvancedMarkerElement && 
                            marker instanceof window.google.maps.marker.AdvancedMarkerElement;

    // Add listeners based on marker type with safety checks
    if (isAdvancedMarker) {
      const element = marker.content as HTMLElement;
      if (element) {
        element.addEventListener('mouseenter', handleMarkerMouseEnter);
        element.addEventListener('mouseleave', handleMarkerMouseLeave);
        element.addEventListener('click', handleMarkerClick);
      }
    } else if (window.google?.maps?.Marker && marker instanceof window.google.maps.Marker) {
      marker.addListener('mouseover', handleMarkerMouseEnter);
      marker.addListener('mouseout', handleMarkerMouseLeave);
      marker.addListener('click', handleMarkerClick);
    } else {
      console.warn('⚠️ Unknown marker type or Google Maps API not fully loaded:', marker);
    }
  }
}
