import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ListingItem } from '../types';
import { generateTags } from '../utils/tagGenerator';

// Define the expected drive-in shape from the database
interface DriveInRow {
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
  status: string | null;
}

export const useDriveIns = () => {
  const [items, setItems] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriveIns = async () => {
      try {
        console.log('🎬 Fetching drive-ins from drive_ins table...');
        
        // Use type assertion since table may not exist yet in generated types
        const { data: driveIns, error } = await (supabase as any)
          .from('drive_ins')
          .select('*')
          .order('name')
          .limit(6);

        if (!error && driveIns) {
          const typedDriveIns = driveIns as DriveInRow[];
          console.log(`🎬 Fetched ${typedDriveIns.length} drive-ins from drive_ins table`);
          setItems(typedDriveIns.map(driveIn => ({
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
        } else if (error) {
          // Table may not exist yet - this is expected
          console.log('🎬 Drive-ins table not available yet:', error.message);
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
