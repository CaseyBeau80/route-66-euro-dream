import React, { createContext, useContext, useState, useCallback } from 'react';

interface MobileCardContextType {
  openCards: Set<string>;
  registerCard: (cardId: string) => void;
  closeCard: (cardId: string) => void;
  closeAllCards: () => void;
}

const MobileCardContext = createContext<MobileCardContextType | undefined>(undefined);

export const useMobileCardContext = () => {
  const context = useContext(MobileCardContext);
  if (!context) {
    throw new Error('useMobileCardContext must be used within a MobileCardProvider');
  }
  return context;
};

interface MobileCardProviderProps {
  children: React.ReactNode;
}

export const MobileCardProvider: React.FC<MobileCardProviderProps> = ({ children }) => {
  const [openCards, setOpenCards] = useState<Set<string>>(new Set());

  const registerCard = useCallback((cardId: string) => {
    setOpenCards(prev => new Set([...prev, cardId]));
  }, []);

  const closeCard = useCallback((cardId: string) => {
    setOpenCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(cardId);
      return newSet;
    });
  }, []);

  const closeAllCards = useCallback(() => {
    setOpenCards(new Set());
  }, []);

  const value = {
    openCards,
    registerCard,
    closeCard,
    closeAllCards
  };

  return (
    <MobileCardContext.Provider value={value}>
      {children}
    </MobileCardContext.Provider>
  );
};