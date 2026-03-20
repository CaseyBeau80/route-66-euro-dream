
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ctaData } from '@/data/storyMapData';
import { ArrowRight } from 'lucide-react';

const StoryMapCTA = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3, once: true });

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#F5EDD8] px-6 py-24 text-[#3D2B1F] md:px-12 md:py-32">
      {/* Decorative road stripe */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 opacity-[0.06]"
        style={{
          backgroundImage: 'repeating-linear-gradient(to bottom, #3D2B1F 0px, #3D2B1F 20px, transparent 20px, transparent 40px)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto max-w-3xl text-center"
      >
        {/* Decorative divider */}
        <div className="mx-auto mb-8 flex items-center justify-center gap-3">
          <div className="h-[1px] w-16 bg-[#C0392B]/30" />
          <div className="h-2 w-2 rotate-45 border border-[#C0392B]/30" />
          <div className="h-[1px] w-16 bg-[#C0392B]/30" />
        </div>

        <h2 className="font-['Playfair_Display'] text-4xl font-bold leading-[1.15] md:text-5xl lg:text-6xl">
          {ctaData.title}
        </h2>

        <p className="mt-8 font-['Libre_Baskerville'] text-lg italic leading-[1.8] text-[#3D2B1F]/70 md:text-xl">
          {ctaData.narration}
        </p>

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          {ctaData.links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`inline-flex items-center gap-2 rounded-sm border-2 border-solid px-6 py-3 font-['Special_Elite'] text-sm uppercase tracking-wider transition-all duration-200 ${
                link.primary
                  ? 'border-[#C0392B] bg-[#C0392B] text-white hover:bg-[#922B21] hover:border-[#922B21]'
                  : 'border-[#6B4C38] bg-transparent text-[#3D2B1F] hover:bg-[#3D2B1F] hover:text-[#F5EDD8]'
              }`}
              style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.15)' }}
            >
              {link.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ))}
        </div>

        {/* Bottom flourish */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-16 font-['Special_Elite'] text-[10px] uppercase tracking-[0.4em] text-[#3D2B1F]/20"
        >
          Chicago → Santa Monica · 2,448 miles
        </motion.div>
      </motion.div>
    </section>
  );
};

export default StoryMapCTA;
