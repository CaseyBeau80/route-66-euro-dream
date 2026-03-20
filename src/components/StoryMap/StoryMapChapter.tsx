
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { StoryMapChapter as ChapterType } from '@/data/storyMapData';

interface StoryMapChapterProps {
  chapter: ChapterType;
  index: number;
  children?: React.ReactNode;
  onInView?: () => void;
}

const StoryMapChapter = ({ chapter, index, children, onInView }: StoryMapChapterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.4, once: false });

  // Trigger callback when chapter comes into view
  if (isInView && onInView) {
    onInView();
  }

  const isDark = chapter.theme === 'dark';

  return (
    <section
      ref={ref}
      id={`chapter-${chapter.id}`}
      className={`relative min-h-screen w-full overflow-hidden ${
        isDark ? 'bg-[#1a1a1a] text-white' : 'bg-[#F5EDD8] text-[#3D2B1F]'
      }`}
    >
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-20 md:flex-row md:gap-12 md:py-24">
        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex-1 space-y-6"
        >
          <span
            className={`font-['Special_Elite'] text-xs uppercase tracking-[0.25em] ${
              isDark ? 'text-[#C9932A]' : 'text-[#C0392B]'
            }`}
          >
            Chapter {index + 1}
          </span>

          <h2 className="font-['Playfair_Display'] text-3xl font-bold leading-tight md:text-4xl">
            {chapter.title}
          </h2>

          <p
            className={`font-['Libre_Baskerville'] text-base italic leading-relaxed md:text-lg ${
              isDark ? 'text-white/80' : 'text-[#3D2B1F]/80'
            }`}
          >
            {chapter.narration}
          </p>
        </motion.div>

        {/* Media side */}
        <motion.div
          initial={{ opacity: 0, x: index % 2 === 0 ? 40 : -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="mt-8 flex-1 md:mt-0"
        >
          {children || (
            chapter.beforeImage && (
              <div className="overflow-hidden rounded-sm border-2 border-solid border-[#6B4C38]" style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.3)' }}>
                <img
                  src={chapter.beforeImage}
                  alt={chapter.title}
                  className="aspect-video w-full object-cover"
                  loading="lazy"
                />
              </div>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default StoryMapChapter;
