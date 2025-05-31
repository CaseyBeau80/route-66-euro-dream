
import React from 'react';
import MapContainer from './components/map/MapContainer';

interface GoogleMapsRoute66Props {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
  onClearSelection: () => void;
}

const GoogleMapsRoute66: React.FC<GoogleMapsRoute66Props> = ({ 
  selectedState,
  onStateClick,
  onClearSelection
}: GoogleMapsRoute66Props) => {
  return (
    <MapContainer 
      selectedState={selectedState}
      onStateClick={onStateClick}
      onClearSelection={onClearSelection}
    />
  );
};

export default GoogleMapsRoute66;
