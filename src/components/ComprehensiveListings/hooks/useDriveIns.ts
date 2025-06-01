
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
        console.log('🎬 Fetching drive-ins with updated images...');
        
        const { data: driveIns, error } = await supabase
          .from('drive_ins')
          .select('*')
          .limit(6);

        if (!error && driveIns) {
          console.log(`🎬 Successfully fetched ${driveIns.length} drive-ins with images:`);
          driveIns.forEach(driveIn => {
            console.log(`  - ${driveIn.name}: ${driveIn.image_url ? '✅ Has image' : '❌ No image'}`);
          });
          
          setItems(driveIns.map(driveIn => ({
            id: driveIn.id,
            name: driveIn.name,
            description: driveIn.description,
            city_name: driveIn.city_name,
            state: driveIn.state,
            image_url: driveIn.image_url,
            website: driveIn.website,
            latitude: driveIn.latitude,
            longitude: driveIn.longitude,
            category: 'drive_ins',
            tags: generateTags(driveIn, 'drive_ins'),
            year_opened: driveIn.year_opened,
            featured: driveIn.featured
          })));
        } else {
          console.error('❌ Error fetching drive-ins:', error);
        }
      } catch (error) {
        console.error('❌ Exception while fetching drive-ins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriveIns();
  }, []);

  return { items, loading };
};
