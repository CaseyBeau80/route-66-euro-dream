
import { getFallbackImage } from '../../utils/fallbackImages';

export const getImageUrl = (
  item: { name: string; description?: string | null; category: string; thumbnail_url?: string | null; image_url?: string | null },
  imageError: boolean,
  fallbackError: boolean
): string => {
  if (fallbackError) {
    return "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=600&q=80";
  }
  if (imageError || (!item.thumbnail_url && !item.image_url)) {
    return getFallbackImage(item.name, item.description, item.category);
  }
  // Prioritize thumbnail_url, fall back to image_url
  return item.thumbnail_url || item.image_url;
};

export const isTheaterSourcedImage = (
  item: { thumbnail_url?: string | null; image_url?: string | null },
  imageError: boolean
): boolean => {
  return ((item.thumbnail_url && item.thumbnail_url.includes('/storage/drive_ins/')) || 
          (item.image_url && item.image_url.includes('/storage/drive_ins/'))) && !imageError;
};
