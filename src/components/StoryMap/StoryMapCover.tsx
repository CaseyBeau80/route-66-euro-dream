
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { coverData } from '@/data/storyMapData';

const StoryMapCover = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Parallax & fade effects
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  return (
    <section ref={ref} className="relative h-[120vh] w-full overflow-hidden bg-[#0a0a0a]">
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${coverData.backgroundImage})`,
          y: bgY,
          filter: 'brightness(0.3) sepia(0.2) saturate(1.2)',
        }}
      />

      {/* Film grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
      }} />

      {/* Content */}
      <motion.div
        style={{ opacity, y: titleY }}
        className="relative z-10 flex h-screen flex-col items-center justify-center px-6 text-center text-white"
      >
        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }}
          className="mb-8 h-[1px] w-24 bg-[#C9932A]"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mb-6 font-['Special_Elite'] text-xs uppercase tracking-[0.4em] text-[#C9932A] md:text-sm"
        >
          {coverData.subtitle}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.7 }}
          className="mb-8 max-w-4xl font-['Playfair_Display'] text-5xl font-bold leading-[1.1] md:text-7xl lg:text-8xl"
          style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
        >
          {coverData.title}
        </motion.h1>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1, ease: 'easeOut' }}
          className="mb-8 h-[1px] w-16 bg-[#C9932A]"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mb-12 max-w-2xl font-['Libre_Baskerville'] text-lg italic leading-relaxed text-white/70 md:text-xl"
        >
          {coverData.narration}
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="flex gap-12 md:gap-16"
        >
          {coverData.stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-['Playfair_Display'] text-3xl font-bold text-[#C9932A] md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 font-['Special_Elite'] text-[10px] uppercase tracking-[0.2em] text-white/40">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-16"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-3"
          >
            <span className="font-['Special_Elite'] text-[10px] uppercase tracking-[0.3em] text-white/30">
              Begin the journey
            </span>
            <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 pt-2">
              <motion.div
                animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="h-1.5 w-1.5 rounded-full bg-[#C9932A]"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default StoryMapCover;
