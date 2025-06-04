
import React from 'react';

const MapLegend: React.FC = () => {
  const legendItems = [
    {
      icon: <div className="w-4 h-4 bg-route66-accent-red rounded-full border-2 border-white shadow-sm"></div>,
      label: "Historic Towns",
      description: "Major stops along Route 66"
    },
    {
      icon: <div className="w-6 h-2 bg-route66-primary rounded-sm shadow-sm"></div>,
      label: "Route 66 Path",
      description: "The Mother Road's original route"
    },
    {
      icon: <div className="w-4 h-4 bg-route66-accent-orange rounded-full border-2 border-white shadow-sm"></div>,
      label: "Attractions",
      description: "Points of interest & attractions"
    },
    {
      icon: <span className="text-route66-primary text-lg">🗺️</span>,
      label: "Interactive Map",
      description: "Click states to explore"
    }
  ];

  return (
    <div className="p-6 rounded-2xl h-full bg-route66-background border border-route66-border">
      <h3 className="text-xl font-bold mb-6 text-center text-route66-text-primary">
        Map Legend
      </h3>
      
      <div className="space-y-4">
        {legendItems.map((item, index) => (
          <div 
            key={index}
            className="flex items-start gap-3 p-4 rounded-xl transition-all duration-300 hover:bg-route66-hover cursor-default border border-route66-divider hover:border-route66-border"
          >
            <div className="flex-shrink-0 flex items-center justify-center w-6 h-6">
              {item.icon}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold mb-1 text-route66-text-primary">
                {item.label}
              </h4>
              <p className="text-xs text-route66-text-muted leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation tip */}
      <div className="mt-6 p-4 rounded-xl text-center bg-route66-background-alt border border-route66-border">
        <p className="text-xs font-medium text-route66-text-secondary">
          💡 Ctrl + scroll to zoom map
        </p>
      </div>
      
      {/* Modern decorative elements */}
      <div className="mt-6 flex justify-center items-center gap-2">
        <div className="w-8 h-1 bg-gradient-to-r from-route66-primary to-route66-primary-light rounded-full"></div>
        <div className="w-3 h-3 bg-route66-accent-orange rounded-full border border-route66-border"></div>
        <div className="w-8 h-1 bg-gradient-to-l from-route66-primary to-route66-primary-light rounded-full"></div>
      </div>
    </div>
  );
};

export default MapLegend;
