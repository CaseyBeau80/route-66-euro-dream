
import React from 'react';
import { MapPin } from 'lucide-react';

const InteractiveMapLegend: React.FC = () => {
  const legendItems = [
    {
      icon: <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-sm"></div>,
      label: "Destination Cities",
      description: "Major cities along Route 66"
    },
    {
      icon: <MapPin className="w-4 h-4 text-red-600" />,
      label: "Attractions",
      description: "Points of interest & attractions"
    },
    {
      icon: <div className="w-4 h-4 bg-purple-600 rounded transform rotate-45 border border-white shadow-sm"></div>,
      label: "Hidden Gems",
      description: "Lesser-known treasures"
    },
    {
      icon: <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-sm"></div>,
      label: "Drive-In Theaters",
      description: "Classic American drive-ins"
    },
    {
      icon: <div className="w-6 h-1 bg-orange-600 rounded-sm shadow-sm"></div>,
      label: "Route 66 Path",
      description: "The historic Mother Road"
    }
  ];

  return (
    <div className="absolute top-4 left-4 z-[1000] max-w-xs">
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 p-4">
        <h3 className="text-sm font-bold mb-3 text-gray-800 border-b border-gray-200 pb-2">
          Map Legend
        </h3>
        
        <div className="space-y-2">
          {legendItems.map((item, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 text-xs"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-6 h-6">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-700 truncate">
                  {item.label}
                </div>
                <div className="text-gray-500 text-xs leading-tight">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            💡 Click markers for details
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapLegend;
