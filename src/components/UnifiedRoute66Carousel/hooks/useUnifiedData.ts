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
      console.log('🔍 Fetching unified Route 66 data with standardized schema...');

      // Fetch all three data types in parallel
      const [attractionsResult, driveInsResult, hiddenGemsResult] = await Promise.all([
        supabase.from('attractions').select('*').order('name'),
        supabase.from('drive_ins').select('*').order('name'),
        supabase.from('hidden_gems').select('*').order('title')
      ]);

      const unifiedItems: UnifiedRoute66Item[] = [];

      // Process attractions with standardized schema
      if (attractionsResult.data) {
        console.log(`🎯 Processing ${attractionsResult.data.length} attractions`);
        attractionsResult.data.forEach(attraction => {
          unifiedItems.push({
            id: `attraction-${attraction.id}`,
            name: attraction.name,
            title: attraction.title || attraction.name,
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
            founded_year: attraction.founded_year || undefined,
            year_opened: attraction.year_opened || undefined,
            featured: Boolean(attraction.featured),
            slug: attraction.slug || attraction.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          });
        });
      }

      // Process drive-ins (unchanged)
      if (driveInsResult.data) {
        console.log(`🎬 Processing ${driveInsResult.data.length} drive-ins`);
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
            tags: [],
            year_opened: driveIn.year_opened,
            featured: Boolean(driveIn.featured),
            slug: driveIn.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          });
        });
      }

      // Process hidden gems with standardized schema
      if (hiddenGemsResult.data) {
        console.log(`💎 Processing ${hiddenGemsResult.data.length} hidden gems`);
        hiddenGemsResult.data.forEach(gem => {
          unifiedItems.push({
            id: `hidden-gem-${gem.id}`,
            name: gem.name || gem.title,
            title: gem.title,
            description: gem.description,
            city_name: gem.city_name,
            state: gem.state || undefined,
            image_url: gem.image_url,
            thumbnail_url: gem.thumbnail_url,
            website: gem.website,
            latitude: gem.latitude,
            longitude: gem.longitude,
            category: 'hidden_gems',
            tags: gem.tags || [],
            founded_year: gem.founded_year || undefined,
            year_opened: gem.year_opened || undefined,
            featured: Boolean(gem.featured),
            slug: gem.slug || gem.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          });
        });
      }

      console.log(`✅ Loaded ${unifiedItems.length} unified Route 66 items with standardized schema`);
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

  // Enhanced filter logic
  const filteredItems = useMemo(() => {
    let filtered = items;

    console.log(`🔍 Starting filter with ${filtered.length} items, filters:`, filters);

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(item => item.category === filters.type);
      console.log(`🎯 After type filter (${filters.type}): ${filtered.length} items`);
    }

    // Enhanced state filter
    if (filters.state) {
      const stateFilter = filters.state.toUpperCase().trim();
      filtered = filtered.filter(item => {
        if (!item.state) return false;
        const itemState = item.state.toUpperCase().trim();
        return itemState === stateFilter || 
               (stateFilter === 'OK' && itemState === 'OKLAHOMA') ||
               (stateFilter === 'OKLAHOMA' && itemState === 'OK');
      });
      console.log(`🏛️ After state filter (${filters.state}): ${filtered.length} items`);
    }

    // Filter by city
    if (filters.city) {
      const cityFilter = filters.city.toLowerCase().trim();
      filtered = filtered.filter(item => {
        if (!item.city_name) return false;
        return item.city_name.toLowerCase().includes(cityFilter);
      });
      console.log(`🏙️ After city filter (${filters.city}): ${filtered.length} items`);
    }

    // Enhanced search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase().trim();
      filtered = filtered.filter(item => {
        return item.name.toLowerCase().includes(searchLower) ||
               (item.title && item.title.toLowerCase().includes(searchLower)) ||
               (item.description && item.description.toLowerCase().includes(searchLower)) ||
               item.city_name.toLowerCase().includes(searchLower) ||
               item.tags.some(tag => tag.toLowerCase().includes(searchLower));
      });
      console.log(`🔍 After search filter ("${filters.search}"): ${filtered.length} items`);
    }

    // Sort: featured first, then alphabetically
    const sorted = filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.name.localeCompare(b.name);
    });

    console.log(`✅ Final filtered results: ${sorted.length} items`);
    return sorted;
  }, [items, filters]);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    console.log('🔄 Updating filters:', newFilters);
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    console.log('🔄 Resetting all filters');
    setFilters({
      type: 'all',
      state: '',
      city: '',
      search: ''
    });
  };

  const hasActiveFilters = Boolean(
    filters.type !== 'all' || 
    filters.state || 
    filters.city || 
    filters.search
  );

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
