
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DriveInData {
  id: string;
  name: string;
  city_name: string;
  state: string;
  latitude: number;
  longitude: number;
  description?: string;
  website?: string;
  image_url?: string;
  thumbnail_url?: string;
  status?: string;
  year_opened?: number;
  capacity_cars?: number;
  screens_count?: number;
  featured?: boolean;
}

export const useDriveInsData = () => {
  const [driveIns, setDriveIns] = useState<DriveInData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriveIns = async () => {
      try {
        console.log('🎬 Fetching drive-ins directly from drive_ins table...');
        
        const { data, error } = await supabase
          .from('drive_ins')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          console.error('❌ Error fetching drive-ins:', error);
          setDriveIns([]);
          return;
        }

        if (!data || data.length === 0) {
          console.warn('⚠️ No drive-ins found in database');
          setDriveIns([]);
          return;
        }

        console.log(`🎬 Successfully fetched ${data.length} drive-ins from database`);
        
        // Log each drive-in with status info
        data.forEach((driveIn, index) => {
          console.log(`🎬 Drive-in ${index + 1}:`, {
            name: driveIn.name,
            city: driveIn.city_name,
            state: driveIn.state,
            status: driveIn.status,
            hasWebsite: !!driveIn.website,
            yearOpened: driveIn.year_opened,
            featured: driveIn.featured
          });
        });
        
        setDriveIns(data);
      } catch (error) {
        console.error('❌ Exception while fetching drive-ins:', error);
        setDriveIns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDriveIns();
  }, []);

  return { driveIns, loading };
};
