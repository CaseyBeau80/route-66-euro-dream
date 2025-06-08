
import React, { useState } from 'react';
import { ExternalLink, MapPin, Calendar } from 'lucide-react';
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
      case 'attractions': return 'bg-blue-100 text-blue-800';
      case 'drive_ins': return 'bg-purple-100 text-purple-800';
      case 'hidden_gems': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const fallbackImage = '/lovable-uploads/79d1bcf2-04dd-4206-8f0b-14e6cdce4cdc.png';
  const imageUrl = item.thumbnail_url || item.image_url || fallbackImage;

  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
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
        
        {/* Loading/Error Fallback */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        )}

        {/* Category Badge */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
          {getCategoryLabel(item.category)}
        </div>

        {/* Featured Badge */}
        {item.featured && (
          <div className="absolute top-2 right-2 bg-route66-accent-gold text-white px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="font-semibold text-lg text-route66-text-primary mb-2 line-clamp-2 group-hover:text-route66-primary transition-colors">
          {item.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-route66-text-secondary mb-2">
          <MapPin className="h-4 w-4" />
          <span>{item.city_name}{item.state && `, ${item.state}`}</span>
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-sm text-route66-text-muted mb-3 line-clamp-3 flex-1">
            {item.description}
          </p>
        )}

        {/* Year Info */}
        {(item.founded_year || item.year_opened) && (
          <div className="flex items-center gap-1 text-sm text-route66-text-secondary mb-3">
            <Calendar className="h-4 w-4" />
            <span>
              {item.founded_year ? `Founded ${item.founded_year}` : `Opened ${item.year_opened}`}
            </span>
          </div>
        )}

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-route66-background-section text-route66-text-muted px-2 py-1 rounded text-xs"
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

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          {item.website && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
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
              className="flex-1"
              onClick={() => {
                const url = `https://www.google.com/maps?q=${item.latitude},${item.longitude}`;
                window.open(url, '_blank');
              }}
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
