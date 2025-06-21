
import React from 'react';
import { Marker, Polyline } from '@react-google-maps/api';
import { DailySegment, RecommendedStop } from '../../services/planning/TripPlanTypes';
import { createStartMarkerIcon, createEndMarkerIcon, createStopMarkerIcon } from './MapMarkerIcons';

interface MapMarkersProps {
  segment: DailySegment;
}

const MapMarkers: React.FC<MapMarkersProps> = ({ segment }) => {
  const hasValidTimings = segment.subStopTimings && segment.subStopTimings.length > 0;

  if (!hasValidTimings) return null;

  return (
    <>
      {/* Start Marker */}
      <Marker
        position={{
          lat: segment.subStopTimings[0].fromStop.latitude,
          lng: segment.subStopTimings[0].fromStop.longitude
        }}
        title={`Start: ${segment.subStopTimings[0].fromStop.name}`}
        icon={createStartMarkerIcon()}
      />

      {/* End Marker */}
      <Marker
        position={{
          lat: segment.subStopTimings[segment.subStopTimings.length - 1].toStop.latitude,
          lng: segment.subStopTimings[segment.subStopTimings.length - 1].toStop.longitude
        }}
        title={`End: ${segment.subStopTimings[segment.subStopTimings.length - 1].toStop.name}`}
        icon={createEndMarkerIcon()}
      />

      {/* Recommended Stop Markers */}
      {segment.recommendedStops?.map((stop, index) => {
        // Ensure stop has an id property
        const stopWithId = stop as RecommendedStop & { id?: string };
        const stopId = stopWithId.id || `stop-${index}`;
        
        return (
          <Marker
            key={stopId}
            position={{
              lat: stop.latitude,
              lng: stop.longitude
            }}
            title={stop.name}
            icon={createStopMarkerIcon(index)}
          />
        );
      })}

      {/* Route Path */}
      <Polyline
        path={[
          {
            lat: segment.subStopTimings[0].fromStop.latitude,
            lng: segment.subStopTimings[0].fromStop.longitude
          },
          ...(segment.recommendedStops || []).map(stop => ({
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
  );
};

export default MapMarkers;
