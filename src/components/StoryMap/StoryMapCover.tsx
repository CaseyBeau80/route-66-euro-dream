
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { coverData } from '@/data/storyMapData';

const StoryMapCover = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#2C2C2C]">
      {/* Background image with parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${coverData.backgroundImage})`,
          filter: 'brightness(0.4) sepia(0.3)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-4 font-['Special_Elite'] text-sm uppercase tracking-[0.3em] text-[#C9932A]"
        >
          {coverData.subtitle}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="mb-8 font-['Playfair_Display'] text-4xl font-bold leading-tight md:text-6xl lg:text-7xl"
          style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.6)' }}
        >
          {coverData.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="max-w-2xl font-['Libre_Baskerville'] text-lg italic leading-relaxed text-white/80 md:text-xl"
        >
          {coverData.narration}
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="font-['Special_Elite'] text-xs uppercase tracking-widest text-white/50">
              Scroll to begin
            </span>
            <ChevronDown className="h-6 w-6 text-white/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default StoryMapCover;
