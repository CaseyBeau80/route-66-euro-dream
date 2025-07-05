
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ListingItem } from '../types';
import { generateTags } from '../utils/tagGenerator';

export const useAttractions = () => {
  const [items, setItems] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        console.log('🏛️ Fetching attractions from attractions table...');
        
        const { data: attractions, error } = await supabase
          .from('attractions')
          .select('*')
          .order('name')
          .limit(6);

        if (!error && attractions) {
          console.log(`🏛️ Fetched ${attractions.length} attractions from attractions table`);
          setItems(attractions.map(attraction => ({
            id: attraction.id,
            name: attraction.name,
            title: attraction.name,
            description: attraction.description,
            city_name: attraction.city_name,
            state: attraction.state,
            image_url: attraction.image_url,
            thumbnail_url: attraction.thumbnail_url,
            website: attraction.website,
            latitude: attraction.latitude,
            longitude: attraction.longitude,
            category: 'attractions',
            tags: generateTags(attraction, 'attractions'),
            featured: attraction.featured
          })));
        }
      } catch (error) {
        console.error('❌ Error fetching attractions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttractions();
  }, []);

  return { items, loading };
};
