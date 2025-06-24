
import React from 'react';
import { Button } from '@/components/ui/button';
import Route66Map from '../../Route66Map';

interface InteractiveMapDisplayProps {
  isMapExpanded: boolean;
  onToggleExpanded: () => void;
}

const InteractiveMapDisplay: React.FC<InteractiveMapDisplayProps> = ({
  isMapExpanded,
  onToggleExpanded
}) => {
  return (
    <div className="relative">
      <div 
        className={`
          transition-all duration-700 ease-in-out overflow-hidden rounded-2xl
          ${isMapExpanded ? 'h-[700px] opacity-100' : 'h-[500px] opacity-100'}
        `}
      >
        <div className="relative h-full bg-white rounded-2xl border-2 border-route66-border shadow-2xl overflow-hidden">
          <Route66Map />
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
