import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ListingItem } from '../types';
import { generateTags } from '../utils/tagGenerator';

export const useHiddenGems = () => {
  const [items, setItems] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHiddenGems = async () => {
      try {
        
        const { data: hiddenGems, error } = await (supabase as any)
          .from('hidden_gems')
          .select('id,name,title,slug,description,city_name,state,latitude,longitude,image_url,thumbnail_url,website,category,category_canonical,tags,featured,founded_year,year_opened')
          .order('title')
          .limit(6);

        if (!error && hiddenGems) {
          setItems(hiddenGems.map((gem: any) => ({
            id: gem.id,
            name: gem.title,
            title: gem.title,
            description: gem.description,
            city_name: gem.city_name,
            state: 'Various',
            image_url: gem.image_url,
            thumbnail_url: gem.thumbnail_url,
            website: gem.website,
            latitude: gem.latitude,
            longitude: gem.longitude,
            category: 'hidden_gems',
            tags: generateTags(gem, 'hidden_gems')
          })));
        }
      } catch (error) {
        console.error('❌ Error fetching hidden gems:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHiddenGems();
  }, []);

  return { items, loading };
};
