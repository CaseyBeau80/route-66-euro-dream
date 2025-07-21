
import { useEffect, useState } from 'react';
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
  status_notes?: string;
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
        console.log('🎬 Fetching drive-ins from drive_ins table...');
        
        const { data, error } = await supabase
          .from('drive_ins')
          .select('*')
          .order('name');

        if (error) {
          console.error('❌ Error fetching drive-ins:', error);
          return;
        }

        console.log(`🎬 Fetched ${data?.length || 0} drive-ins from drive_ins table`);
        setDriveIns(data || []);
      } catch (error) {
        console.error('❌ Error in fetchDriveIns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriveIns();
  }, []);

  return { driveIns, loading };
};
