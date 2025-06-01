
import React from 'react';
import ZoomControls from '../../MapElements/ZoomControls';
import ZoomControlsWrapper from './ZoomControlsWrapper';
import { useZoomControlsLogic } from './hooks/useZoomControlsLogic';

interface ZoomControlsOverlayProps {
  isMapReady: boolean;
  mapRef?: React.MutableRefObject<google.maps.Map | null>;
}

const ZoomControlsOverlay: React.FC<ZoomControlsOverlayProps> = ({
  isMapReady,
  mapRef
}) => {
  const { currentZoom, handleZoomIn, handleZoomOut } = useZoomControlsLogic({
    isMapReady,
    mapRef
  });

  // Don't render if map isn't ready
  if (!isMapReady) {
    console.log('🔍 ZoomControlsOverlay: Not rendering - map not ready');
    return null;
  }

  console.log('🎮 ZoomControlsOverlay: Rendering zoom controls', {
    isMapReady,
    hasMapRef: !!mapRef?.current,
    currentZoom
  });

  return (
    <ZoomControlsWrapper>
      <ZoomControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        currentZoom={currentZoom}
        minZoom={3}
        maxZoom={18}
        disabled={!isMapReady}
      />
    </ZoomControlsWrapper>
  );
};

export default ZoomControlsOverlay;
