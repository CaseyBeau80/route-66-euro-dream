
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCentennialEventsWithFallback } from '@/hooks/useCentennialEvents';
import { Calendar, MapPin } from 'lucide-react';

const StoryMapEventHighlights = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.2, once: true });
  const { events, isLoading } = useCentennialEventsWithFallback();

  // Show only highlight events, max 6
  const highlights = events.filter(e => e.isHighlight).slice(0, 6);
  const displayEvents = highlights.length > 0 ? highlights : events.slice(0, 6);

  return (
    <section
      ref={ref}
      id="chapter-centennial"
      className="min-h-screen bg-[#1a1a1a] px-6 py-20 text-white"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <span className="font-['Special_Elite'] text-xs uppercase tracking-[0.25em] text-[#C9932A]">
            Chapter 11
          </span>
          <h2 className="mt-4 font-['Playfair_Display'] text-3xl font-bold md:text-5xl">
            The Centennial — 2026
          </h2>
          <p className="mx-auto mt-6 max-w-3xl font-['Libre_Baskerville'] text-lg italic leading-relaxed text-white/80">
            On November 11, 2026, Route 66 turns one hundred years old. From coast to coast, 
            communities along the Mother Road are preparing celebrations that honor a century of 
            American wanderlust — parades, car shows, festivals, and a nationwide caravan retracing 
            every mile of the original highway.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#C0392B]" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-sm border-2 border-solid border-[#6B4C38] bg-[#2C2C2C] p-5"
                style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.4)' }}
              >
                <h3 className="font-['Playfair_Display'] text-lg font-bold text-white">
                  {event.title}
                </h3>
                <div className="mt-2 flex items-center gap-2 font-['Special_Elite'] text-xs text-[#C9932A]">
                  <Calendar className="h-3 w-3" />
                  {event.dateDisplay}
                </div>
                <div className="mt-1 flex items-center gap-2 font-['Special_Elite'] text-xs text-white/50">
                  <MapPin className="h-3 w-3" />
                  {event.location}
                </div>
                <p className="mt-3 font-['Libre_Baskerville'] text-sm leading-relaxed text-white/70">
                  {event.description.length > 120
                    ? event.description.slice(0, 120) + '…'
                    : event.description}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default StoryMapEventHighlights;
