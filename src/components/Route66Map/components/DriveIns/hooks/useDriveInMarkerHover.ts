
import { useUnifiedMarkerHover } from '@/components/Route66Map/hooks/useUnifiedMarkerHover';

export const useDriveInMarkerHover = () => {
  return useUnifiedMarkerHover({ showDelay: 0, hideDelay: 300 });
};
