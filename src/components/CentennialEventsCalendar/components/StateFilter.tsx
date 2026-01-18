import React from 'react';
import { Badge } from '@/components/ui/badge';
import { EventState, stateMetadata, centennialEvents } from '@/data/centennialEventsData';

interface StateFilterProps {
  selectedState: EventState | 'all';
  onStateChange: (state: EventState | 'all') => void;
}

const StateFilter: React.FC<StateFilterProps> = ({ selectedState, onStateChange }) => {
  // Get event counts
  const getCount = (state: EventState | 'all'): number => {
    if (state === 'all') return centennialEvents.length;
    return centennialEvents.filter(e => e.state === state).length;
  };

  // States in Route 66 order (Chicago to Santa Monica)
  const stateOrder: (EventState | 'all')[] = [
    'all', 'national', 'IL', 'MO', 'KS', 'OK', 'TX', 'NM', 'AZ', 'CA'
  ];

  // State display info with colors
  const stateStyles: Record<EventState | 'all', { bg: string; activeBg: string; text: string }> = {
    'all': { bg: 'bg-slate-100', activeBg: 'bg-slate-700', text: 'text-slate-700' },
    'national': { bg: 'bg-purple-100', activeBg: 'bg-purple-600', text: 'text-purple-700' },
    'IL': { bg: 'bg-blue-100', activeBg: 'bg-blue-500', text: 'text-blue-700' },
    'MO': { bg: 'bg-red-100', activeBg: 'bg-red-500', text: 'text-red-700' },
    'KS': { bg: 'bg-yellow-100', activeBg: 'bg-yellow-500', text: 'text-yellow-700' },
    'OK': { bg: 'bg-orange-100', activeBg: 'bg-orange-500', text: 'text-orange-700' },
    'TX': { bg: 'bg-red-100', activeBg: 'bg-red-600', text: 'text-red-700' },
    'NM': { bg: 'bg-teal-100', activeBg: 'bg-teal-500', text: 'text-teal-700' },
    'AZ': { bg: 'bg-amber-100', activeBg: 'bg-amber-600', text: 'text-amber-700' },
    'CA': { bg: 'bg-yellow-100', activeBg: 'bg-yellow-500', text: 'text-yellow-700' }
  };

  const getLabel = (state: EventState | 'all'): string => {
    if (state === 'all') return 'All';
    if (state === 'national') return '🌎 National';
    return stateMetadata[state].name;
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {stateOrder.map((state) => {
        const isActive = selectedState === state;
        const styles = stateStyles[state];
        const count = getCount(state);
        
        // Highlight Oklahoma with a special ring
        const isOklahoma = state === 'OK';
        
        return (
          <button
            key={state}
            onClick={() => onStateChange(state)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
              transition-all duration-200 border-2
              ${isActive 
                ? `${styles.activeBg} text-white border-transparent shadow-md` 
                : `${styles.bg} ${styles.text} border-transparent hover:border-slate-300`
              }
              ${isOklahoma && !isActive ? 'ring-2 ring-orange-300 ring-offset-1' : ''}
            `}
            aria-pressed={isActive}
            aria-label={`Filter by ${getLabel(state)}, ${count} events`}
          >
            <span>{getLabel(state)}</span>
            <Badge 
              variant="secondary" 
              className={`
                text-xs px-1.5 py-0 min-w-[1.5rem] justify-center
                ${isActive ? 'bg-white/20 text-white' : 'bg-white/50'}
              `}
            >
              {count}
            </Badge>
          </button>
        );
      })}
    </div>
  );
};

export default StateFilter;
