
import { useRef, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import type { StoryMapChapter as ChapterType } from '@/data/storyMapData';

interface StoryMapChapterProps {
  chapter: ChapterType;
  index: number;
  totalChapters: number;
  children?: React.ReactNode;
  onInView?: () => void;
}

const StoryMapChapter = ({ chapter, index, totalChapters, children, onInView }: StoryMapChapterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3, once: false });
  const hasTriggered = useRef(false);

  // Parallax for background image chapters
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  useEffect(() => {
    if (isInView && onInView) {
      onInView();
      hasTriggered.current = true;
    }
  }, [isInView, onInView]);

  const isDark = chapter.theme === 'dark';
  const isReversed = index % 2 !== 0;

  return (
    <section
      ref={ref}
      id={`chapter-${chapter.id}`}
      className={`relative w-full overflow-hidden ${
        isDark ? 'bg-[#0f0f0f] text-white' : 'bg-[#F5EDD8] text-[#3D2B1F]'
      }`}
    >
      {/* Subtle background image for dark chapters */}
      {isDark && chapter.backgroundImage && (
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${chapter.backgroundImage})`,
            y: bgY,
            filter: 'brightness(0.08) sepia(0.3)',
          }}
        />
      )}

      {/* Film grain for dark sections */}
      {isDark && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      <div className={`relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-24 md:px-12 lg:flex-row lg:gap-16 lg:py-32 ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 space-y-6 lg:max-w-xl"
        >
          {/* Mile marker badge */}
          {chapter.mileMarker && (
            <div className="flex items-center gap-3">
              <div className={`h-[1px] w-8 ${isDark ? 'bg-[#C9932A]' : 'bg-[#C0392B]'}`} />
              <span
                className={`font-['Special_Elite'] text-[10px] uppercase tracking-[0.3em] ${
                  isDark ? 'text-[#C9932A]' : 'text-[#C0392B]'
                }`}
              >
                {chapter.mileMarker}
              </span>
            </div>
          )}

          <h2 className="font-['Playfair_Display'] text-3xl font-bold leading-[1.15] md:text-4xl lg:text-5xl">
            {chapter.title}
          </h2>

          <p
            className={`font-['Libre_Baskerville'] text-base italic leading-[1.8] md:text-lg ${
              isDark ? 'text-white/70' : 'text-[#3D2B1F]/75'
            }`}
          >
            {chapter.narration}
          </p>

          {/* Pull quote */}
          {chapter.pullQuote && (
            <motion.blockquote
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className={`relative mt-8 border-l-2 py-2 pl-6 ${
                isDark ? 'border-[#C9932A]' : 'border-[#C0392B]'
              }`}
            >
              <p className={`font-['Playfair_Display'] text-lg font-medium italic md:text-xl ${
                isDark ? 'text-[#C9932A]/90' : 'text-[#C0392B]/90'
              }`}>
                "{chapter.pullQuote}"
              </p>
              {chapter.pullQuoteAuthor && (
                <cite className={`mt-2 block font-['Special_Elite'] text-xs not-italic tracking-wide ${
                  isDark ? 'text-white/40' : 'text-[#3D2B1F]/40'
                }`}>
                  — {chapter.pullQuoteAuthor}
                </cite>
              )}
            </motion.blockquote>
          )}
        </motion.div>

        {/* Media side */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.96 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex-1 lg:mt-0"
        >
          {children || (
            chapter.beforeImage && (
              <div className="relative">
                <div
                  className="overflow-hidden rounded-sm border-2 border-solid border-[#6B4C38]"
                  style={{ boxShadow: '6px 6px 0 rgba(0,0,0,0.35)' }}
                >
                  <img
                    src={chapter.beforeImage}
                    alt={chapter.title}
                    className="aspect-[3/2] w-full object-cover"
                    loading="lazy"
                  />
                </div>
                {/* Photo caption */}
                <div className={`mt-3 font-['Special_Elite'] text-[10px] uppercase tracking-[0.2em] ${
                  isDark ? 'text-white/30' : 'text-[#3D2B1F]/30'
                }`}>
                  Historical photograph · Route 66 Archives
                </div>
              </div>
            )
          )}
        </motion.div>
      </div>

      {/* Section divider */}
      <div className="relative z-10 flex justify-center pb-8">
        <div className="flex items-center gap-3">
          <div className={`h-[1px] w-12 ${isDark ? 'bg-white/10' : 'bg-[#3D2B1F]/10'}`} />
          <div className={`h-1.5 w-1.5 rounded-full ${isDark ? 'bg-[#C9932A]/40' : 'bg-[#C0392B]/40'}`} />
          <div className={`h-[1px] w-12 ${isDark ? 'bg-white/10' : 'bg-[#3D2B1F]/10'}`} />
        </div>
      </div>
    </section>
  );
};

export default StoryMapChapter;
