
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, ExternalLink, X } from 'lucide-react';
import { HiddenGem } from '../types';

interface RegularGemCardProps {
  gem: HiddenGem;
  onClose: () => void;
  onWebsiteClick: (website: string) => void;
}

const RegularGemCard: React.FC<RegularGemCardProps> = ({ gem, onClose, onWebsiteClick }) => {
  return (
    <Card className="w-87 border-3 border-black bg-white shadow-2xl">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-7 h-7 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors z-20 text-sm font-bold"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Header */}
      <div className="bg-black text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center border border-black shadow-sm">
              <Star className="h-3 w-3 text-black" fill="currentColor" />
            </div>
            <span className="text-sm font-bold tracking-wide uppercase">Hidden Gem</span>
          </div>
          <div className="text-xs font-bold bg-white text-black px-2 py-1 rounded transform -rotate-2 shadow-sm">
            ROUTE 66
          </div>
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="text-center">
          <h3 className="font-black text-xl text-black leading-tight uppercase tracking-wide border-b-2 border-black pb-3 mb-4">
            {gem.title}
          </h3>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="h-4 w-4 text-black" />
            <span className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
              {gem.city_name}
            </span>
          </div>
          
          {gem.description && (
            <div className="bg-gray-100 border-2 border-dashed border-black rounded-lg p-4 mb-4 shadow-inner">
              <p className="text-sm text-black leading-relaxed font-medium">
                {gem.description}
              </p>
            </div>
          )}
          
          {gem.website && (
            <button
              onClick={() => onWebsiteClick(gem.website!)}
              className="bg-black text-white px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wide shadow-lg border-2 border-black hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 w-full"
            >
              <ExternalLink className="h-4 w-4" />
              Learn More
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RegularGemCard;
