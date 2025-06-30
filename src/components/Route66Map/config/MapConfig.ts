
// Map configuration constants

// Styling for the Google Map
export const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.75rem',
};

// Center the map to show the full Route 66 corridor
export const center = {
  lat: 36.0, // Slightly north to better center the route corridor
  lng: -96.0, // Adjusted to center between Chicago and LA
};

// RESTRICTED bounds to show only Route 66 corridor states
export const mapBounds = {
  north: 42.0, // Northern boundary (covers Chicago area)
  south: 32.0, // Southern boundary (covers Texas panhandle and southern CA)
  east: -80.0, // Eastern boundary (covers Illinois/Missouri)
  west: -125.0, // Western boundary (covers California coast)
};

// Map restrictions with strict bounds for Route 66 focus
export const mapRestrictions = {
  latLngBounds: mapBounds,
  strictBounds: true, // Enable strict bounds to prevent panning outside Route 66 area
};

// Route 66 states to highlight (using full names now for more reliable matching)
export const route66StateIds = ['California', 'Arizona', 'New Mexico', 'Texas', 'Oklahoma', 'Missouri', 'Illinois'];

// Custom styling to focus on Route 66 and de-emphasize other areas
export const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false, // Disable fullscreen to maintain Route 66 focus
  restriction: mapRestrictions, // Apply Route 66 corridor restrictions
  minZoom: 4, // Increased minimum zoom to focus on Route 66 corridor
  maxZoom: 12, // Reduced maximum zoom to maintain overview perspective
  gestureHandling: 'greedy', // Enable aggressive touch gestures for mobile
  styles: [
    {
      // Highlight Route 66 states
      featureType: 'administrative.province',
      elementType: 'all',
      stylers: [{ visibility: 'on' }]
    },
    {
      // De-emphasize non-Route 66 areas
      featureType: 'all',
      elementType: 'all',
      stylers: [{ saturation: -30 }, { lightness: 10 }]
    },
    {
      // Make highways more visible (especially historic US-66)
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#f8c967' }, { weight: 2 }]
    },
    {
      // Simplify city labels to focus on Route 66 cities
      featureType: 'administrative.locality',
      elementType: 'labels',
      stylers: [{ visibility: 'simplified' }]
    },
    {
      // Lighten the water
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#bfdbfe' }]
    },
    {
      // Hide non-US country labels
      featureType: 'administrative.country',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    },
    {
      // Hide unnecessary POI to focus on Route 66 content
      featureType: 'poi.business',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    },
    {
      // Simplify transit to focus on Route 66
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

// Route 66 polyline options
export const polylineOptions = {
  strokeColor: '#c2410c',
  strokeOpacity: 0.8,
  strokeWeight: 4,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  zIndex: 1,
};
