
import { MutableRefObject } from "react";

/**
 * Common props used by both mouse and touch handlers
 */
export interface BaseHandlerProps {
  setIsDragging: (isDragging: boolean) => void;
  setLastPosition: (position: { x: number; y: number }) => void;
  isDragging: boolean;
  lastPosition: { x: number; y: number };
  setViewBoxX: (x: number | ((prev: number) => number)) => void;
  setViewBoxY: (y: number | ((prev: number) => number)) => void;
  zoom: number;
  baseWidth: number;
  baseHeight: number;
  viewBoxWidth: number;
  viewBoxHeight: number;
  onDragStart?: () => void;
}

/**
 * Additional props required for touch handlers (pinch zoom)
 */
export interface TouchHandlerProps extends BaseHandlerProps {
  isPinching: boolean;
  touchStartDistance: number | null;
  getDistance: (touches: React.TouchList) => number;
  onZoomChange?: (newZoom: number) => void;
  minZoom: number;
  maxZoom: number;
  initialZoom: number;
  setTouchStartDistance: (distance: number | null) => void;
  setInitialZoom: (zoom: number) => void;
  setIsPinching: (isPinching: boolean) => void;
  touchTimeoutRef: MutableRefObject<NodeJS.Timeout | null>;
  SENSITIVITY_FACTOR: number;
}
