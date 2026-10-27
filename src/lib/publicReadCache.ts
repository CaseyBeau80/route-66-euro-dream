import { queryClient } from './queryClient';

export const PUBLIC_CACHE_TTL = 30 * 60 * 1000;
const PREFIX = 'ramble66:public:v1:';
export const PUBLIC_COLUMNS: Record<string, string> = {
  attractions: 'id,name,title,slug,city_name,state,latitude,longitude,category,category_canonical,image_url,thumbnail_url,featured,description,website,tags,founded_year,year_opened,admission_fee,hours_of_operation',
  hidden_gems: 'id,name,title,slug,city_name,state,latitude,longitude,category,category_canonical,image_url,thumbnail_url,featured,description,website,tags,founded_year,year_opened',
  native_american_sites: 'id,name,slug,city_name,state,latitude,longitude,category,category_canonical,image_url,thumbnail_url,featured,description,website,tags,tribe_nation,site_type',
  drive_ins: 'id,name,city_name,state,latitude,longitude,image_url,thumbnail_url,featured,description,website,status,status_notes,screens_count,capacity_cars,year_opened',
  route66_waypoints: 'id,name,state,latitude,longitude,sequence_order,is_major_stop,highway_designation,description,image_url,thumbnail_url',
  destination_cities: 'id,name,state,latitude,longitude,description,image_url,thumbnail_url,website,population,elevation_ft,founded_year,featured,status',
  centennial_events: 'event_id,title,date_start,date_end,date_display,location,venue,state,description,category,is_highlight,official_url,guinness_attempt,guinness_note',
};

export function readPublicCache<T>(key: string): T | undefined {
  try {
    if (typeof localStorage === 'undefined') return;
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return;
    const entry = JSON.parse(raw);
    if (typeof entry.savedAt !== 'number' || !Number.isFinite(entry.savedAt)) return;
    if (Date.now() - entry.savedAt >= PUBLIC_CACHE_TTL) {
      localStorage.removeItem(PREFIX + key);
      return;
    }
    return entry.value;
  } catch { return; }
}

export function writePublicCache(key: string, value: unknown): void {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(PREFIX + key, JSON.stringify({ savedAt: Date.now(), value }));
  } catch { /* Full/blocked storage must never affect reads. */ }
}

type Snapshot = { body: string; status: number; headers: [string, string][] };
class ReadFailure extends Error {
  constructor(public snapshot: Snapshot) { super('Public read failed'); }
}

/** Cache only anonymous public GETs, retaining Supabase response/error semantics. */
export async function cachedPublicFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const original = input instanceof Request ? input.url : String(input);
  const url = new URL(original);
  const table = url.pathname.split('/rest/v1/')[1];
  const method = init?.method || (input instanceof Request ? input.method : 'GET');
  const requestHeaders = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined));
  const accept = requestHeaders.get('accept') || '';
  const token = requestHeaders.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (payload.role !== 'anon') return fetch(input, init);
    } catch { return fetch(input, init); }
  }
  const isDetail = accept.includes('object') || url.searchParams.has('slug') || url.searchParams.has('id') || url.searchParams.has('event_id');
  const allowed = [...Object.keys(PUBLIC_COLUMNS), 'blog_posts', 'instagram_posts', 'states', 'community_photos'];
  if (method !== 'GET' || !table || !allowed.includes(table)) return fetch(input, init);
  // Identical full-list reads use the same shape/key regardless of their consumer.
  if (!isDetail && !url.searchParams.has('limit') && PUBLIC_COLUMNS[table] &&
      (table === 'destination_cities' || table === 'route66_waypoints' || !url.searchParams.has('state'))) {
    url.searchParams.set('select', PUBLIC_COLUMNS[table]);
    if (table === 'route66_waypoints') url.searchParams.set('order', 'sequence_order.asc');
  }
  url.searchParams.sort();
  // Published list cutoffs change every render; cache the current publication window.
  const keyUrl = new URL(url);
  const publishedBefore = keyUrl.searchParams.get('published_at');
  if (!isDetail && table === 'blog_posts' && publishedBefore?.startsWith('lte.')) {
    const date = new Date(publishedBefore.slice(4));
    if (!Number.isNaN(date.getTime())) {
      keyUrl.searchParams.set('published_at', 'lte.current-publication-window');
    }
  }
  const key = keyUrl.pathname + '?' + keyUrl.searchParams.toString();
  try {
    const snapshot = await queryClient.fetchQuery({
      queryKey: ['public-read', key, accept],
      retry: isDetail ? false : 1,
      queryFn: async () => {
        const cached = !isDetail ? readPublicCache<Snapshot>(key) : undefined;
        if (cached) return cached;
        const response = await fetch(url.toString(), init);
        const result: Snapshot = { body: await response.text(), status: response.status, headers: [...response.headers.entries()] };
        if (!response.ok) throw new ReadFailure(result);
        if (!isDetail) writePublicCache(key, result);
        return result;
      },
    });
    return new Response(snapshot.body, { status: snapshot.status, headers: snapshot.headers });
  } catch (error) {
    if (error instanceof ReadFailure) return new Response(error.snapshot.body, { status: error.snapshot.status, headers: error.snapshot.headers });
    throw error;
  }
}