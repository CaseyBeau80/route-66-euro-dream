
import React from 'react';
import CentennialCard from './CentennialCard';
import { CentennialCardData } from '../data/types';

interface CentennialCardsGridProps {
  cards: CentennialCardData[];
}

const CentennialCardsGrid: React.FC<CentennialCardsGridProps> = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <CentennialCard
          key={card.id}
          {...card}
          index={index}
        />
      ))}
    </div>
  );
};

export default CentennialCardsGrid;
