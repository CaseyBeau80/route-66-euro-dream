
import { useEffect } from 'react';
import MapBoundaryRestriction from './MapBoundaryRestriction';
import StateStyling from './StateStyling';
import Route66DirectionsService from './Route66DirectionsService';

interface MapOverlaysProps {
  map: google.maps.Map;
}

const MapOverlays = ({ map }: MapOverlaysProps) => {
  useEffect(() => {
    if (!map) return;
  }, [map]);
  
  return (
    <>
      <MapBoundaryRestriction map={map} />
      <StateStyling map={map} />
      <Route66DirectionsService map={map} />
    </>
  );
};

export default MapOverlays;
