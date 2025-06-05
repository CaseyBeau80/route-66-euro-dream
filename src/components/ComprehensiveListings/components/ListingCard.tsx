
import { Card, CardContent as UICardContent } from '@/components/ui/card';
import { ListingItem } from '../types';
import { CardImage } from './CardImage/CardImage';
import { CardContent } from './CardContent/CardContent';
import { CardActions } from './CardActions/CardActions';
import { 
  createImageClickHandler, 
  createContainerClickHandler, 
  createWebsiteLinkClickHandler 
} from './utils/clickHandlers';

interface ListingCardProps {
  item: ListingItem;
}

export const ListingCard = ({ item }: ListingCardProps) => {
  console.log(`🃏 ListingCard render for ${item.name}`, { 
    category: item.category, 
    hasWebsite: !!item.website,
    website: item.website,
    hasImage: !!item.image_url,
    hasThumbnail: !!item.thumbnail_url,
    thumbnail_url: item.thumbnail_url
  });

  const handleImageClick = createImageClickHandler(item);
  const handleContainerClick = createContainerClickHandler(item);
  const handleWebsiteLinkClick = createWebsiteLinkClickHandler(item);

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-3 border-route66-primary bg-white shadow-lg hover:border-route66-primary-dark">
      <CardImage 
        item={item}
        onImageClick={handleImageClick}
        onContainerClick={handleContainerClick}
      />
      
      <UICardContent className="p-5 bg-white">
        <CardContent item={item} />
        <CardActions 
          item={item}
          onWebsiteLinkClick={handleWebsiteLinkClick}
        />
      </UICardContent>
    </Card>
  );
};
