
import { Badge } from '@/components/ui/badge';
import { Star, ExternalLink } from 'lucide-react';
import { ListingItem } from '../../types';
import { getFallbackImage } from '../../utils/fallbackImages';
import { useState } from 'react';
import { getImageUrl, isTheaterSourcedImage } from './utils';

interface CardImageProps {
  item: ListingItem;
  onImageClick: (e: React.MouseEvent) => void;
  onContainerClick: (e: React.MouseEvent) => void;
}

export const CardImage = ({ item, onImageClick, onContainerClick }: CardImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const fallbackUrl = getFallbackImage(item.name, item.description, item.category);
    
    // Check if this is the first error (database image failed)
    if (!imageError && target.src !== fallbackUrl) {
      console.log(`🖼️ Database image failed for ${item.name}, switching to fallback: ${fallbackUrl}`);
      setImageError(true);
      target.src = fallbackUrl;
    } 
    // This is the fallback image failing
    else if (imageError && !fallbackError) {
      console.log(`❌ Fallback image also failed for ${item.name}, using final backup`);
      setFallbackError(true);
      // Use a very reliable backup image - vintage car/cinema theme
      target.src = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=600&q=80";
    }
  };

  const imageUrl = getImageUrl(item, imageError, fallbackError);
  const isTheaterSourced = isTheaterSourcedImage(item, imageError);
  
  // Log image loading strategy
  if (!item.thumbnail_url && !item.image_url) {
    console.log(`🖼️ No database image for ${item.name}, using category fallback`);
  } else if (imageError) {
    console.log(`🖼️ Using fallback image for ${item.name} due to load error`);
  } else if (item.thumbnail_url) {
    console.log(`🖼️ Using thumbnail_url for ${item.name}: ${item.thumbnail_url}`);
  } else {
    console.log(`🖼️ Using image_url for ${item.name}: ${item.image_url}`);
  }

  return (
    <div 
      className="relative h-48 overflow-hidden cursor-pointer bg-gray-100 group"
      onClick={onContainerClick}
      style={{ userSelect: 'none' }}
    >
      <img 
        src={imageUrl}
        alt={item.name} 
        className="w-full h-full object-cover cursor-pointer select-none transition-all duration-300 ease-in-out group-hover:animate-jiggle"
        onError={handleImageError}
        onClick={onImageClick}
        loading="lazy"
        draggable={false}
        style={{ 
          pointerEvents: 'auto',
          transformOrigin: 'center center'
        }}
      />
      
      {/* Image Credit for theater-sourced images */}
      {isTheaterSourced && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1">
          <span className="text-white/80">Image courtesy of {item.name}</span>
        </div>
      )}
      
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
  );
};
