import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { CentennialEvent, centennialEvents as staticEvents } from '@/data/centennialEventsData';

interface DatabaseEvent {
  id: string;
  event_id: string;
  title: string;
  date_start: string;
  date_end: string | null;
  date_display: string;
  location: string;
  venue: string | null;
  state: string;
  description: string;
  category: string;
  is_highlight: boolean;
  official_url: string | null;
  guinness_attempt: boolean;
  guinness_note: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// Transform database row (snake_case) to frontend format (camelCase)
// Normalize category to lowercase to match frontend EventCategory type
const transformEvent = (dbEvent: DatabaseEvent): CentennialEvent => ({
  id: dbEvent.event_id,
  title: dbEvent.title,
  dateStart: dbEvent.date_start,
  dateEnd: dbEvent.date_end || undefined,
  dateDisplay: dbEvent.date_display,
  location: dbEvent.location,
  venue: dbEvent.venue || undefined,
  state: dbEvent.state as CentennialEvent['state'],
  description: dbEvent.description,
  category: dbEvent.category.toLowerCase() as CentennialEvent['category'],
  isHighlight: dbEvent.is_highlight,
  officialUrl: dbEvent.official_url || undefined,
  guinnessAttempt: dbEvent.guinness_attempt,
  guinnessNote: dbEvent.guinness_note || undefined,
});

const fetchCentennialEvents = async (): Promise<CentennialEvent[]> => {
  console.log('[CentennialEvents] Fetching from external Supabase...');
  
  const { data, error } = await supabase
    .from('centennial_events')
    .select('*')
    .order('date_start', { ascending: true });

  if (error) {
    console.error('[CentennialEvents] Error fetching:', error);
    throw error;
  }

  console.log('[CentennialEvents] Fetched', data?.length, 'events');
  
  // Debug: Log ALL unique categories from database
  const uniqueCategories = [...new Set(data?.map(e => e.category) || [])];
  console.log('[CentennialEvents] All categories in DB:', uniqueCategories);
  
  // Debug: Log motorcycle, bicycle, and runs events
  const motorcycleEvents = data?.filter(e => e.category === 'motorcycles');
  const bicycleEvents = data?.filter(e => e.category === 'bicycles');
  const runsEvents = data?.filter(e => e.category === 'runs');
  console.log('[CentennialEvents] New category counts:', {
    motorcycles: motorcycleEvents?.length || 0,
    bicycles: bicycleEvents?.length || 0,
    runs: runsEvents?.length || 0
  });
  
  if (motorcycleEvents && motorcycleEvents.length > 0) {
    console.log('[CentennialEvents] Motorcycle events found:', motorcycleEvents);
  }
  
  return (data as DatabaseEvent[]).map(transformEvent);
};

export const useCentennialEvents = () => {
  return useQuery({
    queryKey: ['centennial-events'],
    queryFn: fetchCentennialEvents,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
    gcTime: 1000 * 60 * 30, // Keep in garbage collection for 30 minutes
    retry: 2,
  });
};

// Export for components that need the data synchronously (with fallback)
export const useCentennialEventsWithFallback = () => {
  const { data, isLoading, error } = useCentennialEvents();
  
  // Only fall back to static data if there's an actual error, not during loading
  const events = error ? staticEvents : (data || []);
  const isUsingFallback = !!error;
  
  console.log('[CentennialEvents] Hook state - isLoading:', isLoading, 'hasData:', !!data, 'isUsingFallback:', isUsingFallback);
  
  return {
    events,
    isLoading,
    error,
    isUsingFallback,
  };
};
