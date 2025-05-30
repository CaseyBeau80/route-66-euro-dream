
import { useState } from 'react';
import { HiddenGem } from '../types';

export const useHiddenGemInteraction = (onGemClick?: (gem: HiddenGem) => void) => {
  const [activeGem, setActiveGem] = useState<string | null>(null);

  const handleMarkerClick = (gem: HiddenGem) => {
    console.log('🎯 Hidden gem clicked:', gem.title);
    console.log('📍 Current active gem:', activeGem);
    
    const newActiveGem = activeGem === gem.id ? null : gem.id;
    console.log('🔄 Setting active gem to:', newActiveGem);
    
    setActiveGem(newActiveGem);
    
    if (onGemClick) {
      onGemClick(gem);
    }
    
    console.log('✅ Marker click handler completed for:', gem.title);
  };

  const handleWebsiteClick = (website: string) => {
    console.log('🌐 Opening website:', website);
    const url = website.startsWith('http') ? website : `https://${website}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const closeActiveGem = () => {
    console.log('❌ Closing active gem:', activeGem);
    setActiveGem(null);
  };

  return {
    activeGem,
    handleMarkerClick,
    handleWebsiteClick,
    closeActiveGem
  };
};
