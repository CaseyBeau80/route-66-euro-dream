
import React, { useEffect, useState } from 'react';
import { Polyline, InfoWindow } from '@react-google-maps/api';
import { historicRoute66Waypoints, getHistoricRoute66Segments } from './HistoricRoute66Waypoints';
import { polylineOptions } from '../config/MapConfig';

interface Route66PolylineProps {
  map: google.maps.Map;
}

const Route66Polyline: React.FC<Route66PolylineProps> = ({ map }) => {
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);
  const [clickPosition, setClickPosition] = useState<{ lat: number, lng: number } | null>(null);

  // Convert waypoints to Google Maps LatLng format
  const routePath = historicRoute66Waypoints.map(waypoint => ({
    lat: waypoint.lat,
    lng: waypoint.lng
  }));

  // Get highway segments for interactive features
  const segments = getHistoricRoute66Segments();

  const handlePolylineClick = (event: google.maps.MapMouseEvent, segmentIndex: number) => {
    if (event.latLng) {
      setClickPosition({
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      });
      setSelectedSegment(segmentIndex);
    }
  };

  const handleCloseInfoWindow = () => {
    setSelectedSegment(null);
    setClickPosition(null);
  };

  return (
    <>
      {/* Main Route 66 polyline */}
      <Polyline
        path={routePath}
        options={{
          ...polylineOptions,
          strokeColor: '#D92121', // Route 66 red
          strokeWeight: 4,
          strokeOpacity: 0.8,
          clickable: true,
          zIndex: 10
        }}
        onClick={(event) => handlePolylineClick(event, 0)}
      />

      {/* Interactive highway segments */}
      {segments.map((segment, index) => {
        // Ensure we don't go out of bounds
        const startIndex = Math.min(segment.start, routePath.length - 1);
        const endIndex = Math.min(segment.end, routePath.length - 1);
        const segmentPath = routePath.slice(startIndex, endIndex + 1);
        
        if (segmentPath.length < 2) return null;
        
        return (
          <Polyline
            key={`segment-${index}`}
            path={segmentPath}
            options={{
              strokeColor: 'transparent',
              strokeWeight: 12, // Wider invisible line for easier clicking
              clickable: true,
              zIndex: 20
            }}
            onClick={(event) => handlePolylineClick(event, index)}
          />
        );
      })}

      {/* Info window for clicked segments */}
      {selectedSegment !== null && clickPosition && selectedSegment < segments.length && (
        <InfoWindow
          position={clickPosition}
          onCloseClick={handleCloseInfoWindow}
        >
          <div className="p-2 max-w-xs">
            <h3 className="font-bold text-sm text-red-600 mb-1">
              Route 66 - {segments[selectedSegment].highway}
            </h3>
            <p className="text-xs text-gray-700">
              {segments[selectedSegment].description}
            </p>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default Route66Polyline;
