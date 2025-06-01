
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Calendar, Star, ExternalLink } from 'lucide-react';
import { ListingItem } from '../types';
import { getFallbackImage } from '../utils/fallbackImages';

interface ListingCardProps {
  item: ListingItem;
}

export const ListingCard = ({ item }: ListingCardProps) => {
  console.log(`🃏 ListingCard render for ${item.name}`, { 
    category: item.category, 
    hasWebsite: !!item.website,
    website: item.website,
    hasImage: !!item.image_url 
  });

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const fallbackUrl = getFallbackImage(item.name, item.description, item.category);
    
    // Only log if we're actually switching to fallback (avoid redundant logs)
    if (target.src !== fallbackUrl) {
      console.log(`🖼️ Image failed to load for ${item.name}, switching to fallback`);
      target.src = fallbackUrl;
    }
  };

  // Always try database image first, only use fallback on error
  const imageUrl = item.image_url || getFallbackImage(item.name, item.description, item.category);
  
  // Simplified logging - only when database image is missing
  if (!item.image_url) {
    console.log(`🖼️ No database image for ${item.name}, using category fallback`);
  }

  // Handle image click - open website in new tab
  const handleImageClick = (e: React.MouseEvent) => {
    console.log(`🔗 IMAGE CLICKED for ${item.name}`, { 
      website: item.website,
      category: item.category,
      eventType: e.type,
      target: e.target,
      currentTarget: e.currentTarget 
    });
    
    if (item.website) {
      e.preventDefault();
      e.stopPropagation();
      console.log(`🚀 OPENING WEBSITE: ${item.website}`);
      
      try {
        const newWindow = window.open(item.website, '_blank', 'noopener,noreferrer');
        if (newWindow) {
          console.log(`✅ Window opened successfully for ${item.name}`);
        } else {
          console.log(`❌ Failed to open window for ${item.name} - popup blocked?`);
        }
      } catch (error) {
        console.error(`❌ Error opening website for ${item.name}:`, error);
      }
    } else {
      console.log(`❌ No website available for ${item.name}`);
    }
  };

  // Handle container click as backup
  const handleContainerClick = (e: React.MouseEvent) => {
    console.log(`🔗 CONTAINER CLICKED for ${item.name}`, {
      target: e.target,
      currentTarget: e.currentTarget,
      isDirectClick: e.target === e.currentTarget
    });
    
    // Only handle clicks on the image container itself, not child elements
    if (e.target === e.currentTarget && item.website) {
      console.log(`🔗 Container direct click for ${item.name}, opening website`);
      window.open(item.website, '_blank', 'noopener,noreferrer');
    }
  };

  // Handle website link click
  const handleWebsiteLinkClick = (e: React.MouseEvent) => {
    console.log(`🔗 WEBSITE LINK CLICKED for ${item.name}`, { website: item.website });
    if (item.website) {
      e.preventDefault();
      window.open(item.website, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-route66-gray/10">
      <div 
        className="relative h-48 overflow-hidden cursor-pointer bg-gray-100"
        onClick={handleContainerClick}
        style={{ userSelect: 'none' }}
      >
        <img 
          src={imageUrl}
          alt={item.name} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer select-none"
          onError={handleImageError}
          onClick={handleImageClick}
          loading="lazy"
          draggable={false}
          style={{ pointerEvents: 'auto' }}
        />
        
        {item.featured && (
          <div className="absolute top-3 right-3 pointer-events-none">
            <Badge className="bg-route66-vintage-yellow text-black flex items-center gap-1">
              <Star size={12} fill="currentColor" />
              Featured
            </Badge>
          </div>
        )}
        
        {item.website && (
          <div className="absolute bottom-3 right-3 opacity-70 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-black/70 text-white p-2 rounded-full">
              <ExternalLink size={16} />
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-5">
        <h3 className="font-bold text-lg text-route66-gray mb-1">{item.name}</h3>
        <p className="text-sm text-route66-gray/70 flex items-center mb-3">
          <MapPin size={14} className="mr-1 flex-shrink-0" /> 
          {item.city_name}{item.state && `, ${item.state}`}
        </p>
        
        {item.description && (
          <p className="text-sm text-route66-gray mb-4 line-clamp-3">
            {item.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {item.tags.slice(0, 3).map((tag, idx) => (
            <Badge 
              key={idx} 
              variant="outline" 
              className="text-xs bg-route66-cream border-route66-gray/20"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-route66-gray/60 mb-3">
          {item.population && (
            <div className="flex items-center gap-1">
              <Users size={12} />
              {item.population.toLocaleString()}
            </div>
          )}
          {(item.founded_year || item.year_opened) && (
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              {item.founded_year || item.year_opened}
            </div>
          )}
        </div>

        {item.website && (
          <button 
            onClick={handleWebsiteLinkClick}
            className="inline-flex items-center gap-1 text-route66-blue hover:text-route66-blue/80 text-sm font-medium cursor-pointer"
          >
            <ExternalLink size={14} />
            Visit Website
          </button>
        )}
      </CardContent>
    </Card>
  );
};
