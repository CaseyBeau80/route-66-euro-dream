
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
    <Card className="w-87 border-3 border-teal-600 bg-white shadow-2xl">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-7 h-7 bg-teal-600 text-white rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors z-20 text-sm font-bold"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Header with turquoise gradient */}
      <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600 text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center border border-teal-200 shadow-sm">
              <Star className="h-3 w-3 text-teal-600" fill="currentColor" />
            </div>
            <span className="text-sm font-bold tracking-wide uppercase">Hidden Gem</span>
          </div>
          <div className="text-xs font-bold bg-white text-teal-600 px-2 py-1 rounded transform -rotate-2 shadow-sm">
            ROUTE 66
          </div>
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="text-center">
          <h3 className="font-black text-xl text-teal-800 leading-tight uppercase tracking-wide border-b-2 border-teal-600 pb-3 mb-4">
            {gem.title}
          </h3>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="h-4 w-4 text-teal-600" />
            <span className="bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
              {gem.city_name}
            </span>
          </div>
          
          {gem.description && (
            <div className="bg-gradient-to-br from-teal-50 to-white border-2 border-dashed border-teal-300 rounded-lg p-4 mb-4 shadow-inner">
              <p className="text-sm text-teal-800 leading-relaxed font-medium">
                {gem.description}
              </p>
            </div>
          )}
          
          {gem.website && (
            <button
              onClick={() => onWebsiteClick(gem.website!)}
              className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wide shadow-lg border-2 border-teal-600 hover:from-teal-700 hover:to-teal-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 w-full"
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
