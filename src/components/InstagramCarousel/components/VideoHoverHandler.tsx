
import React, { useRef, useEffect } from 'react';

interface VideoHoverHandlerProps {
  children: React.ReactElement;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  disabled?: boolean;
}

const VideoHoverHandler: React.FC<VideoHoverHandlerProps> = ({
  children,
  onHoverStart,
  onHoverEnd,
  disabled = false
}) => {
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveredRef = useRef(false);

  const handleMouseEnter = () => {
    if (disabled) return;
    
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Add a small delay to prevent accidental triggers
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isHoveredRef.current) {
        isHoveredRef.current = true;
        onHoverStart?.();
      }
    }, 200);
  };

  const handleMouseLeave = () => {
    if (disabled) return;

    // Clear the hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    if (isHoveredRef.current) {
      isHoveredRef.current = false;
      onHoverEnd?.();
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return React.cloneElement(children, {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    style: {
      ...children.props.style,
      cursor: disabled ? 'default' : 'pointer'
    }
  });
};

export default VideoHoverHandler;
