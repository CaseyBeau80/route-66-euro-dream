
import { useEffect, useState } from 'react';

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
        console.log('🎬 Loading static drive-ins data...');
        
        // Static drive-ins data for Route 66
        const staticDriveIns: DriveInData[] = [
          {
            id: '1',
            name: '66 Drive-In Theatre',
            city_name: 'Carthage',
            state: 'MO',
            latitude: 37.1656,
            longitude: -94.3105,
            description: 'Classic drive-in theater on Historic Route 66',
            website: 'http://66drive-in.com/',
            status: 'Open',
            year_opened: 1949,
            capacity_cars: 400,
            screens_count: 1,
            featured: true
          },
          {
            id: '2',
            name: 'Admiral Twin Drive-In',
            city_name: 'Tulsa',
            state: 'OK',
            latitude: 36.1512,
            longitude: -95.9371,
            description: 'Historic drive-in theater featured in The Outsiders',
            website: 'http://admiraltwin.com/',
            status: 'Open',
            year_opened: 1951,
            capacity_cars: 550,
            screens_count: 2,
            featured: true
          },
          {
            id: '3',
            name: 'Tascosa Drive-In',
            city_name: 'Amarillo',
            state: 'TX',
            latitude: 35.2220,
            longitude: -101.7673,
            description: 'Family-friendly drive-in theater in Texas',
            status: 'Open',
            year_opened: 1956,
            capacity_cars: 300,
            screens_count: 1,
            featured: false
          }
        ];

        console.log(`🎬 Loaded ${staticDriveIns.length} static drive-ins`);
        staticDriveIns.forEach(driveIn => {
          console.log(`  🎬 ${driveIn.name} in ${driveIn.city_name}, ${driveIn.state}`);
        });
        
        setDriveIns(staticDriveIns);
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
