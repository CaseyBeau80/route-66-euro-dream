
import { ExternalLink } from 'lucide-react';
import { ListingItem } from '../../types';

interface CardActionsProps {
  item: ListingItem;
  onWebsiteLinkClick: (e: React.MouseEvent) => void;
}

export const CardActions = ({ item, onWebsiteLinkClick }: CardActionsProps) => {
  if (!item.website) return null;

  return (
    <button 
      onClick={onWebsiteLinkClick}
      className="inline-flex items-center gap-1 text-route66-blue hover:text-route66-blue/80 text-sm font-medium cursor-pointer"
    >
      <ExternalLink size={14} />
      Visit Website
    </button>
  );
};
