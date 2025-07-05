
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ListingItem } from '../types';
import { generateTags } from '../utils/tagGenerator';

export const useDriveIns = () => {
  const [items, setItems] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriveIns = async () => {
      try {
        // Fetching drive-ins from drive_ins table
        
        const { data: driveIns, error } = await supabase
          .from('drive_ins')
          .select('*')
          .order('name')
          .limit(6);

        if (!error && driveIns) {
          // Fetched drive-ins successfully
          setItems(driveIns.map(driveIn => ({
            id: driveIn.id,
            name: driveIn.name,
            title: driveIn.name,
            description: driveIn.description,
            city_name: driveIn.city_name,
            state: driveIn.state,
            image_url: driveIn.image_url,
            thumbnail_url: driveIn.thumbnail_url,
            website: driveIn.website,
            latitude: driveIn.latitude,
            longitude: driveIn.longitude,
            category: 'drive_ins',
            tags: generateTags(driveIn, 'drive_ins'),
            featured: driveIn.featured,
            status: driveIn.status
          })));
        }
      } catch (error) {
        console.error('❌ Error fetching drive-ins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriveIns();
  }, []);

  return { items, loading };
};
