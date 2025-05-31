// Map configuration constants

// Styling for the Google Map
export const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.75rem',
};

// Center the map on Route 66 corridor
export const center = {
  lat: 35.5,
  lng: -97.5,
};

// Define tighter map bounds focused on Route 66 states plus Arkansas
export const mapBounds = {
  north: 42.0, // Northern boundary (southern Illinois/Missouri)
  south: 25.5, // Southern boundary (southern Texas)
  east: -87.0, // Eastern boundary (eastern Illinois/Arkansas)
  west: -125.0, // Western boundary (California coast)
};

// Strict map restrictions to keep users within Route 66 corridor
export const mapRestrictions = {
  latLngBounds: mapBounds,
  strictBounds: true, // Use strict bounds to prevent panning outside corridor
};

// Route 66 states plus Arkansas (enhanced list)
export const route66StateIds = [
  'California', 
  'Arizona', 
  'New Mexico', 
  'Texas', 
  'Oklahoma', 
  'Arkansas', // Added Arkansas as requested
  'Missouri', 
  'Illinois'
];

// Enhanced custom styling for US focus with Canada/Mexico grayed out
export const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  restriction: mapRestrictions,
  minZoom: 4, // Minimum zoom to see Route 66 corridor
  maxZoom: 12, // Maximum zoom for detailed exploration
  gestureHandling: 'greedy',
  styles: [
    // Gray out Canada and Mexico
    {
      featureType: 'administrative.country',
      elementType: 'geometry.fill',
      stylers: [
        { visibility: 'on' },
        { color: '#e5e5e5' }, // Light gray for non-US countries
        { lightness: 60 }
      ]
    },
    {
      featureType: 'administrative.country',
      elementType: 'geometry.stroke',
      stylers: [
        { color: '#cccccc' },
        { weight: 1 }
      ]
    },
    // Enhance US styling
    {
      featureType: 'administrative.country',
      elementType: 'labels',
      stylers: [{ visibility: 'simplified' }]
    },
    // Enhanced state boundaries for Route 66 states
    {
      featureType: 'administrative.province',
      elementType: 'geometry.stroke',
      stylers: [
        { color: '#8b5cf6' }, // Purple borders for states
        { weight: 2 },
        { visibility: 'on' }
      ]
    },
    // Highlight highways more prominently
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [
        { color: '#f59e0b' }, // Amber highways
        { weight: 3 },
        { visibility: 'on' }
      ]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels',
      stylers: [
        { visibility: 'simplified' },
        { color: '#1f2937' }
      ]
    },
    // Enhance water features
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        { color: '#3b82f6' }, // Blue water
        { visibility: 'on' }
      ]
    },
    // Simplify and focus on Route 66 relevant features
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }] // Hide POI labels for cleaner look
    },
    {
      featureType: 'administrative.locality',
      elementType: 'labels',
      stylers: [
        { visibility: 'simplified' },
        { color: '#374151' }
      ]
    },
    // Enhance terrain for better depth
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [
        { color: '#f3f4f6' }, // Light background
        { visibility: 'on' }
      ]
    },
    // Style transit features
    {
      featureType: 'transit',
      elementType: 'all',
      stylers: [{ visibility: 'off' }] // Hide transit for cleaner Route 66 focus
    }
  ]
};

// Enhanced Route 66 polyline options
export const polylineOptions = {
  strokeColor: '#dc2626', // Bright red for Route 66
  strokeOpacity: 0.9,
  strokeWeight: 5, // Thicker line for better visibility
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  zIndex: 10, // Higher z-index to ensure visibility
};

// Note: API key is now managed centrally in the useGoogleMaps hook
