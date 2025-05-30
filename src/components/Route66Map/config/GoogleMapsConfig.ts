// Google Maps Configuration
const getApiKey = () => {
  // First try environment variable
  const envApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (envApiKey && envApiKey !== 'demo-key') {
    return envApiKey;
  }
  
  // Then try localStorage
  const storedApiKey = localStorage.getItem('google_maps_api_key');
  return storedApiKey || 'demo-key';
};

export const googleMapsApiKey = getApiKey();

export const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

export const center = {
  lat: 35.5,
  lng: -100
};

export const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
  gestureHandling: 'greedy' as const,
  draggable: true,
  scrollwheel: true,
  disableDoubleClickZoom: false,
  keyboardShortcuts: true,
  clickableIcons: true,
  minZoom: 3,
  maxZoom: 18,
  styles: []
};
