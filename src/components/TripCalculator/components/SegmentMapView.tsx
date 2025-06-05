
import React, { useCallback, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';

interface SegmentMapViewProps {
  segment: DailySegment;
  isExpanded: boolean;
}

const mapContainerStyle = {
  width: '100%',
  height: '256px'
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

const SegmentMapView: React.FC<SegmentMapViewProps> = ({ segment, isExpanded }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  // Get API key from environment or localStorage
  const apiKey = React.useMemo(() => {
    const envApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const storedApiKey = localStorage.getItem('google_maps_api_key');
    
    if (storedApiKey && storedApiKey.trim() !== '' && storedApiKey !== 'demo-key') {
      return storedApiKey.trim();
    } else if (envApiKey && envApiKey.trim() !== '' && envApiKey !== 'demo-key') {
      return envApiKey.trim();
    }
    
    return '';
  }, []);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'segment-map-script',
    googleMapsApiKey: apiKey,
    libraries: ['maps'] as const,
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    console.log('🗺️ Segment map loaded successfully for:', segment.title);
  }, [segment.title]);

  const getMapCenter = useCallback(() => {
    if (segment.subStopTimings && segment.subStopTimings.length > 0) {
      const firstTiming = segment.subStopTimings[0];
      return {
        lat: firstTiming.fromStop.latitude,
        lng: firstTiming.fromStop.longitude
      };
    }
    return { lat: 35.0, lng: -95.0 }; // Default center
  }, [segment]);

  const getMapBounds = useCallback(() => {
    if (!segment.subStopTimings || segment.subStopTimings.length === 0) {
      return null;
    }

    const bounds = new google.maps.LatLngBounds();
    
    // Add start point
    const firstTiming = segment.subStopTimings[0];
    bounds.extend(new google.maps.LatLng(
      firstTiming.fromStop.latitude,
      firstTiming.fromStop.longitude
    ));

    // Add end point
    const lastTiming = segment.subStopTimings[segment.subStopTimings.length - 1];
    bounds.extend(new google.maps.LatLng(
      lastTiming.toStop.latitude,
      lastTiming.toStop.longitude
    ));

    // Add recommended stops
    segment.recommendedStops.forEach(stop => {
      bounds.extend(new google.maps.LatLng(stop.latitude, stop.longitude));
    });

    return bounds;
  }, [segment]);

  // Fit map to bounds when loaded
  React.useEffect(() => {
    if (mapRef.current && isLoaded) {
      const bounds = getMapBounds();
      if (bounds) {
        mapRef.current.fitBounds(bounds, { padding: 20 });
      }
    }
  }, [isLoaded, getMapBounds]);

  if (!isExpanded) return null;

  if (!apiKey) {
    return (
      <Card className="border border-route66-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-route66-text-primary">
            <Navigation className="h-4 w-4" />
            Route Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Google Maps API key required</p>
              <p className="text-xs text-gray-500 mt-2">
                Please set your API key to view route maps
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loadError) {
    return (
      <Card className="border border-route66-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-route66-text-primary">
            <Navigation className="h-4 w-4" />
            Route Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Failed to load Google Maps</p>
              <p className="text-xs text-gray-500 mt-2">
                Please check your API key and try again
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card className="border border-route66-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-route66-text-primary">
            <Navigation className="h-4 w-4" />
            Route Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-pulse" />
              <p className="text-sm text-gray-600">Loading map...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasValidTimings = segment.subStopTimings && segment.subStopTimings.length > 0;

  return (
    <Card className="border border-route66-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-route66-text-primary">
          <Navigation className="h-4 w-4" />
          Route Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={getMapCenter()}
            zoom={8}
            options={mapOptions}
            onLoad={onMapLoad}
          >
            {hasValidTimings && (
              <>
                {/* Start Marker */}
                <Marker
                  position={{
                    lat: segment.subStopTimings[0].fromStop.latitude,
                    lng: segment.subStopTimings[0].fromStop.longitude
                  }}
                  title={`Start: ${segment.subStopTimings[0].fromStop.name}`}
                  icon={{
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="12" fill="#059669" stroke="white" stroke-width="3"/>
                        <text x="16" y="21" text-anchor="middle" fill="white" font-size="14" font-weight="bold">S</text>
                      </svg>
                    `),
                    scaledSize: new google.maps.Size(32, 32),
                    anchor: new google.maps.Point(16, 16)
                  }}
                />

                {/* End Marker */}
                <Marker
                  position={{
                    lat: segment.subStopTimings[segment.subStopTimings.length - 1].toStop.latitude,
                    lng: segment.subStopTimings[segment.subStopTimings.length - 1].toStop.longitude
                  }}
                  title={`End: ${segment.subStopTimings[segment.subStopTimings.length - 1].toStop.name}`}
                  icon={{
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="12" fill="#dc2626" stroke="white" stroke-width="3"/>
                        <text x="16" y="21" text-anchor="middle" fill="white" font-size="14" font-weight="bold">E</text>
                      </svg>
                    `),
                    scaledSize: new google.maps.Size(32, 32),
                    anchor: new google.maps.Point(16, 16)
                  }}
                />

                {/* Recommended Stop Markers */}
                {segment.recommendedStops.map((stop, index) => (
                  <Marker
                    key={stop.id}
                    position={{
                      lat: stop.latitude,
                      lng: stop.longitude
                    }}
                    title={stop.name}
                    icon={{
                      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="8" fill="#f59e0b" stroke="white" stroke-width="2"/>
                          <text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">${index + 1}</text>
                        </svg>
                      `),
                      scaledSize: new google.maps.Size(24, 24),
                      anchor: new google.maps.Point(12, 12)
                    }}
                  />
                ))}

                {/* Route Path */}
                <Polyline
                  path={[
                    {
                      lat: segment.subStopTimings[0].fromStop.latitude,
                      lng: segment.subStopTimings[0].fromStop.longitude
                    },
                    ...segment.recommendedStops.map(stop => ({
                      lat: stop.latitude,
                      lng: stop.longitude
                    })),
                    {
                      lat: segment.subStopTimings[segment.subStopTimings.length - 1].toStop.latitude,
                      lng: segment.subStopTimings[segment.subStopTimings.length - 1].toStop.longitude
                    }
                  ]}
                  options={{
                    geodesic: true,
                    strokeColor: '#dc2626',
                    strokeOpacity: 1.0,
                    strokeWeight: 4
                  }}
                />
              </>
            )}
          </GoogleMap>
        </div>

        {/* Map Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span>Start Point</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span>End Point</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Recommended Stops</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-red-600"></div>
            <span>Route Path</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SegmentMapView;
