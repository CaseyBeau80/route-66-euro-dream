
import React, { useState } from 'react';
import { ExternalLink, MapPin, Route, X } from 'lucide-react';
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
    <Card className="h-full border-2 border-red-600 bg-white shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-red-600 text-white px-4 py-3">
        <div className="flex items-center gap-2">
          <Route className="h-5 w-5" />
          <span className="text-sm font-bold">Route 66 Attraction</span>
          <span className="text-xs bg-white text-red-600 px-2 py-1 rounded font-bold ml-auto">
            Historic Stop
          </span>
        </div>
      </div>

      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-white">
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
          <div className="absolute inset-0 bg-red-50 flex flex-col items-center justify-center text-red-600">
            <Route className="h-12 w-12 mb-2" />
            <span className="text-sm font-medium text-center px-4">
              {imageError ? 'Image not available' : 'Loading image...'}
            </span>
          </div>
        )}

      </div>

      <CardContent className="p-4">
        {/* Title */}
        <h3 className="font-bold text-xl text-red-900 mb-3">
          {displayName}
        </h3>
        
        {/* Location */}
        <div className="flex items-center gap-2 text-red-700 mb-4">
          <MapPin className="h-4 w-4" />
          <span className="text-sm font-medium">{item.state || item.city_name}</span>
          {item.state && item.city_name && (
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">
              {item.state}
            </span>
          )}
        </div>
        
        {/* Description */}
        {item.description && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-800 leading-relaxed">
              {item.description}
            </p>
          </div>
        )}

        {/* Website button */}
        {item.website && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('🌐 Website button clicked for:', displayName, 'URL:', item.website);
              handleWebsiteClick();
            }}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Visit Website
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default UnifiedItemCard;
