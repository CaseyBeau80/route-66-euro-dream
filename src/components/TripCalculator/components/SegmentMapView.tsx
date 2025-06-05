
import React, { useEffect, useRef, useState } from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';

interface SegmentMapViewProps {
  segment: DailySegment;
  isExpanded: boolean;
}

const SegmentMapView: React.FC<SegmentMapViewProps> = ({ segment, isExpanded }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (!isExpanded || !mapRef.current) return;

    console.log('🗺️ Attempting to initialize map for segment:', segment.title);

    // Check if Google Maps is available
    if (typeof window === 'undefined' || typeof (window as any).google === 'undefined' || !(window as any).google.maps) {
      console.warn('⚠️ Google Maps not available, showing fallback');
      setMapError('Google Maps not available. Please ensure the Google Maps API is loaded.');
      return;
    }

    try {
      const google = (window as any).google;
      
      // Create map instance
      const map = new google.maps.Map(mapRef.current, {
        zoom: 8,
        center: { lat: 35.0, lng: -95.0 }, // Default center
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      // Create bounds to fit all points
      const bounds = new google.maps.LatLngBounds();

      // Add start marker if we have coordinates
      if (segment.subStopTimings && segment.subStopTimings.length > 0) {
        const firstTiming = segment.subStopTimings[0];
        const startLatLng = new google.maps.LatLng(
          firstTiming.fromStop.latitude,
          firstTiming.fromStop.longitude
        );

        new google.maps.Marker({
          position: startLatLng,
          map: map,
          title: `Start: ${firstTiming.fromStop.name}`,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="#059669" stroke="white" stroke-width="3"/>
                <text x="16" y="21" text-anchor="middle" fill="white" font-size="14" font-weight="bold">S</text>
              </svg>
            `),
            scaledSize: new google.maps.Size(32, 32),
            anchor: new google.maps.Point(16, 16)
          }
        });

        bounds.extend(startLatLng);

        // Add end marker
        const lastTiming = segment.subStopTimings[segment.subStopTimings.length - 1];
        const endLatLng = new google.maps.LatLng(
          lastTiming.toStop.latitude,
          lastTiming.toStop.longitude
        );

        new google.maps.Marker({
          position: endLatLng,
          map: map,
          title: `End: ${lastTiming.toStop.name}`,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="#dc2626" stroke="white" stroke-width="3"/>
                <text x="16" y="21" text-anchor="middle" fill="white" font-size="14" font-weight="bold">E</text>
              </svg>
            `),
            scaledSize: new google.maps.Size(32, 32),
            anchor: new google.maps.Point(16, 16)
          }
        });

        bounds.extend(endLatLng);

        // Add recommended stop markers
        segment.recommendedStops.forEach((stop, index) => {
          const stopLatLng = new google.maps.LatLng(stop.latitude, stop.longitude);
          
          new google.maps.Marker({
            position: stopLatLng,
            map: map,
            title: stop.name,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" fill="#f59e0b" stroke="white" stroke-width="2"/>
                  <text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">${index + 1}</text>
                </svg>
              `),
              scaledSize: new google.maps.Size(24, 24),
              anchor: new google.maps.Point(12, 12)
            }
          });

          bounds.extend(stopLatLng);
        });

        // Create route path
        const routePath = new google.maps.Polyline({
          path: [
            startLatLng,
            ...segment.recommendedStops.map(stop => 
              new google.maps.LatLng(stop.latitude, stop.longitude)
            ),
            endLatLng
          ],
          geodesic: true,
          strokeColor: '#dc2626',
          strokeOpacity: 1.0,
          strokeWeight: 4
        });

        routePath.setMap(map);
      }

      // Fit map to bounds with proper padding
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 20 });
      }

      setIsMapLoaded(true);
      setMapError(null);
      console.log('✅ Map initialized successfully for segment:', segment.title);
    } catch (error) {
      console.error('❌ Map initialization error:', error);
      setMapError('Failed to initialize map. Please check console for details.');
    }
  }, [isExpanded, segment]);

  if (!isExpanded) return null;

  return (
    <Card className="border border-route66-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-route66-text-primary">
          <Navigation className="h-4 w-4" />
          Route Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        {mapError ? (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">{mapError}</p>
              <p className="text-xs text-gray-500 mt-2">
                Map functionality requires Google Maps API
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div 
              ref={mapRef} 
              className="w-full h-64 rounded-lg border border-gray-200"
            />
            {!isMapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-pulse" />
                  <p className="text-sm text-gray-600">Loading map...</p>
                </div>
              </div>
            )}
          </div>
        )}

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
