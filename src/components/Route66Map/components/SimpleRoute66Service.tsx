
import React from 'react';

interface SimpleRoute66ServiceProps {
  map: google.maps.Map;
}

// This component is completely disabled to prevent route conflicts
// All route rendering is now handled by Route66StaticPolyline component
const SimpleRoute66Service: React.FC<SimpleRoute66ServiceProps> = ({ map }) => {
  console.log('⚠️ SimpleRoute66Service: Component completely disabled to prevent conflicts with single Route66StaticPolyline');
  return null;
};

export default SimpleRoute66Service;
