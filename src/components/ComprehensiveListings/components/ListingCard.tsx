
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Calendar, Star, ExternalLink } from 'lucide-react';
import { ListingItem } from '../types';

interface ListingCardProps {
  item: ListingItem;
}

export const ListingCard = ({ item }: ListingCardProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    
    console.log(`🖼️ Image failed to load for ${item.name}, using /fallback.jpg`);
    
    // Set fallback image
    target.src = '/fallback.jpg';
  };

  // Use database image URL if available, otherwise use fallback
  const imageUrl = item.image_url || '/fallback.jpg';
  
  console.log(`🖼️ Rendering ${item.name}:`, {
    hasImageUrl: !!item.image_url,
    imageUrl: item.image_url,
    finalImageUrl: imageUrl,
    category: item.category
  });

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-route66-gray/10">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl}
          alt={item.name} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          onError={handleImageError}
          loading="lazy"
        />
        {item.featured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-route66-vintage-yellow text-black flex items-center gap-1">
              <Star size={12} fill="currentColor" />
              Featured
            </Badge>
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
          <a 
            href={item.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-route66-blue hover:text-route66-blue/80 text-sm font-medium"
          >
            <ExternalLink size={14} />
            Visit Website
          </a>
        )}
      </CardContent>
    </Card>
  );
};
