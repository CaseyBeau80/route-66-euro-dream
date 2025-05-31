
import React from 'react';
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
  onWebsiteClick
}) => {
  const gemPosition = { lat: Number(gem.latitude), lng: Number(gem.longitude) };

  return (
    <InfoWindow 
      position={gemPosition}
      onCloseClick={onClose}
      options={{
        maxWidth: 280,
        disableAutoPan: true, // Disable auto-pan since we're positioning manually
        zIndex: 9999,
        pixelOffset: new window.google.maps.Size(0, -400) // Position well above the marker
      }}
      onLoad={(infoWindow) => {
        console.log(`✅ InfoWindow loaded for ${gem.title} - positioned north of marker`);
      }}
    >
      <div 
        className="vintage-roadside-sign w-[270px] max-w-[85vw] bg-white border-2 border-route66-blue rounded-lg shadow-lg overflow-hidden"
        style={{
          maxHeight: '50vh',
          overflowY: 'auto'
        }}
      >
        {/* Compact Header Banner */}
        <div className="bg-gradient-to-r from-route66-blue to-blue-800 text-white px-3 py-1.5 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-route66-red rounded-full flex items-center justify-center border border-white shadow-sm">
                <Star className="h-2 w-2 text-white" fill="currentColor" />
              </div>
              <span className="text-xs font-bold tracking-wide uppercase">Hidden Gem</span>
            </div>
            <div className="text-xs font-bold bg-white text-route66-blue px-1.5 py-0.5 rounded transform -rotate-2 shadow-sm">
              ROUTE 66
            </div>
          </div>
        </div>
        
        {/* Compact Main Content */}
        <div className="p-2.5 bg-white">
          {/* Title Section */}
          <div className="mb-2 text-center">
            <h3 className="font-black text-sm text-route66-blue leading-tight uppercase tracking-wide border-b-2 border-route66-red pb-1 mb-1.5 break-words">
              {gem.title}
            </h3>
            <div className="flex items-center justify-center gap-1.5 text-gray-700">
              <MapPin className="h-3 w-3 text-route66-red flex-shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wide">{gem.city_name}</span>
            </div>
          </div>
          
          {/* Compact Description */}
          {gem.description && (
            <div className="mb-2 p-2 bg-gray-50 border border-dashed border-route66-blue rounded max-h-20 overflow-y-auto">
              <p className="text-xs text-gray-800 leading-relaxed font-medium text-left break-words">
                {gem.description}
              </p>
            </div>
          )}
          
          {/* Compact Website Button */}
          {gem.website && (
            <div className="text-center mb-1">
              <button
                onClick={() => onWebsiteClick(gem.website!)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-route66-red text-white font-bold text-xs rounded-full border border-route66-blue hover:bg-red-700 transition-all duration-200 shadow transform hover:scale-105 uppercase tracking-wide"
              >
                <ExternalLink className="h-2.5 w-2.5" />
                Visit Website
              </button>
            </div>
          )}
          
          {/* Compact Bottom Banner */}
          <div className="bg-gradient-to-r from-route66-blue to-blue-800 text-white px-2 py-1.5 -mx-2.5 -mb-2.5 text-center rounded-b-lg">
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-3 h-3 bg-route66-red rounded-full flex items-center justify-center border border-white">
                <span className="text-xs font-black text-white">66</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">
                America's Main Street
              </span>
              <div className="w-3 h-3 bg-route66-red rounded-full flex items-center justify-center border border-white">
                <span className="text-xs font-black text-white">66</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Custom scrollbar styles */}
        <style>
          {`
            .vintage-roadside-sign {
              font-family: 'Arial Black', Arial, sans-serif;
            }
            
            .vintage-roadside-sign::-webkit-scrollbar {
              width: 4px;
            }
            
            .vintage-roadside-sign::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 2px;
            }
            
            .vintage-roadside-sign::-webkit-scrollbar-thumb {
              background: #1E3A5F;
              border-radius: 2px;
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
