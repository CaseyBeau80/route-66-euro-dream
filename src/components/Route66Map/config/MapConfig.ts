// Map configuration constants

// Styling for the Google Map
export const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.75rem',
};

// Center the map on a point along Route 66 (near Oklahoma)
export const center = {
  lat: 37.0,
  lng: -97.0,
};

// Define map bounds to only show Route 66 corridor
// These coordinates form a tighter corridor that encompasses the Route 66 states
export const mapBounds = {
  north: 42.5, // Northern boundary (covering Illinois)
  south: 32.5, // Southern boundary (covering parts of Route 66 states)
  east: -87.0, // Eastern boundary (covering Illinois)
  west: -122.0, // Western boundary (covering California)
};

// Map restrictions to keep users within bounds
export const mapRestrictions = {
  latLngBounds: mapBounds,
  strictBounds: true, // Use strict bounds to prevent panning outside Route 66 corridor
};

// Route 66 states to highlight
export const route66StateIds = ['ca', 'az', 'nm', 'tx', 'ok', 'mo', 'il'];

// Custom styling to focus on Route 66 and de-emphasize other areas
export const mapOptions = {
  disableDefaultUI: false,
  zoomControl: false, // Disable default zoom controls, we'll use custom ones
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  restriction: mapRestrictions,
  minZoom: 4, // Set minimum zoom level
  maxZoom: 15, // Set maximum zoom level
  gestureHandling: 'greedy', // Enable aggressive touch gestures for mobile
  styles: [
    {
      // De-emphasize all administrative areas (states) first
      featureType: 'administrative.province',
      elementType: 'geometry',
      stylers: [{ visibility: 'on' }, { color: '#d3d3d3' }]
    },
    {
      // De-emphasize all administrative areas (states) with labels
      featureType: 'administrative.province',
      elementType: 'labels',
      stylers: [{ visibility: 'on' }, { color: '#9e9e9e' }]
    },
    {
      // De-emphasize all countries except US
      featureType: 'administrative.country',
      elementType: 'geometry',
      stylers: [{ visibility: 'on' }, { color: '#8E9196' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#f8c967' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#14532d' }]
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#f5f5f4' }]
    },
    {
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
