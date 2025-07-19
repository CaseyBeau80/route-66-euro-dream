
import { ListingItem } from '../../types';
import { openExternalLinkWithHistory, createReturnToMapUrl } from '@/utils/externalLinkUtils';

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
      openExternalLinkWithHistory(item.website, item.name, {
        returnUrl: createReturnToMapUrl(),
        linkSource: 'listings',
        showReturnButton: true
      });
      console.log(`✅ External link opened successfully for ${item.name}`);
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
    openExternalLinkWithHistory(item.website, item.name, {
      returnUrl: createReturnToMapUrl(),
      linkSource: 'listings',
      showReturnButton: true
    });
  }
};

export const createWebsiteLinkClickHandler = (item: ListingItem) => (e: React.MouseEvent) => {
  console.log(`🔗 WEBSITE LINK CLICKED for ${item.name}`, { website: item.website });
  if (item.website) {
    e.preventDefault();
    openExternalLinkWithHistory(item.website, item.name, {
      returnUrl: createReturnToMapUrl(),
      linkSource: 'listings',
      showReturnButton: true
    });
  }
};
