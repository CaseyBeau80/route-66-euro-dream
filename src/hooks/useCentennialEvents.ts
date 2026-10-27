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

const computeEventStatus = (dbEvent: DatabaseEvent): 'upcoming' | 'happening_now' => {
  const now = new Date();
  const start = new Date(dbEvent.date_start);
  const end = dbEvent.date_end ? new Date(dbEvent.date_end) : start;
  if (now >= start && now <= end) return 'happening_now';
  return 'upcoming';
};

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
  eventStatus: computeEventStatus(dbEvent),
});

const fetchCentennialEvents = async (): Promise<CentennialEvent[]> => {
  ;
  
  const { data, error } = await supabase
    .from('centennial_events')
    .select('event_id,title,date_start,date_end,date_display,location,venue,state,description,category,is_highlight,official_url,guinness_attempt,guinness_note')
    .order('date_start', { ascending: true });

  if (error) {
    console.error('[CentennialEvents] Error fetching:', error);
    throw error;
  }

  return (data as DatabaseEvent[]).map(transformEvent);
};

export const useCentennialEvents = () => {
  return useQuery({
    queryKey: ['centennial-events'],
    queryFn: fetchCentennialEvents,
  });
};

// Export for components that need the data synchronously (with fallback)
export const useCentennialEventsWithFallback = () => {
  const { data, isLoading, error } = useCentennialEvents();
  
  // Only fall back to static data if there's an actual error, not during loading
  const events = error ? staticEvents : (data || []);
  const isUsingFallback = !!error;
  
  ;
  
  return {
    events,
    isLoading,
    error,
    isUsingFallback,
  };
};
