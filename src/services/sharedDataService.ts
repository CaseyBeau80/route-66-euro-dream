/**
 * Shared data service to reduce duplicate API calls and network dependency chains
 */
import { supabase } from '@/integrations/supabase/client';

// Cache for API responses to prevent duplicate requests
const cache = new Map<string, Promise<any>>();

/**
 * Get cached data or fetch if not cached
 */
const getCachedData = <T>(key: string, fetcher: () => Promise<T>): Promise<T> => {
  if (!cache.has(key)) {
    const promise = fetcher().catch(error => {
      // Remove from cache on error to allow retry
      cache.delete(key);
      throw error;
    });
    cache.set(key, promise);
  }
  return cache.get(key)!;
};

/**
 * Fetch all critical Route 66 data in a single optimized call
 */
export const fetchAllRoute66Data = () => {
  return getCachedData('all-route66-data', async () => {
    console.log('🔍 Fetching all Route 66 data in optimized batch...');
    
    const [
      attractionsResult,
      hiddenGemsResult,
      driveInsResult,
      waypointsResult,
      destinationCitiesResult
    ] = await Promise.all([
      supabase.from('attractions').select('*').order('name'),
      supabase.from('hidden_gems').select('*').order('title'),
      supabase.from('drive_ins').select('*').order('name'),
      supabase.from('route66_waypoints').select('*').order('sequence_order'),
      supabase.from('destination_cities').select('*')
    ]);

    console.log('✅ All Route 66 data fetched in single batch');
    
    return {
      attractions: attractionsResult.data || [],
      hiddenGems: hiddenGemsResult.data || [],
      driveIns: driveInsResult.data || [],
      waypoints: waypointsResult.data || [],
      destinationCities: destinationCitiesResult.data || []
    };
  });
};

/**
 * Get attractions data (cached)
 */
export const getAttractions = () => {
  return getCachedData('attractions', async () => {
    const data = await fetchAllRoute66Data();
    return data.attractions;
  });
};

/**
 * Get hidden gems data (cached)
 */
export const getHiddenGems = () => {
  return getCachedData('hidden-gems', async () => {
    const data = await fetchAllRoute66Data();
    return data.hiddenGems;
  });
};

/**
 * Get drive-ins data (cached)
 */
export const getDriveIns = () => {
  return getCachedData('drive-ins', async () => {
    const data = await fetchAllRoute66Data();
    return data.driveIns;
  });
};

/**
 * Get waypoints data (cached)
 */
export const getWaypoints = () => {
  return getCachedData('waypoints', async () => {
    const data = await fetchAllRoute66Data();
    return data.waypoints;
  });
};

/**
 * Get destination cities data (cached)
 */
export const getDestinationCities = () => {
  return getCachedData('destination-cities', async () => {
    const data = await fetchAllRoute66Data();
    return data.destinationCities;
  });
};

/**
 * Clear all cached data (useful for force refresh)
 */
export const clearDataCache = () => {
  cache.clear();
  console.log('🧹 Data cache cleared');
};

/**
 * Preload critical data for performance optimization with aggressive deferral
 */
export const preloadCriticalData = () => {
  // Use requestIdleCallback to defer data loading until browser is idle
  const scheduleCallback = (window as any).requestIdleCallback || 
    ((cb: () => void) => setTimeout(cb, 300));

  scheduleCallback(() => {
    fetchAllRoute66Data().catch(console.error);
  }, { timeout: 1000 }); // Fallback timeout of 1s
};