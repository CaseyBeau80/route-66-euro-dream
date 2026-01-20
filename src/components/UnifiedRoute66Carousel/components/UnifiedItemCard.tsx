import React, { useState } from 'react';
import { ExternalLink, MapPin, Calendar, ImageIcon, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UnifiedRoute66Item } from '../types';
import { openMobileAwareLink, createMobileAwareReturnUrl } from '@/utils/mobileAwareLinkUtils';
interface UnifiedItemCardProps {
  item: UnifiedRoute66Item;
}
const UnifiedItemCard: React.FC<UnifiedItemCardProps> = ({
  item
}) => {
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
      case 'attractions':
        return 'Historic Attraction';
      case 'drive_ins':
        return 'Drive-In Theater';
      case 'hidden_gems':
        return 'Hidden Gem';
      default:
        return 'Route 66 Stop';
    }
  };
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'attractions':
        return 'bg-route66-primary/10 text-route66-primary border border-route66-primary/20';
      case 'drive_ins':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'hidden_gems':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-route66-background-section text-route66-text-muted border border-route66-border';
    }
  };
  const fallbackImage = '/lovable-uploads/79d1bcf2-04dd-4206-8f0b-14e6cdce4cdc.png';
  const imageUrl = item.thumbnail_url || item.image_url || fallbackImage;
  const handleWebsiteClick = () => {
    if (item.website) {
      openMobileAwareLink(item.website, item.name, {
        returnUrl: createMobileAwareReturnUrl(),
        linkSource: 'unified-carousel',
        showReturnButton: true,
        showLoadingState: true
      });
    }
  };
  const handleMapClick = () => {
    if (item.latitude && item.longitude) {
      const placeName = encodeURIComponent(`${item.name}, ${item.city_name}${item.state ? `, ${item.state}` : ''}`);
      const url = `https://www.google.com/maps/search/${placeName}/@${item.latitude},${item.longitude},15z`;
      openMobileAwareLink(url, `Map for ${item.name}`, {
        returnUrl: createMobileAwareReturnUrl(),
        linkSource: 'unified-carousel-map',
        showReturnButton: true,
        showLoadingState: true
      });
    }
  };

  // Use either title or name for display
  const displayName = item.title || item.name;
  return <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-3 border-route66-primary bg-white shadow-lg hover:border-route66-primary-dark h-full flex flex-col">
      {/* Image Section - Fixed height */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-route66-background-section to-route66-background-alt flex-shrink-0">
        {!imageError && <img src={imageUrl} alt={displayName} loading="lazy" className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setImageLoaded(true)} onError={() => {
        setImageError(true);
        setImageLoaded(true);
      }} />}
        
        {/* Loading/Error Fallback */}
        {(!imageLoaded || imageError) && <div className="absolute inset-0 bg-gradient-to-br from-route66-background-section via-route66-background-alt to-route66-background flex flex-col items-center justify-center text-route66-text-muted border-2 border-dashed border-route66-divider">
            <div className="bg-route66-background rounded-full p-3 mb-2 shadow-sm">
              <ImageIcon className="h-8 w-8 opacity-60" />
            </div>
            <span className="text-sm font-medium text-center px-4">
              {imageError ? 'Image not available' : 'Loading image...'}
            </span>
            <span className="text-xs text-route66-text-muted mt-1 opacity-75">
              Route 66 {getCategoryLabel(item.category)}
            </span>
          </div>}

        {/* Category Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${getCategoryColor(item.category)}`}>
          {getCategoryLabel(item.category)}
        </div>

        {/* Featured Badge */}
        {item.featured}
      </div>

      <CardContent className="p-5 bg-white flex-1 flex flex-col">
        {/* Title - Fixed 2 lines */}
        <h3 className="font-semibold text-lg text-route66-text-primary mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-route66-primary transition-colors">
          {displayName}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-route66-text-secondary mb-3">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{item.city_name}{item.state && `, ${item.state}`}</span>
        </div>

        {/* Description - Fixed 3 lines height */}
        <p className="text-sm text-route66-text-muted mb-4 line-clamp-3 min-h-[4.5rem]">
          {item.description || 'A classic Route 66 destination worth exploring on your road trip adventure.'}
        </p>

        {/* Year Info - Fixed height slot */}
        <div className="h-6 mb-4">
          {(item.founded_year || item.year_opened) && (
            <div className="flex items-center gap-1 text-sm text-route66-text-secondary">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>
                {item.founded_year ? `Founded ${item.founded_year}` : `Opened ${item.year_opened}`}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons - Always at bottom */}
        <div className="flex gap-2 mt-auto">
          {item.website && <Button variant="outline" size="sm" className="flex-1 h-9 border-route66-border text-route66-text-secondary hover:bg-route66-primary hover:text-white hover:border-route66-primary transition-all duration-200 shadow-sm" onClick={handleWebsiteClick}>
              <ExternalLink className="h-4 w-4 mr-1" />
              Visit Website
            </Button>}
          {item.latitude && item.longitude && <Button variant="outline" size="sm" className="flex-1 h-9 border-route66-primary/30 text-route66-primary hover:bg-route66-primary hover:text-white hover:border-route66-primary transition-all duration-200 shadow-sm font-medium" onClick={handleMapClick}>
              <MapPin className="h-4 w-4 mr-1" />
              Map
            </Button>}
        </div>
      </CardContent>
    </Card>;
};
export default UnifiedItemCard;