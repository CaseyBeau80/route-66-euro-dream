
import React, { useEffect, useRef } from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface SingleRouteManagerProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

// ☢️ COMPLETELY DISABLED - replaced by NuclearRouteManager for absolute single polyline control
const SingleRouteManager: React.FC<SingleRouteManagerProps> = ({ map, isMapReady }) => {
  console.log('☢️ SingleRouteManager: COMPLETELY DISABLED - replaced by NuclearRouteManager to prevent ANY duplicate polylines');
  console.log('🚫 This component will not create any polylines to ensure nuclear single route control');
  return null;
};

export default SingleRouteManager;
