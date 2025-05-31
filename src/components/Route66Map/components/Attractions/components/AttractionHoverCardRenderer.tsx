
import React from 'react';
import { Attraction } from '../types';
import { useAttractionHoverContext } from '../contexts/AttractionHoverContext';
import { useAttractionMarker } from '../hooks/useAttractionMarker';
import AttractionHoverPortal from './AttractionHoverPortal';
import DriveInHoverCard from './DriveInHoverCard';

interface AttractionHoverCardRendererProps {
  attraction: Attraction;
  onWebsiteClick?: (website: string) => void;
}

const AttractionHoverCardRenderer: React.FC<AttractionHoverCardRendererProps> = ({
  attraction,
  onWebsiteClick
}) => {
  const { activeAttraction, hoverPosition } = useAttractionHoverContext();
  const { markerConfig } = useAttractionMarker(attraction);

  // Check if this attraction is currently being hovered
  const isHovered = activeAttraction === attraction.name;

  // Use drive-in specific hover card for drive-ins, regular card for others
  return (
    <>
      {markerConfig.isDriveIn ? (
        <DriveInHoverCard
          attraction={attraction}
          isVisible={isHovered}
          position={hoverPosition}
          onWebsiteClick={onWebsiteClick}
        />
      ) : (
        <AttractionHoverPortal
          attraction={attraction}
          isVisible={isHovered}
          position={hoverPosition}
          onWebsiteClick={onWebsiteClick}
        />
      )}
    </>
  );
};

export default AttractionHoverCardRenderer;
