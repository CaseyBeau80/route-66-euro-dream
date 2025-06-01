
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CategoryData, ListingItem } from '../types';
import { generateTags } from '../utils/tagGenerator';

export const useListingsData = () => {
  const [categories, setCategories] = useState<Record<string, CategoryData>>({
    destination_cities: {
      title: 'Destination Cities',
      items: [],
      loading: true,
      color: 'bg-blue-500',
      icon: '🏙️'
    },
    attractions: {
      title: 'Historic Attractions',
      items: [],
      loading: true,
      color: 'bg-green-500',
      icon: '🏛️'
    },
    drive_ins: {
      title: 'Drive-In Theaters',
      items: [],
      loading: true,
      color: 'bg-purple-500',
      icon: '🎬'
    },
    hidden_gems: {
      title: 'Hidden Gems',
      items: [],
      loading: true,
      color: 'bg-orange-500',
      icon: '💎'
    },
    route66_waypoints: {
      title: 'Route 66 Waypoints',
      items: [],
      loading: true,
      color: 'bg-red-500',
      icon: '🛣️'
    }
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        console.log('🎯 Fetching all Route 66 data with images from database...');

        // Fetch destination cities
        const { data: cities, error: citiesError } = await supabase
          .from('destination_cities')
          .select('*')
          .limit(6);

        if (!citiesError && cities) {
          console.log(`🏙️ Fetched ${cities.length} destination cities with images`);
          setCategories(prev => ({
            ...prev,
            destination_cities: {
              ...prev.destination_cities,
              items: cities.map(city => ({
                id: city.id,
                name: city.name,
                description: city.description,
                city_name: city.name,
                state: city.state,
                image_url: city.image_url,
                website: city.website,
                latitude: city.latitude,
                longitude: city.longitude,
                category: 'destination_cities',
                tags: generateTags(city, 'destination_cities'),
                population: city.population,
                founded_year: city.founded_year,
                featured: city.featured
              })),
              loading: false
            }
          }));
        }

        // Fetch attractions
        const { data: attractions, error: attractionsError } = await supabase
          .from('attractions')
          .select('*')
          .limit(6);

        if (!attractionsError && attractions) {
          console.log(`🏛️ Fetched ${attractions.length} attractions with images`);
          setCategories(prev => ({
            ...prev,
            attractions: {
              ...prev.attractions,
              items: attractions.map(attraction => ({
                id: attraction.id,
                name: attraction.name,
                description: attraction.description,
                city_name: attraction.city_name,
                state: attraction.state,
                image_url: attraction.image_url,
                website: attraction.website,
                latitude: attraction.latitude,
                longitude: attraction.longitude,
                category: 'attractions',
                tags: generateTags(attraction, 'attractions'),
                featured: attraction.featured
              })),
              loading: false
            }
          }));
        }

        // Fetch drive-ins
        const { data: driveIns, error: driveInsError } = await supabase
          .from('drive_ins')
          .select('*')
          .limit(6);

        if (!driveInsError && driveIns) {
          console.log(`🎬 Fetched ${driveIns.length} drive-ins with images`);
          setCategories(prev => ({
            ...prev,
            drive_ins: {
              ...prev.drive_ins,
              items: driveIns.map(driveIn => ({
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
              })),
              loading: false
            }
          }));
        }

        // Fetch hidden gems
        const { data: hiddenGems, error: hiddenGemsError } = await supabase
          .from('hidden_gems')
          .select('*')
          .limit(6);

        if (!hiddenGemsError && hiddenGems) {
          console.log(`💎 Fetched ${hiddenGems.length} hidden gems with images`);
          setCategories(prev => ({
            ...prev,
            hidden_gems: {
              ...prev.hidden_gems,
              items: hiddenGems.map(gem => ({
                id: gem.id,
                name: gem.title,
                title: gem.title,
                description: gem.description,
                city_name: gem.city_name,
                state: 'Various',
                image_url: gem.image_url,
                website: gem.website,
                latitude: gem.latitude,
                longitude: gem.longitude,
                category: 'hidden_gems',
                tags: generateTags(gem, 'hidden_gems')
              })),
              loading: false
            }
          }));
        }

        // Fetch route66 waypoints
        const { data: waypoints, error: waypointsError } = await supabase
          .from('route66_waypoints')
          .select('*')
          .order('sequence_order')
          .limit(6);

        if (!waypointsError && waypoints) {
          console.log(`🛣️ Fetched ${waypoints.length} waypoints with images`);
          setCategories(prev => ({
            ...prev,
            route66_waypoints: {
              ...prev.route66_waypoints,
              items: waypoints.map(waypoint => ({
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
              })),
              loading: false
            }
          }));
        }

        console.log('✅ All Route 66 data loaded with images successfully!');

      } catch (error) {
        console.error('❌ Error fetching data:', error);
        setCategories(prev => 
          Object.keys(prev).reduce((acc, key) => ({
            ...acc,
            [key]: { ...prev[key], loading: false }
          }), {})
        );
      }
    };

    fetchAllData();
  }, []);

  return { categories };
};
