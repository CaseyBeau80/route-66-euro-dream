
import { useUnifiedMarkerHover } from '@/components/Route66Map/hooks/useUnifiedMarkerHover';
import { useRef } from 'react';

export const useDriveInMarkerHover = () => {
  return useUnifiedMarkerHover({ showDelay: 0, hideDelay: 300 });
};
