
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
        console.log('🎬 FETCHING ALL drive-ins from database...');
        
        // Remove the limit to get ALL drive-ins
        const { data: driveIns, error } = await supabase
          .from('drive_ins')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          console.error('❌ Error fetching drive-ins:', error);
          setItems([]);
          return;
        }

        if (!driveIns || driveIns.length === 0) {
          console.warn('⚠️ No drive-ins found in database');
          setItems([]);
          return;
        }

        console.log(`🎬 Successfully fetched ${driveIns.length} drive-ins from database`);
        
        // Log each drive-in with detailed info
        driveIns.forEach((driveIn, index) => {
          console.log(`🎬 Drive-in ${index + 1}:`, {
            name: driveIn.name,
            city: driveIn.city_name,
            state: driveIn.state,
            hasImage: !!driveIn.image_url,
            hasWebsite: !!driveIn.website,
            website: driveIn.website,
            imageUrl: driveIn.image_url,
            status: driveIn.status,
            yearOpened: driveIn.year_opened
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
        
        console.log('🎬 Mapped drive-ins:', mappedItems.map(item => ({
          name: item.name,
          city: item.city_name,
          state: item.state,
          hasWebsite: !!item.website,
          website: item.website
        })));
        
        setItems(mappedItems);
      } catch (error) {
        console.error('❌ Exception while fetching drive-ins:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDriveIns();
  }, []);

  console.log(`🎬 useDriveIns returning:`, { 
    loading, 
    itemsCount: items.length,
    items: items.map(item => ({ name: item.name, city: item.city_name, state: item.state }))
  });

  return { items, loading };
};
