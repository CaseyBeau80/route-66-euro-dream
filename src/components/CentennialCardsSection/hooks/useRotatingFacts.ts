
import { useState, useEffect } from 'react';
import { funFactsDatabase } from '../../FunFactsOfTheDay/data/funFactsDatabase';
import { DailyFactsService } from '../../FunFactsOfTheDay/services/DailyFactsService';

export const useRotatingFacts = () => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  // Extract just the fact text from the comprehensive database
  const rotatingFacts = funFactsDatabase.map(fact => 
    DailyFactsService.formatFact(fact)
  );

  useEffect(() => {
    const factTimer = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % rotatingFacts.length);
    }, 10000);

    return () => clearInterval(factTimer);
  }, [rotatingFacts.length]);

  return { currentFact: rotatingFacts[currentFactIndex] };
};
