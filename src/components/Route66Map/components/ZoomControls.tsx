
import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { useZoomState } from '../hooks/useZoomState';
import { useZoomHandlers } from '../hooks/useZoomHandlers';
import ZoomButton from './ZoomButton';
import ZoomDisplay from './ZoomDisplay';

interface ZoomControlsProps {
  map: google.maps.Map | null;
  isMapReady: boolean;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ map, isMapReady }) => {
  const { currentZoom, isZooming, setIsZooming } = useZoomState({ map, isMapReady });
  const { handleZoomIn, handleZoomOut } = useZoomHandlers({ 
    map, 
    isMapReady, 
    isZooming, 
    setIsZooming 
  });

  // Don't render if map isn't ready
  if (!isMapReady || !map) {
    return null;
  }

  const isZoomInDisabled = currentZoom >= 18 || isZooming;
  const isZoomOutDisabled = currentZoom <= 3 || isZooming;

  console.log('🎮 ZoomControls: Rendering with zoom:', currentZoom);

  return (
    <div 
      className="absolute bottom-20 left-6 z-[1000] flex flex-col gap-2 bg-white/95 p-3 rounded-lg shadow-xl border border-gray-200 backdrop-blur-sm"
      style={{ 
        pointerEvents: 'auto',
        position: 'absolute',
        zIndex: 1000
      }}
      onWheel={(e) => {
        // Prevent wheel events from affecting zoom controls
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {/* Zoom In Button */}
      <ZoomButton
        onClick={handleZoomIn}
        disabled={isZoomInDisabled}
        isZooming={isZooming}
        Icon={ZoomIn}
        title={isZoomInDisabled ? 'Maximum zoom reached' : 'Zoom in'}
      />
      
      {/* Current Zoom Display */}
      <ZoomDisplay currentZoom={currentZoom} isZooming={isZooming} />
      
      {/* Zoom Out Button */}
      <ZoomButton
        onClick={handleZoomOut}
        disabled={isZoomOutDisabled}
        isZooming={isZooming}
        Icon={ZoomOut}
        title={isZoomOutDisabled ? 'Minimum zoom reached' : 'Zoom out'}
      />
    </div>
  );
};

export default ZoomControls;
