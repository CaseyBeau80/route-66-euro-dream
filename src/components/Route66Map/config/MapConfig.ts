
// Map configuration constants

// Styling for the Google Map
export const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.75rem',
};

// Center the map to show the full Route 66 corridor
export const center = {
  lat: 35.2, // Centered on Route 66 corridor
  lng: -98.5, // Adjusted to better center the route
};

// Define map bounds to focus on Route 66 corridor (narrower focus)
export const mapBounds = {
  north: 42.0, // Northern boundary (reduced to focus on route corridor)
  south: 32.0, // Southern boundary (focused on Route 66 area)
  east: -87.0, // Eastern boundary (Chicago area)
  west: -118.0, // Western boundary (Los Angeles area)
};

// Map restrictions with bounds to show Route 66 corridor only
export const mapRestrictions = {
  latLngBounds: mapBounds,
  strictBounds: true, // Enable strict bounds to keep focus on Route 66
};

// Route 66 states to highlight (using full names now for more reliable matching)
export const route66StateIds = ['California', 'Arizona', 'New Mexico', 'Texas', 'Oklahoma', 'Missouri', 'Illinois'];

// Custom styling to focus on Route 66 and de-emphasize other areas
export const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true, // Enable zoom controls
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  restriction: mapRestrictions,
  minZoom: 4, // Increased minimum zoom for Route 66 focus
  maxZoom: 12, // Reasonable maximum zoom for route exploration
  gestureHandling: 'greedy', // Enable aggressive touch gestures for mobile
  styles: [
    {
      // Make all states lighter
      featureType: 'administrative.province',
      elementType: 'all',
      stylers: [{ visibility: 'on' }]
    },
    {
      // Simplify the map overall
      featureType: 'all',
      elementType: 'all',
      stylers: [{ saturation: -20 }]
    },
    {
      // Make highways more visible
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#f8c967' }, { weight: 1.5 }]
    },
    {
      // Make city labels smaller
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
      // Hide country labels except USA
      featureType: 'administrative.country',
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

// Note: API key is now managed centrally in the useGoogleMaps hook
