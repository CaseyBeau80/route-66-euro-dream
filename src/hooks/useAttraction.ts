import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { AttractionData, getAttractionDetailPath } from '@/types/attractionDetail';

const RETRY_DELAYS = [500, 1500]; // 3 attempts total
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useAttraction(slug: string | undefined) {
  const [attraction, setAttraction] = useState<AttractionData | null>(null);
  const [nearbyAttractions, setNearbyAttractions] = useState<AttractionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  /** Transient failure (network/exception/Supabase error) after retries exhausted */
  const [error, setError] = useState<string | null>(null);
  /** Definitive: query succeeded but no row matches this slug */
  const [notFound, setNotFound] = useState(false);
  const [attemptKey, setAttemptKey] = useState(0);

  const refetch = useCallback(() => setAttemptKey((k) => k + 1), []);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const runAttempt = async (): Promise<'ok' | 'not-found' | 'retry'> => {
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

        const queryError =
          attractions.error || hiddenGems.error || nativeSites.error || driveIns.error;

        if (!found) {
          if (queryError) {
            console.error('Error fetching attraction:', queryError);
            return 'retry';
          }
          if (cancelled) return 'ok';
          // Definitive answer: nothing matches this slug. Never retry.
          setAttraction(null);
          setNearbyAttractions([]);
          setNotFound(true);
          return 'not-found';
        } else {
          if (cancelled) return 'ok';
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
          
          if (cancelled) return 'ok';
          setNearbyAttractions(
            [...mappedNearbyAttractions, ...mappedNearbyHiddenGems]
              .filter((item) => item.slug && item.slug !== slug)
              .slice(0, 3)
          );
        }
        return 'ok';
      } catch (err) {
        console.error('Unexpected error fetching attraction:', err);
        return 'retry';
      }
    };

    const fetchAttraction = async () => {
      setIsLoading(true);
      setError(null);
      setNotFound(false);

      for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
        if (cancelled) return;

        const result = await runAttempt();
        if (cancelled) return;

        if (result !== 'retry') {
          setIsLoading(false);
          return;
        }

        // Keep isLoading true while backing off so the spinner stays visible.
        if (attempt < RETRY_DELAYS.length) {
          await sleep(RETRY_DELAYS[attempt]);
        }
      }

      if (cancelled) return;
      setError('Failed to load attraction');
      setIsLoading(false);
    };

    fetchAttraction();

    return () => {
      cancelled = true;
    };
  }, [slug, attemptKey]);

  return { attraction, nearbyAttractions, isLoading, error, notFound, refetch };
}
