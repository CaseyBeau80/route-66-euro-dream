
import React from 'react';
import { InfoWindow } from '@react-google-maps/api';
import { Star, MapPin, ExternalLink } from 'lucide-react';
import { HiddenGem } from './types';

interface HiddenGemInfoWindowProps {
  gem: HiddenGem;
  onClose: () => void;
  onWebsiteClick: (website: string) => void;
}

const HiddenGemInfoWindow: React.FC<HiddenGemInfoWindowProps> = ({
  gem,
  onClose,
  onWebsiteClick
}) => {
  return (
    <InfoWindow 
      onCloseClick={onClose}
      position={{ lat: Number(gem.latitude), lng: Number(gem.longitude) }}
      options={{
        pixelOffset: new google.maps.Size(0, -10),
        maxWidth: 400,
        disableAutoPan: false
      }}
    >
      <div className="vintage-roadside-sign w-96 bg-white border-4 border-route66-blue rounded-xl shadow-2xl overflow-hidden">
        {/* Vintage Header Banner */}
        <div className="bg-gradient-to-r from-route66-blue to-blue-800 text-white px-6 py-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-route66-red rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <Star className="h-5 w-5 text-white" fill="currentColor" />
              </div>
              <span className="text-lg font-black tracking-wide uppercase">Hidden Gem</span>
            </div>
            <div className="text-sm font-bold bg-white text-route66-blue px-4 py-2 rounded-lg transform -rotate-2 shadow-md">
              ROUTE 66
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="p-6 bg-white">
          {/* Title Section */}
          <div className="mb-5 text-center">
            <h3 className="font-black text-2xl text-route66-blue leading-tight uppercase tracking-wide border-b-4 border-route66-red pb-3 mb-4">
              {gem.title}
            </h3>
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <MapPin className="h-5 w-5 text-route66-red" />
              <span className="text-lg font-bold uppercase tracking-wide">{gem.city_name}</span>
            </div>
          </div>
          
          {/* Description */}
          {gem.description && (
            <div className="mb-6 p-5 bg-gray-50 border-2 border-dashed border-route66-blue rounded-lg">
              <p className="text-lg text-gray-800 leading-relaxed font-medium text-left">
                {gem.description}
              </p>
            </div>
          )}
          
          {/* Website Button */}
          {gem.website && (
            <div className="text-center mb-4">
              <button
                onClick={() => onWebsiteClick(gem.website!)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-route66-red text-white font-bold text-lg rounded-full border-2 border-route66-blue hover:bg-red-700 transition-all duration-200 shadow-lg transform hover:scale-105 uppercase tracking-wide"
              >
                <ExternalLink className="h-5 w-5" />
                Visit Website
              </button>
            </div>
          )}
          
          {/* Bottom Banner */}
          <div className="bg-gradient-to-r from-route66-blue to-blue-800 text-white px-6 py-4 -mx-6 -mb-6 text-center rounded-b-lg">
            <div className="flex items-center justify-center gap-4">
              <div className="w-8 h-8 bg-route66-red rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-lg font-black text-white">66</span>
              </div>
              <span className="text-lg font-bold uppercase tracking-widest">
                America's Main Street
              </span>
              <div className="w-8 h-8 bg-route66-red rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-lg font-black text-white">66</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </InfoWindow>
  );
};

export default HiddenGemInfoWindow;
