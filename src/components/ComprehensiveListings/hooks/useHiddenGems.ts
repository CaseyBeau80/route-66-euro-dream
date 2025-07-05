
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ListingItem } from '../types';
import { generateTags } from '../utils/tagGenerator';

export const useHiddenGems = () => {
  const [items, setItems] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHiddenGems = async () => {
      try {
        // Fetching hidden gems from hidden_gems table
        
        const { data: hiddenGems, error } = await supabase
          .from('hidden_gems')
          .select('*')
          .order('title')
          .limit(6);

        if (!error && hiddenGems) {
          // Fetched hidden gems successfully
          setItems(hiddenGems.map(gem => ({
            id: gem.id,
            name: gem.title,
            title: gem.title,
            description: gem.description,
            city_name: gem.city_name,
            state: 'Various', // Hidden gems may span multiple states
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
