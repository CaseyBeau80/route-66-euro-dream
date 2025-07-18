
import { TimeLeft, CentennialCardData } from './types';

import { timelineCardData } from './timelineCardData';
import { createFunFactsCardData } from './funFactsCardData';
import { triviaCardData } from './triviaCardData';

export const createCentennialCardsData = (timeLeft: TimeLeft, currentFact: string): CentennialCardData[] => [
  timelineCardData,
  createFunFactsCardData(currentFact),
  triviaCardData
];

// Re-export types for backward compatibility
export type { TimeLeft, CentennialCardData } from './types';
