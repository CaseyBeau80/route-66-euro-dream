
import React, { useState } from 'react';
import { ExternalLink, MapPin, Calendar, ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UnifiedRoute66Item } from '../types';

interface UnifiedItemCardProps {
  item: UnifiedRoute66Item;
}

const UnifiedItemCard: React.FC<UnifiedItemCardProps> = ({ item }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

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

  const handleMapClick = () => {
    if (item.latitude && item.longitude) {
      // Enhanced Google Maps search using place name and coordinates
      const placeName = encodeURIComponent(`${item.name}, ${item.city_name}${item.state ? `, ${item.state}` : ''}`);
      const url = `https://www.google.com/maps/search/${placeName}/@${item.latitude},${item.longitude},15z`;
      window.open(url, '_blank');
    }
  };

  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group border-route66-border hover:border-route66-primary/50 bg-route66-background hover:scale-[1.02]">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-route66-background-section">
        {!imageError && (
          <img
            src={imageUrl}
            alt={item.name}
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
        
        {/* Enhanced Loading/Error Fallback */}
        {(!imageLoaded || imageError) && (
          <div className="absolute inset-0 bg-route66-background-section/80 flex flex-col items-center justify-center text-route66-text-muted">
            <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
            <span className="text-sm font-medium">
              {imageError ? 'Image not available' : 'Loading...'}
            </span>
          </div>
        )}

        {/* Category Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${getCategoryColor(item.category)}`}>
          {getCategoryLabel(item.category)}
        </div>

        {/* Featured Badge */}
        {item.featured && (
          <div className="absolute top-3 right-3 bg-route66-accent-gold text-white px-2 py-1 rounded-full text-xs font-medium border border-route66-accent-gold/20 backdrop-blur-sm">
            Featured
          </div>
        )}
      </div>

      <CardContent className="p-5 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="font-semibold text-lg text-route66-text-primary mb-2 line-clamp-2 group-hover:text-route66-primary transition-colors">
          {item.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-route66-text-secondary mb-3">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{item.city_name}{item.state && `, ${item.state}`}</span>
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-sm text-route66-text-muted mb-4 line-clamp-3 flex-1">
            {item.description}
          </p>
        )}

        {/* Year Info */}
        {(item.founded_year || item.year_opened) && (
          <div className="flex items-center gap-1 text-sm text-route66-text-secondary mb-4">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>
              {item.founded_year ? `Founded ${item.founded_year}` : `Opened ${item.year_opened}`}
            </span>
          </div>
        )}

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-route66-background-section text-route66-text-muted px-2 py-1 rounded text-xs border border-route66-divider"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-xs text-route66-text-muted">
                +{item.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Consistent Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          {item.website && (
            <Button
              variant="outline"
              size="sm"
              className="h-9 border-route66-border text-route66-text-secondary hover:bg-route66-primary hover:text-white hover:border-route66-primary transition-all duration-200 shadow-sm"
              onClick={() => window.open(item.website!, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Visit
            </Button>
          )}
          {item.latitude && item.longitude && (
            <Button
              variant="outline"
              size="sm"
              className="h-9 border-route66-border text-route66-text-secondary hover:bg-route66-primary hover:text-white hover:border-route66-primary transition-all duration-200 shadow-sm"
              onClick={handleMapClick}
            >
              <MapPin className="h-4 w-4 mr-1" />
              Map
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedItemCard;
