import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AttractionData, getAttractionDetailPath } from '@/types/attractionDetail';

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
            year_opened: d.year_opened, source_table: 'attractions', detailPath: getAttractionDetailPath('attractions', d.slug),
          };
        } else if (hiddenGems.data) {
          const d = hiddenGems.data;
          found = {
            id: d.id, name: d.name || d.title, slug: d.slug, description: d.description,
            city_name: d.city_name?.replace(/,\s*\w{2}$/, '') || '', state: d.state || '',
            latitude: d.latitude, longitude: d.longitude,
            image_url: d.image_url, website: d.website, category: d.category || 'Hidden Gem',
            tags: d.tags || [], featured: d.featured || false,
            year_opened: d.year_opened, source_table: 'hidden_gems', detailPath: getAttractionDetailPath('hidden_gems', d.slug),
          };
        } else if (nativeSites.data) {
          const d = nativeSites.data;
          found = {
            id: d.id, name: d.name, slug: d.slug || slug, description: d.description,
            city_name: d.city_name, state: d.state, latitude: d.latitude, longitude: d.longitude,
            image_url: d.image_url, website: d.website, category: d.category || 'Heritage Site',
            tags: d.tags || [], featured: d.featured || false,
            tribe_nation: d.tribe_nation, site_type: d.site_type, source_table: 'native_american_sites', detailPath: getAttractionDetailPath('native_american_sites', d.slug || slug),
          };
        } else if (driveIns.data) {
          const d = driveIns.data;
          found = {
            id: d.id, name: d.name, slug: slug, description: d.description,
            city_name: d.city_name, state: d.state, latitude: d.latitude, longitude: d.longitude,
            image_url: d.image_url || d.thumbnail_url, website: d.website,
            category: 'Drive-In Theater', tags: [], featured: d.featured || false,
            year_opened: d.year_opened, source_table: 'drive_ins', detailPath: getAttractionDetailPath('drive_ins', slug),
          };
        }

        if (!found) {
          setError('Attraction not found');
          setAttraction(null);
        } else {
          setAttraction(found);
          const [nearbyAttractionsResult, nearbyHiddenGemsResult] = await Promise.all([
            supabase
              .from('attractions')
              .select('id, name, slug, city_name, state, image_url, category, description, admission_fee, hours_of_operation, website, featured')
              .eq('state', found.state)
              .neq('slug', slug)
              .limit(3),
            supabase
              .from('hidden_gems')
              .select('id, name, title, slug, city_name, state, image_url, category, description, website, featured')
              .eq('state', found.state)
              .neq('slug', slug)
              .limit(3),
          ]);

          const mappedNearbyAttractions: AttractionData[] = (nearbyAttractionsResult.data || []).map((n: any) => ({
            id: n.id,
            name: n.name,
            slug: n.slug,
            description: n.description,
            city_name: n.city_name,
            state: n.state,
            image_url: n.image_url,
            category: n.category,
            website: n.website,
            admission_fee: n.admission_fee,
            hours_of_operation: n.hours_of_operation,
            latitude: 0,
            longitude: 0,
            tags: [],
            featured: n.featured || false,
            source_table: 'attractions',
            detailPath: getAttractionDetailPath('attractions', n.slug),
          }));

          const mappedNearbyHiddenGems: AttractionData[] = (nearbyHiddenGemsResult.data || []).map((n: any) => ({
            id: n.id,
            name: n.name || n.title,
            slug: n.slug,
            description: n.description,
            city_name: n.city_name?.replace(/,\s*\w{2}$/, '') || '',
            state: n.state || '',
            image_url: n.image_url,
            category: n.category || 'Hidden Gem',
            website: n.website,
            latitude: 0,
            longitude: 0,
            tags: [],
            featured: n.featured || false,
            source_table: 'hidden_gems',
            detailPath: getAttractionDetailPath('hidden_gems', n.slug),
          }));
          
          setNearbyAttractions(
            [...mappedNearbyAttractions, ...mappedNearbyHiddenGems]
              .filter((item) => item.slug && item.slug !== slug)
              .slice(0, 3)
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
