/**
 * Shared data service to reduce duplicate API calls and network dependency chains
 */
import { supabase } from '@/lib/supabase';

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
      (supabase as any).from('attractions').select('*').order('name'),
      (supabase as any).from('hidden_gems').select('*').order('title'),
      (supabase as any).from('drive_ins').select('*').order('name'),
      (supabase as any).from('route66_waypoints').select('*').order('sequence_order'),
      (supabase as any).from('destination_cities').select('*')
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
 * Preload critical data with aggressive main-thread yielding
 */
export const preloadCriticalData = () => {
  // Use multiple yielding strategies to minimize main-thread blocking
  const scheduleCallback = (window as any).requestIdleCallback || 
    ((cb: () => void) => setTimeout(cb, 500));

  scheduleCallback(() => {
    // Further defer data loading to avoid any main-thread blocking
    setTimeout(() => {
      fetchAllRoute66Data().catch(console.error);
    }, 100);
  }, { timeout: 2000 }); // Extended timeout for better main-thread management
};