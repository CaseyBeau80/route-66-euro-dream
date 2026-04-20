import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { stateMetadata, categoryMetadata, CentennialEvent } from '@/data/centennialEventsData';
import { formatSmartDateDisplay, getSmartCountdownText } from '@/components/CentennialEventsCalendar/utils/eventCalendarHelpers';
import { Calendar, MapPin, ExternalLink, ArrowLeft, ChevronRight, Clock, Star, Award } from 'lucide-react';
import NotFound from './NotFound';
import MainLayout from '@/components/MainLayout';

interface DbEvent {
  id: string;
  event_id: string;
  title: string;
  date_start: string;
  date_end: string | null;
  date_display: string;
  location: string;
  venue: string | null;
  state: CentennialEvent['state'];
  description: string;
  category: string;
  is_highlight: boolean | null;
  official_url: string | null;
  guinness_attempt: boolean | null;
  guinness_note: string | null;
  image_url: string | null;
}

const toFrontend = (e: DbEvent): CentennialEvent => ({
  id: e.event_id,
  title: e.title,
  dateStart: e.date_start,
  dateEnd: e.date_end || undefined,
  dateDisplay: e.date_display,
  location: e.location,
  venue: e.venue || undefined,
  state: e.state,
  description: e.description,
  category: e.category.toLowerCase() as CentennialEvent['category'],
  isHighlight: !!e.is_highlight,
  officialUrl: e.official_url || undefined,
  guinnessAttempt: !!e.guinness_attempt,
  guinnessNote: e.guinness_note || undefined,
});

const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event-detail', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('centennial_events')
        .select('*')
        .eq('event_id', eventId!)
        .single();
      if (error) throw error;
      return toFrontend(data as DbEvent);
    },
    enabled: !!eventId,
  });

  const { data: nearbyEvents } = useQuery({
    queryKey: ['nearby-events', event?.state, eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('centennial_events')
        .select('*')
        .eq('state', event!.state)
        .neq('event_id', eventId!)
        .order('date_start', { ascending: true })
        .limit(3);
      if (error) throw error;
      return (data as DbEvent[]).map(toFrontend);
    },
    enabled: !!event,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !event) {
    return <NotFound />;
  }

  const stateInfo = stateMetadata[event.state] || { name: event.state, order: 99, color: 'bg-gray-500' };
  const categoryInfo = categoryMetadata[event.category] || { label: 'Event', emoji: '📅' };
  const stateName = stateInfo.name;
  const canonicalUrl = `https://ramble66.com/events/${eventId}`;
  const metaDesc = event.description.substring(0, 155) + (event.description.length > 155 ? '…' : '');
  const pageTitle = `${event.title} — Route 66 Centennial Event | Ramble 66`;
  const dateDisplay = formatSmartDateDisplay(event);
  const countdown = getSmartCountdownText(event);
  const fallbackImage = 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=1200&q=80';

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="event" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:image" content={event.officialUrl ? fallbackImage : fallbackImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDesc} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div className="bg-[hsl(var(--foreground))] text-white py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-xs font-special uppercase text-white/70 mb-4">
              <Link to="/" className="hover:text-white">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/events" className="hover:text-white">Events</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white">{event.title}</span>
            </nav>

            <h1 className="font-heading text-3xl md:text-5xl leading-tight mb-4">{event.title}</h1>

            <div className="flex flex-wrap items-center gap-3">
              {/* Category badge */}
              <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-sm font-special text-xs uppercase border-2 border-primary">
                {categoryInfo.emoji} {categoryInfo.label}
              </span>

              {/* State badge */}
              <span className="inline-flex items-center gap-1 bg-accent text-accent-foreground px-3 py-1 rounded-sm font-special text-xs uppercase border-2 border-border">
                <MapPin className="w-3 h-3" /> {stateName}
              </span>

              {/* Countdown */}
              <span className="inline-flex items-center gap-1 bg-white/20 text-white px-3 py-1 rounded-sm font-special text-xs uppercase">
                <Clock className="w-3 h-3" /> {countdown}
              </span>

              {/* Highlight badge */}
              {event.isHighlight && (
                <span className="inline-flex items-center gap-1 bg-accent text-accent-foreground px-3 py-1 rounded-sm font-special text-xs uppercase border-2 border-accent">
                  <Star className="w-3 h-3" /> Centennial Highlight
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <Link to="/events" className="inline-flex items-center gap-1 font-special text-xs uppercase text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-3 h-3" /> Back to Events
          </Link>

          {/* Date & Location card */}
          <div className="bg-surface border-2 border-border rounded-sm p-6 mb-8 shadow-[4px_4px_0_hsl(var(--border)/0.3)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-special text-xs uppercase text-muted-foreground block">Date</span>
                  <span className="font-body text-foreground">{dateDisplay}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-special text-xs uppercase text-muted-foreground block">Location</span>
                  <span className="font-body text-foreground">{event.location}</span>
                  {event.venue && (
                    <span className="font-body text-sm text-muted-foreground block">{event.venue}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Guinness badge */}
          {event.guinnessAttempt && (
            <div className="bg-surface border-2 border-accent rounded-sm p-4 mb-8 shadow-[4px_4px_0_hsl(var(--accent)/0.3)]">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-special text-xs uppercase text-accent-foreground block">Guinness World Record Attempt</span>
                  {event.guinnessNote && (
                    <span className="font-body text-sm text-foreground">{event.guinnessNote}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-surface border-2 border-border rounded-sm p-6 mb-8 shadow-[4px_4px_0_hsl(var(--border)/0.3)]">
            <h2 className="font-heading text-xl text-foreground mb-3">About This Event</h2>
            <p className="font-body text-foreground leading-relaxed text-lg">{event.description}</p>
          </div>

          {/* CTA button */}
          {event.officialUrl && (
            <div className="mb-10">
              <a
                href={event.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-sm font-special text-sm uppercase border-2 border-primary hover:bg-primary/90 transition-colors shadow-[4px_4px_0_hsl(var(--primary)/0.3)]"
              >
                <ExternalLink className="w-4 h-4" />
                Get Details / Register
              </a>
            </div>
          )}

          {/* Nearby Events */}
          {nearbyEvents && nearbyEvents.length > 0 && (
            <div>
              <h2 className="font-heading text-2xl text-foreground mb-4">
                More Events in {stateName}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {nearbyEvents.map((ne) => {
                  const neCat = categoryMetadata[ne.category] || { label: 'Event', emoji: '📅' };
                  return (
                    <Link
                      key={ne.id}
                      to={`/events/${ne.id}`}
                      className="bg-surface border-2 border-border rounded-sm p-4 hover:border-primary transition-colors shadow-[4px_4px_0_hsl(var(--border)/0.3)]"
                    >
                      <span className="font-special text-xs uppercase text-muted-foreground block mb-1">
                        {neCat.emoji} {neCat.label}
                      </span>
                      <h3 className="font-heading text-base text-foreground mb-1 line-clamp-2">{ne.title}</h3>
                      <span className="font-body text-sm text-muted-foreground">{formatSmartDateDisplay(ne)}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EventDetailPage;
