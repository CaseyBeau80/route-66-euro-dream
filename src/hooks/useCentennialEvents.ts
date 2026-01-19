import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
  category: dbEvent.category as CentennialEvent['category'],
  isHighlight: dbEvent.is_highlight,
  officialUrl: dbEvent.official_url || undefined,
  guinnessAttempt: dbEvent.guinness_attempt,
  guinnessNote: dbEvent.guinness_note || undefined,
});

const fetchCentennialEvents = async (): Promise<CentennialEvent[]> => {
  const { data, error } = await supabase
    .from('centennial_events')
    .select('*')
    .order('date_start', { ascending: true });

  if (error) {
    console.error('Error fetching centennial events:', error);
    throw error;
  }

  return (data as DatabaseEvent[]).map(transformEvent);
};

export const useCentennialEvents = () => {
  return useQuery({
    queryKey: ['centennial-events'],
    queryFn: fetchCentennialEvents,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
    gcTime: 1000 * 60 * 30, // Keep in garbage collection for 30 minutes
    placeholderData: staticEvents, // Use static data while loading
    retry: 2,
  });
};

// Export for components that need the data synchronously (with fallback)
export const useCentennialEventsWithFallback = () => {
  const { data, isLoading, error } = useCentennialEvents();
  
  // Fall back to static data if there's an error or still loading
  const events = error || !data ? staticEvents : data;
  
  return {
    events,
    isLoading,
    error,
    isUsingFallback: !!error || !data,
  };
};
