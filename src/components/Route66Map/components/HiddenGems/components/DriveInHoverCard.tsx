
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, ExternalLink } from 'lucide-react';
import { HiddenGem } from '../types';

interface DriveInHoverCardProps {
  gem: HiddenGem;
  onWebsiteClick: (website: string) => void;
}

const DriveInHoverCard: React.FC<DriveInHoverCardProps> = ({ gem, onWebsiteClick }) => {
  return (
    <Card className="w-87 border-4 border-red-600 bg-gradient-to-br from-red-50 via-yellow-50 to-orange-100 shadow-2xl overflow-hidden relative">
      {/* Film strip decorations */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-red-800 via-yellow-600 to-red-800"></div>
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-red-800 via-yellow-600 to-red-800"></div>
      
      <div className="absolute left-0 top-0 bottom-0 w-5 bg-red-800">
        <div className="flex flex-col justify-around h-full py-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-3 h-1 bg-yellow-100 rounded-sm mx-auto"></div>
          ))}
        </div>
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-5 bg-red-800">
        <div className="flex flex-col justify-around h-full py-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-3 h-1 bg-yellow-100 rounded-sm mx-auto"></div>
          ))}
        </div>
      </div>

      <CardContent className="p-6 pl-10 pr-12">
        <div className="text-center">
          <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-yellow-200 px-4 py-3 rounded-lg shadow-lg mb-4 border-2 border-yellow-400">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl animate-pulse">🎬</span>
              <span className="font-bold text-sm uppercase tracking-widest">Drive-In Theater</span>
              <span className="text-2xl animate-pulse">🍿</span>
            </div>
          </div>
          
          <h3 className="font-black text-xl text-red-900 leading-tight uppercase tracking-wide mb-3">
            {gem.title}
          </h3>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="h-4 w-4 text-red-800" />
            <span className="bg-red-800 text-yellow-100 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg border border-yellow-400">
              {gem.city_name}
            </span>
          </div>
          
          {gem.description && (
            <div className="bg-gradient-to-br from-yellow-100 to-red-50 border-2 border-dashed border-red-600 rounded-lg p-4 mb-4 shadow-inner">
              <p className="text-sm text-red-900 leading-relaxed font-medium">
                {gem.description}
              </p>
            </div>
          )}
          
          {gem.website && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`🌐 Clicking drive-in website for ${gem.title}: ${gem.website}`);
                onWebsiteClick(gem.website!);
              }}
              className="bg-gradient-to-r from-red-600 to-red-700 text-yellow-200 px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wide shadow-lg border-2 border-yellow-400 hover:from-red-700 hover:to-red-800 hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 w-full pointer-events-auto"
            >
              <ExternalLink className="h-4 w-4" />
              Visit Theater Website
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DriveInHoverCard;
