
import { motion } from 'framer-motion';

interface StoryMapNavDotsProps {
  chapters: { id: string; title: string }[];
  activeIndex: number;
}

const StoryMapNavDots = ({ chapters, activeIndex }: StoryMapNavDotsProps) => {
  const handleClick = (id: string) => {
    document.getElementById(`chapter-${id}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  const progress = ((activeIndex + 1) / chapters.length) * 100;

  return (
    <nav className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-0 xl:flex">
      {/* Progress track */}
      <div className="relative flex flex-col items-center">
        {/* Background line */}
        <div className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-white/10" />

        {/* Active progress line */}
        <motion.div
          className="absolute left-1/2 top-0 w-[1px] -translate-x-1/2 bg-[#C0392B]/60 origin-top"
          animate={{ height: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {chapters.map((chapter, i) => (
          <button
            key={chapter.id}
            onClick={() => handleClick(chapter.id)}
            className="group relative z-10 flex items-center justify-end py-2"
            aria-label={`Go to ${chapter.title}`}
          >
            {/* Tooltip */}
            <span className="pointer-events-none absolute right-8 whitespace-nowrap rounded-sm border border-[#6B4C38] bg-[#2C2C2C] px-3 py-1.5 font-['Special_Elite'] text-[10px] uppercase tracking-wider text-white/80 opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100"
              style={{ boxShadow: '3px 3px 0 rgba(0,0,0,0.3)' }}
            >
              {chapter.title}
            </span>

            <motion.div
              animate={{
                scale: i === activeIndex ? 1 : 0.7,
                backgroundColor: i === activeIndex ? '#C0392B' : i < activeIndex ? '#C9932A' : '#6B4C38',
                borderColor: i === activeIndex ? '#C0392B' : '#6B4C38',
              }}
              className="h-3 w-3 rounded-full border-2 border-solid"
              transition={{ duration: 0.3 }}
            />
          </button>
        ))}
      </div>

      {/* Current chapter label */}
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-center"
      >
        <div className="font-['Special_Elite'] text-[8px] uppercase tracking-[0.2em] text-white/30">
          {activeIndex + 1} / {chapters.length}
        </div>
      </motion.div>
    </nav>
  );
};

export default StoryMapNavDots;
