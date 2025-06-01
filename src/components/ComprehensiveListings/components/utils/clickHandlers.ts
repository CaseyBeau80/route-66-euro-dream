
import { ListingItem } from '../../types';

export const createImageClickHandler = (item: ListingItem) => (e: React.MouseEvent) => {
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

export const createContainerClickHandler = (item: ListingItem) => (e: React.MouseEvent) => {
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

export const createWebsiteLinkClickHandler = (item: ListingItem) => (e: React.MouseEvent) => {
  console.log(`🔗 WEBSITE LINK CLICKED for ${item.name}`, { website: item.website });
  if (item.website) {
    e.preventDefault();
    window.open(item.website, '_blank', 'noopener,noreferrer');
  }
};
