
import React from 'react';

interface RouteStatsHeaderProps {
  onToggle: () => void;
}

const RouteStatsHeader: React.FC<RouteStatsHeaderProps> = ({ onToggle }) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
        🛣️ Route 66 Statistics
      </h3>
      <button
        onClick={onToggle}
        className="text-gray-400 hover:text-gray-600 text-sm"
      >
        ✕
      </button>
    </div>
  );
};

export default RouteStatsHeader;
