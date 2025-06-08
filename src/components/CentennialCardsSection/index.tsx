
import React from 'react';
import FloatingSparkles from './components/FloatingSparkles';
import CentennialHeader from './components/CentennialHeader';
import CentennialCard from './components/CentennialCard';
import EasterEggCelebration from './components/EasterEggCelebration';
import BottomCelebrationElements from './components/BottomCelebrationElements';
import { useCentennialTimer } from './hooks/useCentennialTimer';
import { useKonamiCode } from './hooks/useKonamiCode';
import { useRotatingFacts } from './hooks/useRotatingFacts';
import { createCentennialCardsData } from './data/centennialCardsData';

const CentennialCardsSection: React.FC = () => {
  const { timeLeft, mounted } = useCentennialTimer();
  const { easterEggActive } = useKonamiCode();
  const { currentFact } = useRotatingFacts();

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  const centennialCards = createCentennialCardsData(timeLeft, currentFact);

  return (
    <section 
      className="relative py-16 sm:py-20 bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50 overflow-hidden"
      role="region"
      aria-labelledby="centennial-heading"
    >
      {/* Floating Sparkles Background */}
      <FloatingSparkles />

      {/* Easter Egg Celebration */}
      <EasterEggCelebration isActive={easterEggActive} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Festive Header */}
        <CentennialHeader />

        {/* 4-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {centennialCards.map((card, index) => (
            <CentennialCard
              key={card.id}
              {...card}
              index={index}
            />
          ))}
        </div>

        {/* Bottom Celebration Elements */}
        <BottomCelebrationElements />
      </div>
    </section>
  );
};

export default CentennialCardsSection;
