import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Polyline, Marker, InfoWindow } from '@react-google-maps/api';
import { route66Towns } from '@/types/route66';
import Route66Badge from './MapElements/Route66Badge';
import ClearSelectionButton from './MapElements/ClearSelectionButton';
import ZoomControls from './MapElements/ZoomControls';

// Styling for the Google Map
const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.75rem',
};

// Center the map on a point along Route 66 (near Oklahoma)
const center = {
  lat: 37.0,
  lng: -97.0,
};

// Define map bounds to only show Route 66 corridor
// These coordinates form a tighter corridor that encompasses the Route 66 states
const mapBounds = {
  north: 42.5, // Northern boundary (covering Illinois)
  south: 32.5, // Southern boundary (covering parts of Route 66 states)
  east: -87.0, // Eastern boundary (covering Illinois)
  west: -122.0, // Western boundary (covering California)
};

// Map restrictions to keep users within bounds
const mapRestrictions = {
  latLngBounds: mapBounds,
  strictBounds: true, // Use strict bounds to prevent panning outside Route 66 corridor
};

// Route 66 states to highlight
const route66StateIds = ['ca', 'az', 'nm', 'tx', 'ok', 'mo', 'il'];

// Custom styling to focus on Route 66 and de-emphasize other areas
const mapOptions = {
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
const polylineOptions = {
  strokeColor: '#c2410c',
  strokeOpacity: 0.8,
  strokeWeight: 4,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  zIndex: 1,
};

interface GoogleMapsRoute66Props {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
  onClearSelection: () => void;
}

const GoogleMapsRoute66 = ({ 
  selectedState,
  onStateClick,
  onClearSelection
}: GoogleMapsRoute66Props) => {
  // Load the Google Maps JS API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCj2hJjT8wA0G3gBmUaK7qmhKX8Uv3mDH8', // Google Maps API key
  });

  // State for active marker and zoom level
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(5);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Convert route66Towns to the format needed for the polyline
  const route66Path = route66Towns.map(town => ({
    lat: town.latLng[0],
    lng: town.latLng[1],
  }));

  // Filter towns based on selected state
  const getVisibleTowns = () => {
    if (selectedState) {
      return route66Towns.filter(town => 
        town.name.includes(`, ${selectedState}`)
      );
    }
    return route66Towns;
  };

  const visibleTowns = getVisibleTowns();

  // Handle marker click
  const handleMarkerClick = (index: number) => {
    setActiveMarker(index === activeMarker ? null : index);
  };

  // Handle map click
  const handleMapClick = () => {
    setActiveMarker(null);
  };

  // Map ref for potential future use
  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    
    // Listen for zoom changes
    map.addListener("zoom_changed", () => {
      if (mapRef.current) {
        setCurrentZoom(mapRef.current.getZoom() || 5);
      }
    });
    
    // Listen for drag events to show visual feedback
    map.addListener("dragstart", () => {
      setIsDragging(true);
    });
    
    map.addListener("dragend", () => {
      setTimeout(() => setIsDragging(false), 200);
    });
    
    // Set initial bounds with padding to avoid too much zoom
    const bounds = new google.maps.LatLngBounds();
    
    // Add all Route 66 towns to bounds
    route66Towns.forEach(town => {
      bounds.extend({lat: town.latLng[0], lng: town.latLng[1]});
    });
    
    // Apply padding to the bounds (20% padding)
    map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    
    // Ensure we don't zoom in too much on initial load
    const listener = google.maps.event.addListener(map, "idle", () => {
      if (map.getZoom() > 6) {
        map.setZoom(6);
      }
      google.maps.event.removeListener(listener);
    });
    
    // Create a rectangle overlay for areas outside Route 66 corridor
    // This adds a semi-transparent overlay to de-emphasize areas outside the corridor
    const addOverlays = () => {
      // North overlay (Canada)
      new google.maps.Rectangle({
        bounds: {
          north: 90,
          south: mapBounds.north,
          east: 180,
          west: -180
        },
        map: map,
        fillColor: "#8E9196",
        fillOpacity: 0.2,
        strokeWeight: 0,
        clickable: false
      });
      
      // South overlay (Mexico and below)
      new google.maps.Rectangle({
        bounds: {
          north: mapBounds.south,
          south: -90,
          east: 180,
          west: -180
        },
        map: map,
        fillColor: "#8E9196",
        fillOpacity: 0.2,
        strokeWeight: 0,
        clickable: false
      });
      
      // East overlay
      new google.maps.Rectangle({
        bounds: {
          north: mapBounds.north,
          south: mapBounds.south,
          east: 180,
          west: mapBounds.east
        },
        map: map,
        fillColor: "#8E9196",
        fillOpacity: 0.2,
        strokeWeight: 0,
        clickable: false
      });
      
      // West overlay
      new google.maps.Rectangle({
        bounds: {
          north: mapBounds.north,
          south: mapBounds.south,
          east: mapBounds.west,
          west: -180
        },
        map: map,
        fillColor: "#8E9196",
        fillOpacity: 0.2,
        strokeWeight: 0,
        clickable: false
      });
    };
    
    // Add overlays to de-emphasize areas outside the Route 66 corridor
    addOverlays();
    
  }, [route66Towns]);

  // Handle zoom controls
  const handleZoomIn = useCallback(() => {
    if (mapRef.current) {
      const newZoom = Math.min((mapRef.current.getZoom() || 5) + 1, mapOptions.maxZoom);
      mapRef.current.setZoom(newZoom);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapRef.current) {
      const newZoom = Math.max((mapRef.current.getZoom() || 5) - 1, mapOptions.minZoom);
      mapRef.current.setZoom(newZoom);
    }
  }, []);

  // Show error if Maps failed to load
  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-xl border border-gray-200">
        <div className="text-center p-6">
          <h3 className="text-lg font-semibold text-red-600">Error Loading Google Maps</h3>
          <p className="mt-2 text-gray-700">
            Please check your internet connection or API key configuration.
          </p>
        </div>
      </div>
    );
  }

  // Show loading indicator while Maps is loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-xl border border-gray-200">
        <div className="text-center p-6">
          <h3 className="text-lg font-semibold">Loading Google Maps...</h3>
          <p className="mt-2 text-gray-500">Please wait while we load the map.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Route 66 Shield Badge */}
      <div className="absolute top-4 left-4 z-10">
        <Route66Badge />
      </div>
      
      {/* Clear Selection Button */}
      {selectedState && (
        <ClearSelectionButton 
          selectedState={selectedState} 
          onClearSelection={onClearSelection} 
        />
      )}

      {/* Custom Zoom Controls */}
      <ZoomControls 
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        currentZoom={currentZoom}
        minZoom={mapOptions.minZoom}
        maxZoom={mapOptions.maxZoom}
      />
      
      {/* Mobile touch indicator - only shows briefly when dragging */}
      {isDragging && (
        <div className="absolute top-4 right-4 z-10 bg-white/80 text-xs px-2 py-1 rounded-full shadow-md md:hidden">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            Moving map
          </span>
        </div>
      )}
      
      {/* Google Map Component */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={5}
        options={mapOptions}
        onClick={handleMapClick}
        onLoad={onMapLoad}
      >
        {/* Draw Route 66 line */}
        <Polyline
          path={route66Path}
          options={polylineOptions}
        />
        
        {/* Draw markers for each town */}
        {visibleTowns.map((town, index) => (
          <Marker
            key={`town-marker-${index}`}
            position={{ lat: town.latLng[0], lng: town.latLng[1] }}
            onClick={() => handleMarkerClick(index)}
            icon={{
              url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzhjMWIxYiIgZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCA5LjVhMi41IDIuNSAwIDAgMSAwLTUgMi41IDIuNSAwIDAgMSAwIDV6Ii8+PC9zdmc+',
              scaledSize: new google.maps.Size(30, 30)
            }}
          >
            {activeMarker === index && (
              <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                <div className="p-1">
                  <h3 className="font-semibold text-sm">{town.name}</h3>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
      
      {/* Touch instructions hint for mobile */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white/80 text-xs px-3 py-1.5 rounded-full shadow-md md:hidden">
        <span className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
          </svg>
          Drag with finger to move map
        </span>
      </div>
    </div>
  );
};

export default GoogleMapsRoute66;
