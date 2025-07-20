import React, { useCallback, useRef } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { useGlobalGoogleMapsContext } from '@/components/providers/GlobalGoogleMapsProvider';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from 'lucide-react';
import { mapContainerStyle, mapOptions } from './map/MapConfigTypes';
import { MapNoApiKey, MapLoadError, MapLoading } from './map/MapErrorStates';
import MapMarkers from './map/MapMarkers';
import MapLegend from './map/MapLegend';

interface SegmentMapViewProps {
  segment: DailySegment;
  isExpanded: boolean;
}

const SegmentMapView: React.FC<SegmentMapViewProps> = ({ segment, isExpanded }) => {
  const mapRef = useRef<google.maps.Map | null>(null);

  // Use context instead of separate loader to prevent conflicts
  const { isLoaded, loadError, hasApiKey } = useGlobalGoogleMapsContext();

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
        mapRef.current.fitBounds(bounds, 20);
      }
    }
  }, [isLoaded, getMapBounds]);

  if (!isExpanded) return null;

  if (!hasApiKey) {
    return <MapNoApiKey />;
  }

  if (loadError) {
    return <MapLoadError />;
  }

  if (!isLoaded) {
    return <MapLoading />;
  }

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
            {/* MapMarkers temporarily disabled to fix Google Maps loader conflict */}
            {/* <MapMarkers segment={segment} /> */}
          </GoogleMap>
        </div>
        <MapLegend />
      </CardContent>
    </Card>
  );
};

export default SegmentMapView;