
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
        console.log('🎬 Fetching drive-ins with detailed logging...');
        
        const { data: driveIns, error } = await supabase
          .from('drive_ins')
          .select('*')
          .limit(6);

        if (!error && driveIns) {
          console.log(`🎬 Raw database response:`, driveIns);
          
          driveIns.forEach((driveIn, index) => {
            console.log(`🎬 Drive-in ${index + 1}:`, {
              name: driveIn.name,
              image_url: driveIn.image_url,
              hasImage: !!driveIn.image_url,
              imageType: typeof driveIn.image_url
            });
          });
          
          const mappedItems = driveIns.map(driveIn => ({
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
          }));
          
          console.log('🎬 Mapped items with image URLs:', mappedItems.map(item => ({
            name: item.name,
            image_url: item.image_url
          })));
          
          setItems(mappedItems);
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
