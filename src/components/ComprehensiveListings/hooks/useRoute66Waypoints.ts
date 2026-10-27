import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ListingItem } from '../types';
import { generateTags } from '../utils/tagGenerator';

export const useRoute66Waypoints = () => {
  const [items, setItems] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoute66Waypoints = async () => {
      try {
        
        const { data: waypoints, error } = await (supabase as any)
          .from('route66_waypoints')
          .select('id,name,state,latitude,longitude,description,image_url,thumbnail_url,sequence_order,is_major_stop,highway_designation')
          .order('sequence_order')
          .limit(6);

        if (!error && waypoints) {
          setItems(waypoints.map((waypoint: any) => ({
            id: waypoint.id,
            name: waypoint.name,
            description: waypoint.description,
            city_name: waypoint.name,
            state: waypoint.state,
            image_url: waypoint.image_url,
            website: null,
            latitude: waypoint.latitude,
            longitude: waypoint.longitude,
            category: 'route66_waypoints',
            tags: generateTags(waypoint, 'route66_waypoints')
          })));
        }
      } catch (error) {
        console.error('❌ Error fetching Route 66 waypoints:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute66Waypoints();
  }, []);

  return { items, loading };
};
