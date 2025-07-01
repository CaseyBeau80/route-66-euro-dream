
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
        supabase.from('drive_ins').select('*').order('title'),
        supabase.from('hidden_gems').select('*').order('title')
      ]);

      const unifiedItems: UnifiedRoute66Item[] = [];

      // Process attractions - use available fields only
      if (attractionsResult.data) {
        console.log(`🎯 Processing ${attractionsResult.data.length} attractions`);
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
            tags: [], // Default empty array since not in DB
            founded_year: undefined, // Not available in DB
            year_opened: undefined, // Not available in DB
            featured: Boolean(attraction.featured),
            slug: attraction.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          });
        });
      }

      // Process drive-ins - use available fields only
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
            tags: [], // Default empty array since not in DB
            year_opened: driveIn.year_opened,
            featured: Boolean(driveIn.featured),
            slug: driveIn.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          });
        });
      }

      // Process hidden gems
      if (hiddenGemsResult.data) {
        console.log(`💎 Processing ${hiddenGemsResult.data.length} hidden gems`);
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
            featured: false, // Hidden gems don't have featured field
            slug: gem.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          });
        });
      }

      console.log(`✅ Loaded ${unifiedItems.length} unified Route 66 items`);
      
      // Debug: Look for Church Studio specifically
      const churchStudio = unifiedItems.find(item => 
        item.name.toLowerCase().includes('church') && 
        item.name.toLowerCase().includes('studio')
      );
      
      if (churchStudio) {
        console.log('🎵 Found Church Studio:', {
          name: churchStudio.name,
          state: churchStudio.state,
          city: churchStudio.city_name,
          category: churchStudio.category
        });
      } else {
        console.log('❌ Church Studio not found in results');
        // Log all OK items to see what we have
        const okItems = unifiedItems.filter(item => 
          item.state === 'OK' || 
          (item.state && item.state.toUpperCase() === 'OK')
        );
        console.log(`🔍 Found ${okItems.length} items in OK:`, okItems.map(item => ({
          name: item.name,
          state: item.state,
          city: item.city_name
        })));
      }
      
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

  // Enhanced filter logic to catch more variations
  const filteredItems = useMemo(() => {
    let filtered = items;

    console.log(`🔍 Starting filter with ${filtered.length} items, filters:`, filters);

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(item => item.category === filters.type);
      console.log(`🎯 After type filter (${filters.type}): ${filtered.length} items`);
    }

    // Enhanced state filter - more flexible matching
    if (filters.state) {
      const stateFilter = filters.state.toUpperCase().trim();
      filtered = filtered.filter(item => {
        if (!item.state) return false;
        
        const itemState = item.state.toUpperCase().trim();
        
        // Exact match
        if (itemState === stateFilter) return true;
        
        // Handle common variations
        if (stateFilter === 'OK' && (itemState === 'OKLAHOMA' || itemState === 'OK')) return true;
        if (stateFilter === 'OKLAHOMA' && (itemState === 'OK' || itemState === 'OKLAHOMA')) return true;
        
        // Partial match for other cases
        return itemState.includes(stateFilter) || stateFilter.includes(itemState);
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
        // Search in name (primary field)
        if (item.name.toLowerCase().includes(searchLower)) return true;
        
        // Search in title if it exists
        if (item.title && item.title.toLowerCase().includes(searchLower)) return true;
        
        // Search in description
        if (item.description && item.description.toLowerCase().includes(searchLower)) return true;
        
        // Search in city name
        if (item.city_name.toLowerCase().includes(searchLower)) return true;
        
        // Search in tags
        if (item.tags.some(tag => tag.toLowerCase().includes(searchLower))) return true;
        
        return false;
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
    
    // Debug filtered results if searching for Church Studio
    if (filters.search && filters.search.toLowerCase().includes('church')) {
      console.log('🎵 Church Studio search results:', sorted.map(item => item.name));
    }

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
