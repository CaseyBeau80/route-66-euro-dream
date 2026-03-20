
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ctaData } from '@/data/storyMapData';
import { ArrowRight } from 'lucide-react';

const StoryMapCTA = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.4, once: true });

  return (
    <section ref={ref} className="bg-[#F5EDD8] px-6 py-24 text-[#3D2B1F]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-3xl text-center"
      >
        <h2 className="font-['Playfair_Display'] text-3xl font-bold md:text-5xl">
          {ctaData.title}
        </h2>
        <p className="mt-6 font-['Libre_Baskerville'] text-lg italic leading-relaxed text-[#3D2B1F]/80">
          {ctaData.narration}
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          {ctaData.links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="inline-flex items-center gap-2 rounded-sm border-2 border-solid border-[#C0392B] bg-[#C0392B] px-6 py-3 font-['Special_Elite'] text-sm text-white transition-colors hover:bg-[#922B21]"
              style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.2)' }}
            >
              {link.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default StoryMapCTA;
