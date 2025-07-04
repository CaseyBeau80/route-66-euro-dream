
import React from 'react';
import { ListingCard } from '@/components/ComprehensiveListings/components/ListingCard';
import { ListingItem } from '@/components/ComprehensiveListings/types';
import { UnifiedRoute66Item } from '../types';

interface UnifiedItemCardProps {
  item: UnifiedRoute66Item;
}

const UnifiedItemCard: React.FC<UnifiedItemCardProps> = ({ item }) => {
  // Convert UnifiedRoute66Item to ListingItem format
  const listingItem: ListingItem = {
    id: item.id,
    name: item.name,
    description: item.description,
    city_name: item.city_name,
    state: item.state,
    image_url: item.image_url,
    thumbnail_url: item.thumbnail_url,
    website: item.website,
    latitude: item.latitude,
    longitude: item.longitude,
    category: item.category,
    tags: item.tags,
    founded_year: item.founded_year,
    year_opened: item.year_opened,
    featured: item.featured
  };

  return <ListingCard item={listingItem} />;
};

export default UnifiedItemCard;
