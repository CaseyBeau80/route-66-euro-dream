
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCentennialEventsWithFallback } from '@/hooks/useCentennialEvents';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';

const StoryMapEventHighlights = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.15, once: true });
  const { events, isLoading } = useCentennialEventsWithFallback();

  const highlights = events.filter(e => e.isHighlight).slice(0, 6);
  const displayEvents = highlights.length > 0 ? highlights : events.slice(0, 6);

  return (
    <section
      ref={ref}
      id="chapter-centennial"
      className="relative overflow-hidden bg-[#0f0f0f] px-6 py-24 text-white md:px-12 md:py-32"
    >
      {/* Subtle texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 text-center"
        >
          <div className="mx-auto mb-6 flex items-center justify-center gap-3">
            <div className="h-[1px] w-12 bg-[#C9932A]" />
            <span className="font-['Special_Elite'] text-[10px] uppercase tracking-[0.4em] text-[#C9932A]">
              November 11, 2026
            </span>
            <div className="h-[1px] w-12 bg-[#C9932A]" />
          </div>

          <h2 className="font-['Playfair_Display'] text-4xl font-bold md:text-6xl">
            The Centennial
          </h2>

          <p className="mx-auto mt-8 max-w-2xl font-['Libre_Baskerville'] text-lg italic leading-[1.8] text-white/60">
            On November 11, 2026, Route 66 turns one hundred years old. Communities along 
            the Mother Road are preparing celebrations that honor a century of American wanderlust.
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
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden rounded-sm border-2 border-solid border-[#6B4C38]/40 bg-[#1a1a1a] p-6 transition-all duration-300 hover:border-[#C9932A]/60 hover:bg-[#1f1f1f]"
                style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.4)' }}
              >
                {/* Category badge */}
                <div className="mb-4 inline-block rounded-sm bg-[#C0392B]/10 px-2 py-0.5">
                  <span className="font-['Special_Elite'] text-[9px] uppercase tracking-[0.2em] text-[#C0392B]">
                    {event.category}
                  </span>
                </div>

                <h3 className="font-['Playfair_Display'] text-lg font-bold leading-snug text-white group-hover:text-[#C9932A] transition-colors">
                  {event.title}
                </h3>

                <div className="mt-3 flex items-center gap-2 font-['Special_Elite'] text-[10px] uppercase tracking-wider text-[#C9932A]/80">
                  <Calendar className="h-3 w-3" />
                  {event.dateDisplay}
                </div>

                <div className="mt-1.5 flex items-center gap-2 font-['Special_Elite'] text-[10px] uppercase tracking-wider text-white/35">
                  <MapPin className="h-3 w-3" />
                  {event.location}, {event.state}
                </div>

                <p className="mt-4 font-['Libre_Baskerville'] text-sm leading-[1.7] text-white/50">
                  {event.description.length > 140
                    ? event.description.slice(0, 140) + '…'
                    : event.description}
                </p>

                {event.officialUrl && (
                  <a
                    href={event.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 font-['Special_Elite'] text-[10px] uppercase tracking-wider text-[#C9932A]/60 transition-colors hover:text-[#C9932A]"
                  >
                    Learn more <ArrowUpRight className="h-3 w-3" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default StoryMapEventHighlights;
