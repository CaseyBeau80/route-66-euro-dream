import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { AttractionData } from '@/types/attractionDetail';

interface CityData {
  id: string;
  name: string;
  state: string;
}

export function useStateData(stateAbbr: string | undefined) {
  const [cities, setCities] = useState<CityData[]>([]);
  const [attractions, setAttractions] = useState<AttractionData[]>([]);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [heroAlt, setHeroAlt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!stateAbbr) return;

    const fetchData = async () => {
      setIsLoading(true);

      const [waypointsRes, attractionsRes, nativeRes, gemsRes, stateMetaRes] = await Promise.all([
        supabase.from('destination_cities').select('id,name,state').eq('state', stateAbbr),
        supabase.from('attractions').select('id,name,title,slug,description,city_name,state,latitude,longitude,image_url,thumbnail_url,website,category,category_canonical,tags,featured,founded_year,year_opened,admission_fee,hours_of_operation').eq('state', stateAbbr).order('name'),
        supabase.from('native_american_sites').select('id,name,slug,description,city_name,state,latitude,longitude,image_url,thumbnail_url,website,category,category_canonical,tags,featured,tribe_nation,site_type').eq('state', stateAbbr).order('name'),
        supabase.from('hidden_gems').select('id,name,title,slug,description,city_name,state,latitude,longitude,image_url,thumbnail_url,website,category,category_canonical,tags,featured,founded_year,year_opened').eq('state', stateAbbr).order('name'),
        supabase.from('states').select('hero_image_url, hero_alt').eq('code', stateAbbr).maybeSingle(),
      ]);

      setCities(waypointsRes.data || []);
      setHeroImageUrl(stateMetaRes.data?.hero_image_url ?? null);
      setHeroAlt(stateMetaRes.data?.hero_alt ?? null);

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

  return { cities, attractions, heroImageUrl, heroAlt, isLoading };
}
