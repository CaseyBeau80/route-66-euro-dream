import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface AttractionData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  city_name: string;
  state: string;
  latitude: number;
  longitude: number;
  image_url: string | null;
  website: string | null;
  category: string | null;
  tags: string[];
  featured: boolean;
  admission_fee?: string | null;
  hours_of_operation?: string | null;
  year_opened?: number | null;
  tribe_nation?: string | null;
  site_type?: string | null;
  source_table: 'attractions' | 'hidden_gems' | 'native_american_sites' | 'drive_ins';
}

export function useAttraction(slug: string | undefined) {
  const [attraction, setAttraction] = useState<AttractionData | null>(null);
  const [nearbyAttractions, setNearbyAttractions] = useState<AttractionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchAttraction = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Query all 4 tables in parallel
        const [attractions, hiddenGems, nativeSites, driveIns] = await Promise.all([
          supabase.from('attractions').select('*').eq('slug', slug).maybeSingle(),
          supabase.from('hidden_gems').select('*').eq('slug', slug).maybeSingle(),
          supabase.from('native_american_sites').select('*').eq('slug', slug).maybeSingle(),
          supabase.from('drive_ins').select('*').eq('slug', slug).maybeSingle(),
        ]);

        let found: AttractionData | null = null;

        if (attractions.data) {
          const d = attractions.data;
          found = {
            id: d.id, name: d.name, slug: d.slug, description: d.description,
            city_name: d.city_name, state: d.state, latitude: d.latitude, longitude: d.longitude,
            image_url: d.image_url, website: d.website, category: d.category,
            tags: d.tags || [], featured: d.featured || false,
            admission_fee: d.admission_fee, hours_of_operation: d.hours_of_operation,
            year_opened: d.year_opened, source_table: 'attractions',
          };
        } else if (hiddenGems.data) {
          const d = hiddenGems.data;
          found = {
            id: d.id, name: d.name || d.title, slug: d.slug, description: d.description,
            city_name: d.city_name?.replace(/,\s*\w{2}$/, '') || '', state: d.state || '',
            latitude: d.latitude, longitude: d.longitude,
            image_url: d.image_url, website: d.website, category: d.category || 'Hidden Gem',
            tags: d.tags || [], featured: d.featured || false,
            year_opened: d.year_opened, source_table: 'hidden_gems',
          };
        } else if (nativeSites.data) {
          const d = nativeSites.data;
          found = {
            id: d.id, name: d.name, slug: d.slug || slug, description: d.description,
            city_name: d.city_name, state: d.state, latitude: d.latitude, longitude: d.longitude,
            image_url: d.image_url, website: d.website, category: d.category || 'Heritage Site',
            tags: d.tags || [], featured: d.featured || false,
            tribe_nation: d.tribe_nation, site_type: d.site_type, source_table: 'native_american_sites',
          };
        } else if (driveIns.data) {
          const d = driveIns.data;
          found = {
            id: d.id, name: d.name, slug: slug, description: d.description,
            city_name: d.city_name, state: d.state, latitude: d.latitude, longitude: d.longitude,
            image_url: d.image_url || d.thumbnail_url, website: d.website,
            category: 'Drive-In Theater', tags: [], featured: d.featured || false,
            year_opened: d.year_opened, source_table: 'drive_ins',
          };
        }

        if (!found) {
          setError('Attraction not found');
          setAttraction(null);
        } else {
          setAttraction(found);
          // Fetch nearby attractions from same state
          const { data: nearby } = await supabase
            .from('attractions')
            .select('id, name, slug, city_name, state, image_url, category, description')
            .eq('state', found.state)
            .neq('slug', slug)
            .limit(4);
          
          setNearbyAttractions(
            (nearby || []).map((n: any) => ({
              ...n, latitude: 0, longitude: 0, tags: [], featured: false,
              source_table: 'attractions' as const,
            }))
          );
        }
      } catch (err) {
        setError('Failed to load attraction');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttraction();
  }, [slug]);

  return { attraction, nearbyAttractions, isLoading, error };
}
