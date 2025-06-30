
import React, { useState } from 'react';
import { MapPin, Gem, Shield, ChevronUp, ChevronDown } from 'lucide-react';

const InteractiveMapLegend: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const legendItems = [
    {
      icon: <Shield className="w-4 h-4 text-route66-primary" />,
      label: "Route 66 Shields",
      description: "Historic Route 66 markers and destination cities",
      color: "text-route66-primary"
    },
    {
      icon: <MapPin className="w-4 h-4 text-red-600" />,
      label: "Red Pins",
      description: "Major attractions and points of interest",
      color: "text-red-600"
    },
    {
      icon: <Gem className="w-4 h-4 text-blue-600" />,
      label: "Blue Gem Markers",
      description: "Hidden gems and secret local treasures",
      color: "text-blue-600"
    }
  ];

  return (
    <div className="bg-blue-600 text-white rounded-lg shadow-lg">
      {/* Legend Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-blue-700 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5" />
          <span className="font-bold text-lg">MAP LEGEND</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5" />
        ) : (
          <ChevronUp className="w-5 h-5" />
        )}
      </button>

      {/* Expanded Legend Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-blue-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {legendItems.map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-blue-700/50 hover:bg-blue-700/70 transition-all duration-200"
              >
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/20">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-1 text-white">
                    {item.label}
                  </h4>
                  <p className="text-xs text-blue-100 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Interactive Tips */}
          <div className="mt-4 p-3 rounded-lg bg-blue-700/30 border border-blue-400/30">
            <h5 className="font-semibold text-sm text-white mb-2 flex items-center gap-2">
              <span>💡</span>
              Interactive Tips
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-blue-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                <span>Click markers to discover stories</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                <span>Use mouse wheel to zoom</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                <span>Drag to explore Route 66</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMapLegend;
