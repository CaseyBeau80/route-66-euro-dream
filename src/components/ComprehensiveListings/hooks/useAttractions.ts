import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ListingItem } from '../types';
import { generateTags } from '../utils/tagGenerator';

// Define the expected attraction shape from the database
interface AttractionRow {
  id: string;
  name: string;
  description: string | null;
  city_name: string | null;
  state: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
  website: string | null;
  latitude: number | null;
  longitude: number | null;
  featured: boolean | null;
}

export const useAttractions = () => {
  const [items, setItems] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        console.log('🏛️ Fetching attractions from attractions table...');
        
        // Use type assertion since table may not exist yet in generated types
        const { data: attractions, error } = await (supabase as any)
          .from('attractions')
          .select('*')
          .order('name')
          .limit(6);

        if (!error && attractions) {
          const typedAttractions = attractions as AttractionRow[];
          console.log(`🏛️ Fetched ${typedAttractions.length} attractions from attractions table`);
          setItems(typedAttractions.map(attraction => ({
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
        } else if (error) {
          // Table may not exist yet - this is expected
          console.log('🏛️ Attractions table not available yet:', error.message);
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
