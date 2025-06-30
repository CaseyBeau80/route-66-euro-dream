
import React from 'react';
import { MapPin } from 'lucide-react';

const InteractiveMapLegend: React.FC = () => {
  const legendItems = [
    {
      icon: (
        <div className="w-6 h-6 flex items-center justify-center">
          <div className="w-12 h-14 flex items-center justify-center">
            <svg width="24" height="30" viewBox="0 0 24 30" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="woodGrain" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{stopColor:'#8B4513', stopOpacity:1}} />
                  <stop offset="50%" style={{stopColor:'#A0522D', stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:'#8B4513', stopOpacity:1}} />
                </linearGradient>
              </defs>
              <rect x="10" y="12" width="4" height="18" fill="url(#woodGrain)" stroke="#654321" strokeWidth="0.3"/>
              <path d="M12 2 L4 2 L4 8 C4 10 5 12 7 13.5 C9 14.5 10.5 15 12 15 C13.5 15 15 14.5 17 13.5 C19 12 20 10 20 8 L20 2 L12 2 Z" 
                    fill="#F5F5DC" 
                    stroke="#000000" 
                    strokeWidth="1"/>
              <text x="12" y="6" textAnchor="middle" fill="#000000" fontSize="2" fontWeight="bold">ROUTE</text>
              <text x="12" y="11" textAnchor="middle" fill="#000000" fontSize="6" fontWeight="900">66</text>
            </svg>
          </div>
        </div>
      ),
      label: "Major Route 66 Cities",
      description: "Major Route 66 cities that include Event Calendars, Weather, Population, and Fun Facts"
    },
    {
      icon: (
        <div className="w-6 h-6 flex items-center justify-center">
          <svg width="20" height="24" viewBox="0 0 20 24" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pinGradient" x1="10%" y1="0%" x2="90%" y2="100%">
                <stop offset="0%" style={{stopColor:'#ff4444', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#cc2222', stopOpacity:1}} />
              </linearGradient>
            </defs>
            <path d="M10,22 C4,16 4,10 10,10 C16,10 16,16 10,22 Z" fill="url(#pinGradient)" stroke="#ffffff" strokeWidth="1"/>
            <circle cx="10" cy="13" r="3" fill="#ffffff" stroke="#cc2222" strokeWidth="1"/>
            <circle cx="10" cy="13" r="1.5" fill="#ff4444"/>
          </svg>
        </div>
      ),
      label: "Attractions",
      description: "Points of interest & attractions"
    },
    {
      icon: (
        <div className="w-6 h-6 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#40E0D0', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#008B8B', stopOpacity:1}} />
              </linearGradient>
            </defs>
            <polygon points="11,2 6,2 6,7 4,11 6,20 11,20 16,20 18,11 16,7 16,2" 
                     fill="url(#gemGradient)" 
                     stroke="#ffffff" 
                     strokeWidth="1"/>
            <polygon points="11,2 8,7 11,11 14,7" fill="#B0E0E6" opacity="0.7"/>
            <polygon points="8,7 4,11 11,11" fill="#87CEEB" opacity="0.6"/>
            <polygon points="14,7 18,11 11,11" fill="#87CEEB" opacity="0.5"/>
          </svg>
        </div>
      ),
      label: "Hidden Gems",
      description: "Lesser-known treasures"
    },
    {
      icon: (
        <div className="w-6 h-6 flex items-center justify-center">
          <div className="w-5 h-5 bg-orange-500 rounded-full border-2 border-white shadow-md flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      ),
      label: "Drive-In Theaters",
      description: "Classic American drive-ins"
    }
  ];

  return (
    <div className="absolute top-4 left-4 z-[1000] max-w-xs">
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 p-4">
        <h3 className="text-sm font-bold mb-3 text-gray-800 border-b border-gray-200 pb-2">
          Route 66 Map Legend
        </h3>
        
        <div className="space-y-3">
          {legendItems.map((item, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 text-xs"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 mt-0.5">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-700 leading-tight mb-1">
                  {item.label}
                </div>
                <div className="text-gray-500 text-xs leading-tight">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapLegend;
