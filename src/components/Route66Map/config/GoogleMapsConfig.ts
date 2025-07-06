
// Google Maps Configuration
export const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

export const center = {
  lat: 35.5,
  lng: -100
};

// Device-aware map options function
export const createMapOptions = (isMobile: boolean): google.maps.MapOptions => ({
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
  // Device-aware gesture handling:
  // Desktop: 'cooperative' requires Ctrl+scroll to zoom
  // Mobile: 'greedy' allows normal touch gestures
  gestureHandling: isMobile ? 'greedy' : 'cooperative',
  draggable: true,
  scrollwheel: true,
  disableDoubleClickZoom: false,
  keyboardShortcuts: true,
  clickableIcons: true,
  minZoom: 3,
  maxZoom: 18,
  styles: []
});

// Default map options (for backwards compatibility)
export const mapOptions = createMapOptions(false); // Default to desktop behavior
