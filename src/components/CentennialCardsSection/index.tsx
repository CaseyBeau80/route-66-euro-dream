
import React from 'react';
import CentennialCardsProvider from './components/CentennialCardsProvider';

const CentennialCardsSection: React.FC = () => {
  return (
    <section 
      className="relative py-16 sm:py-20 bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50 overflow-hidden"
      style={{
        background: `
          linear-gradient(135deg, 
            #FFF9F0 0%, 
            #F2F8FF 25%, 
            #F0F9FF 50%, 
            #F2F8FF 75%, 
            #FFF9F0 100%
          )
        `
      }}
      role="region"
      aria-labelledby="centennial-heading"
    >
      <CentennialCardsProvider />
    </section>
  );
};

export default CentennialCardsSection;
