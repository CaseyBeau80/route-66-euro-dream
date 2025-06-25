
import React, { useState } from 'react';
import { Bug, Database, CheckCircle } from 'lucide-react';
import WaypointValidationDisplay from './WaypointValidationDisplay';

interface MapDebugPanelProps {
  map: google.maps.Map | null;
}

const MapDebugPanel: React.FC<MapDebugPanelProps> = ({ map }) => {
  const [showValidation, setShowValidation] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!map) return null;

  return (
    <>
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border z-40">
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg"
        >
          <Bug className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Debug Panel</span>
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t p-3 space-y-2">
            <div className="text-xs text-gray-500 mb-2">Map Debug Tools</div>
            
            {/* Map Info */}
            <div className="text-xs space-y-1">
              <div>Zoom: {map.getZoom()?.toFixed(1)}</div>
              <div>
                Center: {map.getCenter()?.lat().toFixed(4)}, {map.getCenter()?.lng().toFixed(4)}
              </div>
            </div>

            {/* Validation Button */}
            <button
              onClick={() => setShowValidation(true)}
              className="flex items-center gap-2 w-full p-2 text-left text-sm bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
            >
              <Database className="h-4 w-4 text-blue-600" />
              <span className="text-blue-700">Validate Waypoints</span>
            </button>

            {/* Route Status */}
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-700">AccurateRoute66Polyline Active</span>
            </div>
          </div>
        )}
      </div>

      {/* Validation Modal */}
      <WaypointValidationDisplay
        isVisible={showValidation}
        onClose={() => setShowValidation(false)}
      />
    </>
  );
};

export default MapDebugPanel;
