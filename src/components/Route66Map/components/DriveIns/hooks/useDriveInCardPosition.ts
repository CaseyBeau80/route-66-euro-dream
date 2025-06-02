
import { useMemo } from 'react';

interface UseDriveInCardPositionProps {
  isVisible: boolean;
  position: { x: number; y: number };
  cardWidth: number;
  cardHeight: number;
}

export const useDriveInCardPosition = ({
  isVisible,
  position,
  cardWidth,
  cardHeight
}: UseDriveInCardPositionProps) => {
  
  return useMemo(() => {
    if (!isVisible) return { left: 0, top: 0, display: 'none' };

    const padding = 20;
    const topOffset = 60;

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
    if (top < padding + 100) {
      top = position.y + topOffset + 20;
    }

    // Bottom boundary
    if (top + cardHeight > viewport.height - padding - 20) {
      top = viewport.height - cardHeight - padding - 20;
    }

    console.log(`🎬 Drive-in hover card positioning:`, {
      markerPos: position,
      cardPos: { left, top },
      viewport
    });

    return { left, top, display: 'block' };
  }, [isVisible, position, cardWidth, cardHeight]);
};
