import { useUnifiedMarkerHover } from '@/components/Route66Map/hooks/useUnifiedMarkerHover';

export const useDestinationHover = () => {
  return useUnifiedMarkerHover({ showDelay: 0, hideDelay: 300 });
};
