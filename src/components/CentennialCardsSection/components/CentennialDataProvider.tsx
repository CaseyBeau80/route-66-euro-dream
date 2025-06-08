
import React, { createContext, useContext } from 'react';
import { useCentennialTimer } from '../hooks/useCentennialTimer';
import { useKonamiCode } from '../hooks/useKonamiCode';
import { useRotatingFacts } from '../hooks/useRotatingFacts';
import { createCentennialCardsData } from '../data/centennialCardsData';
import { CentennialCardData, TimeLeft } from '../data/types';

interface CentennialDataContextType {
  timeLeft: TimeLeft;
  mounted: boolean;
  easterEggActive: boolean;
  currentFact: string;
  centennialCards: CentennialCardData[];
}

const CentennialDataContext = createContext<CentennialDataContextType | null>(null);

export const useCentennialData = () => {
  const context = useContext(CentennialDataContext);
  if (!context) {
    throw new Error('useCentennialData must be used within CentennialDataProvider');
  }
  return context;
};

interface CentennialDataProviderProps {
  children: React.ReactNode;
}

const CentennialDataProvider: React.FC<CentennialDataProviderProps> = ({ children }) => {
  const { timeLeft, mounted } = useCentennialTimer();
  const { easterEggActive } = useKonamiCode();
  const { currentFact } = useRotatingFacts();

  const centennialCards = createCentennialCardsData(timeLeft, currentFact);

  const value: CentennialDataContextType = {
    timeLeft,
    mounted,
    easterEggActive,
    currentFact,
    centennialCards
  };

  return (
    <CentennialDataContext.Provider value={value}>
      {children}
    </CentennialDataContext.Provider>
  );
};

export default CentennialDataProvider;
