import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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
        ;
        
        // Use type assertion since table may not exist yet in generated types
        const { data: attractions, error } = await (supabase as any)
          .from('attractions')
          .select('id,name,title,slug,description,city_name,state,latitude,longitude,image_url,thumbnail_url,website,category,category_canonical,tags,featured,founded_year,year_opened,admission_fee,hours_of_operation')
          .order('name')
          .limit(6);

        if (!error && attractions) {
          const typedAttractions = attractions as AttractionRow[];
          ;
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
          ;
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
