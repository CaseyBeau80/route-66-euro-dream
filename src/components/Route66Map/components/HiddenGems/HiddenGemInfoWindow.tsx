
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
    <InfoWindow onCloseClick={onClose}>
      <div className="vintage-roadside-sign w-80 bg-gradient-to-b from-route66-cream to-gray-100 border-4 border-route66-blue rounded-lg shadow-2xl overflow-hidden">
        {/* Vintage Header Banner */}
        <div className="bg-gradient-to-r from-route66-blue to-teal-700 text-route66-cream px-6 py-3 relative">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-route66-red rounded-full flex items-center justify-center border-2 border-route66-cream shadow-md">
                <Star className="h-4 w-4 text-route66-cream" fill="currentColor" />
              </div>
              <span className="text-sm font-black tracking-wide uppercase">Hidden Gem</span>
            </div>
            <div className="text-sm font-bold bg-route66-cream text-route66-blue px-3 py-1 rounded-md transform -rotate-2 shadow-sm">
              ROUTE 66
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="p-6 bg-route66-cream">
          {/* Title Section */}
          <div className="mb-4 text-center">
            <h3 className="font-black text-xl text-route66-blue leading-tight uppercase tracking-wide border-b-3 border-route66-red pb-2 mb-3">
              {gem.title}
            </h3>
            <div className="flex items-center justify-center gap-2 text-route66-gray">
              <MapPin className="h-4 w-4" />
              <span className="text-base font-bold uppercase tracking-wide">{gem.city_name}</span>
            </div>
          </div>
          
          {/* Description */}
          {gem.description && (
            <div className="mb-5 p-4 bg-white border-2 border-dashed border-route66-blue rounded-lg">
              <p className="text-base text-route66-gray leading-relaxed font-medium text-left">
                {gem.description}
              </p>
            </div>
          )}
          
          {/* Website Button */}
          {gem.website && (
            <div className="text-center mb-4">
              <button
                onClick={() => onWebsiteClick(gem.website!)}
                className="inline-flex items-center gap-3 px-6 py-3 bg-route66-red text-route66-cream font-bold text-base rounded-full border-2 border-route66-blue hover:bg-red-700 transition-all duration-200 shadow-lg transform hover:scale-105 uppercase tracking-wide"
              >
                <ExternalLink className="h-4 w-4" />
                Visit Site
              </button>
            </div>
          )}
          
          {/* Bottom Banner */}
          <div className="bg-gradient-to-r from-route66-blue to-teal-700 text-route66-cream px-4 py-3 -mx-6 -mb-6 text-center rounded-b-md">
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 bg-route66-red rounded-full flex items-center justify-center border border-route66-cream">
                <span className="text-sm font-black text-route66-cream">66</span>
              </div>
              <span className="text-sm font-bold uppercase tracking-widest">
                America's Main Street
              </span>
              <div className="w-6 h-6 bg-route66-red rounded-full flex items-center justify-center border border-route66-cream">
                <span className="text-sm font-black text-route66-cream">66</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </InfoWindow>
  );
};

export default HiddenGemInfoWindow;
