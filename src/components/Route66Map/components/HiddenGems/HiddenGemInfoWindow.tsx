
import React, { useEffect, useRef } from 'react';
import { InfoWindow } from '@react-google-maps/api';
import { Star, MapPin, ExternalLink } from 'lucide-react';
import { HiddenGem } from './types';

interface HiddenGemInfoWindowProps {
  gem: HiddenGem;
  onClose: () => void;
  onWebsiteClick: (website: string) => void;
  map?: google.maps.Map;
}

const HiddenGemInfoWindow: React.FC<HiddenGemInfoWindowProps> = ({
  gem,
  onClose,
  onWebsiteClick,
  map
}) => {
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Simplified auto-pan logic that doesn't interfere with InfoWindow display
  useEffect(() => {
    if (map && gem) {
      const gemPosition = { lat: Number(gem.latitude), lng: Number(gem.longitude) };
      
      // Wait for InfoWindow to be mounted, then gently adjust view
      const timeoutId = setTimeout(() => {
        // Center the map on the gem with a slight upward offset to account for InfoWindow
        const offsetLat = gemPosition.lat + 0.01; // Small offset to show InfoWindow better
        map.panTo({ lat: offsetLat, lng: gemPosition.lng });
        
        // Ensure reasonable zoom level
        const currentZoom = map.getZoom() || 10;
        if (currentZoom < 11) {
          map.setZoom(11);
        }
        
        console.log(`📍 Adjusted map view for ${gem.title}`);
      }, 300); // Give InfoWindow time to render first

      return () => clearTimeout(timeoutId);
    }
  }, [map, gem]);

  const gemPosition = { lat: Number(gem.latitude), lng: Number(gem.longitude) };

  return (
    <InfoWindow 
      position={gemPosition}
      onCloseClick={onClose}
      options={{
        pixelOffset: new google.maps.Size(0, -40),
        maxWidth: 450,
        disableAutoPan: false, // Let Google Maps handle auto-pan
        zIndex: 9999
      }}
      onLoad={(infoWindow) => {
        infoWindowRef.current = infoWindow;
        console.log(`✅ InfoWindow loaded for ${gem.title}`);
      }}
    >
      <div 
        className="vintage-roadside-sign w-[420px] max-w-[95vw] bg-white border-4 border-route66-blue rounded-xl shadow-2xl overflow-hidden"
        style={{
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        {/* Vintage Header Banner */}
        <div className="bg-gradient-to-r from-route66-blue to-blue-800 text-white px-5 py-3 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-route66-red rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <Star className="h-4 w-4 text-white" fill="currentColor" />
              </div>
              <span className="text-base font-black tracking-wide uppercase">Hidden Gem</span>
            </div>
            <div className="text-xs font-bold bg-white text-route66-blue px-3 py-1 rounded-lg transform -rotate-2 shadow-md">
              ROUTE 66
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="p-5 bg-white">
          {/* Title Section */}
          <div className="mb-4 text-center">
            <h3 className="font-black text-xl text-route66-blue leading-tight uppercase tracking-wide border-b-4 border-route66-red pb-2 mb-3 break-words">
              {gem.title}
            </h3>
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <MapPin className="h-4 w-4 text-route66-red flex-shrink-0" />
              <span className="text-base font-bold uppercase tracking-wide">{gem.city_name}</span>
            </div>
          </div>
          
          {/* Description */}
          {gem.description && (
            <div className="mb-5 p-4 bg-gray-50 border-2 border-dashed border-route66-blue rounded-lg max-h-40 overflow-y-auto">
              <p className="text-base text-gray-800 leading-relaxed font-medium text-left break-words">
                {gem.description}
              </p>
            </div>
          )}
          
          {/* Website Button */}
          {gem.website && (
            <div className="text-center mb-3">
              <button
                onClick={() => onWebsiteClick(gem.website!)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-route66-red text-white font-bold text-base rounded-full border-2 border-route66-blue hover:bg-red-700 transition-all duration-200 shadow-lg transform hover:scale-105 uppercase tracking-wide"
              >
                <ExternalLink className="h-4 w-4" />
                Visit Website
              </button>
            </div>
          )}
          
          {/* Bottom Banner */}
          <div className="bg-gradient-to-r from-route66-blue to-blue-800 text-white px-5 py-3 -mx-5 -mb-5 text-center rounded-b-lg">
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 bg-route66-red rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-sm font-black text-white">66</span>
              </div>
              <span className="text-base font-bold uppercase tracking-widest">
                America's Main Street
              </span>
              <div className="w-6 h-6 bg-route66-red rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-sm font-black text-white">66</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Add custom CSS for animations */}
        <style>
          {`
            .vintage-roadside-sign {
              font-family: 'Arial Black', Arial, sans-serif;
            }
            
            .vintage-roadside-sign::-webkit-scrollbar {
              width: 8px;
            }
            
            .vintage-roadside-sign::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 4px;
            }
            
            .vintage-roadside-sign::-webkit-scrollbar-thumb {
              background: #1E3A5F;
              border-radius: 4px;
            }
            
            .vintage-roadside-sign::-webkit-scrollbar-thumb:hover {
              background: #2C5F41;
            }
          `}
        </style>
      </div>
    </InfoWindow>
  );
};

export default HiddenGemInfoWindow;
