
import React from 'react';
import { Attraction } from './types';
import AttractionMarkerRenderer from './components/AttractionMarkerRenderer';
import AttractionHoverCardRenderer from './components/AttractionHoverCardRenderer';

interface AttractionCustomMarkerProps {
  attraction: Attraction;
  map: google.maps.Map;
  onAttractionClick?: (attraction: Attraction) => void;
  onWebsiteClick?: (website: string) => void;
}

const AttractionCustomMarker: React.FC<AttractionCustomMarkerProps> = React.memo(({
  attraction,
  map,
  onAttractionClick,
  onWebsiteClick
}) => {
  return (
    <>
      <AttractionMarkerRenderer
        attraction={attraction}
        map={map}
        onAttractionClick={onAttractionClick}
      />
      <AttractionHoverCardRenderer
        attraction={attraction}
        onWebsiteClick={onWebsiteClick}
      />
    </>
  );
});

AttractionCustomMarker.displayName = 'AttractionCustomMarker';

export default AttractionCustomMarker;
