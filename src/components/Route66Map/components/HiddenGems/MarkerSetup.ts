
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

  // Create overlay element for hover detection with larger area
  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.width = '40px';
  overlay.style.height = '40px';
  overlay.style.cursor = 'pointer';
  overlay.style.zIndex = '999999';
  overlay.style.backgroundColor = 'transparent';
  overlay.style.borderRadius = '50%';

  const customOverlay = new CustomOverlay(
    new google.maps.LatLng(Number(gem.latitude), Number(gem.longitude)),
    overlay,
    onPositionUpdate
  );

  customOverlay.setMap(map);

  // Event handlers
  const handleClick = () => {
    console.log(`🎯 Clicked gem: ${gem.title}`);
    onMarkerClick(gem);
  };

  // Add event listeners with proper event passing
  const handleOverlayMouseEnter = (event: MouseEvent) => {
    onMouseEnter(event);
  };

  const handleOverlayMouseLeave = () => {
    onMouseLeave();
  };

  // Add event listeners
  overlay.addEventListener('mouseenter', handleOverlayMouseEnter);
  overlay.addEventListener('mouseleave', handleOverlayMouseLeave);
  overlay.addEventListener('click', handleClick);
  marker.addListener('click', handleClick);

  // Update overlay position when map changes
  const updatePosition = () => {
    if (customOverlay) {
      customOverlay.draw();
    }
  };

  const zoomChangedListener = map.addListener('zoom_changed', updatePosition);
  const boundsChangedListener = map.addListener('bounds_changed', updatePosition);

  // Cleanup function
  const cleanup = () => {
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
  };

  return { marker, customOverlay, cleanup };
};
