// Map configuration constants

// Styling for the Google Map
export const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.75rem',
};

// Center the map on a point along Route 66 (roughly Oklahoma)
export const center = {
  lat: 36.0,
  lng: -98.0,
};

// Define map bounds to show Route 66 corridor
// These coordinates form a corridor that encompasses the Route 66 states
export const mapBounds = {
  north: 44.0, // Northern boundary (covering Illinois)
  south: 28.0, // Southern boundary (covering parts of Texas)
  east: -80.0, // Eastern boundary (covering Chicago)
  west: -124.0, // Western boundary (covering Los Angeles)
};

// Map restrictions to keep users within bounds
export const mapRestrictions = {
  latLngBounds: mapBounds,
  strictBounds: false, // Use less strict bounds to allow slight panning outside Route 66 corridor
};

// Route 66 states to highlight - including all states the route passes through
export const route66StateIds = ['ca', 'az', 'nm', 'tx', 'ok', 'ks', 'mo', 'il'];

// Custom styling to focus on Route 66 and de-emphasize other areas
export const mapOptions = {
  disableDefaultUI: false,
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  restriction: mapRestrictions,
  minZoom: 4, // Lower minimum zoom to see more of the map
  maxZoom: 10, // Limit maximum zoom to prevent zooming in too far
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

// Google Maps API key
export const googleMapsApiKey = 'AIzaSyCj2hJjT8wA0G3gBmUaK7qmhKX8Uv3mDH8';
