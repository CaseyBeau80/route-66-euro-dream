
import React from 'react';
import { HiddenGem } from '../types';
import { useMarkerHover } from '../hooks/useMarkerHover';

interface MarkerInteractionHandlerProps {
  gem: HiddenGem;
  children: (props: {
    isHovered: boolean;
    hoverPosition: { x: number; y: number };
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
    updatePosition: (x: number, y: number) => void;
    cleanup: () => void;
  }) => React.ReactNode;
}

export const MarkerInteractionHandler: React.FC<MarkerInteractionHandlerProps> = ({
  gem,
  children
}) => {
  const {
    isHovered,
    hoverPosition,
    handleMouseEnter,
    handleMouseLeave,
    updatePosition,
    cleanup
  } = useMarkerHover();

  const wrappedHandleMouseEnter = React.useCallback(() => {
    handleMouseEnter(gem.title);
  }, [handleMouseEnter, gem.title]);

  const wrappedHandleMouseLeave = React.useCallback(() => {
    handleMouseLeave(gem.title);
  }, [handleMouseLeave, gem.title]);

  return (
    <>
      {children({
        isHovered,
        hoverPosition,
        handleMouseEnter: wrappedHandleMouseEnter,
        handleMouseLeave: wrappedHandleMouseLeave,
        updatePosition,
        cleanup
      })}
    </>
  );
};
