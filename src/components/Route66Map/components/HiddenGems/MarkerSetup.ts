
import { createVintageRoute66Icon } from './VintageRoute66Icon';
import { CustomOverlay } from './CustomOverlay';
import { HiddenGem } from './types';

interface MarkerSetupConfig {
  gem: HiddenGem;
  map: google.maps.Map;
  onMarkerClick: (gem: HiddenGem) => void;
  onMouseEnter: (event: MouseEvent) => void;
  onMouseLeave: () => void;
  onPositionUpdate: (x: number, y: number) => void;
}

export const createMarkerSetup = ({
  gem,
  map,
  onMarkerClick,
  onMouseEnter,
  onMouseLeave,
  onPositionUpdate
}: MarkerSetupConfig) => {
  // Create the marker
  const marker = new google.maps.Marker({
    position: { lat: Number(gem.latitude), lng: Number(gem.longitude) },
    map: map,
    icon: createVintageRoute66Icon(),
    title: `Hidden Gem: ${gem.title}`,
    zIndex: 1000
  });

  // Create overlay element with larger hover area (increased from 40px to 60px)
  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.width = '60px'; // Increased hover detection area
  overlay.style.height = '60px'; // Increased hover detection area
  overlay.style.cursor = 'pointer';
  overlay.style.zIndex = '999999';
  overlay.style.backgroundColor = 'transparent';
  overlay.style.borderRadius = '50%';
  overlay.style.transform = 'translate(-50%, -50%)'; // Center the overlay properly

  // Add hover area visualization for debugging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    overlay.style.border = '1px dashed rgba(255, 0, 0, 0.3)';
    overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
  }

  const customOverlay = new CustomOverlay(
    new google.maps.LatLng(Number(gem.latitude), Number(gem.longitude)),
    overlay,
    onPositionUpdate
  );

  customOverlay.setMap(map);

  // Optimized event handlers with proper debouncing
  let isHovering = false;
  let hoverDebounceTimeout: NodeJS.Timeout | null = null;

  const handleClick = () => {
    console.log(`🎯 Clicked gem: ${gem.title}`);
    onMarkerClick(gem);
  };

  const handleOverlayMouseEnter = (event: MouseEvent) => {
    if (isHovering) return; // Prevent duplicate events
    
    if (hoverDebounceTimeout) {
      clearTimeout(hoverDebounceTimeout);
    }
    
    isHovering = true;
    console.log(`🔥 Optimized mouse enter for ${gem.title}`);
    onMouseEnter(event);
  };

  const handleOverlayMouseLeave = () => {
    if (!isHovering) return; // Prevent duplicate events
    
    // Small delay to prevent flickering on micro-movements
    hoverDebounceTimeout = setTimeout(() => {
      isHovering = false;
      console.log(`❄️ Optimized mouse leave for ${gem.title}`);
      onMouseLeave();
    }, 100);
  };

  // Add event listeners with passive option for better performance
  overlay.addEventListener('mouseenter', handleOverlayMouseEnter, { passive: true });
  overlay.addEventListener('mouseleave', handleOverlayMouseLeave, { passive: true });
  overlay.addEventListener('click', handleClick, { passive: true });
  marker.addListener('click', handleClick);

  // Optimized position update handling
  let updateTimeout: NodeJS.Timeout | null = null;
  const debouncedUpdatePosition = () => {
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }
    updateTimeout = setTimeout(() => {
      if (customOverlay) {
        customOverlay.draw();
      }
    }, 16); // ~60fps for smooth updates
  };

  const zoomChangedListener = map.addListener('zoom_changed', debouncedUpdatePosition);
  const boundsChangedListener = map.addListener('bounds_changed', debouncedUpdatePosition);

  // Cleanup function
  const cleanup = () => {
    if (hoverDebounceTimeout) {
      clearTimeout(hoverDebounceTimeout);
    }
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }
    
    if (marker) {
      marker.setMap(null);
    }
    if (customOverlay) {
      customOverlay.setMap(null);
    }
    
    overlay.removeEventListener('mouseenter', handleOverlayMouseEnter);
    overlay.removeEventListener('mouseleave', handleOverlayMouseLeave);
    overlay.removeEventListener('click', handleClick);
    
    // Remove listeners using the listener objects
    if (zoomChangedListener) {
      google.maps.event.removeListener(zoomChangedListener);
    }
    if (boundsChangedListener) {
      google.maps.event.removeListener(boundsChangedListener);
    }
    
    console.log(`🧹 Cleaned up optimized marker setup for ${gem.title}`);
  };

  return { marker, customOverlay, cleanup };
};
