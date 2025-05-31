
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

    // Add listeners based on marker type
    if (marker instanceof google.maps.marker.AdvancedMarkerElement) {
      const element = marker.content as HTMLElement;
      element.addEventListener('mouseenter', handleMarkerMouseEnter);
      element.addEventListener('mouseleave', handleMarkerMouseLeave);
      element.addEventListener('click', handleMarkerClick);
    } else {
      marker.addListener('mouseover', handleMarkerMouseEnter);
      marker.addListener('mouseout', handleMarkerMouseLeave);
      marker.addListener('click', handleMarkerClick);
    }
  }
}
