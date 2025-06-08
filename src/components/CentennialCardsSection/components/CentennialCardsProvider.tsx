
import React from 'react';
import FloatingSparkles from './FloatingSparkles';
import CentennialHeader from './CentennialHeader';
import CentennialCardsGrid from './CentennialCardsGrid';
import EasterEggCelebration from './EasterEggCelebration';
import BottomCelebrationElements from './BottomCelebrationElements';
import { useCentennialTimer } from '../hooks/useCentennialTimer';
import { useKonamiCode } from '../hooks/useKonamiCode';
import { useRotatingFacts } from '../hooks/useRotatingFacts';
import { createCentennialCardsData } from '../data/centennialCardsData';

const CentennialCardsProvider: React.FC = () => {
  const { timeLeft, mounted } = useCentennialTimer();
  const { easterEggActive } = useKonamiCode();
  const { currentFact } = useRotatingFacts();

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  const centennialCards = createCentennialCardsData(timeLeft, currentFact);

  return (
    <>
      {/* Floating Sparkles Background */}
      <FloatingSparkles />

      {/* Easter Egg Celebration */}
      <EasterEggCelebration isActive={easterEggActive} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Festive Header */}
        <CentennialHeader />

        {/* 4-Card Grid with consistent spacing */}
        <CentennialCardsGrid cards={centennialCards} />

        {/* Bottom Celebration Elements */}
        <BottomCelebrationElements />
      </div>
    </>
  );
};

export default CentennialCardsProvider;
