
import React from 'react';
import { Button } from '@/components/ui/button';
import { InteractiveGoogleMap } from '@/components/InteractiveGoogleMap';

interface InteractiveMapDisplayProps {
  isMapExpanded: boolean;
  onToggleExpanded: () => void;
}

const InteractiveMapDisplay: React.FC<InteractiveMapDisplayProps> = ({
  isMapExpanded,
  onToggleExpanded
}) => {
  // Route 66 path center point
  const route66Center = {
    lat: 35.0,
    lng: -98.0
  };

  return (
    <div className="relative">
      <div 
        className={`
          transition-all duration-700 ease-in-out overflow-hidden rounded-2xl
          ${isMapExpanded ? 'h-[700px]' : 'h-[500px]'}
        `}
      >
        <div className="relative h-full bg-white rounded-2xl border-2 border-route66-border shadow-2xl overflow-hidden">
          {/* Use InteractiveGoogleMap directly for full interactivity */}
          <InteractiveGoogleMap
            center={route66Center}
            zoom={5}
            className="w-full h-full"
            onMapLoad={(map) => {
              console.log('🗺️ Interactive map loaded for Route 66 display');
            }}
            onMapClick={() => {
              console.log('🗺️ Interactive map clicked');
            }}
          />
        </div>
      </div>
      
      {/* Map Controls */}
      <div className="mt-8 flex justify-center">
        <Button
          onClick={onToggleExpanded}
          className="bg-route66-primary hover:bg-route66-primary-dark text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300"
        >
          {isMapExpanded ? 'Compact View' : 'Expand Map'}
        </Button>
      </div>
    </div>
  );
};

export default InteractiveMapDisplay;
