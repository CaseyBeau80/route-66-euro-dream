import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { AttractionData } from '@/types/attractionDetail';

interface CityData {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  description: string | null;
  image_url: string | null;
}

export function useStateData(stateAbbr: string | undefined) {
  const [cities, setCities] = useState<CityData[]>([]);
  const [attractions, setAttractions] = useState<AttractionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!stateAbbr) return;

    const fetchData = async () => {
      setIsLoading(true);

      const [waypointsRes, attractionsRes, nativeRes, gemsRes] = await Promise.all([
        supabase.from('destination_cities').select('*').eq('state', stateAbbr),
        supabase.from('attractions').select('*').eq('state', stateAbbr).order('name'),
        supabase.from('native_american_sites').select('*').eq('state', stateAbbr).order('name'),
        supabase.from('hidden_gems').select('*').eq('state', stateAbbr).order('name'),
      ]);

      setCities(waypointsRes.data || []);

      // Merge order: attractions → native_american_sites → hidden_gems (attractions wins collisions)
      const merged: AttractionData[] = [
        ...(attractionsRes.data || []).map((d: any) => ({
          id: d.id, name: d.name, slug: d.slug, description: d.description,
          city_name: d.city_name, state: d.state, latitude: d.latitude, longitude: d.longitude,
          image_url: d.image_url, website: d.website, category: d.category,
          category_canonical: d.category_canonical,
          tags: d.tags || [], featured: d.featured || false, source_table: 'attractions' as const,
        })),
        ...(nativeRes.data || []).map((d: any) => ({
          id: d.id, name: d.name, slug: d.slug, description: d.description,
          city_name: d.city_name, state: d.state, latitude: d.latitude, longitude: d.longitude,
          image_url: d.image_url, website: d.website, category: d.category || 'Heritage Site',
          category_canonical: d.category_canonical,
          tags: d.tags || [], featured: d.featured || false,
          tribe_nation: d.tribe_nation, source_table: 'native_american_sites' as const,
        })),
        ...(gemsRes.data || []).map((d: any) => ({
          id: d.id, name: d.name || d.title, slug: d.slug, description: d.description,
          city_name: d.city_name?.replace(/,\s*\w{2}$/, '') || '', state: stateAbbr,
          latitude: d.latitude, longitude: d.longitude,
          image_url: d.image_url, website: d.website, category: d.category || 'Hidden Gem',
          category_canonical: d.category_canonical,
          tags: d.tags || [], featured: d.featured || false, source_table: 'hidden_gems' as const,
        })),
      ];

      // Dedupe by name (case-insensitive, trimmed) — first occurrence wins
      const seen = new Set<string>();
      const deduped = merged.filter(item => {
        const key = (item.name?.trim().toLowerCase()) ?? '';
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      setAttractions(deduped);
      setIsLoading(false);
    };

    fetchData();
  }, [stateAbbr]);

  return { cities, attractions, isLoading };
}
