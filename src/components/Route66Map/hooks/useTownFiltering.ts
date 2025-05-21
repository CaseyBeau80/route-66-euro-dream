
import { useMemo } from 'react';
import { getVisibleTowns } from '../utils/townUtils';
import { Route66Town } from '@/types/route66';

interface UseTownFilteringProps {
  selectedState: string | null;
}

export const useTownFiltering = ({ selectedState }: UseTownFilteringProps) => {
  // Use memoization to prevent unnecessary re-filtering
  const visibleTowns = useMemo(() => {
    return getVisibleTowns(selectedState);
  }, [selectedState]);

  return {
    visibleTowns
  };
};
