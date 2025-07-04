
import React, { useState } from 'react';
import { ExternalLink, MapPin, Calendar, ImageIcon, Tag, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UnifiedRoute66Item } from '../types';

interface UnifiedItemCardProps {
  item: UnifiedRoute66Item;
}

const UnifiedItemCard: React.FC<UnifiedItemCardProps> = ({ item }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Debug website data
  console.log(`🔍 ${item.name}:`, {
    hasWebsite: !!item.website,
    website: item.website,
    websiteLength: item.website?.length
  });

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'attractions': return 'Historic Attraction';
      case 'drive_ins': return 'Drive-In Theater';
      case 'hidden_gems': return 'Hidden Gem';
      default: return 'Route 66 Stop';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'attractions': return 'bg-route66-primary/10 text-route66-primary border border-route66-primary/20';
      case 'drive_ins': return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'hidden_gems': return 'bg-green-100 text-green-800 border border-green-200';
      default: return 'bg-route66-background-section text-route66-text-muted border border-route66-border';
    }
  };

  const fallbackImage = '/lovable-uploads/79d1bcf2-04dd-4206-8f0b-14e6cdce4cdc.png';
  const imageUrl = item.thumbnail_url || item.image_url || fallbackImage;

  const handleWebsiteClick = () => {
    if (item.website) {
      window.open(item.website, '_blank', 'noopener,noreferrer');
    }
  };

  const handleMapClick = () => {
    if (item.latitude && item.longitude) {
      const placeName = encodeURIComponent(`${item.name}, ${item.city_name}${item.state ? `, ${item.state}` : ''}`);
      const url = `https://www.google.com/maps/search/${placeName}/@${item.latitude},${item.longitude},15z`;
      window.open(url, '_blank');
    }
  };

  // Use either title or name for display
  const displayName = item.title || item.name;

  return (
    <Card className="h-full overflow-hidden border-3 border-blue-600 bg-gradient-to-br from-blue-50 via-white to-blue-100 shadow-2xl relative">
      {/* Vintage Route 66 decorative border */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-red-600 via-white via-blue-600 to-red-600"></div>
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-red-600 via-white via-blue-600 to-red-600"></div>
      
      {/* Side decorative elements */}
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-600"></div>
      <div className="absolute right-0 top-0 bottom-0 w-2 bg-blue-600"></div>

      {/* Header with vintage styling */}
      <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-800 text-white px-6 py-4 mt-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-blue-200 shadow-sm">
            <Star className="h-4 w-4 text-blue-800" fill="currentColor" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-bold tracking-wider uppercase text-blue-100">Route 66 Attraction</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full font-bold uppercase tracking-wide">
                Historic Stop
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-white">
        {!imageError && (
          <img
            src={imageUrl}
            alt={displayName}
            loading="lazy"
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />
        )}
        
        {/* Loading/Error Fallback */}
        {(!imageLoaded || imageError) && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center text-blue-800 border-2 border-dashed border-blue-300">
            <div className="bg-white rounded-full p-3 mb-2 shadow-sm border-2 border-blue-200">
              <ImageIcon className="h-8 w-8 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-center px-4">
              {imageError ? 'Image not available' : 'Loading image...'}
            </span>
            <span className="text-xs text-blue-600 mt-1 opacity-75">
              Route 66 {getCategoryLabel(item.category)}
            </span>
          </div>
        )}

      </div>

      <CardContent className="p-6 pb-3">
        {/* Enhanced title with better typography */}
        <div className="text-center mb-4">
          <h3 className="font-black text-xl text-blue-900 leading-tight mb-2 break-words">
            {displayName}
          </h3>
          
          {/* Location with enhanced styling */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-blue-700" />
            <span className="bg-blue-800 text-blue-100 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
              {item.state || 'Route 66'}
            </span>
          </div>
        </div>
        
        {/* Description with improved styling */}
        {item.description && (
          <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-dashed border-blue-300 rounded-lg p-4 mb-4 shadow-inner">
            <p className="text-sm text-blue-800 leading-relaxed font-medium text-center break-words">
              {item.description.length > 100 
                ? `${item.description.substring(0, 100)}...` 
                : item.description
              }
            </p>
          </div>
        )}

        {/* Website button - fully interactive */}
        {item.website && (
          <div className="mb-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🌐 Website button clicked for:', displayName, 'URL:', item.website);
                handleWebsiteClick();
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
            >
              <ExternalLink className="h-4 w-4" />
              Visit Website
            </button>
          </div>
        )}
        
        {/* Enhanced footer with vintage Route 66 styling */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white px-4 py-3 -mx-6 -mb-3 rounded-b-lg border-t-2 border-blue-600">
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-red-200 shadow-sm">
              <span className="text-xs font-black text-red-700">66</span>
            </div>
            <span className="text-sm font-bold uppercase tracking-wider text-center">
              America's Main Street
            </span>
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-red-200 shadow-sm">
              <span className="text-xs font-black text-red-700">66</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedItemCard;
