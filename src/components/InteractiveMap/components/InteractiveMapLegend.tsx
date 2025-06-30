
import React, { useState } from 'react';
import { MapPin, Gem, Shield, ChevronUp, ChevronDown } from 'lucide-react';

const InteractiveMapLegend: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const legendItems = [
    {
      icon: <Shield className="w-5 h-5 text-blue-600" />,
      label: "Route 66 Shields",
      description: "Historic Route 66 markers and destination cities",
      color: "bg-blue-100"
    },
    {
      icon: <MapPin className="w-5 h-5 text-red-600" />,
      label: "Red Pins",
      description: "Major attractions and points of interest",
      color: "bg-red-100"
    },
    {
      icon: <Gem className="w-5 h-5 text-purple-600" />,
      label: "Blue Gem Markers",  
      description: "Hidden gems and secret local treasures",
      color: "bg-purple-100"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-w-4xl mx-auto">
      {/* Legend Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-lg text-gray-800">MAP LEGEND</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Expanded Legend Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {legendItems.map((item, index) => (
              <div 
                key={index}
                className={`flex items-center gap-3 p-4 rounded-lg ${item.color} hover:shadow-md transition-all duration-200`}
              >
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-1 text-gray-800">
                    {item.label}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Interactive Tips */}
          <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
            <h5 className="font-semibold text-sm text-gray-800 mb-3 flex items-center gap-2">
              <span>💡</span>
              Interactive Tips
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                <span>Click markers to discover stories</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                <span>Use mouse wheel to zoom</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
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
