
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
    onDestinationClick: (destination: Route66Waypoint) => void,
    handleTouchInteraction?: (destinationName?: string) => void,
    isMobile?: boolean
  ): void {
    const handleMarkerMouseEnter = (event?: any) => {
      console.log(`🏛️ HOVER DETECTED: Mouse entered marker for ${destination.name}`);
      
      DestinationPositionCalculator.calculateHoverPosition(
        destination,
        map,
        updatePosition
      );
      
      handleMouseEnter(destination.name);
    };

    const handleMarkerMouseLeave = () => {
      console.log(`🏛️ HOVER END: Mouse left marker for ${destination.name}`);
      handleMouseLeave(destination.name);
    };

    const handleMarkerClick = () => {
      console.log(`🏛️ CLICK: Destination marker clicked: ${destination.name}`);
      if (isMobile && handleTouchInteraction) {
        console.log(`📱 Mobile click - triggering touch interaction`);
        handleTouchInteraction(destination.name);
      } else {
        onDestinationClick(destination);
      }
    };

    const handleTouchStart = (event: Event) => {
      if (isMobile && handleTouchInteraction) {
        console.log(`📱 TOUCH START: Destination touched: ${destination.name}`);
        event.preventDefault();
        event.stopPropagation();
        
        DestinationPositionCalculator.calculateHoverPosition(
          destination,
          map,
          updatePosition
        );
        
        handleTouchInteraction(destination.name);
      }
    };

    // Ensure Google Maps API is available before checking marker types
    if (!window.google?.maps) {
      console.warn('⚠️ Google Maps API not available for event attachment');
      return;
    }

    // Check marker type and attach appropriate events
    const isAdvancedMarker = window.google.maps.marker?.AdvancedMarkerElement && 
                            marker instanceof window.google.maps.marker.AdvancedMarkerElement;

    if (isAdvancedMarker) {
      console.log(`🎯 Attaching events to AdvancedMarkerElement for ${destination.name}`);
      const element = marker.content as HTMLElement;
      if (element) {
        // Remove any existing listeners first
        element.removeEventListener('mouseenter', handleMarkerMouseEnter);
        element.removeEventListener('mouseleave', handleMarkerMouseLeave);
        element.removeEventListener('click', handleMarkerClick);
        
        // Add new listeners
        element.addEventListener('mouseenter', handleMarkerMouseEnter, { passive: true });
        element.addEventListener('mouseleave', handleMarkerMouseLeave, { passive: true });
        element.addEventListener('click', handleMarkerClick, { passive: true });
        
        // Add mobile touch events
        if (isMobile) {
          element.addEventListener('touchstart', handleTouchStart, { passive: false });
          element.style.cursor = 'pointer';
          element.style.minHeight = '44px';
          element.style.minWidth = '44px';
        }
        
        console.log(`✅ Events attached to AdvancedMarkerElement for ${destination.name}`);
      } else {
        console.warn(`⚠️ No content element found for AdvancedMarkerElement: ${destination.name}`);
      }
    } else if (window.google.maps.Marker && marker instanceof window.google.maps.Marker) {
      console.log(`🎯 Attaching events to regular Marker for ${destination.name}`);
      
      // Remove existing listeners first
      google.maps.event.clearListeners(marker, 'mouseover');
      google.maps.event.clearListeners(marker, 'mouseout');
      google.maps.event.clearListeners(marker, 'click');
      
      // Add new listeners
      marker.addListener('mouseover', handleMarkerMouseEnter);
      marker.addListener('mouseout', handleMarkerMouseLeave);
      marker.addListener('click', handleMarkerClick);
      
      // Add mobile touch handling for regular markers
      if (isMobile) {
        marker.addListener('touchstart', () => {
          console.log(`📱 TOUCH START: Regular marker touched: ${destination.name}`);
          if (handleTouchInteraction) {
            DestinationPositionCalculator.calculateHoverPosition(
              destination,
              map,
              updatePosition
            );
            handleTouchInteraction(destination.name);
          }
        });
      }
      
      console.log(`✅ Events attached to regular Marker for ${destination.name}`);
    } else {
      console.warn(`⚠️ Unknown marker type for ${destination.name}:`, marker);
    }
  }
}
