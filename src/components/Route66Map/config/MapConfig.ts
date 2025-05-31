
// Map configuration constants

// Styling for the Google Map
export const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.75rem',
};

// Center the map to show the full Route 66 corridor as shown in the image
export const center = {
  lat: 36.0, // Slightly north to better center the route corridor
  lng: -96.0, // Adjusted to center between Chicago and LA
};

// Define tighter map bounds to restrict view to Route 66 corridor only (expanded by 25%)
export const mapBounds = {
  north: 44.5, // Northern boundary (expanded from 42.0 by 25%)
  south: 29.5, // Southern boundary (expanded from 32.0 by 25%)
  east: -79.25, // Eastern boundary (expanded from -87.0 by 25%)
  west: -126.4, // Western boundary (expanded from -118.5 by 25%)
};

// Map restrictions with strict bounds to create viewport lock
export const mapRestrictions = {
  latLngBounds: mapBounds,
  strictBounds: true, // Enable strict bounds to prevent panning outside Route 66 corridor
};

// Route 66 states to highlight (using full names now for more reliable matching)
export const route66StateIds = ['California', 'Arizona', 'New Mexico', 'Texas', 'Oklahoma', 'Missouri', 'Illinois'];

// Custom styling to focus on Route 66 and de-emphasize other areas
export const mapOptions = {
  disableDefaultUI: false,
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  restriction: mapRestrictions,
  minZoom: 4, // Minimum zoom to see the Route 66 corridor
  maxZoom: 8, // Reduced maximum zoom to maintain focus on corridor
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
