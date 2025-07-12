
import { useUnifiedMarkerHover } from '@/components/Route66Map/hooks/useUnifiedMarkerHover';
import { useRef } from 'react';

export const useAttractionHover = () => {
  const isCardHoveredRef = useRef(false);
  const baseHover = useUnifiedMarkerHover({ showDelay: 0, hideDelay: 300 });

  const handleMouseEnter = baseHover.handleMouseEnter;
  const handleMouseLeave = baseHover.handleMouseLeave;

  const handleCardMouseEnter = baseHover.handleMouseEnter;
  const handleCardMouseLeave = baseHover.handleMouseLeave;

  return {
    isHovered: baseHover.isHovered,
    hoverPosition: baseHover.hoverPosition,
    handleMouseEnter,
    handleMouseLeave,
    handleCardMouseEnter,
    handleCardMouseLeave,
    updatePosition: baseHover.updatePosition,
    cleanup: baseHover.cleanup,
    clearHover: baseHover.clearHover
  };
};
