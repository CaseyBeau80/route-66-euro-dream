
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
    <Card className="w-87 border-3 shadow-2xl" style={{ borderColor: '#40E0D0', backgroundColor: 'white' }}>
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-7 h-7 text-white rounded-full flex items-center justify-center transition-colors z-20 text-sm font-bold"
        style={{ backgroundColor: '#40E0D0' }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#20B2AA'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#40E0D0'}
      >
        <X className="h-4 w-4" />
      </button>

      {/* Header */}
      <div className="text-white px-4 py-3" style={{ backgroundColor: '#40E0D0' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm" style={{ borderColor: '#40E0D0', borderWidth: '1px' }}>
              <Star className="h-3 w-3" style={{ color: '#40E0D0' }} fill="currentColor" />
            </div>
            <span className="text-sm font-bold tracking-wide uppercase">Hidden Gem</span>
          </div>
          <div className="text-xs font-bold bg-white px-2 py-1 rounded transform -rotate-2 shadow-sm" style={{ color: '#40E0D0' }}>
            ROUTE 66
          </div>
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="text-center">
          <h3 className="font-black text-xl leading-tight uppercase tracking-wide border-b-2 pb-3 mb-4" style={{ color: '#40E0D0', borderColor: '#40E0D0' }}>
            {gem.title}
          </h3>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="h-4 w-4" style={{ color: '#40E0D0' }} />
            <span className="text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg" style={{ backgroundColor: '#40E0D0' }}>
              {gem.city_name}
            </span>
          </div>
          
          {gem.description && (
            <div className="border-2 border-dashed rounded-lg p-4 mb-4 shadow-inner" style={{ backgroundColor: '#F0FFFF', borderColor: '#40E0D0' }}>
              <p className="text-sm leading-relaxed font-medium" style={{ color: '#20B2AA' }}>
                {gem.description}
              </p>
            </div>
          )}
          
          {gem.website && (
            <button
              onClick={() => onWebsiteClick(gem.website!)}
              className="text-white px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wide shadow-lg border-2 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 w-full"
              style={{ backgroundColor: '#40E0D0', borderColor: '#40E0D0' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#20B2AA'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#40E0D0'}
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
