
import React from 'react';
import DebugComponentWrapper from './DebugComponentWrapper';
import { DailySegment } from '../services/planning/TripPlanBuilder';

interface DebugStopSelectionWrapperProps {
  segment: DailySegment;
}

/**
 * Wrapper that conditionally loads the debug component only in development
 */
const DebugStopSelectionWrapper: React.FC<DebugStopSelectionWrapperProps> = ({ segment }) => {
  // Conditional import - only load in development
  const [DebugComponent, setDebugComponent] = React.useState<React.ComponentType<any> | null>(null);
  
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Dynamic import only in development
      import('./DebugStopSelection')
        .then(module => {
          setDebugComponent(() => module.default);
        })
        .catch(error => {
          console.warn('Failed to load debug component:', error);
        });
    }
  }, []);
  
  return (
    <DebugComponentWrapper>
      {DebugComponent && <DebugComponent segment={segment} />}
    </DebugComponentWrapper>
  );
};

export default DebugStopSelectionWrapper;
