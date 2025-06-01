
import React from 'react';
import { useWaypointManagement } from '../hooks/useWaypointManagement';
import { useGoogleMapsContext } from './GoogleMapsProvider';

interface WaypointManagerProps {
  selectedState: string | null;
  children: (props: {
    visibleWaypoints: any[];
    handleDestinationClick: (destination: any) => void;
    handleAttractionClick: (attraction: any) => void;
  }) => React.ReactNode;
}

export const WaypointManager: React.FC<WaypointManagerProps> = ({
  selectedState,
  children
}) => {
  const { waypoints } = useGoogleMapsContext();

  const { visibleWaypoints, handleDestinationClick, handleAttractionClick } = useWaypointManagement({
    waypoints,
    selectedState
  });

  return (
    <>
      {children({
        visibleWaypoints,
        handleDestinationClick,
        handleAttractionClick
      })}
    </>
  );
};
