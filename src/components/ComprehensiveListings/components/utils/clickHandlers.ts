
import { ListingItem } from '../../types';

export const createImageClickHandler = (item: ListingItem) => (e: React.MouseEvent) => {
  if (item.website) {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const newWindow = window.open(item.website, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error(`❌ Error opening website for ${item.name}:`, error);
    }
  }
};

export const createContainerClickHandler = (item: ListingItem) => (e: React.MouseEvent) => {
  // Only handle clicks on the image container itself, not child elements
  if (e.target === e.currentTarget && item.website) {
    window.open(item.website, '_blank', 'noopener,noreferrer');
  }
};

export const createWebsiteLinkClickHandler = (item: ListingItem) => (e: React.MouseEvent) => {
  if (item.website) {
    e.preventDefault();
    window.open(item.website, '_blank', 'noopener,noreferrer');
  }
};
