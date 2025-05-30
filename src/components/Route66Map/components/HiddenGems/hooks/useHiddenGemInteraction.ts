
import { useState } from 'react';
import { HiddenGem } from '../types';

export const useHiddenGemInteraction = (onGemClick?: (gem: HiddenGem) => void) => {
  const [activeGem, setActiveGem] = useState<string | null>(null);

  const handleMarkerClick = (gem: HiddenGem) => {
    console.log('🎯 Hidden gem clicked:', gem.title);
    const newActiveGem = activeGem === gem.id ? null : gem.id;
    setActiveGem(newActiveGem);
    
    if (onGemClick) {
      onGemClick(gem);
    }
  };

  const handleWebsiteClick = (website: string) => {
    console.log('🌐 Opening website:', website);
    const url = website.startsWith('http') ? website : `https://${website}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const closeActiveGem = () => {
    setActiveGem(null);
  };

  return {
    activeGem,
    handleMarkerClick,
    handleWebsiteClick,
    closeActiveGem
  };
};
