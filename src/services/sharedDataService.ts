/** Consumer-driven public reads; never preload unrelated tables. */
import { supabase } from '@/lib/supabase';
import { PUBLIC_COLUMNS } from '@/lib/publicReadCache';
import { queryClient } from '@/lib/queryClient';

interface PublicRow {
  id: string; name: string; title?: string; slug?: string; description?: string;
  city_name?: string; state: string; latitude: number; longitude: number;
  image_url?: string; thumbnail_url?: string; website?: string; tags?: string[];
  founded_year?: number; year_opened?: number; featured?: boolean;
  sequence_order?: number; is_major_stop?: boolean; highway_designation?: string;
}
const read = async (table: string, order?: string): Promise<PublicRow[]> => {
  let query = supabase.from(table).select(PUBLIC_COLUMNS[table]);
  if (order) query = query.order(order);
  const { data, error } = await query.returns<PublicRow[]>();
  if (error) throw error;
  return data || [];
};
export const getAttractions = () => read('attractions', 'name');
export const getHiddenGems = () => read('hidden_gems', 'title');
export const getDriveIns = () => read('drive_ins', 'name');
export const getWaypoints = () => read('route66_waypoints', 'sequence_order');
export const getDestinationCities = () => read('destination_cities');
export const getNativeAmericanSites = () => read('native_american_sites', 'name');
export const fetchAllRoute66Data = async () => {
  const [attractions, hiddenGems, driveIns, waypoints, destinationCities, nativeAmericanSites] = await Promise.all([
    getAttractions(), getHiddenGems(), getDriveIns(), getWaypoints(), getDestinationCities(), getNativeAmericanSites(),
  ]);
  return { attractions, hiddenGems, driveIns, waypoints, destinationCities, nativeAmericanSites };
};
export const clearDataCache = () => {
  queryClient.removeQueries({ queryKey: ['public-read'] });
  try {
    for (const key of Object.keys(localStorage)) if (key.startsWith('ramble66:public:v1:')) localStorage.removeItem(key);
  } catch { /* Storage may be unavailable. */ }
};
