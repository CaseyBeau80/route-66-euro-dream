
import React from 'react';
import FloatingSparkles from './FloatingSparkles';
import CentennialHeader from './CentennialHeader';
import CentennialCardsGrid from './CentennialCardsGrid';
import EasterEggCelebration from './EasterEggCelebration';
import BottomCelebrationElements from './BottomCelebrationElements';
import { useCentennialData } from './CentennialDataProvider';

const CentennialLayout: React.FC = () => {
  const { easterEggActive, centennialCards, mounted } = useCentennialData();

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center py-16">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

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

export default CentennialLayout;
