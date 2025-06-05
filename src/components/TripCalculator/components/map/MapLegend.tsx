
import React from 'react';

const MapLegend: React.FC = () => (
  <div className="mt-4 flex flex-wrap gap-4 text-xs">
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
      <span>Start Point</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 bg-red-600 rounded-full"></div>
      <span>End Point</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
      <span>Recommended Stops</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-8 h-1 bg-red-600"></div>
      <span>Route Path</span>
    </div>
  </div>
);

export default MapLegend;
