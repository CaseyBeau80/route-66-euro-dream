
import { useSimpleWeatherState, SimpleWeatherState, SimpleWeatherActions } from './useSimpleWeatherState';

// Legacy compatibility layer - redirects to the new simplified hook
export const useSegmentWeatherState = (segmentEndCity: string, day: number): SimpleWeatherState & SimpleWeatherActions => {
  return useSimpleWeatherState(segmentEndCity, day);
};
