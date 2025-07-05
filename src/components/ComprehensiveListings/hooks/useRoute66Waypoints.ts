
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ListingItem } from '../types';
import { generateTags } from '../utils/tagGenerator';

export const useRoute66Waypoints = () => {
  const [items, setItems] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoute66Waypoints = async () => {
      try {
        // Fetching Route 66 waypoints with images
        
        const { data: waypoints, error } = await supabase
          .from('route66_waypoints')
          .select('*')
          .order('sequence_order')
          .limit(6);

        if (!error && waypoints) {
          // Fetched waypoints successfully
          setItems(waypoints.map(waypoint => ({
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
