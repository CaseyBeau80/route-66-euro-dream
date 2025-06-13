
import { useSimpleWeatherState, SimpleWeatherState, SimpleWeatherActions } from './useSimpleWeatherState';

// Legacy compatibility layer - redirects to the new simplified hook
export const useSegmentWeatherState = (segmentEndCity: string, day: number): SimpleWeatherState & SimpleWeatherActions => {
  // Convert legacy parameters to new format
  const segmentDate = null; // Legacy hook doesn't have date context
  const sectionKey = `legacy-segment-${day}`;
  
  return useSimpleWeatherState(segmentEndCity, segmentDate, sectionKey);
};
