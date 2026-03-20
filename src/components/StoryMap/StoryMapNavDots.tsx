
import { motion } from 'framer-motion';

interface StoryMapNavDotsProps {
  chapters: { id: string; title: string }[];
  activeIndex: number;
}

const StoryMapNavDots = ({ chapters, activeIndex }: StoryMapNavDotsProps) => {
  const handleClick = (id: string) => {
    document.getElementById(`chapter-${id}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-3 md:flex">
      {chapters.map((chapter, i) => (
        <button
          key={chapter.id}
          onClick={() => handleClick(chapter.id)}
          className="group relative flex items-center justify-end"
          aria-label={`Go to ${chapter.title}`}
        >
          {/* Tooltip */}
          <span className="mr-3 whitespace-nowrap rounded-sm bg-[#2C2C2C] px-2 py-1 font-['Special_Elite'] text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
            {chapter.title}
          </span>

          <motion.div
            animate={{
              scale: i === activeIndex ? 1.3 : 1,
              backgroundColor: i === activeIndex ? '#C0392B' : '#6B4C38',
            }}
            className="h-2.5 w-2.5 rounded-full border border-solid border-[#6B4C38]"
            transition={{ duration: 0.3 }}
          />
        </button>
      ))}
    </nav>
  );
};

export default StoryMapNavDots;
