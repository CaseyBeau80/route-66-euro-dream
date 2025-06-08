
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UnifiedRoute66Item, FilterState } from '../types';

export const useUnifiedData = () => {
  const [items, setItems] = useState<UnifiedRoute66Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    state: '',
    city: '',
    search: ''
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching unified Route 66 data...');

      // Fetch all three data types in parallel
      const [attractionsResult, driveInsResult, hiddenGemsResult] = await Promise.all([
        supabase.from('attractions').select('*').order('name'),
        supabase.from('drive_ins').select('*').order('name'),
        supabase.from('hidden_gems').select('*').order('title')
      ]);

      const unifiedItems: UnifiedRoute66Item[] = [];

      // Process attractions
      if (attractionsResult.data) {
        attractionsResult.data.forEach(attraction => {
          unifiedItems.push({
            id: `attraction-${attraction.id}`,
            name: attraction.name,
            description: attraction.description,
            city_name: attraction.city_name,
            state: attraction.state,
            image_url: attraction.image_url,
            thumbnail_url: attraction.thumbnail_url,
            website: attraction.website,
            latitude: attraction.latitude,
            longitude: attraction.longitude,
            category: 'attractions',
            tags: attraction.tags || [],
            founded_year: attraction.founded_year,
            year_opened: attraction.year_opened,
            featured: attraction.featured,
            slug: attraction.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          });
        });
      }

      // Process drive-ins
      if (driveInsResult.data) {
        driveInsResult.data.forEach(driveIn => {
          unifiedItems.push({
            id: `drive-in-${driveIn.id}`,
            name: driveIn.name,
            description: driveIn.description,
            city_name: driveIn.city_name,
            state: driveIn.state,
            image_url: driveIn.image_url,
            thumbnail_url: driveIn.thumbnail_url,
            website: driveIn.website,
            latitude: driveIn.latitude,
            longitude: driveIn.longitude,
            category: 'drive_ins',
            tags: driveIn.tags || [],
            year_opened: driveIn.year_opened,
            featured: driveIn.featured,
            slug: driveIn.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          });
        });
      }

      // Process hidden gems
      if (hiddenGemsResult.data) {
        hiddenGemsResult.data.forEach(gem => {
          unifiedItems.push({
            id: `hidden-gem-${gem.id}`,
            name: gem.title,
            title: gem.title,
            description: gem.description,
            city_name: gem.city_name,
            website: gem.website,
            latitude: gem.latitude,
            longitude: gem.longitude,
            category: 'hidden_gems',
            tags: [],
            featured: false,
            slug: gem.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          });
        });
      }

      console.log(`✅ Loaded ${unifiedItems.length} unified Route 66 items`);
      setItems(unifiedItems);
    } catch (error) {
      console.error('❌ Error fetching unified data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique states and cities for filters
  const { states, cities } = useMemo(() => {
    const statesSet = new Set<string>();
    const citiesSet = new Set<string>();

    items.forEach(item => {
      if (item.state) statesSet.add(item.state);
      citiesSet.add(item.city_name);
    });

    return {
      states: Array.from(statesSet).sort(),
      cities: Array.from(citiesSet).sort()
    };
  }, [items]);

  // Filter items based on current filters
  const filteredItems = useMemo(() => {
    let filtered = items;

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(item => item.category === filters.type);
    }

    // Filter by state
    if (filters.state) {
      filtered = filtered.filter(item => item.state === filters.state);
    }

    // Filter by city
    if (filters.city) {
      filtered = filtered.filter(item => item.city_name === filters.city);
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.city_name.toLowerCase().includes(searchLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort: featured first, then alphabetically
    return filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [items, filters]);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      type: 'all',
      state: '',
      city: '',
      search: ''
    });
  };

  const hasActiveFilters = filters.type !== 'all' || filters.state || filters.city || filters.search;

  return {
    items: filteredItems,
    loading,
    filters,
    updateFilters,
    resetFilters,
    hasActiveFilters,
    states,
    cities,
    totalCount: items.length,
    filteredCount: filteredItems.length
  };
};
