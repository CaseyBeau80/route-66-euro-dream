
import { useCallback } from 'react';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface UseWaypointManagementProps {
  waypoints: Route66Waypoint[];
  selectedState: string | null;
}

export const useWaypointManagement = ({ waypoints, selectedState }: UseWaypointManagementProps) => {
  // Filter waypoints by selected state if applicable
  const visibleWaypoints = selectedState 
    ? waypoints.filter(waypoint => waypoint.state === selectedState)
    : waypoints;

  // Handle destination clicks with correct type signature
  const handleDestinationClick = useCallback((destination: Route66Waypoint) => {
    console.log('🏛️ Destination clicked (shield only, no yellow circle):', destination.name);
  }, []);

  // Handle attraction/waypoint clicks with correct type signature
  const handleAttractionClick = useCallback((waypoint: Route66Waypoint) => {
    console.log('🎯 Attraction clicked (clustered, no yellow):', waypoint.name);

    // Track GA4 event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'attraction_clicked', {
        attraction_name: waypoint.name,
        attraction_state: waypoint.state,
        attraction_type: waypoint.is_major_stop ? 'major_stop' : 'attraction'
      });
    }
  }, []);

  return {
    visibleWaypoints,
    handleDestinationClick,
    handleAttractionClick
  };
};
