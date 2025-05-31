
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

const MarkerInteractionHandler: React.FC<MarkerInteractionHandlerProps> = ({
  gem,
  children
}) => {
  const {
    isHovered,
    hoverPosition,
    handleMouseEnter: baseHandleMouseEnter,
    handleMouseLeave: baseHandleMouseLeave,
    updatePosition,
    cleanup
  } = useMarkerHover();

  const handleMouseEnter = () => {
    baseHandleMouseEnter(gem.title);
  };

  const handleMouseLeave = () => {
    baseHandleMouseLeave(gem.title);
  };

  React.useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <>
      {children({
        isHovered,
        hoverPosition,
        handleMouseEnter,
        handleMouseLeave,
        updatePosition,
        cleanup
      })}
    </>
  );
};

export default MarkerInteractionHandler;
