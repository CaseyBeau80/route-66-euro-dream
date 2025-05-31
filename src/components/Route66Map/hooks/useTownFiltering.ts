
import { useMemo } from 'react';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface UseTownFilteringProps {
  selectedState: string | null;
  waypoints: Route66Waypoint[];
}

export const useTownFiltering = ({ selectedState, waypoints }: UseTownFilteringProps) => {
  // Use memoization to prevent unnecessary re-filtering
  const visibleWaypoints = useMemo(() => {
    if (selectedState) {
      return waypoints.filter(waypoint => waypoint.state === selectedState);
    }
    return waypoints;
  }, [selectedState, waypoints]);

  return {
    visibleWaypoints
  };
};
