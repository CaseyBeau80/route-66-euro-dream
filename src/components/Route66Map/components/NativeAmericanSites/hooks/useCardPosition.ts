
import { useMemo } from 'react';

interface UseCardPositionProps {
  isVisible: boolean;
  position: { x: number; y: number };
  cardWidth?: number;
  cardHeight?: number;
  topOffset?: number;
  padding?: number;
}

export const useCardPosition = ({
  isVisible,
  position,
  cardWidth = 350,
  cardHeight = 320,
  topOffset = 80,
  padding = 20
}: UseCardPositionProps) => {
  return useMemo(() => {
    if (!isVisible) return { left: 0, top: 0, display: 'none' };

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let left = position.x - cardWidth / 2;
    let top = position.y - cardHeight - topOffset;

    // Horizontal positioning
    if (left < padding) {
      left = padding;
    } else if (left + cardWidth > viewport.width - padding) {
      left = viewport.width - cardWidth - padding;
    }

    // Vertical positioning
    if (top < padding) {
      top = position.y + topOffset + 20;
    }

    if (top + cardHeight > viewport.height - padding) {
      top = viewport.height - cardHeight - padding;
    }

    return { left, top, display: 'block' };
  }, [isVisible, position, cardWidth, cardHeight, topOffset, padding]);
};
