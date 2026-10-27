
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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
        
        const { data, error } = await (supabase as any)
          .from('drive_ins')
          .select('id,name,description,city_name,state,latitude,longitude,image_url,thumbnail_url,website,featured,status,status_notes,year_opened,screens_count,capacity_cars')
          .order('name');

        if (error) {
          console.error('❌ Error fetching drive-ins:', error);
          return;
        }

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
