
import React from 'react';

interface HiddenGemsLegendProps {
  map: google.maps.Map;
}

// This component is now completely disabled as the Map Legend has been removed
const HiddenGemsLegend: React.FC<HiddenGemsLegendProps> = ({ map }) => {
  console.log('🚫 HiddenGemsLegend: Component disabled - Map Legend removed from interactive map');
  return null;
};

export default HiddenGemsLegend;
